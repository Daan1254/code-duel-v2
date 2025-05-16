import { useGetStatistic } from "@/api/endpoints/statistic/statistic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const StatisticsCard = () => {
  const { data } = useGetStatistic();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game Statistics</CardTitle>
        <CardDescription>Your coding journey overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Games</p>
              <p className="text-2xl font-bold">{data?.totalGames || 0}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">
                {data?.completionRate || "0%"}
              </p>
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Games by Difficulty</p>
            <div className="space-y-1">
              {data?.gamesByDifficulty?.map((diff) => (
                <div
                  key={diff.difficulty}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm">{diff.difficulty}</span>
                  <span className="font-medium">{diff.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Language Stats */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Language Usage</p>
            <div className="flex flex-wrap gap-2">
              {data?.languageUsage?.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Avg. Completion Time</span>
              <span className="font-medium">
                {data?.averageCompletionTimeMs
                  ? `${Math.round(data.averageCompletionTimeMs / 1000 / 60)}m`
                  : "0m"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Preferred Language</span>
              <span className="font-medium">
                {data?.preferredLanguage || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
