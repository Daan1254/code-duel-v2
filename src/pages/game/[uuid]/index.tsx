import { GameDtoStatus } from "@/api/models";
import { GameQueue } from "@/components/game/GameQueue";
import GameScreen from "@/components/game/GameScreen";
import { useGameSocket } from "@/hooks/useGameSocket";

export default function Game() {
  const game = useGameSocket();

  if (!game.gameState) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-muted text-foreground dark flex">
        {(game.gameState.status == "PENDING" || game.gameState === null) && (
          <GameQueue {...game} />
        )}
        {game.gameState.status === GameDtoStatus.IN_PROGRESS &&
          game.gameState && <GameScreen {...game} />}
      </div>
    </>
  );
}
