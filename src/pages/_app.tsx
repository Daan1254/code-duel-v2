import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <>
      <div className="flex flex-col h-screen w-full dark bg-background">
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" />
          <Component {...pageProps} />
        </QueryClientProvider>
      </div>
    </>
  );
}
