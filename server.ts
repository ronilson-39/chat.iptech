import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client if API key is present
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Assistant Route
app.post('/api/ai/assist', async (req: Request, res: Response) => {
  const { action, prompt, conversationHistory, vertical, context, knowledgeBase } = req.body;

  const ai = getAiClient();

  if (!ai) {
    // Graceful fallback with rich, realistic domain-specific response
    let fallbackText = '';
    switch (action) {
      case 'suggest_response':
        fallbackText = `Olá! Compreendo a situação reportada referente ao módulo de ${vertical || 'Atendimento'}. Verifiquei as parametrizações e recomendo conferir os fechamentos e o histórico de envio. Estou à disposição para orientar cada etapa!`;
        break;
      case 'summarize':
        fallbackText = `Resumo do Atendimento:\n- Cliente relatou dúvida/incidente no setor ${vertical || 'Geral'}.\n- Solicitadas evidências complementares.\n- Aguardando validação cadastral ou conferência de parâmetros.`;
        break;
      case 'identify_problem':
        fallbackText = `Diagnóstico Identificado:\n- Divergência ou inconsistência operacional no módulo ${vertical || 'Operacional'}.\n- Impacto potencial: Validação de relatórios ou eventos.\n- Causa provável: Cadastro desatualizado ou dependência de conferência de lote.`;
        break;
      case 'suggest_solution':
        fallbackText = `Procedimento Recomendado:\n1. Acessar o menu de configurações da vertical ${vertical || 'do sistema'}.\n2. Realizar sincronização dos registros pendentes.\n3. Revalidar o envio e confirmar o código do protocolo retornado.\n4. Caso persista, abrir thread com a equipe de Desenvolvimento.`;
        break;
      case 'formalize_text':
        fallbackText = prompt
          ? `Prezado(a), informamos que sua solicitação foi recebida e está sendo analisada com prioridade. Seguiremos com as orientações técnicas pertinentes assim que concluirmos a conferência.`
          : 'Texto formatado com padrão corporativo e cortesia.';
        break;
      default:
        fallbackText = `Atendimento processado com sucesso para a área ${vertical || 'Geral'}.`;
    }

    return res.json({
      success: true,
      result: fallbackText,
      source: 'offline_heuristic',
      notice: 'Gemini API Key não configurada no ambiente. Resposta gerada pelo motor heurístico integrado.',
    });
  }

  try {
    let systemInstruction = `Você é o Agente de Inteligência Artificial integrado ao Helpdesk SaaS Profissional.
Sua missão é auxiliar técnicos e operadores nos atendimentos municipais e corporativos (Folha, eSocial, Contabilidade, Contas, Licitações, Tributos, Educação, Saúde e Desenvolvimento).
Mantenha um tom profissional, cordial, técnico e objetivo em português do Brasil.`;

    if (knowledgeBase) {
      systemInstruction += `\nBase de Conhecimento ativa:\n${knowledgeBase}`;
    }

    let userPrompt = '';
    switch (action) {
      case 'suggest_response':
        userPrompt = `Com base no histórico da conversa e no contexto a seguir, sugira uma resposta cordial e resolutiva para o cliente na vertical ${vertical || 'Geral'}:\n\nContexto: ${context || ''}\nPrompt técnico: ${prompt || ''}\nHistórico: ${JSON.stringify(conversationHistory || [])}`;
        break;
      case 'summarize':
        userPrompt = `Resuma o seguinte atendimento de forma clara para passagem de bastão ou registro em ticket:\n${JSON.stringify(conversationHistory || prompt)}`;
        break;
      case 'identify_problem':
        userPrompt = `Identifique e categorize o problema principal apresentado pelo cliente na seguinte conversa:\n${JSON.stringify(conversationHistory || prompt)}`;
        break;
      case 'suggest_solution':
        userPrompt = `Sugira um procedimento passo a passo para resolução do seguinte caso técnico na área ${vertical || 'Geral'}:\n${prompt || JSON.stringify(conversationHistory || '')}`;
        break;
      case 'formalize_text':
        userPrompt = `Reescreva o seguinte texto em um português corporativo, polido e profissional adequado para envio ao cliente:\n"${prompt}"`;
        break;
      default:
        userPrompt = prompt || 'Como posso ajudar com este chamado?';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const resultText = response.text || 'Sem resposta gerada pelo modelo.';
    return res.json({
      success: true,
      result: resultText,
      source: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.json({
      success: false,
      error: error.message || 'Erro ao processar chamada com o Gemini.',
      result: 'Não foi possível gerar a resposta via IA no momento. Por favor, tente novamente.',
      source: 'error_fallback',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    aiAvailable: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
  });
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
