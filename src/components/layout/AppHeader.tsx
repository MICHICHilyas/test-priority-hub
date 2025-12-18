import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, GitBranch, Moon, Sun, User, Settings, LogOut } from 'lucide-react';

interface AppHeaderProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const repositories = [
  { id: 'github_spring-projects_spring-petclinic', name: 'spring-petclinic' },
  { id: 'github_apache_kafka', name: 'apache-kafka' },
  { id: 'github_elastic_elasticsearch', name: 'elasticsearch' },
];

const branches = ['main', 'develop', 'feature/ml-improvements'];

const dateRanges = [
  { value: '7', label: 'Derniers 7 jours' },
  { value: '30', label: 'Derniers 30 jours' },
  { value: '90', label: 'Derniers 90 jours' },
  { value: 'custom', label: 'Personnalisé' },
];

export function AppHeader({ theme, onThemeToggle }: AppHeaderProps) {
  const [selectedRepo, setSelectedRepo] = useState(repositories[0].id);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [dateRange, setDateRange] = useState('30');

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/50 px-6">
      {/* Left side - Repository & Branch selectors */}
      <div className="flex items-center gap-4">
        <Select value={selectedRepo} onValueChange={setSelectedRepo}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Sélectionner un dépôt" />
          </SelectTrigger>
          <SelectContent>
            {repositories.map((repo) => (
              <SelectItem key={repo.id} value={repo.id}>
                {repo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
          <SelectTrigger className="w-[150px] bg-background">
            <GitBranch className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Branche" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px] bg-background">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right side - Live indicator, theme toggle, user menu */}
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="live-indicator text-success">
          <span className="text-muted-foreground">Live</span>
        </div>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@prioritest.dev
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
