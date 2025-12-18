import { KPICard } from '@/components/dashboard/KPICard';
import { CoverageChart } from '@/components/dashboard/CoverageChart';
import { RiskDistributionChart } from '@/components/dashboard/RiskDistributionChart';
import { TopPriorityChart } from '@/components/dashboard/TopPriorityChart';
import {
  Shield,
  AlertTriangle,
  FileCode,
  Zap,
  Target,
  Clock,
} from 'lucide-react';

// Mock data for demonstration
const kpiData = [
  {
    label: 'Couverture Globale',
    value: '62.5%',
    trend: 3.8,
    trendLabel: 'vs dernière semaine',
    icon: Shield,
    color: 'success' as const,
  },
  {
    label: 'Classes à Risque Élevé',
    value: '8',
    trend: -12.5,
    trendLabel: 'vs dernière semaine',
    icon: AlertTriangle,
    color: 'danger' as const,
  },
  {
    label: 'Dette de Test',
    value: '2 847',
    trend: -8.2,
    trendLabel: 'lignes non couvertes',
    icon: FileCode,
    color: 'warning' as const,
  },
  {
    label: 'Tests Flaky',
    value: '12',
    trend: -15.4,
    trendLabel: 'vs dernière semaine',
    icon: Zap,
    color: 'danger' as const,
  },
  {
    label: 'Défauts Évités',
    value: '23',
    trend: 28.6,
    trendLabel: 'ce mois',
    icon: Target,
    color: 'success' as const,
  },
  {
    label: 'Effort Total Estimé',
    value: '156h',
    icon: Clock,
    color: 'default' as const,
  },
];

const coverageData = [
  { date: '08 Nov', lineCoverage: 58.2, branchCoverage: 52.1, mutationCoverage: 45.3 },
  { date: '12 Nov', lineCoverage: 59.5, branchCoverage: 53.2, mutationCoverage: 46.1 },
  { date: '16 Nov', lineCoverage: 60.1, branchCoverage: 53.8, mutationCoverage: 46.8 },
  { date: '20 Nov', lineCoverage: 61.3, branchCoverage: 54.2, mutationCoverage: 47.5 },
  { date: '24 Nov', lineCoverage: 61.8, branchCoverage: 54.5, mutationCoverage: 47.9 },
  { date: '28 Nov', lineCoverage: 62.0, branchCoverage: 54.6, mutationCoverage: 48.0 },
  { date: '02 Déc', lineCoverage: 62.3, branchCoverage: 54.7, mutationCoverage: 48.1 },
  { date: '06 Déc', lineCoverage: 62.5, branchCoverage: 54.8, mutationCoverage: 48.2 },
];

const riskDistribution = [
  { bucket: '0.0 - 0.2', count: 24, color: 'hsl(160, 84%, 39%)' },
  { bucket: '0.2 - 0.4', count: 18, color: 'hsl(142, 71%, 45%)' },
  { bucket: '0.4 - 0.6', count: 12, color: 'hsl(38, 92%, 50%)' },
  { bucket: '0.6 - 0.8', count: 8, color: 'hsl(25, 95%, 53%)' },
  { bucket: '0.8 - 1.0', count: 3, color: 'hsl(0, 84%, 60%)' },
];

const topPriorityClasses = [
  { className: 'com.prioritest.auth.UserAuthenticationService', shortName: 'UserAuthService', riskScore: 0.92, riskLevel: 'high' as const },
  { className: 'com.prioritest.payment.PaymentProcessor', shortName: 'PaymentProcessor', riskScore: 0.89, riskLevel: 'high' as const },
  { className: 'com.prioritest.validation.DataValidationEngine', shortName: 'DataValidation', riskScore: 0.85, riskLevel: 'high' as const },
  { className: 'com.prioritest.db.TransactionManager', shortName: 'TransactionMgr', riskScore: 0.78, riskLevel: 'high' as const },
  { className: 'com.prioritest.api.RequestHandler', shortName: 'RequestHandler', riskScore: 0.72, riskLevel: 'high' as const },
  { className: 'com.prioritest.cache.CacheManager', shortName: 'CacheManager', riskScore: 0.65, riskLevel: 'medium' as const },
  { className: 'com.prioritest.queue.MessageQueue', shortName: 'MessageQueue', riskScore: 0.58, riskLevel: 'medium' as const },
  { className: 'com.prioritest.util.DateFormatter', shortName: 'DateFormatter', riskScore: 0.45, riskLevel: 'medium' as const },
  { className: 'com.prioritest.config.ConfigLoader', shortName: 'ConfigLoader', riskScore: 0.32, riskLevel: 'low' as const },
  { className: 'com.prioritest.log.LogManager', shortName: 'LogManager', riskScore: 0.25, riskLevel: 'low' as const },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Principal</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de la qualité et de la priorisation des tests
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendLabel={kpi.trendLabel}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CoverageChart data={coverageData} />
        <RiskDistributionChart data={riskDistribution} />
      </div>

      {/* Top Priority Classes */}
      <TopPriorityChart data={topPriorityClasses} />
    </div>
  );
}
