import express, { Express } from "express";
const app: Express = express();
import cors from "cors";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninUserSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

app.use(express.json());

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: " incorrect inputs ",
    });
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

    res.json({
      message: "you are signup successfully",
      userId: user.id,
    });
  } catch (e) {
    res.status(403).json({
      message: " user already exist with this email",
    });
  }
});

app.post("/signin", async (req, res) => {
  const parsedData = SigninUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: " incorrect inputs ",
    });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.email,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "user is not authenticated",
    });
  }

  const token = jwt.sign(
    {
      userId: user?.id,
    },
    JWT_SECRET
  );

  res.json({
    message: "you are signin in successfully",
    token,
  });
});

app.post("/create-room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: " incorrect inputs ",
    });
    return;
  }

  const userId = (req as any).userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name, //name of a room as a slug
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.status(411).json({
      message: "room already exist with this name",
    });
  }

  app.get("/chats/:roomId", async (req, res) => {
    try {
      const roomId = Number(req.params.roomId);

      const messages = await prismaClient.chat.findMany({
        where: {
          roomId: roomId,
        },

        orderBy: {
          id: "desc",
        },

        take: 1000,
      });

      res.json({
        messages,
      });
    } catch (e) {
      res.json({
        messages: [],
      });
    }
  });

  app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;

    const room = await prismaClient.room.findFirst({
      where: {
        slug,
      },
    });

    res.json({ room });
  });
});

app.get("/rooms", middleware, async (req, res) => {
  const userId = (req as any).userId;

  const rooms = await prismaClient.room.findMany({
    where: {
      adminId: userId,
    },
  });

  res.json({ rooms });
});

app.listen(3000, (error) => {
  console.log("Server is running on port 3000");
  console.log(error);
});
