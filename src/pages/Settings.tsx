import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceStatus } from '@/components/common/ServiceStatus';
import { useToast } from '@/hooks/use-toast';
import {
  GitBranch,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Bell,
  Mail,
  MessageSquare,
} from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  url: string;
  platform: 'github' | 'gitlab';
  branch: string;
  webhookUrl: string;
}

const mockRepositories: Repository[] = [
  {
    id: '1',
    name: 'spring-petclinic',
    url: 'https://github.com/spring-projects/spring-petclinic',
    platform: 'github',
    branch: 'main',
    webhookUrl: 'https://api.prioritest.dev/webhooks/abc123',
  },
  {
    id: '2',
    name: 'elasticsearch',
    url: 'https://github.com/elastic/elasticsearch',
    platform: 'github',
    branch: 'main',
    webhookUrl: 'https://api.prioritest.dev/webhooks/def456',
  },
];

const strategies = [
  { value: 'maximize_popt20', label: 'Maximiser POPT20', description: 'Optimise le score POPT20 pour maximiser la détection de défauts dans les 20% premiers tests' },
  { value: 'top_k_coverage', label: 'Top K Couverture', description: 'Sélectionne les K classes avec le meilleur ratio effort/couverture' },
  { value: 'budget_optimization', label: 'Optimisation Budget', description: 'Maximise la couverture dans un budget d\'heures donné' },
  { value: 'risk_first', label: 'Risque en Premier', description: 'Priorise les classes avec le score de risque le plus élevé' },
  { value: 'effort_aware', label: 'Effort Conscient', description: 'Équilibre entre risque et effort de test' },
];

interface ServiceHealthState {
  name: string;
  status: 'healthy' | 'unhealthy' | 'loading';
  version?: string;
}

export default function Settings() {
  const { toast } = useToast();
  const [repositories, setRepositories] = useState<Repository[]>(mockRepositories);
  const [defaultStrategy, setDefaultStrategy] = useState('maximize_popt20');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [slackWebhook, setSlackWebhook] = useState('');
  const [services, setServices] = useState<ServiceHealthState[]>([
    { name: 'Collecte Dépôts (S1)', status: 'loading', version: '1.0.0' },
    { name: 'Analyse Statique (S2)', status: 'loading', version: '1.0.0' },
    { name: 'Historique Tests (S3)', status: 'loading', version: '1.0.0' },
    { name: 'Prétraitement (S4)', status: 'loading', version: '1.0.0' },
    { name: 'ML Service (S5)', status: 'loading', version: '1.0.0' },
    { name: 'Moteur Priorisation (S6)', status: 'loading', version: '1.0.0' },
    { name: 'Test Scaffolder (S7)', status: 'loading', version: '1.0.0' },
  ]);

  useEffect(() => {
    // Simulate health check
    const checkHealth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setServices((prev) =>
        prev.map((service) => ({
          ...service,
          status: Math.random() > 0.15 ? 'healthy' : 'unhealthy',
        }))
      );
    };
    checkHealth();
  }, []);

  const handleRefreshHealth = async () => {
    setServices((prev) => prev.map((s) => ({ ...s, status: 'loading' as const })));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setServices((prev) =>
      prev.map((service) => ({
        ...service,
        status: Math.random() > 0.15 ? 'healthy' : 'unhealthy',
      }))
    );
    toast({
      title: 'Statut actualisé',
      description: 'Les statuts des services ont été mis à jour',
    });
  };

  const handleCopyWebhook = (webhookUrl: string) => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: 'URL copiée',
      description: 'L\'URL du webhook a été copiée dans le presse-papiers',
    });
  };

  const handleRemoveRepository = (id: string) => {
    setRepositories((prev) => prev.filter((r) => r.id !== id));
    toast({
      title: 'Dépôt supprimé',
      description: 'Le dépôt a été supprimé de la configuration',
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: 'Paramètres sauvegardés',
      description: 'Vos préférences ont été mises à jour',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configuration de la plateforme PRIORITEST
        </p>
      </div>

      <Tabs defaultValue="repositories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="repositories">Dépôts</TabsTrigger>
          <TabsTrigger value="strategy">Stratégie</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Repositories Tab */}
        <TabsContent value="repositories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuration des Dépôts</CardTitle>
                  <CardDescription>
                    Gérez les dépôts Git connectés à PRIORITEST
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un dépôt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <GitBranch className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{repo.name}</p>
                        <p className="text-sm text-muted-foreground">{repo.url}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Branche: {repo.branch} • Plateforme: {repo.platform}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyWebhook(repo.webhookUrl)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Webhook
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveRepository(repo.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategy Tab */}
        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stratégie de Priorisation</CardTitle>
              <CardDescription>
                Choisissez la stratégie par défaut pour la priorisation des tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Stratégie par défaut</Label>
                <Select value={defaultStrategy} onValueChange={setDefaultStrategy}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {strategies.map((strategy) => (
                  <div
                    key={strategy.value}
                    className={`rounded-lg border p-4 transition-colors ${
                      defaultStrategy === strategy.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          defaultStrategy === strategy.value
                            ? 'bg-primary'
                            : 'bg-muted-foreground'
                        }`}
                      />
                      <p className="font-medium">{strategy.label}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 ml-4">
                      {strategy.description}
                    </p>
                  </div>
                ))}
              </div>

              <Button onClick={handleSaveSettings}>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Statut des Services</CardTitle>
                  <CardDescription>
                    État de santé des microservices PRIORITEST
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleRefreshHealth}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => (
                  <ServiceStatus
                    key={service.name}
                    name={service.name}
                    status={service.status}
                    version={service.version}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notification</CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Notifications Email</p>
                    <p className="text-sm text-muted-foreground">
                      Recevez des rapports quotidiens par email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Notifications Slack</p>
                      <p className="text-sm text-muted-foreground">
                        Envoyez des alertes vers un canal Slack
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={slackNotifications}
                    onCheckedChange={setSlackNotifications}
                  />
                </div>

                {slackNotifications && (
                  <div className="space-y-2 ml-14">
                    <Label htmlFor="slack-webhook">URL du Webhook Slack</Label>
                    <Input
                      id="slack-webhook"
                      placeholder="https://hooks.slack.com/services/..."
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Types de notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Rapport quotidien • Alertes risque élevé • Dégradation couverture
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>Sauvegarder</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
