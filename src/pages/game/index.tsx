import { useGetMe } from "@/api/endpoints/user/user";
import { GameQueue } from "@/components/game/GameQueue";
import { useGameSocket } from "@/hooks/useGameSocket";

export default function Game() {
  const { data } = useGetMe();

  const game = useGameSocket(data?.id || "");

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
