import { GameDto, GameDtoStatus } from "@/api/models";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import { useUser } from "./useUser";

export interface GameSocket {
  gameState: GameDto | null;
  leave: () => void;
  isHost: boolean;
  startGame: () => void;
  submitCode: () => void;
}

interface GameSocketError {
  code: string;
  message: string;
}

export function useGameSocket(): GameSocket {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameDto | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!user?.id || !params.uuid) return;
    console.log("uuid", params.uuid);
    const newSocket = io(
      `${process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:80"}/game`,
      {
        auth: {
          userId: user?.id,
          gameId: params.uuid,
        },
      }
    );

    newSocket.on("gameState", (data: GameDto) => {
      console.log("gameState", data);
      setGameState(data);
    });

    newSocket.on("startGame", (data: GameDto) => {
      setGameState(data);
      console.log("startGame", data);
    });

    newSocket.on("error", (error: GameSocketError) => {
      switch (error.code) {
        case "PLAYER_NOT_IN_GAME":
          toast.error("You are not in this game");
          router.push("/game");
          break;
        case "GAME_NOT_FOUND":
          toast.error("Game not found...");
          router.push("/dashboard");
          break;
        case "NOT_ENOUGH_PLAYERS":
          toast.error("There were not enough players to start the game");
          router.push("/dashboard");
          break;
        case "PLAYER_ALREADY_COMPLETED":
          toast.error("You have already completed the game");
          router.push(`/game/${params.uuid}/results`);
          break;
        default:
          toast.error("An error occurred");
          break;
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user?.id, router]);

  const leave = () => {
    if (socket && user?.id) {
      socket.emit("leave");
      router.push("/dashboard");
      toast.success("Game left successfully");
    }
  };

  const submitCode = () => {
    if (!socket || !user?.id) return;
    socket.emit("submit");

    router.push(`/game/${params.uuid}/results`);
  };

  const startGame = () => {
    if (!socket || !user?.id) return;

    if (!isHost) {
      toast.error("You are not the host of this game");
      return;
    }

    if (gameState?.status !== GameDtoStatus.PENDING) {
      toast.error("Game is not pending");
      return;
    }

    if (gameState?.participants.length < 2) {
      toast.error(
        "There are not enough players to start the game (2 players required)"
      );
      return;
    }

    socket.emit("startGame");
  };

  useEffect(() => {
    if (gameState && user?.id) {
      console.log(gameState.participants);
      console.log(user?.id);

      setIsHost(
        gameState.participants?.find(
          (participant) => participant.user.id === user?.id
        )?.isHost || false
      );
    }
  }, [gameState]);

  return { gameState, leave, isHost, startGame, submitCode };
}
