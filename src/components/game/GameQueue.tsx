import { GameSocket } from "@/hooks/useGameSocket";

import { formatTime } from "@/lib/utils";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export const GameQueue = ({
  gameState,
  isHost,
  leave,
  startGame,
}: GameSocket) => {
  const [countdown, setCountdown] = useState("Starting soon...");

  useEffect(() => {
    if (gameState?.startsAt && new Date(gameState.startsAt) > new Date()) {
      // Update countdown every second
      const timer = setInterval(() => {
        const timeLeft =
          new Date(gameState.startsAt).getTime() - new Date().getTime();
        if (timeLeft > 0) {
          setCountdown(formatTime(new Date(gameState.startsAt)));
        } else {
          setCountdown("Starting soon...");
          clearInterval(timer);
          if (isHost) {
            startGame();
          }
        }
      }, 1000);

      // Cleanup interval on unmount or when gameState changes
      return () => clearInterval(timer);
    } else {
      console.log(isHost);
      if (isHost) {
        startGame();
      }
    }
  }, [gameState, isHost, startGame]);

  const maxPlayers = 8;

  const emptySlots = maxPlayers - (gameState?.participants?.length || 0);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted">
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gradient bg-gradient-to-r from-white to-gray-900 bg-clip-text text-transparent mb-2">
          CODE{" "}
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text">
            DUEL
          </span>
        </h1>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          className="px-8 py-4 text-lg font-bold "
          variant="default"
          disabled={!isHost}
          onClick={startGame}
        >
          LAUNCH GAME
        </Button>
        <Button
          className="px-8 py-4 text-lg font-bold bg-muted-foreground/20"
          variant="secondary"
          onClick={leave}
        >
          LEAVE CLASH
        </Button>
      </div>

      {/* Countdown */}
      <div className="mb-6 text-xl font-semibold">
        Game starts in: <span className="font-mono">{countdown}</span>
      </div>

      {/* Player grid */}
      <div className="grid grid-cols-4 gap-6">
        {gameState?.participants.map((player) => (
          <div key={player.user.id} className="flex flex-col items-center">
            <Avatar className="w-16 h-16 mb-2 bg-muted">
              <AvatarFallback>
                <Users className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium   max-w-[80px] text-center">
              {player.user.username}
            </span>
          </div>
        ))}
        {[...Array(emptySlots)].map((_, i) => (
          <div key={i} className="flex flex-col items-center opacity-60">
            <Avatar className="w-16 h-16 mb-2 bg-muted">
              <AvatarFallback>
                <Users className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              Waiting for player...
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
