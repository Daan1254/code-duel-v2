import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Player {
  userId: string;
  username: string;
}

interface GameState {
  gameId: string | null;
  players: Player[];
  isConnected: boolean;
  error: string | null;
}

export function useGameSocket(userId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    gameId: null,
    players: [],
    isConnected: false,
    error: null,
  });

  useEffect(() => {
    const newSocket = io("http://localhost:80/game");

    newSocket.on("connect", () => {
      setGameState((prev) => ({ ...prev, isConnected: true }));
    });

    newSocket.on(
      "playerJoined",
      (data: { gameId: string; players: Player[] }) => {
        setGameState((prev) => ({
          ...prev,
          gameId: data.gameId,
          players: data.players,
        }));
      }
    );

    newSocket.on(
      "playerLeft",
      (data: { gameId: string; players: Player[] }) => {
        setGameState((prev) => ({
          ...prev,
          players: data.players,
        }));
      }
    );

    newSocket.on("error", (data: { message: string }) => {
      setGameState((prev) => ({ ...prev, error: data.message }));
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
