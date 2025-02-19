import { useGetHello } from "@/api/endpoints/app/app"
import { Navigation } from "@/components/shared/navigation"
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
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"
import { useState } from "react"

export default function GameQueue() {
  const [isQueuing, setIsQueuing] = useState(false)
  const [queueProgress, setQueueProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState("2:30")
  const [difficulty, setDifficulty] = useState("medium")

  const { data } = useGetHello();

  const handleJoinQueue = () => {
    setIsQueuing(true)
    // Simulating queue progress
    const interval = setInterval(() => {
      setQueueProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 1000)
  }

  const handleLeaveQueue = () => {
    setIsQueuing(false)
    setQueueProgress(0)
  }

  return (
    <>
    <Navigation />
    <div className="min-h-screen bg-background text-foreground dark flex">
    <div className="p-4 flex items-center justify-center w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join a Code Duel</CardTitle>
          <CardDescription>Select difficulty and join the queue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty
              {JSON.stringify(data)}

            </label>
            <Select disabled={isQueuing} value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isQueuing && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Searching for opponents...</span>
                <span className="text-sm text-muted-foreground">Est. wait: {estimatedTime}</span>
              </div>
              <Progress value={queueProgress} className="h-2" />
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

