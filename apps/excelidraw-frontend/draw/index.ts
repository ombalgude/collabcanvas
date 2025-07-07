import { HTTP_BACKEND } from "@/config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const existingShapes: Shape[] = await getExistingShapes(roomId);
  clearCanvas(existingShapes, canvas, ctx);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      const parsed = JSON.parse(message.message);
      existingShapes.push(parsed.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  let clicked = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", () => {
    clicked = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked) return;

    //@ts-ignore
    const selectedTool = window.selectedTool;
    const endX = e.clientX;
    const endY = e.clientY;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(endX - startX, endY - startY) / 2;
      shape = {
        type: "circle",
        centerX: startX + radius,
        centerY: startY + radius,
        radius,
      };
    } else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        startX,
        startY,
        endX,
        endY,
      };
    }

    if (!shape) return;
    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId,
      })
    );

    if (shape.type === "pencil") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
      ctx.closePath();

      startX = shape.endX;
      startY = shape.endY;
    } else {
      clearCanvas(existingShapes, canvas, ctx);
    }
  });
}

function clearCanvas(
  shapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  shapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    } else if (shape.type === "pencil") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
      ctx.closePath();
    }
  });
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found.");
    return [];
  }

  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const messages = res.data.messages;
    return messages.map((msg: { message: string }) => {
      const parsed = JSON.parse(msg.message);
      return parsed.shape;
    });
  } catch (err) {
    console.error("Error fetching shapes:", err);
    return [];
  }
}
