import { useRegister } from "@/api/endpoints/auth/auth";
import { RegisterDto } from "@/api/models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { setCookie } from "typescript-cookie";



export default function Index() {
  const { mutateAsync: signUp } = useRegister();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
  } = useForm<RegisterDto>();
  const onSubmit: SubmitHandler<RegisterDto> = async (data) => {
    console.log(data);
    try {
      const result = await signUp({
        data: {
          email: data.email,
          password: data.password,
          username: data.username,
          passwordConfirmation: data.passwordConfirmation,
        },
      });

      setCookie('token', result.access_token);
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message);
    }
  }

  
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Register to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <p className="text-red-500">{error}</p>
            <Input {...register("username")} type="text" placeholder="Username" />
            <Input {...register("email")} type="email" placeholder="Email" />
            <Input {...register("password")} type="password" placeholder="Password" />
            <Input {...register("passwordConfirmation")} type="password" placeholder="Confirm Password" />
            <Button type="submit">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="link">Forgot Password?</Button>
          <Link href="/login" className="text-sm text-gray-500">Already have an account? Login</Link>
        </CardFooter>
      </Card>
    </div>  
  );
}
