import { useGetMe } from "@/api/endpoints/user/user";
import { GameDto } from "@/api/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface GameSocket {
  gameState: GameDto | null;
  connect: () => void;
  isHost: boolean;
  error: string | null;
}

export function useGameSocket(): GameSocket {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useGetMe();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:80"}/game`,
      {
        auth: {
          userId: user?.id,
        },
      }
    );

    newSocket.on("gameState", (data: GameDto) => {
      console.log("gameState", data);
      setGameState(data);
    });

    newSocket.on("error", (data: { message: string }) => {
      if (data.message === "PLAYER_NOT_IN_GAME") {
        router.push("/game");
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user?.id]);

  const connect = () => {
    if (socket && user?.id) {
      socket.emit("connect", { userId: user?.id });
    }
  };

  useEffect(() => {
    if (gameState && user?.id) {
      setIsHost(
        gameState.participants.find(
          (participant) => participant.user.id === user?.id
        )?.isHost || false
      );
    }
  }, [gameState]);

  return { gameState, connect, isHost, error };
}
