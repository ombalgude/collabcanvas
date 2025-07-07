"use client";

import { useState } from "react";
import { Input } from "@repo/ui/Input";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/signin", {
        email,
        password,
      });

      alert(res.data.message);
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      alert("Signin failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-400">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300">
          Sign in to continue to Excelidraw
        </p>

        <Input
          type="text"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignin}
          className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Sign In
        </button>

        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
