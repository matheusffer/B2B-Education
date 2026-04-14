import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Users, Search, Plus, Edit2, Trash2, Shield, Building2, Briefcase, Mail, Filter
} from "lucide-react";
import { toast } from "sonner";

// ─── Mocks (Substituindo tRPC) ───────────────────────────────────────────────

const MOCK_DEPARTMENTS = [
  { id: "1", name: "Tecnologia" },
  { id: "2", name: "Recursos Humanos" },
  { id: "3", name: "Vendas" },
  { id: "4", name: "Marketing" },
];

const MOCK_POSITIONS = [
  { id: "1", name: "Desenvolvedor Sênior" },
  { id: "2", name: "Gerente de Projetos" },
  { id: "3", name: "Analista de RH" },
  { id: "4", name: "Executivo de Vendas" },
];

const INITIAL_USERS = [
  { id: "1", name: "Ana Silva", email: "ana@empresa.com", role: "ADMIN", departmentId: "1", positionId: "2", status: "Ativo" },
  { id: "2", name: "Carlos Santos", email: "carlos@empresa.com", role: "COLABORADOR", departmentId: "3", positionId: "4", status: "Ativo" },
  { id: "3", name: "Mariana Costa", email: "mariana@empresa.com", role: "GESTOR", departmentId: "2", positionId: "3", status: "Inativo" },
  { id: "4", name: "João Pedro", email: "joao@empresa.com", role: "COLABORADOR", departmentId: "1", positionId: "1", status: "Ativo" },
];

// ─── Helpers Visuais ─────────────────────────────────────────────────────────

const roleColors: Record<string, string> = {
  ADMIN: "bg-emerald-100 text-emerald-700 border-emerald-200",
  GESTOR: "bg-blue-100 text-blue-700 border-blue-200",
  COLABORADOR: "bg-gray-100 text-gray-700 border-gray-200",
};

const statusColors: Record<string, string> = {
  Ativo: "bg-green-100 text-green-700",
  Inativo: "bg-red-100 text-red-700",
};

// ─── Componente Principal ────────────────────────────────────────────────────

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "COLABORADOR",
    departmentId: "",
    positionId: "",
    status: "Ativo",
  });

  useEffect(() => {
    // Simulando fetch('/api/users')
    setTimeout(() => {
      setUsers(INITIAL_USERS);
      setIsLoading(false);
    }, 600);
  }, []);

  const handleOpenDialog = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        positionId: user.positionId,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "COLABORADOR",
        departmentId: "",
        positionId: "",
        status: "Ativo",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email || !formData.departmentId || !formData.positionId) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    // Simulando fetch('/api/users', { method: 'POST/PUT' })
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      toast.success("Usuário atualizado com sucesso!");
    } else {
      const newUser = {
        id: Math.random().toString(36).substring(7),
        ...formData,
      };
      setUsers([...users, newUser]);
      toast.success("Usuário criado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      // Simulando fetch(`/api/users/${id}`, { method: 'DELETE' })
      setUsers(users.filter(u => u.id !== id));
      toast.success("Usuário removido com sucesso!");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-[var(--color-primary)]" />
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie colaboradores, níveis de acesso, departamentos e cargos.</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-[var(--color-primary)] hover:opacity-90 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Nível de Acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Níveis</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="GESTOR">Gestor</SelectItem>
                <SelectItem value="COLABORADOR">Colaborador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[300px]">Usuário</TableHead>
                    <TableHead>Nível de Acesso</TableHead>
                    <TableHead>Departamento & Cargo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const dept = MOCK_DEPARTMENTS.find(d => d.id === user.departmentId)?.name;
                      const pos = MOCK_POSITIONS.find(p => p.id === user.positionId)?.name;

                      return (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-sm font-bold text-[var(--color-primary)] flex-shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{user.name}</span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3" /> {user.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs border", roleColors[user.role])}>
                              {user.role === "ADMIN" && <Shield className="w-3 h-3 mr-1" />}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm flex items-center gap-1.5 text-foreground">
                                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                                {dept || "Não definido"}
                              </span>
                              <span className="text-xs flex items-center gap-1.5 text-muted-foreground">
                                <Briefcase className="w-3.5 h-3.5" />
                                {pos || "Não definido"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs font-medium", statusColors[user.status])}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-muted-foreground hover:text-[var(--color-primary)]"
                                onClick={() => handleOpenDialog(user)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-muted-foreground hover:text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Nenhum usuário encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Create/Edit User */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="Nome completo"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                placeholder="email@empresa.com"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nível (Role) *</Label>
              <div className="col-span-3">
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="GESTOR">Gestor</SelectItem>
                    <SelectItem value="COLABORADOR">Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Departamento *</Label>
              <div className="col-span-3">
                <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_DEPARTMENTS.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Cargo *</Label>
              <div className="col-span-3">
                <Select value={formData.positionId} onValueChange={(v) => setFormData({ ...formData, positionId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_POSITIONS.map(pos => (
                      <SelectItem key={pos.id} value={pos.id}>{pos.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="col-span-3">
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveUser} className="bg-[var(--color-primary)] hover:opacity-90 text-white">
              {editingUser ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
