import { customInstance } from "@/api/custom-instance";
import {
  useGetCurrentSubscription,
  useGetSubscriptions,
} from "@/api/endpoints/subscription/subscription";
import { Navigation } from "@/components/shared/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Zap } from "lucide-react";
import router from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

export const Subscriptions = () => {
  const { data: subscriptions } = useGetSubscriptions();
  const { data: currentSubscription } = useGetCurrentSubscription();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Custom mutation functions with parameters since orval doesn't generate them correctly
  const changeSubscriptionMutation = useMutation({
    mutationFn: (priceId: string) =>
      customInstance({
        url: "/api/subscription/change",
        method: "PATCH",
        data: { priceId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/subscription/current"],
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: () =>
      customInstance({
        url: "/api/subscription/cancel",
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/subscription/current"],
      });
    },
  });

  const createCheckoutMutation = useMutation({
    mutationFn: (priceId: string) =>
      customInstance<{ url: string }>({
        url: "/api/subscription/create-checkout-session-for-subscription",
        method: "POST",
        data: { priceId },
      }),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleSubscriptionAction = async (subscription: any) => {
    setIsLoading(subscription.id);

    try {
      if (!currentSubscription) {
        // No current subscription - create new one
        await createCheckoutMutation.mutateAsync(subscription.priceId);
      } else if (currentSubscription.id === subscription.id) {
        // Same subscription - do nothing or show manage options
        toast("Dit is je huidige abonnement");
      } else {
        // Different subscription - upgrade/downgrade
        await changeSubscriptionMutation.mutateAsync(subscription.priceId);
        toast.success("Abonnement succesvol gewijzigd!");
      }
    } catch (error: any) {
      toast.error(error.message || "Er is een fout opgetreden");
    } finally {
      setIsLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) {
      toast.error("Geen actief abonnement gevonden");
      return;
    }

    try {
      await cancelSubscriptionMutation.mutateAsync();
      toast.success(
        "Abonnement wordt geannuleerd aan het einde van de factureringsperiode"
      );
    } catch (error: any) {
      toast.error(
        error.message || "Er is een fout opgetreden bij het annuleren"
      );
    }
  };

  const getButtonText = (subscription: any) => {
    if (!currentSubscription) {
      return "Subscribe";
    }

    if (currentSubscription.id === subscription.id) {
      if (currentSubscription.status === "active") {
        return "Huidig abonnement";
      }
      return `Status: ${currentSubscription.status}`;
    }

    // Compare prices to determine if it's upgrade or downgrade
    const currentPrice = currentSubscription.price || 0;
    const newPrice = subscription.price || 0;

    if (newPrice > currentPrice) {
      return "Upgrade";
    } else if (newPrice < currentPrice) {
      return "Downgrade";
    } else {
      return "Wijzig naar dit plan";
    }
  };

  const getButtonVariant = (subscription: any) => {
    if (!currentSubscription) {
      return "default";
    }

    if (currentSubscription.id === subscription.id) {
      return "secondary";
    }

    return "default";
  };

  const isCurrentSubscription = (subscription: any) => {
    return currentSubscription?.id === subscription.id;
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Navigation />
      <div className="mx-auto max-w-7xl flex flex-col gap-4 items-center justify-center h-[90%] p-4">
        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="w-full max-w-2xl mb-6">
            <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Je huidige abonnement: {currentSubscription.name}
                </CardTitle>
                <CardDescription>
                  Status: {currentSubscription.status}
                  {currentSubscription.status === "active" && (
                    <span className="ml-2 text-green-600 font-semibold">
                      Actief
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              {currentSubscription.status === "active" && (
                <CardFooter>
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    disabled={cancelSubscriptionMutation.isPending}
                  >
                    {cancelSubscriptionMutation.isPending
                      ? "Annuleren..."
                      : "Abonnement annuleren"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        )}

        {/* Available Subscriptions */}
        <div className="flex flex-row gap-4 w-full">
          {subscriptions?.map((subscription) => (
            <Card
              key={subscription.id}
              className={`border-primary w-full ${
                isCurrentSubscription(subscription)
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {subscription.name}
                  {isCurrentSubscription(subscription) && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>Voor serieuze programmeurs</CardDescription>
                <div className="mt-4 text-4xl font-bold">
                  {formatPrice(subscription.price)}
                </div>
                <p className="text-muted-foreground">per maand</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-primary" />
                    <span>Onbeperkte duels</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-primary" />
                    <span>Geavanceerde analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-primary" />
                    <span>Private duels</span>
                  </li>
                  <li className="flex items-center">
                    <Zap className="mr-2 h-4 w-4 text-primary" />
                    <span>Custom uitdagingen</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={getButtonVariant(subscription)}
                  onClick={() => handleSubscriptionAction(subscription)}
                  disabled={
                    isLoading === subscription.id ||
                    (isCurrentSubscription(subscription) &&
                      currentSubscription?.status === "active")
                  }
                >
                  {isLoading === subscription.id
                    ? "Laden..."
                    : getButtonText(subscription)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Button className="w-32" onClick={() => router.back()}>
          Terug
        </Button>
      </div>
    </div>
  );
};

export default Subscriptions;
