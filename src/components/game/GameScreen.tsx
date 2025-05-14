import { GameSocket } from "@/hooks/useGameSocket";
import { Users } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const GameScreen = ({ gameState, submitCode }: GameSocket) => {
  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#23272e]">
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Challenge Info */}
        <Card className="w-[420px] min-w-[320px] max-w-[480px] h-full rounded-none border-r border-muted-foreground/20 bg-[#23272e]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              {gameState.challenge.title}
            </CardTitle>
            <CardDescription className="text-sm text-blue-300 mt-2">
              {gameState.challenge.difficulty}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert text-gray-200 max-w-none">
              <p>{gameState.challenge.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Right: Code Editor & Console */}
        <div className="flex-1 flex flex-col bg-[#23272e]">
          {/* Language selector and code editor */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2">
            <div className="text-sm text-gray-400 font-mono">JavaScript ▼</div>
            <Button variant="default" className="ml-auto w-32">
              RUN
            </Button>
          </div>
          <div className="flex-1 px-6 pb-2">
            <Card className="h-full bg-[#181a20] border border-muted-foreground/20">
              <CardContent className="h-full p-0">
                {/* Replace this with your code editor component */}
                <textarea
                  className="w-full h-full bg-transparent text-white font-mono p-4 resize-none outline-none"
                  placeholder="// Write your code here"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          </div>
          {/* Console output */}
          <div className="px-6 pb-2">
            <Card className="bg-[#181a20] border border-muted-foreground/20 h-72">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400 font-mono">
                  Console output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-gray-300">
                  Output will appear here...
                </pre>
              </CardContent>
            </Card>
          </div>
          {/* Test cases row */}
          <div className="flex items-center gap-2 px-6 py-2 border-t border-muted-foreground/10 bg-[#23272e]">
            {/* {gameState.challenge.testCases.map((testCase) => (
              <TestCaseModal key={testCase.id} testCase={testCase} />
            ))} */}
            <Button variant="default" onClick={submitCode} className="ml-auto">
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
      {/* Bottom: Player Status */}
      <div className="w-full bg-[#181a20] border-t border-muted-foreground/20 px-6 py-3 flex items-center gap-4 overflow-x-auto">
        {gameState.participants.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-2 px-3 py-2 rounded bg-muted-foreground/10 min-w-[180px]"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback>
                <Users className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-white font-medium">
                {user.user.username}
              </div>
              <div className="text-xs text-gray-400">
                {user.isCompleted ? (
                  <span className="text-green-400">Completed</span>
                ) : (
                  <span className="text-yellow-400">In Progress</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
