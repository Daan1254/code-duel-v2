import { GameDto } from "@/api/models";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useGameSocket(userId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameDto | null>(null);

  useEffect(() => {
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_BACK_END_URL ?? "http://localhost"}:80/game`
    );

    newSocket.on("playerJoined", (data: GameDto) => {
      setGameState(data);
    });

    newSocket.on("playerLeft", (data: GameDto) => {
      setGameState(data);
    });

    newSocket.on("error", (data: GameDto) => {
      setGameState(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinQueue = (difficulty: string) => {
    socket?.emit("joinQueue", { userId, difficulty });
  };

  const leaveQueue = () => {
    socket?.emit("leaveQueue", { userId });
  };

  return { gameState, joinQueue, leaveQueue };
}
