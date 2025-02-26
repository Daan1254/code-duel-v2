import { useSignIn } from "@/api/endpoints/auth/auth";
import { SignInDto } from "@/api/models/signInDto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { setCookie } from "typescript-cookie";



export default function Index() {
  const { mutateAsync: signIn } = useSignIn();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInDto>();
  const onSubmit: SubmitHandler<SignInDto> = async (data) => {
    try {
      const result = await signIn({
        data: {
          email: data.email,
          password: data.password,
        },
      });

      setCookie('token', result.access_token);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message);
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
        <CardContent>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-red-500">{error}</p>
            <Input {...register("email")} type="email" placeholder="Email" />
            <Input {...register("password")} type="password" placeholder="Password" />
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="link">Forgot Password?</Button>
          <Link href="/register" className="text-sm text-gray-500">Don't have an account? Sign Up</Link>
        </CardFooter>
      </Card>
    </div>  
  );
}
