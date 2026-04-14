import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, CheckCircle2, Lock, PlayCircle, Clock, Zap, BookOpen,
  FileText, Video, Image as ImageIcon, Activity, GraduationCap,
  Trophy, ChevronDown, ChevronUp, Download, ExternalLink, Map, Search, Layers
} from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";

const levelColors: Record<string, string> = {
  basic: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
};

const levelLabels: Record<string, string> = {
  basic: "Básico",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

const typeLabels: Record<string, string> = {
  onboarding: "Onboarding",
  recycling: "Reciclagem",
  development: "Desenvolvimento",
  compliance: "Compliance",
  custom: "Personalizada",
};

function TrailCard({ trail, progress, onClick }: { trail: any; progress?: any; onClick: () => void; key?: React.Key }) {
  const prog = progress?.progressPercent ?? 0;
  const isCompleted = progress?.status === "completed";
  const isStarted = progress?.status === "in_progress";

  return (
    <div
      className="rounded-xl bg-card border border-border hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      {/* Cover / Header */}
      <div className="h-2 bg-gradient-to-r from-[var(--color-primary)] to-blue-400" style={{ width: `${prog}%`, minWidth: prog > 0 ? "8px" : "0" }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {trail.title}
            </p>
            {trail.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{trail.description}</p>
            )}
          </div>
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          ) : isStarted ? (
            <PlayCircle className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
          ) : null}
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          {trail.level && (
            <Badge className={cn("text-xs", levelColors[trail.level] ?? "bg-muted text-muted-foreground")}>
              {levelLabels[trail.level]}
            </Badge>
          )}
          {trail.type && (
            <Badge variant="outline" className="text-xs">{typeLabels[trail.type] ?? trail.type}</Badge>
          )}
          {trail.isRequired && <Badge className="text-xs bg-rose-100 text-rose-700">Obrigatória</Badge>}
        </div>

        {(isStarted || isCompleted) && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progresso</span>
              <span className="text-xs font-medium text-foreground">{Math.round(prog)}%</span>
            </div>
            <Progress value={prog} className="h-1.5" />
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {trail.estimatedHours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{trail.estimatedHours}h</span>}
          {trail.points && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" />{trail.points}pts</span>}
          {trail.moduleCount > 0 && <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{trail.moduleCount} módulos</span>}
        </div>
      </div>
    </div>
  );
}

function TrailDetail({ trailId, onClose }: { trailId: number; onClose: () => void }) {
  const [trail, setTrail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setTrail({
        id: trailId,
        title: "Onboarding Corporativo",
        level: "basic",
        type: "onboarding",
        isRequired: true,
        description: "Trilha de integração para novos colaboradores.",
        estimatedHours: 10,
        points: 150,
        modules: [
          {
            id: 1,
            title: "Módulo 1: Cultura",
            items: [
              { id: 1, type: "video", title: "Nossa História", points: 10 },
              { id: 2, type: "pdf", title: "Código de Conduta", points: 20 },
            ]
          }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, [trailId]);

  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>;
  }

  if (!trail) return null;

  const prog = 0;
  const isStarted = false;
  const isCompleted = false;

  const itemTypeIcon = (type: string) => {
    switch (type) {
      case "content": return BookOpen;
      case "quiz": return GraduationCap;
      case "pdf": return FileText;
      case "video": return Video;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
      {/* Header */}
      <div>
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{trail.title}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {trail.level && <Badge className={cn("text-xs", levelColors[trail.level])}>{levelLabels[trail.level]}</Badge>}
              {trail.type && <Badge variant="outline" className="text-xs">{typeLabels[trail.type]}</Badge>}
              {trail.isRequired && <Badge className="text-xs bg-rose-100 text-rose-700">Obrigatória</Badge>}
            </div>
          </div>
          {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />}
        </div>

        {trail.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{trail.description}</p>
        )}

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground">{trail.estimatedHours ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Horas</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground">{trail.points ?? 0}</p>
            <p className="text-xs text-muted-foreground">Pontos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <p className="text-lg font-bold text-foreground">{Math.round(prog)}%</p>
            <p className="text-xs text-muted-foreground">Progresso</p>
          </div>
        </div>

        {isStarted && (
          <div className="mt-3">
            <Progress value={prog} className="h-2" />
          </div>
        )}
      </div>

      {/* Modules & Items */}
      <div className="space-y-4">
        {trail.modules?.map((module: any, mIdx: number) => {
          const moduleItems = module.items ?? [];
          const completedItems = 0;

          return (
            <div key={module.id} className="border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                    {mIdx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{module.title}</p>
                    {module.description && <p className="text-xs text-muted-foreground">{module.description}</p>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{completedItems}/{moduleItems.length}</span>
              </div>

              <div className="divide-y divide-border">
                {moduleItems.map((item: any, iIdx: number) => {
                  const isItemCompleted = false;
                  const Icon = itemTypeIcon(item.type);
                  const isLocked = false;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 p-4 transition-colors",
                        isLocked ? "opacity-50" : "hover:bg-muted/30",
                        isItemCompleted && "bg-emerald-50/50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        isItemCompleted ? "bg-emerald-100" : "bg-[var(--color-primary)]/10"
                      )}>
                        {isItemCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.points > 0 && (
                          <span className="text-xs text-muted-foreground">{item.points}pts</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action */}
      {!isStarted && (
        <Button
          className="w-full gap-2 bg-[var(--color-primary)] hover:opacity-90 text-white"
          onClick={() => {
            toast.success("Trilha iniciada!");
            onClose();
          }}
        >
          <PlayCircle className="w-4 h-4" />
          Iniciar trilha
        </Button>
      )}
    </div>
  );
}

export default function Trails() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedTrailId, setSelectedTrailId] = useState<number | null>(null);
  const [tab, setTab] = useState<"all" | "mine">("mine");
  const [isLoading, setIsLoading] = useState(true);
  const [trails, setTrails] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setTrails([
        { id: 1, title: 'Onboarding Corporativo', level: 'basic', type: 'onboarding', isRequired: true, estimatedHours: 10, points: 150, moduleCount: 3, progress: { status: 'in_progress', progressPercent: 50 } },
        { id: 4, title: 'Desenvolvimento de Vendas', level: 'intermediate', type: 'development', isRequired: true, estimatedHours: 20, points: 300, moduleCount: 5, progress: { status: 'in_progress', progressPercent: 75 } },
        { id: 5, title: 'Compliance e Ética', level: 'basic', type: 'compliance', isRequired: true, estimatedHours: 5, points: 50, moduleCount: 1, progress: { status: 'completed', progressPercent: 100 } },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const displayTrails = trails.filter((t: any) => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trilhas de Aprendizagem</h1>
          <p className="text-muted-foreground mt-1">Jornadas personalizadas de desenvolvimento</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
        <button
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", tab === "mine" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          onClick={() => setTab("mine")}
        >
          Minhas Trilhas
        </button>
        <button
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", tab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
          onClick={() => setTab("all")}
        >
          Catálogo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar trilhas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os níveis</SelectItem>
            <SelectItem value="basic">Básico</SelectItem>
            <SelectItem value="intermediate">Intermediário</SelectItem>
            <SelectItem value="advanced">Avançado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trails Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : displayTrails && displayTrails.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTrails.map((trail: any) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              progress={trail.progress}
              onClick={() => setSelectedTrailId(trail.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <Map className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">
            {tab === "mine" ? "Nenhuma trilha atribuída" : "Nenhuma trilha encontrada"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {tab === "mine" ? "Aguarde a atribuição de trilhas pelo gestor." : "Novas trilhas serão publicadas em breve."}
          </p>
        </div>
      )}

      {/* Trail Detail Dialog */}
      <Dialog open={!!selectedTrailId} onOpenChange={(o) => !o && setSelectedTrailId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Detalhes da trilha</DialogTitle>
          </DialogHeader>
          {selectedTrailId && (
            <TrailDetail trailId={selectedTrailId} onClose={() => setSelectedTrailId(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
