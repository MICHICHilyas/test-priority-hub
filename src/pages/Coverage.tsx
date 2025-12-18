import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CoverageChart } from '@/components/dashboard/CoverageChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

const commitCoverage = [
  { sha: 'abc1234', date: '06 Déc 2024', line: 62.5, branch: 54.8, mutation: 48.2, classes: 45 },
  { sha: 'def5678', date: '05 Déc 2024', line: 62.3, branch: 54.7, mutation: 48.1, classes: 45 },
  { sha: 'ghi9012', date: '04 Déc 2024', line: 62.0, branch: 54.6, mutation: 48.0, classes: 44 },
  { sha: 'jkl3456', date: '03 Déc 2024', line: 61.8, branch: 54.5, mutation: 47.9, classes: 44 },
  { sha: 'mno7890', date: '02 Déc 2024', line: 61.3, branch: 54.2, mutation: 47.5, classes: 43 },
];

const classCoverage = [
  { name: 'UserService', package: 'com.prioritest.service', line: 85.2, branch: 78.5, mutation: 72.1 },
  { name: 'PaymentController', package: 'com.prioritest.controller', line: 78.4, branch: 65.2, mutation: 58.9 },
  { name: 'DataValidator', package: 'com.prioritest.validation', line: 72.1, branch: 62.8, mutation: 55.2 },
  { name: 'AuthManager', package: 'com.prioritest.auth', line: 45.8, branch: 38.2, mutation: 32.5 },
  { name: 'CacheHelper', package: 'com.prioritest.cache', line: 92.3, branch: 88.1, mutation: 85.4 },
];

const moduleCoverage = [
  { name: 'com.prioritest.service', classes: 12, line: 68.5, branch: 62.3, mutation: 55.8 },
  { name: 'com.prioritest.controller', classes: 8, line: 72.1, branch: 65.8, mutation: 58.2 },
  { name: 'com.prioritest.validation', classes: 5, line: 65.2, branch: 58.4, mutation: 51.2 },
  { name: 'com.prioritest.auth', classes: 6, line: 52.8, branch: 45.2, mutation: 38.5 },
  { name: 'com.prioritest.cache', classes: 4, line: 88.2, branch: 82.5, mutation: 78.1 },
];

interface CoverageBarProps {
  value: number;
  color: string;
}

function CoverageBar({ value, color }: CoverageBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={value} className="h-2 flex-1" style={{ '--progress-color': color } as React.CSSProperties} />
      <span className="text-sm tabular-nums w-12 text-right">{value.toFixed(1)}%</span>
    </div>
  );
}

export default function Coverage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analyse de Couverture</h1>
        <p className="text-muted-foreground">
          Métriques de couverture de code et de mutation
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Couverture Ligne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-coverage-line">62.5%</div>
              <Progress value={62.5} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Couverture Branche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-coverage-branch">54.8%</div>
              <Progress value={54.8} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Score Mutation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-coverage-mutation">48.2%</div>
              <Progress value={48.2} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Chart */}
      <CoverageChart data={coverageData} className="mb-6" />

      {/* Detailed Tabs */}
      <Tabs defaultValue="commits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commits">Par Commit</TabsTrigger>
          <TabsTrigger value="classes">Par Classe</TabsTrigger>
          <TabsTrigger value="modules">Par Module</TabsTrigger>
        </TabsList>

        <TabsContent value="commits">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Couverture par Commit</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SHA</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Ligne</TableHead>
                    <TableHead>Branche</TableHead>
                    <TableHead>Mutation</TableHead>
                    <TableHead className="text-right">Classes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commitCoverage.map((commit) => (
                    <TableRow key={commit.sha}>
                      <TableCell className="font-mono text-sm">{commit.sha}</TableCell>
                      <TableCell>{commit.date}</TableCell>
                      <TableCell>
                        <CoverageBar value={commit.line} color="hsl(var(--coverage-line))" />
                      </TableCell>
                      <TableCell>
                        <CoverageBar value={commit.branch} color="hsl(var(--coverage-branch))" />
                      </TableCell>
                      <TableCell>
                        <CoverageBar value={commit.mutation} color="hsl(var(--coverage-mutation))" />
                      </TableCell>
                      <TableCell className="text-right">{commit.classes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Couverture par Classe</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Ligne</TableHead>
                    <TableHead>Branche</TableHead>
                    <TableHead>Mutation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classCoverage.map((cls) => (
                    <TableRow key={cls.name}>
                      <TableCell className="font-mono text-sm">{cls.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{cls.package}</TableCell>
                      <TableCell>
                        <CoverageBar value={cls.line} color="hsl(var(--coverage-line))" />
                      </TableCell>
                      <TableCell>
                        <CoverageBar value={cls.branch} color="hsl(var(--coverage-branch))" />
                      </TableCell>
                      <TableCell>
                        <CoverageBar value={cls.mutation} color="hsl(var(--coverage-mutation))" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Couverture par Module</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead className="text-right">Classes</TableHead>
                    <TableHead>Ligne</TableHead>
                    <TableHead>Branche</TableHead>
                    <TableHead>Mutation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moduleCoverage.map((mod) => (
                    <TableRow key={mod.name}>
                      <TableCell className="font-mono text-sm">{mod.name}</TableCell>
                      <TableCell className="text-right">{mod.classes}</TableCell>
                      <TableCell>
                        <CoverageBar value={mod.line} color="hsl(var(--coverage-line))" />
                      </TableCell>
                      <TableCell>
                        <CoverageBar value={mod.branch} color="hsl(var(--coverage-branch))" />
                      </TableCell>
                      <TableCell>
                        <CoverageBar value={mod.mutation} color="hsl(var(--coverage-mutation))" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
