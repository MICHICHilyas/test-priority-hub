import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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
} from 'recharts';
import { CreditCard, TrendingDown, AlertTriangle, FileCode, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const debtByModule = [
  { module: 'auth', lines: 850, classes: 6 },
  { module: 'payment', lines: 720, classes: 5 },
  { module: 'validation', lines: 540, classes: 4 },
  { module: 'db', lines: 420, classes: 3 },
  { module: 'api', lines: 317, classes: 3 },
];

const debtClasses = [
  { name: 'UserAuthenticationService', module: 'auth', uncoveredLines: 285, totalLines: 520, priority: 1 },
  { name: 'PaymentProcessor', module: 'payment', uncoveredLines: 248, totalLines: 480, priority: 2 },
  { name: 'DataValidationEngine', module: 'validation', uncoveredLines: 195, totalLines: 380, priority: 3 },
  { name: 'TransactionManager', module: 'db', uncoveredLines: 168, totalLines: 350, priority: 4 },
  { name: 'RequestHandler', module: 'api', uncoveredLines: 142, totalLines: 320, priority: 5 },
  { name: 'CacheManager', module: 'cache', uncoveredLines: 98, totalLines: 280, priority: 6 },
  { name: 'SessionManager', module: 'auth', uncoveredLines: 87, totalLines: 240, priority: 7 },
  { name: 'AuditLogger', module: 'logging', uncoveredLines: 75, totalLines: 200, priority: 8 },
];

export default function Debt() {
  const navigate = useNavigate();

  const totalDebt = debtByModule.reduce((acc, m) => acc + m.lines, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dette de Test</h1>
        <p className="text-muted-foreground">
          Lignes de code non couvertes nécessitant des tests
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dette Totale
            </CardTitle>
            <CreditCard className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDebt.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">lignes non couvertes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Classes Affectées
            </CardTitle>
            <FileCode className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">21</div>
            <p className="text-xs text-muted-foreground mt-1">sur 65 classes totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Réduction ce Mois
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">-8.2%</div>
            <p className="text-xs text-muted-foreground mt-1">-256 lignes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Effort Estimé
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89h</div>
            <p className="text-xs text-muted-foreground mt-1">pour couvrir 80%</p>
          </CardContent>
        </Card>
      </div>

      {/* Debt by Module Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dette par Module</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={debtByModule}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="module" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} lignes`, 'Dette']}
                />
                <Bar dataKey="lines" fill="hsl(var(--warning))" name="Lignes non couvertes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Debt Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Classes avec le Plus de Dette</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Priorité</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Lignes Non Couvertes</TableHead>
                <TableHead>Couverture</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debtClasses.map((cls) => {
                const coverage = ((cls.totalLines - cls.uncoveredLines) / cls.totalLines) * 100;
                return (
                  <TableRow key={cls.name}>
                    <TableCell className="font-medium text-center">{cls.priority}</TableCell>
                    <TableCell className="font-mono text-sm">{cls.name}</TableCell>
                    <TableCell className="text-muted-foreground">{cls.module}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-warning font-medium">{cls.uncoveredLines}</span>
                        <span className="text-muted-foreground">/ {cls.totalLines}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={coverage} className="w-20 h-2" />
                        <span className="text-sm">{coverage.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/test-generator')}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
