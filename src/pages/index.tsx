import { useSignIn } from "@/api/endpoints/auth/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { setCookie } from "typescript-cookie";



export default function Index() {
  const { mutateAsync: signIn } = useSignIn();
  const router = useRouter();
  const submit = async () => {
    try {
      const result = await signIn({
        data: {
          email: 'daan@code-duel.com',
          password: 'Test123!',
        },
      });

      setCookie('token', result.access_token);
      router.push('/dashboard');
    } catch (e) {
      console.log(e);
    }
  }
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
          <Button onClick={submit}>Login</Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="link">Forgot Password?</Button>
          <Button variant="link">Sign Up</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
