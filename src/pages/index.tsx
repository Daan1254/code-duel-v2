import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Login to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Login</Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="link">Forgot Password?</Button>
          <Button variant="link">Sign Up</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
