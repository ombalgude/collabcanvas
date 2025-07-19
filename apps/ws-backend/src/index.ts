import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET, PORT } from "./config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: Number(PORT) });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
  socketId: string; 
}

const users: User[] = [];

function generateSocketId() {
  return Math.random().toString(36).substr(2, 9);
}

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded || !decoded.userId) return null;
    return decoded.userId;
  } catch {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  const socketId = generateSocketId();

  const newUser: User = {
    ws,
    userId,
    rooms: [],
    socketId,
  };

  users.push(newUser);

  ws.on("message", async (data) => {
    let parsedData;
    try {
      parsedData = typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString());
    } catch (e) {
      console.error("Invalid JSON received:", data);
      return;
    }

    const { type, roomId, message } = parsedData;

    if (type === "join_room") {
      const user = users.find((u) => u.ws === ws);
      if (user && !user.rooms.includes(roomId)) {
        user.rooms.push(roomId);
        users.forEach((u) => {
          if (u.rooms.includes(roomId) && u.ws !== ws) {
            u.ws.send(
              JSON.stringify({
                type: "user-joined",
                roomId,
                newUserSocketId: socketId,
              })
            );
          }
        });
      }
    }

    if (type === "request_canvas_history") {
        try {
            const messages = await prismaClient.chat.findMany({
                where: { roomId: Number(roomId) },
                orderBy: { id: "asc" }, 
            });

            const shapes = messages.map((x: { message: string }) => {
                try {
                    const messageData = JSON.parse(x.message);
                    return messageData.shape;
                } catch {
                    return null;
                }
            }).filter(shape => shape !== null); 
            ws.send(JSON.stringify({
                type: "canvas_history",
                shapes,
            }));

        } catch (err) {
            console.error("Failed to fetch or send canvas history:", err);
        }
    }


    if (type === "chat") {
      try {
        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId,
          },
        });
      } catch (err) {
        console.error("Failed to store chat in DB:", err);
      }

      users.forEach((u) => {
        if (u.rooms.includes(roomId)) {
          u.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              roomId,
            })
          );
        }
      });
    }


  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) users.splice(index, 1);
  });
});
