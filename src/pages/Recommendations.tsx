import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RiskBadge } from '@/components/common/RiskBadge';
import { RiskProgress } from '@/components/common/RiskProgress';
import {
  Search,
  Download,
  FlaskConical,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendedClass {
  rank: number;
  className: string;
  module: string;
  riskScore: number;
  effortHours: number;
  coverage: number;
  criticality: 'high' | 'medium' | 'low';
}

const mockRecommendations: RecommendedClass[] = [
  { rank: 1, className: 'UserAuthenticationService', module: 'com.prioritest.auth', riskScore: 0.92, effortHours: 8, coverage: 45, criticality: 'high' },
  { rank: 2, className: 'PaymentProcessor', module: 'com.prioritest.payment', riskScore: 0.89, effortHours: 12, coverage: 38, criticality: 'high' },
  { rank: 3, className: 'DataValidationEngine', module: 'com.prioritest.validation', riskScore: 0.85, effortHours: 6, coverage: 52, criticality: 'medium' },
  { rank: 4, className: 'TransactionManager', module: 'com.prioritest.db', riskScore: 0.78, effortHours: 10, coverage: 41, criticality: 'high' },
  { rank: 5, className: 'RequestHandler', module: 'com.prioritest.api', riskScore: 0.72, effortHours: 5, coverage: 58, criticality: 'medium' },
  { rank: 6, className: 'CacheManager', module: 'com.prioritest.cache', riskScore: 0.65, effortHours: 4, coverage: 62, criticality: 'medium' },
  { rank: 7, className: 'MessageQueue', module: 'com.prioritest.queue', riskScore: 0.58, effortHours: 7, coverage: 55, criticality: 'medium' },
  { rank: 8, className: 'DateFormatter', module: 'com.prioritest.util', riskScore: 0.45, effortHours: 2, coverage: 78, criticality: 'low' },
  { rank: 9, className: 'ConfigLoader', module: 'com.prioritest.config', riskScore: 0.32, effortHours: 3, coverage: 82, criticality: 'low' },
  { rank: 10, className: 'LogManager', module: 'com.prioritest.log', riskScore: 0.25, effortHours: 2, coverage: 88, criticality: 'low' },
];

const strategies = [
  { value: 'maximize_popt20', label: 'Maximiser POPT20' },
  { value: 'top_k_coverage', label: 'Top K Couverture' },
  { value: 'budget_optimization', label: 'Optimisation Budget' },
  { value: 'risk_first', label: 'Risque en Premier' },
  { value: 'effort_aware', label: 'Effort Conscient' },
];

export default function Recommendations() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [strategy, setStrategy] = useState('maximize_popt20');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = mockRecommendations.filter(
    (item) =>
      item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGenerateTests = (className: string) => {
    navigate('/test-generator', { state: { className } });
  };

  const handleExportCSV = () => {
    const headers = ['Rang', 'Classe', 'Module', 'Score Risque', 'Effort (h)', 'Couverture', 'Criticité'];
    const rows = filteredData.map((item) => [
      item.rank,
      item.className,
      item.module,
      `${(item.riskScore * 100).toFixed(0)}%`,
      item.effortHours,
      `${item.coverage}%`,
      item.criticality.toUpperCase(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'prioritest_recommendations.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recommandations</h1>
          <p className="text-muted-foreground">
            Classes prioritaires pour les tests unitaires
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button>
            <FlaskConical className="mr-2 h-4 w-4" />
            Générer Tous
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une classe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Stratégie" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Plan de Priorisation
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredData.length} classes)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-16">
                    <Button variant="ghost" size="sm" className="h-8 p-0">
                      Rang
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead className="w-40">
                    <Button variant="ghost" size="sm" className="h-8 p-0">
                      Score Risque
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-24">Effort (h)</TableHead>
                  <TableHead className="w-28">Couverture</TableHead>
                  <TableHead className="w-24">Criticité</TableHead>
                  <TableHead className="w-32 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.rank}>
                    <TableCell className="font-medium text-center">
                      {item.rank}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {item.className}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {item.module}
                    </TableCell>
                    <TableCell>
                      <RiskProgress value={item.riskScore} />
                    </TableCell>
                    <TableCell className="text-center">{item.effortHours}</TableCell>
                    <TableCell className="text-center">{item.coverage}%</TableCell>
                    <TableCell>
                      <RiskBadge level={item.criticality} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateTests(item.className)}
                      >
                        <FlaskConical className="mr-2 h-3 w-3" />
                        Générer tests
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Affichage {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} sur{' '}
              {filteredData.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
