import {
  useCreateCustomerPortalSession,
  useGetCurrentSubscription,
} from "@/api/endpoints/subscription/subscription";
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
import { CreditCard, Receipt } from "lucide-react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { data, isLoading } = useGetProfile();
  const { data: currentSubscription } = useGetCurrentSubscription();
  const router = useRouter();

  const customerPortalMutation = useCreateCustomerPortalSession({
    mutation: {
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Er is een fout opgetreden");
      },
    },
  });

  const handleViewInvoices = () => {
    customerPortalMutation.mutate();
  };

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
                      {currentSubscription?.name ?? "FREE"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={`font-medium ${
                        currentSubscription?.status === "active"
                          ? "text-green-500"
                          : currentSubscription?.status
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }`}
                    >
                      {currentSubscription?.status ?? "No active subscription"}
                    </span>
                  </div>
                  {currentSubscription && (
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">
                        €{((currentSubscription.price || 0) / 100).toFixed(2)}
                        /month
                      </span>
                    </div>
                  )}
                  <Button
                    className="w-full mt-4"
                    onClick={() => router.push("/dashboard/subscriptions")}
                  >
                    {currentSubscription ? "Manage Plan" : "Choose Plan"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Billing & Invoices Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Billing & Invoices
                </CardTitle>
                <CardDescription>
                  Manage your billing and view invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>
                      View all your invoices and manage payment methods
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleViewInvoices}
                    data-testid="invoices-button"
                    disabled={
                      customerPortalMutation.isPending || !currentSubscription
                    }
                  >
                    {customerPortalMutation.isPending
                      ? "Opening..."
                      : !currentSubscription
                      ? "No subscription"
                      : "View Invoices & Billing"}
                  </Button>
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
