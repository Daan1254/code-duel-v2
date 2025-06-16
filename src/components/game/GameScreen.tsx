import { useCodeRunner } from "@/hooks/useCodeRunner";
import { GameSocket } from "@/hooks/useGameSocket";
import { CheckCircle, Play, Trash2, Users, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface TestResult {
  testCaseId: number;
  passed: boolean;
  actualOutput?: string;
  expectedOutput: string;
}

const GameScreen = ({ gameState, submitCode }: GameSocket) => {
  const { runCode, consoleOutput, clearConsole, isRunning } = useCodeRunner();
  const [currentCode, setCurrentCode] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Initialize code with starter code
  useEffect(() => {
    if (gameState?.challenge?.starterCode && !currentCode) {
      setCurrentCode(gameState.challenge.starterCode);
    }
  }, [gameState?.challenge?.starterCode, currentCode]);

  // Handle code execution with test validation
  const handleRunCode = async () => {
    if (!currentCode.trim()) return;

    // Clear console before each run
    clearConsole();

    try {
      await validateAllTestCases();
    } catch (error) {
      console.error("Code execution failed:", error);
    }
  };

  const validateAllTestCases = async () => {
    if (!gameState?.challenge?.testCases) return;

    clearConsole();

    const results: TestResult[] = [];

    const visibleTestCases = gameState.challenge.testCases.filter(
      (tc) => !tc.hidden
    );

    for (const testCase of visibleTestCases) {
      try {
        const executionResult = await runCode(currentCode, testCase.inputs);

        const testCaseOutput =
          executionResult.consoleOutput?.filter(
            (output) => output.method === "log"
          ) || [];

        console.log(`Test ${testCase.id} output:`, testCaseOutput);

        const userOutput =
          testCaseOutput.length > 0
            ? testCaseOutput[testCaseOutput.length - 1]?.args.join(" ") ||
              "No output"
            : "No output";

        console.log(`Test ${testCase.id} user output:`, userOutput);

        const hasExpectedOutput = testCaseOutput.some((output) =>
          output.args.some((arg) => arg.includes(testCase.expectedOutput))
        );

        results.push({
          testCaseId: testCase.id,
          passed: hasExpectedOutput,
          actualOutput: userOutput,
          expectedOutput: testCase.expectedOutput,
        });
      } catch (error) {
        const errorMessage =
          "Error: " + (error instanceof Error ? error.message : String(error));

        results.push({
          testCaseId: testCase.id,
          passed: false,
          actualOutput: errorMessage,
          expectedOutput: testCase.expectedOutput,
        });
      }
    }

    setTestResults(results);
  };

  const getTestResult = (testCaseId: number) => {
    return testResults.find((result) => result.testCaseId === testCaseId);
  };

  const getConsoleOutputStyle = (method: string) => {
    switch (method) {
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-gray-300";
    }
  };

  // Calculate test percentage
  const calculatePercentage = () => {
    if (testResults.length === 0) return 0;
    const passedTests = testResults.filter((r) => r.passed).length;
    return Math.round((passedTests / testResults.length) * 100);
  };

  // Handle final submission
  const handleSubmitCode = () => {
    const percentage = calculatePercentage();
    submitCode(percentage, currentCode);
  };

  if (!gameState) {
    return <div>Loading...</div>;
  }
  // Get visible test cases for display
  const visibleTestCases =
    gameState.challenge.testCases?.filter((tc) => !tc.hidden) || [];

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
          <CardContent className="space-y-4">
            <div className="prose prose-invert text-gray-200 max-w-none">
              <p>{gameState.challenge.description}</p>
            </div>

            {/* Test Cases with Results */}
            {visibleTestCases.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3">Test Cases:</h4>
                <div className="space-y-2 text-sm">
                  {visibleTestCases.map((testCase) => {
                    const result = getTestResult(testCase.id);
                    return (
                      <div
                        key={testCase.id}
                        className="bg-gray-800 p-3 rounded flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="text-gray-300 font-medium mb-1">
                            {testCase.description}
                          </div>
                          <div className="font-mono text-xs space-y-1">
                            {Object.entries(testCase.inputs).map(
                              ([key, value]) => (
                                <div key={key} className="text-gray-400">
                                  {key}:{" "}
                                  {Array.isArray(value)
                                    ? `[${value.join(", ")}]`
                                    : JSON.stringify(value)}
                                </div>
                              )
                            )}
                            <div className="text-green-400">
                              Expected: {testCase.expectedOutput}
                            </div>
                          </div>
                        </div>
                        {result && (
                          <div className="ml-3">
                            {result.passed ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Progress Summary */}
            {testResults.length > 0 && (
              <div className="bg-gray-800 p-3 rounded">
                <div className="text-white font-semibold mb-2">Progress:</div>
                <div className="text-2xl font-bold text-green-400">
                  {calculatePercentage()}%
                </div>
                <div className="text-sm text-gray-400">
                  {testResults.filter((r) => r.passed).length}/
                  {testResults.length} tests passed
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Code Editor & Console */}
        <div className="flex-1 flex flex-col bg-[#23272e]">
          {/* Language selector and code editor */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2">
            <div className="text-sm text-gray-400 font-mono">JavaScript ▼</div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearConsole}
                className="bg-[#181a20] border-muted-foreground/20 text-gray-300 hover:bg-[#2a2d35]"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <Button
                variant="default"
                className="w-32 bg-green-600 hover:bg-green-700"
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? (
                  "Testing..."
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    RUN & TEST
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="flex-1 px-6 pb-2">
            <Card className="h-full bg-[#181a20] border border-muted-foreground/20">
              <CardContent className="h-full p-0">
                <MonacoEditor
                  className="h-full rounded-2xl"
                  language="javascript"
                  theme="vs-dark"
                  value={currentCode}
                  onChange={(value) => setCurrentCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                  }}
                />
              </CardContent>
            </Card>
          </div>
          {/* Console output */}
          <div className="px-6 pb-2">
            <Card className="bg-[#181a20] border border-muted-foreground/20 h-72">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-gray-400 font-mono">
                    Console output
                  </CardTitle>
                  <div className="text-xs text-gray-500">
                    {consoleOutput.length} lines
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 h-full overflow-y-auto">
                <div className="font-mono text-sm space-y-1">
                  {consoleOutput.length === 0 ? (
                    <div className="text-gray-500 italic">
                      Run your code to see output...
                    </div>
                  ) : (
                    consoleOutput.map((output, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-gray-500 text-xs min-w-[60px]">
                          {new Date(output.timestamp).toLocaleTimeString()}
                        </span>
                        <span
                          className={`text-xs uppercase min-w-[40px] ${
                            output.method === "error"
                              ? "text-red-400"
                              : output.method === "warn"
                              ? "text-yellow-400"
                              : output.method === "info"
                              ? "text-blue-400"
                              : "text-gray-400"
                          }`}
                        >
                          {output.method}
                        </span>
                        <span className={getConsoleOutputStyle(output.method)}>
                          {output.args.join(" ")}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Test cases row */}
          <div className="flex items-center gap-2 px-6 py-2 border-t border-muted-foreground/10 bg-[#23272e]">
            <div className="flex items-center gap-2">
              {testResults.length > 0 && (
                <div className="text-sm text-gray-400">
                  Tests: {testResults.filter((r) => r.passed).length}/
                  {testResults.length} passed
                </div>
              )}
            </div>
            <Button
              variant="default"
              onClick={handleSubmitCode}
              className="ml-auto"
            >
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
