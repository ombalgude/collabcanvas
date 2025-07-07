"use client";

import { Button } from "@repo/ui/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [roomName, setRoomName] = useState("");
  const [roomSlug, setRoomSlug] = useState("");
  const [rooms, setRooms] = useState<{ id: number; slug: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/rooms", {
        headers: {
          Authorization: token ?? "",
        },
      });

      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!roomName) return alert("Please enter a room name");

      const res = await axios.post(
        "http://localhost:3000/create-room",
        { name: roomName },
        {
          headers: {
            Authorization: token ?? "",
          },
        }
      );

      const newRoomId = res.data.roomId;
      alert("Room created successfully!");
      router.push(`/canvas/${newRoomId}`);
    } catch (err) {
      alert("Room creation failed");
      console.error(err);
    }
  };

  const handleJoinRoom = async () => {
    try {
      if (!roomSlug) return alert("Enter Room Slug to Join");

      const res = await axios.get(`http://localhost:3000/room/${roomSlug}`);
      const roomId = res.data.room?.id;

      if (!roomId) return alert("Room not found");
      router.push(`/canvas/${roomId}`);
    } catch (err) {
      alert("Failed to join room");
      console.error(err);
    }
  };

  const joinRoomById = (roomId: number) => {
    router.push(`/canvas/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-purple-400">Dashboard</h1>


        <div className="bg-white/5 backdrop-blur p-6 rounded-xl space-y-4 border border-white/10">
          <h2 className="text-2xl font-semibold text-purple-300">Create a New Room</h2>
          <input
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-black/50 text-white placeholder-white border border-white/20"
          />
          <Button onClick={handleCreateRoom}>Create Room</Button>
        </div>

        <div className="bg-white/5 backdrop-blur p-6 rounded-xl space-y-4 border border-white/10">
          <h2 className="text-2xl font-semibold text-purple-300">Join a Room via Slug</h2>
          <input
            type="text"
            placeholder="Enter Room Slug"
            value={roomSlug}
            onChange={(e) => setRoomSlug(e.target.value)}
            className="w-full px-4 py-2 rounded bg-black/50 text-white placeholder-white border border-white/20"
          />
          <Button onClick={handleJoinRoom}>Join Room</Button>
        </div>

        <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Your Rooms</h2>
          {rooms.length === 0 ? (
            <p className="text-gray-300">No rooms created yet.</p>
          ) : (
            <div className="space-y-2">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-3 bg-black/30 rounded border border-white/10"
                >
                  <span className="text-white">{room.slug}</span>
                  <Button onClick={() => joinRoomById(room.id)}>Join</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
