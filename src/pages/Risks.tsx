import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskBadge } from '@/components/common/RiskBadge';
import { RiskProgress } from '@/components/common/RiskProgress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { AlertTriangle, TrendingUp, TrendingDown, Shield } from 'lucide-react';

const highRiskClasses = [
  { name: 'UserAuthenticationService', module: 'com.prioritest.auth', riskScore: 0.92, factors: ['Haute complexité', 'Churn élevé', 'Faible couverture'] },
  { name: 'PaymentProcessor', module: 'com.prioritest.payment', riskScore: 0.89, factors: ['Historique bugs', 'Haute criticité', 'Dépendances multiples'] },
  { name: 'DataValidationEngine', module: 'com.prioritest.validation', riskScore: 0.85, factors: ['Complexité cyclomatique', 'Tests instables'] },
  { name: 'TransactionManager', module: 'com.prioritest.db', riskScore: 0.78, factors: ['Modifications récentes', 'Couplage élevé'] },
  { name: 'RequestHandler', module: 'com.prioritest.api', riskScore: 0.72, factors: ['Points d\'entrée multiples', 'Validation manquante'] },
];

const riskByModule = [
  { module: 'auth', highRisk: 3, mediumRisk: 5, lowRisk: 4 },
  { module: 'payment', highRisk: 2, mediumRisk: 4, lowRisk: 6 },
  { module: 'validation', highRisk: 2, mediumRisk: 3, lowRisk: 5 },
  { module: 'db', highRisk: 1, mediumRisk: 4, lowRisk: 8 },
  { module: 'api', highRisk: 1, mediumRisk: 6, lowRisk: 10 },
];

const riskDistributionPie = [
  { name: 'Risque Élevé', value: 8, color: 'hsl(var(--risk-high))' },
  { name: 'Risque Moyen', value: 22, color: 'hsl(var(--risk-medium))' },
  { name: 'Risque Faible', value: 35, color: 'hsl(var(--risk-low))' },
];

export default function Risks() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analyse des Risques</h1>
        <p className="text-muted-foreground">
          Classes à risque élevé nécessitant une attention prioritaire
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Classes à Risque Élevé
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">8</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-success" />
              -2 vs semaine dernière
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Risque Moyen
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">22</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-success" />
              -5 vs semaine dernière
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Risque Faible
            </CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">35</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              +7 vs semaine dernière
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Score Risque Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0.42</div>
            <p className="text-xs text-muted-foreground mt-1">
              Sur une échelle de 0 à 1
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribution des Risques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {riskDistributionPie.map((entry, index) => (
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

        {/* Risk by Module */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risque par Module</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskByModule} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="module" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="highRisk" stackId="a" fill="hsl(var(--risk-high))" name="Élevé" />
                  <Bar dataKey="mediumRisk" stackId="a" fill="hsl(var(--risk-medium))" name="Moyen" />
                  <Bar dataKey="lowRisk" stackId="a" fill="hsl(var(--risk-low))" name="Faible" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Classes à Risque Élevé</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classe</TableHead>
                <TableHead>Module</TableHead>
                <TableHead className="w-48">Score de Risque</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Facteurs de Risque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {highRiskClasses.map((cls) => (
                <TableRow key={cls.name}>
                  <TableCell className="font-mono text-sm font-medium">{cls.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{cls.module}</TableCell>
                  <TableCell>
                    <RiskProgress value={cls.riskScore} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge level={cls.riskScore >= 0.7 ? 'high' : cls.riskScore >= 0.4 ? 'medium' : 'low'} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cls.factors.map((factor, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
