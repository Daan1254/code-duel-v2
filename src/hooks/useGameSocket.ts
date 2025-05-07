import { GameDto } from "@/api/models";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface GameSocket {
  gameState: GameDto | null;
  joinQueue: (difficulty: string) => void;
  leaveQueue: () => void;
  sendEvent: <T>(event: string, data: T) => void;
  isHost: boolean;
}

export function useGameSocket(userId: string): GameSocket {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameDto | null>(null);

  useEffect(() => {
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:80"}/game`
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

    newSocket.on("gameStarted", (data: GameDto) => {
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

  const startGame = () => {
    socket?.emit("startGame", { userId });
  };

  const sendEvent = <T>(event: string, data: T) => {
    socket?.emit(event, data);
  };

  useEffect(() => {
    if (gameState) {
      setIsHost(
        gameState.participants.find(
          (participant) => participant.user.id === userId
        )?.isHost || false
      );
    }
  }, [gameState]);

  return { gameState, joinQueue, leaveQueue, sendEvent, isHost };
}
