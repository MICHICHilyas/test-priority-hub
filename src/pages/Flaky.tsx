import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RefreshCw, AlertTriangle, CheckCircle2, XCircle, Clock, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlakyTest {
  id: string;
  name: string;
  className: string;
  failureRate: number;
  lastFailure: string;
  occurrences: number;
  status: 'active' | 'quarantined' | 'fixed';
}

const flakyTests: FlakyTest[] = [
  { id: '1', name: 'testConcurrentUserLogin', className: 'AuthServiceTest', failureRate: 35, lastFailure: '2024-12-06', occurrences: 28, status: 'active' },
  { id: '2', name: 'testAsyncPaymentProcessing', className: 'PaymentProcessorTest', failureRate: 28, lastFailure: '2024-12-05', occurrences: 22, status: 'quarantined' },
  { id: '3', name: 'testDatabaseTimeout', className: 'TransactionManagerTest', failureRate: 22, lastFailure: '2024-12-06', occurrences: 18, status: 'active' },
  { id: '4', name: 'testCacheEviction', className: 'CacheManagerTest', failureRate: 18, lastFailure: '2024-12-04', occurrences: 15, status: 'active' },
  { id: '5', name: 'testNetworkRetry', className: 'ApiClientTest', failureRate: 15, lastFailure: '2024-12-03', occurrences: 12, status: 'quarantined' },
  { id: '6', name: 'testFileUpload', className: 'StorageServiceTest', failureRate: 12, lastFailure: '2024-12-02', occurrences: 10, status: 'fixed' },
  { id: '7', name: 'testEmailDelivery', className: 'NotificationServiceTest', failureRate: 10, lastFailure: '2024-12-01', occurrences: 8, status: 'fixed' },
];

const flakyTrend = [
  { week: 'Sem 1', count: 18, fixed: 2 },
  { week: 'Sem 2', count: 16, fixed: 3 },
  { week: 'Sem 3', count: 15, fixed: 4 },
  { week: 'Sem 4', count: 14, fixed: 5 },
  { week: 'Sem 5', count: 13, fixed: 5 },
  { week: 'Sem 6', count: 12, fixed: 6 },
  { week: 'Sem 7', count: 12, fixed: 7 },
];

export default function Flaky() {
  const { toast } = useToast();
  const [tests, setTests] = useState(flakyTests);

  const activeCount = tests.filter(t => t.status === 'active').length;
  const quarantinedCount = tests.filter(t => t.status === 'quarantined').length;
  const fixedCount = tests.filter(t => t.status === 'fixed').length;

  const handleQuarantine = (id: string) => {
    setTests(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'quarantined' as const } : t
    ));
    toast({
      title: 'Test mis en quarantaine',
      description: 'Le test a été isolé du pipeline CI/CD',
    });
  };

  const handleRerun = (name: string) => {
    toast({
      title: 'Test relancé',
      description: `${name} est en cours d'exécution...`,
    });
  };

  const getStatusBadge = (status: FlakyTest['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="risk-badge-high">Actif</Badge>;
      case 'quarantined':
        return <Badge variant="outline" className="risk-badge-medium">Quarantaine</Badge>;
      case 'fixed':
        return <Badge variant="outline" className="risk-badge-low">Corrigé</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tests Flaky</h1>
        <p className="text-muted-foreground">
          Tests instables nécessitant une attention particulière
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tests Flaky Actifs
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">nécessitent une correction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Quarantaine
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">{quarantinedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">isolés du pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Corrigés ce Mois
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{fixedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">tests stabilisés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux d'Échec Moyen
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">20%</div>
            <p className="text-xs text-muted-foreground mt-1">sur les tests flaky</p>
          </CardContent>
        </Card>
      </div>

      {/* Flaky Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Évolution des Tests Flaky</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flakyTrend}>
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
                <Line type="monotone" dataKey="count" stroke="hsl(var(--destructive))" strokeWidth={2} name="Tests Flaky" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fixed" stroke="hsl(var(--success))" strokeWidth={2} name="Corrigés" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Flaky Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Liste des Tests Flaky</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Test</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Taux d'Échec</TableHead>
                <TableHead>Occurrences</TableHead>
                <TableHead>Dernier Échec</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-mono text-sm">{test.name}</TableCell>
                  <TableCell className="text-muted-foreground">{test.className}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full bg-destructive" 
                          style={{ width: `${test.failureRate}%` }}
                        />
                      </div>
                      <span className="text-sm">{test.failureRate}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{test.occurrences}</TableCell>
                  <TableCell className="text-muted-foreground">{test.lastFailure}</TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRerun(test.name)}
                        disabled={test.status === 'fixed'}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuarantine(test.id)}
                        disabled={test.status !== 'active'}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
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
