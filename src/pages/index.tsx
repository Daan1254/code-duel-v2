"use client"

import { useGetMe } from "@/api/endpoints/user/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Award, Code, Cpu, Layers, Rocket, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { TypeAnimation } from 'react-type-animation'

export default function Home() {
  const { data: user } = useGetMe()

  return (
    <div className="min-h-screen scroll-smooth  bg-background text-foreground dark">
      {/* Navigation with conditional auth buttons */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold">Code Duel</span>
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    href="#features"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="#pricing"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Pricing
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">          
              {user ? (
                <>
                  <Link href="/dashboard">
                  <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.id} />
                      <AvatarFallback className="font-bold">
                       {user?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="default">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Challenge Your Coding Skills in Real-Time Duels
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Compete against other programmers, solve challenging problems, and climb the leaderboard to prove
                    your coding prowess.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href={user ? "/game-queue" : "/register"}>
                    <Button size="lg" className="gap-1">
                      {user ? "Start Dueling" : "Join Now"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-muted/50 md:aspect-square">
                  <div className="p-4 font-mono text-sm">
                    <div className="mb-2 text-muted-foreground">// TypeScript Code Example</div>
                    <div className="whitespace-pre">
                      <pre className="text-primary">
                        <code>
                          <TypeAnimation
                            sequence={[
                              `interface Duel {
  players: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  timeLimit: number;
}

function startDuel(config: Duel) {
  console.log("Starting duel...");
  return new Promise((resolve) => {
    // Duel logic here
  });
}`,
                              1000,
                              "",
                              500,
                            ]}
                            repeat={Infinity}
                            speed={72}
                            style={{ display: 'block' }}
                          />
                        </code>
                      </pre>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-background/90 p-4 backdrop-blur">
                    <div className="text-sm font-medium">Live Coding Battle</div>
                    <div className="mt-1 text-xs text-muted-foreground">2 players • Medium difficulty • TypeScript</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
          <hr />  
        {/* Features Section */}
        <section className="py-12 md:py-24 bg-background" id="features">
          <div className="container  px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Sharpen Your Skills
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Code Duel provides a comprehensive platform for programmers to practice, compete, and improve.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {[
                {
                  icon: <Code className="h-10 w-10 text-primary" />,
                  title: "Real-time Coding Battles",
                  description: "Compete against other programmers in real-time coding challenges.",
                },
                {
                  icon: <Layers className="h-10 w-10 text-primary" />,
                  title: "Multiple Languages",
                  description: "Support for JavaScript, Python, Java, C++, and more.",
                },
                {
                  icon: <Award className="h-10 w-10 text-primary" />,
                  title: "Global Leaderboard",
                  description: "Climb the ranks and showcase your programming skills.",
                },
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: "Skill-based Matchmaking",
                  description: "Compete against programmers of similar skill levels.",
                },
                {
                  icon: <Cpu className="h-10 w-10 text-primary" />,
                  title: "Diverse Challenges",
                  description: "From algorithms to data structures and beyond.",
                },
                {
                  icon: <Rocket className="h-10 w-10 text-primary" />,
                  title: "Performance Analytics",
                  description: "Track your progress and identify areas for improvement.",
                },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 rounded-lg border p-6 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
              <hr />
        {/* How It Works Section */}
        <section className="py-12 bg-background md:py-24" id="how-it-works">
          <div className="container  px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Start Coding, Start Dueling</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Get started with Code Duel in just a few simple steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Create an Account",
                  description: "Sign up and set up your coding profile with your preferred languages.",
                },
                {
                  step: "02",
                  title: "Join a Queue",
                  description: "Select your difficulty level and join the matchmaking queue.",
                },
                {
                  step: "03",
                  title: "Duel and Win",
                  description: "Solve coding challenges faster than your opponent to win the duel.",
                },
              ].map((step, index) => (
                <div key={index} className="relative flex flex-col items-start space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
              <hr />
        {/* Pricing Section */}
        <section className="py-12 md:py-24 bg-background" id="pricing">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Choose Your Plan</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  We offer flexible plans to meet your needs.
                </p>
              </div>
            </div>
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly" className="flex flex-row gap-6 mx-auto container w-full">

                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Free</CardTitle>
                      <CardDescription>For casual coders</CardDescription>
                      <div className="mt-4 text-4xl font-bold">$0</div>
                      <p className="text-muted-foreground">per month</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>5 duels per day</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Basic analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Public leaderboard</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="border-primary w-full">
                    <CardHeader>
                      <div className="text-center text-sm font-medium text-primary mb-2">Most Popular</div>
                      <CardTitle>Pro</CardTitle>
                      <CardDescription>For serious programmers</CardDescription>
                      <div className="mt-4 text-4xl font-bold">$15</div>
                      <p className="text-muted-foreground">per month</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Unlimited duels</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Private duels</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Custom challenges</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Subscribe</Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Team</CardTitle>
                      <CardDescription>For organizations</CardDescription>
                      <div className="mt-4 text-4xl font-bold">$49</div>
                      <p className="text-muted-foreground">per month</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Everything in Pro</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Team management</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Team analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        Contact Sales
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="yearly" className="grid gap-6 md:grid-cols-3">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Free</CardTitle>
                      <CardDescription>For casual coders</CardDescription>
                      <div className="mt-4 text-4xl font-bold">$0</div>
                      <p className="text-muted-foreground">per year</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>5 duels per day</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Basic analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Public leaderboard</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        Get Started
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="border-primary w-full">
                    <CardHeader>
                      <div className="text-center text-sm font-medium text-primary mb-2">Most Popular</div>
                      <CardTitle>Pro</CardTitle>
                      <CardDescription>For serious programmers</CardDescription>
                      <div className="mt-4 text-4xl font-bold">$150</div>
                      <p className="text-muted-foreground">per year</p>
                      <p className="text-sm text-green-500 mt-1">Save $30</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Unlimited duels</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Private duels</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Custom challenges</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Subscribe</Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Team</CardTitle>
                      <CardDescription>For organizations</CardDescription>
                      <div className="mt-4 text-4xl font-bold">$490</div>
                      <p className="text-muted-foreground">per year</p>
                      <p className="text-sm text-green-500 mt-1">Save $98</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Everything in Pro</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Team management</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Team analytics</span>
                        </li>
                        <li className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-primary" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        Contact Sales
                      </Button>
                    </CardFooter>
                  </Card>

                </TabsContent>

              </Tabs>
            </div>
        </section>
              <hr />
        {/* CTA Section */}
        <section className="py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Test Your Skills?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Join thousands of programmers already dueling on our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href={user ? "/game-queue" : "/register"}>
                  <Button size="lg">{user ? "Start Dueling" : "Sign Up Now"}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Code Duel. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

