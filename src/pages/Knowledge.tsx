import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  BookOpen, Search, FileText, Video, Link2, FileQuestion,
  BookMarked, Clock, Eye, Star, ExternalLink, Layers, Tag, Play
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const contentTypeIcons: Record<string, React.ElementType> = {
  document: FileText,
  video: Video,
  pdf: FileText,
  article: BookOpen,
  faq: FileQuestion,
  playbook: BookMarked,
  procedure: Layers,
  link: Link2,
};

const contentTypeLabels: Record<string, string> = {
  document: "Documento",
  video: "Vídeo",
  pdf: "PDF",
  article: "Artigo",
  faq: "FAQ",
  playbook: "Playbook",
  procedure: "Procedimento",
  link: "Link",
};

const contentTypeColors: Record<string, string> = {
  document: "bg-blue-100 text-blue-700",
  video: "bg-purple-100 text-purple-700",
  pdf: "bg-red-100 text-red-700",
  article: "bg-emerald-100 text-emerald-700",
  faq: "bg-amber-100 text-amber-700",
  playbook: "bg-indigo-100 text-indigo-700",
  procedure: "bg-teal-100 text-teal-700",
  link: "bg-gray-100 text-gray-700",
};

function ContentCard({ content, onClick }: { content: any; onClick: () => void; key?: React.Key }) {
  const Icon = contentTypeIcons[content.type] ?? FileText;
  return (
    <div
      className="p-5 rounded-xl bg-card border border-border hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", contentTypeColors[content.type] ?? "bg-muted text-muted-foreground")}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
            {content.title}
          </p>
          {content.categoryName && (
            <p className="text-xs text-muted-foreground mt-0.5">{content.categoryName}</p>
          )}
        </div>
      </div>
      {content.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{content.description}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{content.viewCount ?? 0}</span>
        {content.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{content.duration}min</span>}
        {content.avgRating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{Number(content.avgRating).toFixed(1)}</span>}
        {content.isRequired && <Badge className="text-xs bg-rose-100 text-rose-700 ml-auto">Obrigatório</Badge>}
      </div>
    </div>
  );
}

function ContentDetail({ content, onClose }: { content: any; onClose: () => void }) {
  const navigate = useNavigate();
  const Icon = contentTypeIcons[content.type] ?? FileText;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", contentTypeColors[content.type] ?? "bg-muted")}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{content.title}</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge className={cn("text-xs", contentTypeColors[content.type])}>{contentTypeLabels[content.type]}</Badge>
            {content.categoryName && <Badge variant="outline" className="text-xs">{content.categoryName}</Badge>}
            {content.isRequired && <Badge className="text-xs bg-rose-100 text-rose-700">Obrigatório</Badge>}
          </div>
        </div>
      </div>

      {content.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">{content.description}</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{content.viewCount ?? 0}</p>
          <p className="text-xs text-muted-foreground">Visualizações</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{content.duration ? `${content.duration}min` : "—"}</p>
          <p className="text-xs text-muted-foreground">Duração</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-lg font-bold text-foreground">{content.avgRating ? Number(content.avgRating).toFixed(1) : "—"}</p>
          <p className="text-xs text-muted-foreground">Avaliação</p>
        </div>
      </div>

      {content.tags && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          {content.tags.split(",").map((tag: string) => (
            <Badge key={tag.trim()} variant="outline" className="text-xs">{tag.trim()}</Badge>
          ))}
        </div>
      )}

      {/* Ação principal: Redireciona para o Player Modular */}
      <Button 
        className="w-full gap-2 bg-[var(--color-primary)] hover:opacity-90 text-white" 
        onClick={() => {
          onClose();
          navigate('/player');
        }}
      >
        <Play className="w-4 h-4" />
        Acessar Conteúdo
      </Button>

      <div className="text-xs text-muted-foreground">
        Publicado em {new Date(content.publishedAt ?? content.createdAt).toLocaleDateString("pt-BR")}
        {content.authorName && ` · por ${content.authorName}`}
      </div>
    </div>
  );
}

export default function Knowledge() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetch
    setTimeout(() => {
      setContents([
        { id: 1, title: "Manual de Boas Práticas", type: "pdf", description: "Guia completo de conduta da empresa.", categoryName: "RH", viewCount: 120, duration: 15, avgRating: 4.8, createdAt: new Date() },
        { id: 2, title: "Introdução à Liderança", type: "video", description: "Vídeo aula sobre os pilares da liderança moderna.", categoryName: "Desenvolvimento", viewCount: 340, duration: 45, avgRating: 4.9, createdAt: new Date() },
        { id: 3, title: "Como usar o novo CRM", type: "playbook", description: "Passo a passo para cadastro de leads.", categoryName: "Vendas", viewCount: 85, duration: 10, avgRating: 4.5, createdAt: new Date() },
        { id: 4, title: "Políticas de Reembolso", type: "document", description: "Regras para solicitação de reembolso de despesas.", categoryName: "Financeiro", viewCount: 200, duration: 5, avgRating: 4.2, createdAt: new Date() },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const displayContents = contents.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || c.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Base de Conhecimento</h1>
          <p className="text-muted-foreground mt-1">Documentos, vídeos, playbooks e procedimentos</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conteúdos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(contentTypeLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : displayContents && displayContents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayContents.map((c: any) => (
            <ContentCard key={c.id} content={c} onClick={() => setSelectedContent(c)} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Nenhum conteúdo encontrado</p>
        </div>
      )}

      {/* Content Detail Dialog */}
      <Dialog open={!!selectedContent} onOpenChange={(o) => !o && setSelectedContent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Detalhes do conteúdo</DialogTitle>
          </DialogHeader>
          {selectedContent && (
            <ContentDetail content={selectedContent} onClose={() => setSelectedContent(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
