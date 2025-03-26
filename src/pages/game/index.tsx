import { useGetMe } from "@/api/endpoints/user/user"
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useGameSocket } from "@/hooks/useGameSocket"
import { Users } from "lucide-react"
import { useState } from "react"

export default function GameQueue() {
  const [isQueuing, setIsQueuing] = useState(false)
  const { data, isLoading } = useGetMe();

  const { gameState, joinQueue, leaveQueue } = useGameSocket(data?.id || '');

  const handleJoinQueue = () => {
    joinQueue('EASY');
    setIsQueuing(true);
  };

  const handleLeaveQueue = () => {
    leaveQueue();
    setIsQueuing(false);
  };

  return (
    <>
    <div className="min-h-screen bg-background text-foreground dark flex">
    <div className="p-4 flex items-center justify-center w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join a Code Duel</CardTitle>
          <CardDescription>Select difficulty and join the queue</CardDescription>
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
            <span>In Lobby: {gameState?.participants.length} players</span>
          </div>
          <div className="space-y-2">
            {gameState?.participants.map((player) => (
              <div key={player.user.id} className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{player.user.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>1,234 players online</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {!isQueuing ? (
            <Button onClick={handleJoinQueue} className="w-full">
              Join Queue
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Leave Queue
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to leave the queue?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will lose your place in line and have to start over.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLeaveQueue}>Leave Queue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  </div>
  </>
  )
}

