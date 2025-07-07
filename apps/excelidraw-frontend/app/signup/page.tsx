"use client";

import { useState } from "react";
import { Input } from "@repo/ui/Input";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:3000/signup", {
        email,
        password,
        name,
      });

      alert(res.data.message);
    } catch (err) {
      alert("Signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center px-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-400">
          Create an Account
        </h2>
        <p className="text-center text-gray-300">Start your journey with Excelidraw</p>
        
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={handleSignup}
          className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <a href="/signin" className="text-purple-400 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
