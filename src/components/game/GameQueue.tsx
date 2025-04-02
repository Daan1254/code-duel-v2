import { GameSocket } from "@/hooks/useGameSocket";

import { Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const GameQueue = ({
  gameState,
  joinQueue,
  leaveQueue,
  isHost,
  sendEvent,
}: GameSocket) => {
  const isQueuing =
    gameState?.status === "PENDING" && gameState?.participants.length > 0;
  return (
    <>
      <div className="p-4 flex items-center justify-center w-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join a Code Duel</CardTitle>
            <CardDescription>
              Select difficulty and join the queue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* <Select disabled={isQueuing} value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select> */}
            </div>
            {isQueuing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>
                    In Lobby: {gameState?.participants.length} players
                  </span>
                </div>

                <div className="space-y-2">
                  {gameState?.participants.map((player) => (
                    <div
                      key={player.user.id}
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      <span>{player.user.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {!isQueuing ? (
              <Button onClick={() => joinQueue("EASY")} className="w-full">
                Join Queue
              </Button>
            ) : (
              <>
                {isHost && (
                  <Button
                    variant="outline"
                    disabled={gameState?.participants.length === 1}
                    className="w-full"
                    onClick={() =>
                      sendEvent("startGame", {
                        userId: gameState?.participants[0].user.id,
                      })
                    }
                  >
                    Start Game
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <>
                      <Button variant="outline" className="w-full">
                        Leave Queue
                      </Button>
                    </>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to leave the queue?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You will lose your place in line and have to start over.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => leaveQueue()}>
                        Leave Queue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};
