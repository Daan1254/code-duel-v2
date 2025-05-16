import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useUser } from "@/hooks/useUser";

const ResultsPage = () => {
  const { gameState } = useGameSocket();
  const { user: userData } = useUser();

  if (!gameState) {
    return <div>Loading...</div>;
  }

  const calculateDuration = (completedAt: string | null, startsAt: string) => {
    if (!completedAt) return "--:--";
    try {
      console.log(completedAt, startsAt);
      const completedAtDate = new Date(completedAt);
      const startsAtDate = new Date(startsAt);

      if (isNaN(completedAtDate.getTime()) || isNaN(startsAtDate.getTime())) {
        console.error("Invalid date format");
        return "--:--";
      }

      const totalSeconds = Math.floor(
        (completedAtDate.getTime() - startsAtDate.getTime()) / 1000
      );

      if (totalSeconds < 0) {
        console.error("Negative duration");
        return "--:--";
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } catch (err) {
      console.error("Error calculating duration:", err);
      console.log("completedAt:", completedAt);
      console.log("startsAt:", startsAt);
      return "--:--";
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#23272e]">
      <div className="max-w-7xl mx-auto w-full mt-10">
        <Card className="bg-[#181a20] border border-muted-foreground/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {gameState.participants.map((user, idx) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between px-4 py-3 rounded ${
                    user.id === userData?.id
                      ? "bg-yellow-900/30 border-2 border-yellow-400"
                      : "bg-muted-foreground/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-gray-300 w-6 text-center">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {user.user.username}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.language}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-white font-bold">100%</div>
                      <div className="text-xs text-gray-400">SCORE</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">
                        {calculateDuration(
                          user.completedAt,
                          gameState.startsAt
                        )}
                      </div>
                      <div className="text-xs text-gray-400">DURATION</div>
                    </div>
                    <Button variant="secondary" size="sm">
                      VIEW CODE
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Share your code section */}
        <Card className="bg-[#181a20] border border-muted-foreground/20 mt-6">
          <CardContent className="py-6 flex flex-col items-center">
            <div className="text-white font-semibold mb-2">Share Your Code</div>
            <div className="text-gray-400 text-sm mb-4 text-center max-w-md">
              Code sharing helps other coders improve and gives you the
              opportunity to receive feedback. Embrace this philosophy of mutual
              sharing and boost your knowledge.
            </div>
            <Button variant="default" className="w-48">
              SHARE MY CODE
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;
