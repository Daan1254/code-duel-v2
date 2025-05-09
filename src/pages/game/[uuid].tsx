import { GameQueue } from "@/components/game/GameQueue";
import { useGameSocket } from "@/hooks/useGameSocket";

export default function Game() {
  const game = useGameSocket();

  return (
    <>
      <div className="min-h-screen bg-background text-foreground dark flex">
        {(game.gameState?.status == "PENDING" || game.gameState === null) && (
          <GameQueue {...game} />
        )}
      </div>
    </>
  );
}
