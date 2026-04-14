/**
 * Serviço responsável por simular a extração de metadados de URLs externas.
 */
export const extractDurationFromUrl = async (url: string, type: string): Promise<number> => {
  // Simula o delay de rede/processamento (ex: requisição para API do YouTube ou download de PDF)
  await new Promise((resolve) => setTimeout(resolve, 2500));

  try {
    const lowerUrl = url.toLowerCase();

    // Simulação: Extração de minutos de um vídeo do YouTube
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      console.log(`[ExtractorService] Extraindo duração do YouTube para: ${url}`);
      // Retorna um valor simulado (ex: 15 minutos)
      return 15;
    }

    // Simulação: Cálculo de WPM (Words Per Minute) para Artigos ou PDFs
    if (type === 'PDF' || lowerUrl.endsWith('.pdf') || type === 'ARTICLE') {
      console.log(`[ExtractorService] Calculando WPM para documento: ${url}`);
      // Simula um documento lido a 200 WPM = 10 minutos
      return 10;
    }

    // Fallback padrão para outros tipos de conteúdo
    console.log(`[ExtractorService] Usando duração padrão para: ${url}`);
    return 5;
  } catch (error) {
    console.error(`[ExtractorService] Erro ao extrair duração da URL ${url}:`, error);
    return 0; // Retorna 0 em caso de erro para não quebrar o fluxo
  }
};
