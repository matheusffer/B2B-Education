import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Map,
  Star,
  TrendingUp,
  Trophy,
  Users,
  AlertTriangle,
  ArrowRight,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Metric Card ─────────────────────────────────────────────────────────────

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  color?: "primary" | "emerald" | "amber" | "rose" | "blue";
}) {
  const colorMap = {
    primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    rose: "bg-rose-100 text-rose-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <Card className="border-border hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <span className={cn("text-xs font-medium flex items-center gap-1", trend.value >= 0 ? "text-emerald-600" : "text-rose-600")}>
              <TrendingUp className="w-3 h-3" />
              {trend.value >= 0 ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm font-medium text-foreground/80">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [topContents, setTopContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mocking data fetch
    setTimeout(() => {
      setSummary({
        totalUsers: 150,
        adoptionRate: 85,
        completionRate: 60,
        avgSatisfaction: 92,
      });
      setTopContents([
        { title: "Manual de Onboarding", views: 340, category: "RH" },
        { title: "Segurança da Informação", views: 210, category: "TI" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Visão Executiva</h1>
        <p className="text-muted-foreground">Indicadores gerais da plataforma em tempo real</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Usuários Ativos"
          value={summary?.totalUsers ?? 0}
          icon={Users}
          color="primary"
          trend={{ value: 12, label: "vs mês anterior" }}
        />
        <MetricCard
          title="Taxa de Adoção"
          value={`${summary?.adoptionRate ?? 0}%`}
          icon={TrendingUp}
          color="emerald"
          trend={{ value: 8, label: "crescimento" }}
        />
        <MetricCard
          title="Taxa de Conclusão"
          value={`${summary?.completionRate ?? 0}%`}
          icon={CheckCircle2}
          color="blue"
          trend={{ value: 5, label: "vs semana anterior" }}
        />
        <MetricCard
          title="Satisfação Média"
          value={`${summary?.avgSatisfaction ?? 0}%`}
          icon={Star}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
              Conteúdos Mais Acessados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topContents && topContents.length > 0 ? (
              <div className="space-y-3">
                {topContents.map((content: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{content.title}</p>
                      <p className="text-xs text-muted-foreground">{content.views} visualizações</p>
                    </div>
                    <Badge variant="outline">{content.category}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem dados ainda</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Áreas Críticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Taxa de conclusão abaixo de 50% em:</p>
              <ul className="list-disc list-inside text-foreground space-y-1">
                <li>Compliance e Ética</li>
                <li>Segurança da Informação</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Collaborator Dashboard ───────────────────────────────────────────────────

function CollaboratorDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const demoTrails = [
    { id: 1, title: 'Onboarding Corporativo', level: 'basic', isRequired: true, progress: { status: 'in_progress', progressPercent: 50 } },
    { id: 4, title: 'Desenvolvimento de Vendas', level: 'intermediate', isRequired: true, progress: { status: 'in_progress', progressPercent: 75 } },
    { id: 5, title: 'Compliance e Ética', level: 'basic', isRequired: true, progress: { status: 'in_progress', progressPercent: 100 } },
  ];

  const demoCerts = [
    { id: 1, trailTitle: 'Compliance e Ética', trailLevel: 'basic', issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  ];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const trailsToShow = demoTrails.slice(0, 5);
  const nextPendingTrail = trailsToShow.find((t: any) => t.progress?.status === 'in_progress' || t.progress?.status === 'not_started');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Meu Aprendizado</h1>
        <p className="text-muted-foreground">Acompanhe seu progresso e conteúdos pendentes</p>
      </div>

      {nextPendingTrail && (
        <Card className="border-[var(--color-primary)]/30 bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[var(--color-primary)] text-white">Próximo Passo</Badge>
                  {nextPendingTrail.isRequired && (
                    <Badge className="bg-rose-100 text-rose-700">Obrigatória</Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{nextPendingTrail.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Progresso: {Math.round(nextPendingTrail.progress?.progressPercent ?? 0)}% concluído
                </p>
                <Progress value={nextPendingTrail.progress?.progressPercent ?? 0} className="h-2 mb-4" />
                <Link to={`/player`}>
                  <Button className="bg-[var(--color-primary)] hover:opacity-90 text-white gap-2">
                    <Play className="w-4 h-4" />
                    Continuar Trilha
                  </Button>
                </Link>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-bold text-[var(--color-primary)] mb-1">
                  {Math.round(nextPendingTrail.progress?.progressPercent ?? 0)}%
                </div>
                <p className="text-xs text-muted-foreground">Concluído</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Trilhas Atribuídas" value={5} icon={Map} color="primary" />
        <MetricCard title="Concluídas" value={2} icon={CheckCircle2} color="emerald" />
        <MetricCard title="Progresso Médio" value="54%" icon={TrendingUp} color="blue" />
        <MetricCard title="Certificados" value={2} icon={Award} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Map className="w-4 h-4 text-[var(--color-primary)]" />
              Trilhas Pendentes
            </CardTitle>
            <Link to="/player">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Ver todas <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {trailsToShow.length > 0 ? (
              <div className="space-y-3">
                {trailsToShow.slice(0, 5).map((trail: any) => (
                  <Link key={trail.id} to={`/player`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Map className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{trail.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={trail.progress?.progressPercent ?? 0} className="h-1 flex-1" />
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {Math.round(trail.progress?.progressPercent ?? 0)}%
                          </span>
                        </div>
                      </div>
                      {trail.isRequired && (
                        <Badge className="text-xs bg-rose-100 text-rose-700 flex-shrink-0">Obrigatória</Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Todas as trilhas concluídas!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Certificados
            </CardTitle>
            <Link to="/player">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {demoCerts && demoCerts.length > 0 ? (
              <div className="space-y-3">
                {demoCerts.map((cert: any) => (
                  <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{cert.trailTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(cert.issuedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Trophy className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum certificado ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // Mocking auth role
  const platformRole = "admin"; // Change to "collaborator" to see the other view

  if (platformRole === "admin") {
    return <AdminDashboard />;
  } else {
    return <CollaboratorDashboard />;
  }
}
