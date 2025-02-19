import { Navigation } from "@/components/shared/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, Code2, Trophy, Users } from "lucide-react"

export default function Dashboard() {
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
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">John Doe</h2>
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
                    <span className="font-medium">Pro</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next billing:</span>
                    <span className="font-medium">July 1, 2025</span>
                  </div>
                  <Button className="w-full mt-4">Upgrade Plan</Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest coding duels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { opponent: "Alice Chen", result: "Won", date: "2 hours ago" },
                    { opponent: "Bob Smith", result: "Lost", date: "Yesterday" },
                    { opponent: "Carol Davis", result: "Won", date: "3 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <span>{activity.opponent}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={activity.result === "Won" ? "text-green-500" : "text-red-500"}>
                          {activity.result}
                        </span>
                        <span className="text-sm text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>Your coding performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Win Rate</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span>Avg. Solve Time</span>
                    <span className="font-medium">12m 34s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Duels</span>
                    <span className="font-medium">142</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Position Card */}
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard Position</CardTitle>
                <CardDescription>Your ranking among other coders</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="text-center">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <p className="text-4xl font-bold mb-2">#28</p>
                  <p className="text-muted-foreground">Top 5%</p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Challenges Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Challenges</CardTitle>
                <CardDescription>Scheduled coding events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Weekly Algorithm Challenge", date: "June 15, 2025" },
                    { name: "Full Stack Hackathon", date: "July 1-3, 2025" },
                    { name: "Code Golf Tournament", date: "July 20, 2025" },
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{event.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{event.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Breakdown Card */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Breakdown</CardTitle>
                <CardDescription>Your proficiency in different areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { skill: "Algorithms", level: 85 },
                    { skill: "Data Structures", level: 78 },
                    { skill: "Problem Solving", level: 92 },
                    { skill: "Time Complexity", level: 70 },
                  ].map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>{skill.skill}</span>
                        <span className="font-medium">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Resources Section */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>Improve your skills with these recommended materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Advanced Algorithms Course", type: "Video Course", duration: "10 hours" },
                  { title: "System Design Interview Prep", type: "E-book", duration: "200 pages" },
                  { title: "Machine Learning Fundamentals", type: "Interactive Tutorial", duration: "15 modules" },
                ].map((resource, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <BookOpen className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {resource.type} • {resource.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Section */}
          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
              <CardDescription>Connect with other developers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">5,234 members</p>
                    <p className="text-sm text-muted-foreground">Join discussions and collaborate</p>
                  </div>
                </div>
                <Button>Join Forum</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

