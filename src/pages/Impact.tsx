import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Target, Bug, Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

const impactByModule = [
  { module: 'auth', bugs: 8, coverage: 45, score: 85 },
  { module: 'payment', bugs: 6, coverage: 38, score: 78 },
  { module: 'validation', bugs: 4, coverage: 52, score: 72 },
  { module: 'db', bugs: 3, coverage: 41, score: 68 },
  { module: 'api', bugs: 2, coverage: 58, score: 62 },
];

const defectsByCategory = [
  { name: 'Logique métier', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Validation', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Intégration', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Performance', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Sécurité', value: 8, color: 'hsl(var(--chart-5))' },
];

const kpis = [
  { label: 'Défauts Évités', value: 23, icon: Bug, trend: '+28.6%', color: 'text-success' },
  { label: 'Heures Économisées', value: '156h', icon: Clock, trend: '+15.2%', color: 'text-primary' },
  { label: 'Taux de Détection', value: '94%', icon: Target, trend: '+5.3%', color: 'text-success' },
  { label: 'ROI Estimé', value: '340%', icon: TrendingUp, trend: '+12.8%', color: 'text-success' },
];

export default function Impact() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Impact</h1>
        <p className="text-muted-foreground">
          Mesure de l'efficacité de la priorisation ML sur la qualité
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <p className={`text-xs font-medium mt-1 ${kpi.color}`}>
                  {kpi.trend} vs trimestre précédent
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Impact by Module */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Impact par Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactByModule}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="module" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="score" fill="hsl(var(--primary))" name="Score d'Impact" radius={[4, 4, 0, 0]}>
                    {impactByModule.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Defects by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Défauts par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defectsByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {defectsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Impact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Détail de l'Impact par Module</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {impactByModule.map((module) => (
              <div key={module.module} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="font-medium">{module.module}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{module.bugs} bugs évités</span>
                    <span>{module.coverage}% couverture</span>
                  </div>
                </div>
                <Progress value={module.score} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
