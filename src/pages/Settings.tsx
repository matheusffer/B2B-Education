import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  SettingsIcon, Bell, Lock, Palette, HelpCircle, LogOut,
  User, Mail, Calendar, Shield, Eye, Volume2, Moon, Sun, Trophy, Key, Star
} from "lucide-react";
import { toast } from "sonner";
import { useTenant } from "../contexts/TenantContext";

const settingsTabs = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "tenant", label: "Identidade Visual (Tenant)", icon: Palette },
  { id: "integrations", label: "Integrações (BYOK)", icon: Key },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "privacy", label: "Privacidade", icon: Lock },
];

export default function Settings() {
  const { tenant, updateVisualSettings } = useTenant();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Visual Settings State
  const [primaryColor, setPrimaryColor] = useState(tenant?.visualSettings?.primary_color || "#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState(tenant?.visualSettings?.secondary_color || "#1E40AF");

  // Integrations State
  const [aiToken, setAiToken] = useState("");

  const [notifSettings, setNotifSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    trailReminders: true,
    contentUpdates: true,
    performanceAlerts: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: false,
    showRanking: true,
    allowMessages: true,
  });

  const handleLogout = () => {
    toast.success("Desconectado com sucesso");
    // Simulando logout
  };

  const handleSaveVisualSettings = () => {
    // Atualiza o contexto global para refletir as cores imediatamente
    updateVisualSettings({
      primary_color: primaryColor,
      secondary_color: secondaryColor,
    });
    
    // Aqui seria o fetch('/api/tenant/visual-settings', { method: 'PUT' })
    toast.success("Identidade visual atualizada com sucesso! Veja as cores mudarem em tempo real.");
  };

  const handleSaveIntegrations = () => {
    // Aqui seria o fetch('/api/tenant/integrations', { method: 'PUT' })
    toast.success("Chave de API salva com sucesso! O Tenant agora usa sua própria cota de IA.");
  };

  const handleSaveSettings = (section: string) => {
    toast.success(`Configurações de ${section} salvas com sucesso!`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[var(--color-primary)]" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie suas preferências e configurações da plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="space-y-1 sticky top-6">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    activeTab === tab.id
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          
          {/* Tenant Visual Identity Tab */}
          {activeTab === "tenant" && (
            <Card>
              <CardHeader>
                <CardTitle>Identidade Visual (White-label)</CardTitle>
                <CardDescription>Personalize as cores e a marca da sua plataforma B2B.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Cor Primária</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-14 h-14 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 font-mono uppercase"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Usada em botões, links ativos e destaques.</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Cor Secundária</Label>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-14 h-14 p-1 cursor-pointer"
                      />
                      <Input 
                        type="text" 
                        value={secondaryColor} 
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 font-mono uppercase"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Usada em gradientes e elementos de suporte.</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Preview em Tempo Real</Label>
                  <div className="p-6 rounded-xl border border-border bg-muted/30 flex items-center justify-center gap-4">
                    <Button style={{ backgroundColor: primaryColor, color: '#fff' }}>
                      Botão Primário
                    </Button>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      <Star className="w-5 h-5" />
                    </div>
                    <span style={{ color: primaryColor }} className="font-semibold">
                      Texto Destaque
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSaveVisualSettings}
                    className="bg-[var(--color-primary)] hover:opacity-90 text-white"
                  >
                    Salvar e Aplicar Cores
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations (BYOK) Tab */}
          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrações e BYOK (Bring Your Own Key)</CardTitle>
                <CardDescription>Configure as chaves de API para usar os recursos de Inteligência Artificial na sua própria cota.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50">
                    <div className="flex items-start gap-3">
                      <Key className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Por que usar sua própria chave?</h4>
                        <p className="text-sm text-blue-800 mt-1">
                          Ao fornecer sua própria chave de API (OpenAI ou Gemini), sua empresa não consome a cota padrão da plataforma, garantindo limites maiores para geração de quizzes, resumos e interações com o assistente virtual.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Token de API (Gemini / OpenAI)</Label>
                    <Input 
                      type="password" 
                      placeholder="sk-..." 
                      value={aiToken}
                      onChange={(e) => setAiToken(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Sua chave é criptografada e armazenada com segurança.</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSaveIntegrations}
                    className="bg-[var(--color-primary)] hover:opacity-90 text-white"
                  >
                    Salvar Integrações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-border">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
                    U
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Usuário Admin</p>
                    <p className="text-sm text-muted-foreground">admin@empresa.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <Input defaultValue="Usuário Admin" className="mt-1" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input defaultValue="admin@empresa.com" disabled className="mt-1 bg-muted" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleSaveSettings("perfil")} className="bg-[var(--color-primary)] hover:opacity-90 text-white">
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>Escolha como deseja ser notificado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Notificações por Email</p>
                        <p className="text-xs text-muted-foreground">Receba atualizações importantes por email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifSettings.emailNotifications}
                      onCheckedChange={(v) => setNotifSettings((p) => ({ ...p, emailNotifications: v }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Lembretes de Trilhas</p>
                        <p className="text-xs text-muted-foreground">Alertas sobre trilhas pendentes e prazos</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifSettings.trailReminders}
                      onCheckedChange={(v) => setNotifSettings((p) => ({ ...p, trailReminders: v }))}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleSaveSettings("notificações")} className="bg-[var(--color-primary)] hover:opacity-90 text-white">
                    Salvar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacidade e Segurança</CardTitle>
                <CardDescription>Controle quem pode ver suas informações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Mostrar no Ranking</p>
                        <p className="text-xs text-muted-foreground">Apareça no ranking de performance</p>
                      </div>
                    </div>
                    <Switch
                      checked={privacySettings.showRanking}
                      onCheckedChange={(v) => setPrivacySettings((p) => ({ ...p, showRanking: v }))}
                    />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Segurança da Conta</h3>
                  <Button variant="outline" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Alterar Senha
                  </Button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleSaveSettings("privacidade")} className="bg-[var(--color-primary)] hover:opacity-90 text-white">
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
