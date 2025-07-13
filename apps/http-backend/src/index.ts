import express, { Express, Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { JWT_SECRET, PORT } from "./config";  
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninUserSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";



const app: Express = express();
app.use(express.json());
app.use(cors({
  origin: "https://collabcanvas-frontend.onrender.com", 
  credentials: true,
}));


app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect inputs" });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.email,
        password: parsedData.data.password,
        name: parsedData.data.name,
        photo: parsedData.data?.photo,
      },
    });

    res.json({ message: "You are signed up successfully", userId: user.id });
  } catch(error) {
     console.error("Signup error:", error);
    res.status(403).json({ message: "User already exists with this email" });
  }
});


app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const parsedData = SigninUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect inputs" });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.email,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({ message: "User is not authenticated" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ message: "You are signed in successfully", token });
});


app.post("/create-room", middleware, async (req: Request, res: Response): Promise<void> => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  
  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect inputs" });
    return;
  }

  const userId = (req as any).userId;
  console.log("Creating room for userId:", userId);


  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name, // use this as slug (name)
        adminId: userId,
      },
    });

    res.json({ roomId: room.id });
  } catch {
    res.status(411).json({ message: "Room already exists with this name" });
  }
});


// get room by slug
 
app.get("/room/:slug", async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug;

  const room = await prismaClient.room.findFirst({
    where: { slug },
  });

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  res.json({ room });
});

// get users romm

app.get("/rooms", middleware, async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).userId;
console.log("Authenticated userId:", userId);

  const rooms = await prismaClient.room.findMany({
    where: { adminId: userId },
  });

  res.json({ rooms });
});


app.get("/chats/:roomId", async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 1000,
    });

    res.json({ messages });
  } catch {
    res.json({ messages: [] });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
