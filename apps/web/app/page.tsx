"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {

  const [roomId, setRoomId] = useState("")
  const router = useRouter()

  return (
  <>
<div className="flex w-screen h-screen justify-center items-center">
  <div>
    <input type="text" value={roomId} onChange={(e) => {
        setRoomId(e.target.value)
    }} placeholder="Room id"/>  

    <button onClick={ () =>router.push(`/room/${roomId}`)
    }  >Join Room</button>
  </div>

</div>

  </>
)}
