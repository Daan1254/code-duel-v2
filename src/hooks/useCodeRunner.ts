import { useCallback, useEffect, useRef, useState } from "react";

export interface ConsoleOutput {
  method: "log" | "error" | "warn" | "info";
  args: string[];
  timestamp: number;
}

export interface ExecutionResult {
  success: boolean;
  result?: any;
  error?: {
    message: string;
    stack?: string;
    name: string;
  };
  executionTime: number;
  consoleOutput?: ConsoleOutput[];
}

export interface CodeRunnerHook {
  runCode: (
    code: string,
    inputs?: Record<string, any>
  ) => Promise<ExecutionResult>;
  consoleOutput: ConsoleOutput[];
  clearConsole: () => void;
  isRunning: boolean;
  getLatestConsoleOutput: () => ConsoleOutput[];
}

export function useCodeRunner(): CodeRunnerHook {
  const workerRef = useRef<Worker | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const promiseResolvers = useRef<{
    resolve: (value: ExecutionResult) => void;
    reject: (reason?: any) => void;
  } | null>(null);
  const currentExecutionOutput = useRef<ConsoleOutput[]>([]);

  // Initialize worker
  useEffect(() => {
    if (typeof window !== "undefined") {
      const worker = new Worker("/workers/codeRunner.js");

      worker.onmessage = (event) => {
        const { type, method, args, success, result, error, executionTime } =
          event.data;

        if (type === "console") {
          const consoleEntry = {
            method,
            args,
            timestamp: Date.now(),
          };

          setConsoleOutput((prev) => [...prev, consoleEntry]);

          // Also add to current execution output
          if (currentExecutionOutput.current) {
            currentExecutionOutput.current.push(consoleEntry);
          }
        } else if (type === "result") {
          setIsRunning(false);

          if (promiseResolvers.current) {
            const executionResult: ExecutionResult = {
              success,
              result,
              error,
              executionTime,
              consoleOutput: [...currentExecutionOutput.current], // Include captured output
            };

            promiseResolvers.current.resolve(executionResult);
            promiseResolvers.current = null;

            // Clear current execution output
            currentExecutionOutput.current = [];
          }
        } else if (type === "ready") {
          console.log("Code runner worker is ready");
        }
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        setIsRunning(false);

        if (promiseResolvers.current) {
          promiseResolvers.current.reject(error);
          promiseResolvers.current = null;
          currentExecutionOutput.current = [];
        }
      };

      workerRef.current = worker;

      return () => {
        worker.terminate();
      };
    }
  }, []);

  const runCode = useCallback(
    (code: string, inputs: Record<string, any> = {}) => {
      return new Promise<ExecutionResult>((resolve, reject) => {
        if (!workerRef.current) {
          reject(new Error("Worker not initialized"));
          return;
        }

        setIsRunning(true);
        promiseResolvers.current = { resolve, reject };

        // Reset current execution output
        currentExecutionOutput.current = [];

        // Send code to worker
        workerRef.current.postMessage({
          type: "execute",
          code,
          inputs,
          timeout: 5000,
        });

        setTimeout(() => {
          if (promiseResolvers.current) {
            setIsRunning(false);
            promiseResolvers.current.reject(new Error("Execution timeout"));
            promiseResolvers.current = null;
            currentExecutionOutput.current = [];
          }
        }, 6000);
      });
    },
    []
  );

  const clearConsole = useCallback(() => {
    setConsoleOutput([]);
  }, []);

  const getLatestConsoleOutput = useCallback(() => {
    return consoleOutput;
  }, [consoleOutput]);

  return {
    runCode,
    consoleOutput,
    clearConsole,
    isRunning,
    getLatestConsoleOutput,
  };
}
