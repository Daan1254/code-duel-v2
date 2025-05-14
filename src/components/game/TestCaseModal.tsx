import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader } from "../ui/alert-dialog";
import { Button } from "../ui/button";

const TestCaseModal = ({ testCase }: { testCase: any }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant={testCase.passed ? "success" : "secondary"}
        className={`w-full flex justify-between items-center px-4 py-2 rounded-md text-xs font-mono ${
          testCase.passed
            ? "bg-green-900/40 text-green-300"
            : "bg-yellow-900/40 text-yellow-300"
        }`}
      >
        <span>Test {testCase.id}</span>
        <span>{testCase.passed ? "✔" : "✗"}</span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-muted-foreground/20 border-muted-foreground/20 max-w-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-lg font-bold">
          Test Case {testCase.id}
        </AlertDialogTitle>
      </AlertDialogHeader>
      <div className="mt-2">
        <div>
          <div className="font-semibold text-white mb-1">Input</div>
          <pre className="bg-muted-foreground/30 p-3 rounded text-sm text-gray-300">
            {testCase.input}
          </pre>
        </div>
        <div className="mt-3">
          <div className="font-semibold text-white mb-1">Expected Output</div>
          <pre className="bg-muted-foreground/30 p-3 rounded text-sm text-gray-300">
            {testCase.output}
          </pre>
        </div>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);
