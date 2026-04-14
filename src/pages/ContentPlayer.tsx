import React, { useState } from 'react';
import { PlayCircle, FileText, CheckSquare, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

// Tipos simulados para o frontend
type ContentType = 'VIDEO' | 'PDF' | 'QUIZ';

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  durationMinutes: number;
  completed: boolean;
}

const MOCK_TRAIL_ITEMS: ContentItem[] = [
  { id: '1', title: 'Introdução à Liderança', type: 'VIDEO', durationMinutes: 15, completed: true },
  { id: '2', title: 'Manual de Boas Práticas', type: 'PDF', durationMinutes: 10, completed: false },
  { id: '3', title: 'Avaliação de Conhecimento', type: 'QUIZ', durationMinutes: 5, completed: false },
];

export default function ContentPlayer() {
  const [activeItemIndex, setActiveItemIndex] = useState(1); // Começa no PDF (não concluído)
  const activeItem = MOCK_TRAIL_ITEMS[activeItemIndex];

  const handleNext = () => {
    if (activeItemIndex < MOCK_TRAIL_ITEMS.length - 1) {
      setActiveItemIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeItemIndex > 0) {
      setActiveItemIndex(prev => prev - 1);
    }
  };

  const renderContent = () => {
    switch (activeItem.type) {
      case 'VIDEO':
        return (
          <div className="w-full aspect-video bg-black rounded-xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-white transition-colors cursor-pointer" />
            <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-medium">Reproduzindo: {activeItem.title}</p>
            </div>
          </div>
        );
      case 'PDF':
        return (
          <div className="w-full h-[600px] bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500">
            <FileText className="w-16 h-16 mb-4 text-gray-400" />
            <p className="font-medium text-lg">Visualizador de PDF</p>
            <p className="text-sm mt-2">O documento "{activeItem.title}" seria renderizado aqui.</p>
            <button className="mt-6 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              Baixar Documento
            </button>
          </div>
        );
      case 'QUIZ':
        return (
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CheckSquare className="w-8 h-8 text-[var(--color-primary)]" />
              <h3 className="text-2xl font-bold text-gray-800">Avaliação</h3>
            </div>
            <p className="text-gray-600 mb-8">Responda às perguntas abaixo para testar seus conhecimentos sobre o módulo.</p>
            
            <div className="space-y-6">
              <div className="p-5 rounded-lg border border-gray-100 bg-gray-50">
                <p className="font-medium text-gray-800 mb-4">1. Qual é a principal característica de um líder?</p>
                <div className="space-y-3">
                  {['Empatia', 'Autoritarismo', 'Indiferença', 'Microgerenciamento'].map((option, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded border border-gray-200 bg-white cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                      <input type="radio" name="q1" className="text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button className="mt-8 w-full py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
              Enviar Respostas
            </button>
          </div>
        );
      default:
        return <div>Conteúdo não suportado.</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
      {/* Área Principal do Player */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{activeItem.title}</h2>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
              Módulo 1 • {activeItem.durationMinutes} min
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors border border-green-200">
            <CheckCircle className="w-5 h-5" />
            Marcar como Concluído
          </button>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          {renderContent()}
        </div>

        {/* Controles de Navegação */}
        <div className="mt-6 flex items-center justify-between">
          <button 
            onClick={handlePrev}
            disabled={activeItemIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>
          <button 
            onClick={handleNext}
            disabled={activeItemIndex === MOCK_TRAIL_ITEMS.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Próximo
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar de Trilha (Playlist) */}
      <div className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden shrink-0">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Conteúdo da Trilha</h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[var(--color-primary)] w-1/3 rounded-full"></div>
            </div>
            <span>33%</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {MOCK_TRAIL_ITEMS.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveItemIndex(index)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                activeItemIndex === index 
                  ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20' 
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="mt-0.5">
                {item.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : item.type === 'VIDEO' ? (
                  <PlayCircle className={`w-5 h-5 ${activeItemIndex === index ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                ) : item.type === 'PDF' ? (
                  <FileText className={`w-5 h-5 ${activeItemIndex === index ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                ) : (
                  <CheckSquare className={`w-5 h-5 ${activeItemIndex === index ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                )}
              </div>
              <div>
                <p className={`font-medium text-sm ${activeItemIndex === index ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.durationMinutes} min</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
