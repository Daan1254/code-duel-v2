import { useGetProfile } from "@/api/endpoints/user/user";
import { StatisticsCard } from "@/components/dashboard/StatisticsCard";
import { Navigation } from "@/components/shared/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data, isLoading } = useGetProfile();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Navigation />
      <div className="p-4">
        <div className="container mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {/* User Profile Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="User avatar" />
                <AvatarFallback className="font-bold">
                  {data?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{data?.username}</h2>
                <p className="text-muted-foreground">Full Stack Developer</p>
              </div>
            </div>
            <Button>Edit Profile</Button>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Subscription Card */}
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your active plan details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">
                      {data?.subscription?.name ?? "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-500">
                      {data?.subscription?.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next billing:</span>
                    <span className="font-medium">volgende week neef</span>
                  </div>
                  <Button className="w-full mt-4">Upgrade Plan</Button>
                </div>
              </CardContent>
            </Card>

            <StatisticsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
