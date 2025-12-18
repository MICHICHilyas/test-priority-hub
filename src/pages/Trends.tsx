import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const coverageTrend = [
  { week: 'Sem 1', line: 55.2, branch: 48.1, mutation: 42.3 },
  { week: 'Sem 2', line: 56.8, branch: 49.2, mutation: 43.1 },
  { week: 'Sem 3', line: 58.1, branch: 50.5, mutation: 44.2 },
  { week: 'Sem 4', line: 59.5, branch: 52.1, mutation: 45.8 },
  { week: 'Sem 5', line: 60.2, branch: 53.2, mutation: 46.5 },
  { week: 'Sem 6', line: 61.8, branch: 54.1, mutation: 47.2 },
  { week: 'Sem 7', line: 62.5, branch: 54.8, mutation: 48.2 },
];

const riskTrend = [
  { week: 'Sem 1', high: 15, medium: 28, low: 22 },
  { week: 'Sem 2', high: 14, medium: 27, low: 24 },
  { week: 'Sem 3', high: 12, medium: 26, low: 27 },
  { week: 'Sem 4', high: 11, medium: 25, low: 29 },
  { week: 'Sem 5', high: 10, medium: 24, low: 31 },
  { week: 'Sem 6', high: 9, medium: 23, low: 33 },
  { week: 'Sem 7', high: 8, medium: 22, low: 35 },
];

const defectsTrend = [
  { month: 'Juil', detected: 12, prevented: 8 },
  { month: 'Août', detected: 15, prevented: 11 },
  { month: 'Sept', detected: 10, prevented: 9 },
  { month: 'Oct', detected: 8, prevented: 7 },
  { month: 'Nov', detected: 6, prevented: 6 },
  { month: 'Déc', detected: 5, prevented: 5 },
];

const trendMetrics = [
  { label: 'Couverture Ligne', current: 62.5, previous: 55.2, unit: '%', positive: true },
  { label: 'Couverture Branche', current: 54.8, previous: 48.1, unit: '%', positive: true },
  { label: 'Score Mutation', current: 48.2, previous: 42.3, unit: '%', positive: true },
  { label: 'Classes à Risque', current: 8, previous: 15, unit: '', positive: false },
];

export default function Trends() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tendances</h1>
        <p className="text-muted-foreground">
          Évolution des métriques de qualité sur les 7 dernières semaines
        </p>
      </div>

      {/* Trend Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {trendMetrics.map((metric) => {
          const change = metric.current - metric.previous;
          const percentChange = ((change / metric.previous) * 100).toFixed(1);
          const isPositive = metric.positive ? change > 0 : change < 0;

          return (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {metric.current}{metric.unit}
                  </span>
                  <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                    {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(Number(percentChange))}%
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>{metric.previous}{metric.unit}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>{metric.current}{metric.unit}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Coverage Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Évolution de la Couverture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={coverageTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value}%`]}
                />
                <Legend />
                <Line type="monotone" dataKey="line" stroke="hsl(var(--coverage-line))" strokeWidth={2} name="Ligne" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="branch" stroke="hsl(var(--coverage-branch))" strokeWidth={2} name="Branche" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="mutation" stroke="hsl(var(--coverage-mutation))" strokeWidth={2} name="Mutation" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk and Defects Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Évolution du Risque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="high" stackId="1" fill="hsl(var(--risk-high))" stroke="hsl(var(--risk-high))" name="Élevé" />
                  <Area type="monotone" dataKey="medium" stackId="1" fill="hsl(var(--risk-medium))" stroke="hsl(var(--risk-medium))" name="Moyen" />
                  <Area type="monotone" dataKey="low" stackId="1" fill="hsl(var(--risk-low))" stroke="hsl(var(--risk-low))" name="Faible" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Defects Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Défauts Détectés vs Évités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={defectsTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="detected" stroke="hsl(var(--destructive))" strokeWidth={2} name="Détectés" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="prevented" stroke="hsl(var(--success))" strokeWidth={2} name="Évités" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
