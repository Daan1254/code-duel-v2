import { useCodeRunner } from "@/hooks/useCodeRunner";
import { CheckCircle, Play, Trash2, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface TestCase {
  input: any[];
  expected: string;
  description: string;
}

const CodeRunnerDemo = () => {
  const { runCode, consoleOutput, clearConsole, isRunning } = useCodeRunner();
  const [testResults, setTestResults] = useState<
    { passed: boolean; output: string; expected: string; description: string }[]
  >([]);

  // Problem: Find the maximum number in an array
  const problem = {
    title: "Find Maximum Number",
    description:
      "Write code that finds and console.log() the largest number in each test array. The arrays are available as 'testArray'.",
    starterCode: `// Write your code here
// Find the maximum number in testArray and console.log it

// Your solution here...`,
    testCases: [
      {
        input: [[1, 3, 2, 8, 5]],
        expected: "8",
        description: "Basic positive numbers",
      },
      {
        input: [[-1, -5, -2, -10]],
        expected: "-1",
        description: "All negative numbers",
      },
      {
        input: [[42]],
        expected: "42",
        description: "Single element array",
      },
      {
        input: [[0, 0, 0, 0]],
        expected: "0",
        description: "All zeros",
      },
      {
        input: [[100, 1, 50, 99, 101, 25]],
        expected: "101",
        description: "Mixed numbers with large values",
      },
    ] as TestCase[],
  };

  const [currentCode, setCurrentCode] = useState(problem.starterCode);

  const handleRunCode = async () => {
    if (!currentCode.trim()) return;

    try {
      await validateSolution();
    } catch (error) {
      console.error("Code execution failed:", error);
    }
  };

  const validateSolution = async () => {
    const results = [];

    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      try {
        const testCode = `
          ${currentCode}
        `;

        const result = await runCode(testCode, {
          testArray: testCase.input[0],
        });

        // Check if the expected value appears in any console output
        const hasExpectedOutput = consoleOutput.some(
          (output) =>
            output.method === "log" &&
            output.args.some((arg) => arg.includes(testCase.expected))
        );

        results.push({
          passed: hasExpectedOutput,
          output:
            consoleOutput.length > 0
              ? consoleOutput[consoleOutput.length - 1]?.args.join(" ") ||
                "No output"
              : "No output",
          expected: testCase.expected,
          description: testCase.description,
        });
      } catch (error) {
        results.push({
          passed: false,
          output:
            "Error: " +
            (error instanceof Error ? error.message : String(error)),
          expected: testCase.expected,
          description: testCase.description,
        });
      }
    }

    setTestResults(results);
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

  const passedTests = testResults.filter((t) => t.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#23272e] p-6">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-6">Code Challenge</h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Problem Description */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-4">Problem</h2>
            <Card className="flex-1 bg-[#181a20] border border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  {problem.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">{problem.description}</p>

                <div>
                  <h4 className="text-white font-semibold mb-2">Test Cases:</h4>
                  <div className="space-y-2 text-sm font-mono">
                    {problem.testCases.map((testCase, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 p-2 rounded flex items-center justify-between"
                      >
                        <div>
                          <div className="text-gray-400">
                            testArray: [{testCase.input[0].join(", ")}]
                          </div>
                          <div className="text-green-400">
                            Expected output: {testCase.expected}
                          </div>
                        </div>
                        {testResults.length > 0 && (
                          <div className="ml-4">
                            {testResults[index]?.passed ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Solution</h2>
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
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    "Testing..."
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Test Solution
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Card className="flex-1 bg-[#181a20] border border-muted-foreground/20">
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

          {/* Console Output */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibent text-white">
                Console Output
              </h2>
              <div className="text-sm text-gray-400">
                {consoleOutput.length} lines
              </div>
            </div>

            <Card className="flex-1 bg-[#181a20] border border-muted-foreground/20">
              <CardContent className="h-full p-4 overflow-y-auto">
                <div className="font-mono text-sm space-y-2">
                  {consoleOutput.length === 0 ? (
                    <div className="text-gray-500 italic">
                      Your console.log() output will appear here...
                    </div>
                  ) : (
                    consoleOutput.map((output, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <span className="text-gray-500 text-xs min-w-[70px] mt-0.5">
                          {new Date(output.timestamp).toLocaleTimeString()}
                        </span>
                        <span
                          className={`text-xs uppercase min-w-[50px] mt-0.5 font-semibold ${
                            output.method === "error"
                              ? "text-red-400"
                              : output.method === "warn"
                              ? "text-yellow-400"
                              : output.method === "info"
                              ? "text-cyan-400"
                              : "text-green-400"
                          }`}
                        >
                          {output.method}
                        </span>
                        <span
                          className={`${getConsoleOutputStyle(
                            output.method
                          )} break-words flex-1`}
                        >
                          {output.args.join(" ")}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRunnerDemo;
