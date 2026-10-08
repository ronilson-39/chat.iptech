import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { WorkflowNode } from '../../types';
import {
  GitBranch,
  Plus,
  Play,
  Save,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Sparkles,
  Bot,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Trash2,
  Settings,
} from 'lucide-react';

export const WorkflowsView: React.FC = () => {
  const { workflow, setWorkflow, addAuditLog, playNotificationSound } = useHelpdesk();
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(workflow.nodes[0] || null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number | null>(null);

  const nodeIcons: Record<string, any> = {
    Mensagem: MessageSquare,
    Pergunta: HelpCircle,
    Menu: Layers,
    Condição: GitBranch,
    Equipe: Layers,
    IA: Sparkles,
    Horário: Clock,
    SLA: ShieldAlert,
    Finalização: CheckCircle2,
  };

  const handleSimulateWorkflow = () => {
    setSimulationRunning(true);
    setSimulationStepIndex(0);
    playNotificationSound();

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < workflow.nodes.length) {
        setSimulationStepIndex(current);
        playNotificationSound();
      } else {
        clearInterval(interval);
        setSimulationRunning(false);
        setSimulationStepIndex(null);
      }
    }, 1200);
  };

  const handleAddNode = () => {
    const newNode: WorkflowNode = {
      id: 'node-' + Date.now(),
      type: 'Mensagem',
      title: 'Nova Etapa de Fluxo',
      description: 'Ação executada no pipeline de atendimento',
      config: {},
      x: 100,
      y: 100,
      connections: [],
    };
    setWorkflow((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    setSelectedNode(newNode);
    addAuditLog('Edição de Fluxo', 'Workflow', 'Novo nó adicionado ao fluxo');
  };

  const handleDeleteNode = (id: string) => {
    setWorkflow((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== id),
    }));
    if (selectedNode?.id === id) setSelectedNode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-indigo-400" />
            Construtor Visual de Fluxos de Atendimento (Workflow Builder)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Defina como as mensagens são recebidas no WhatsApp, classificadas por vertical e roteadas para as equipes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar Nó
          </button>

          <button
            onClick={handleSimulateWorkflow}
            disabled={simulationRunning}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-950/40 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{simulationRunning ? 'Simulando Fluxo...' : 'Testar Fluxo Interativo'}</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas / Steps Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Nodes Pipeline */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pipeline Sequencial de Execução:
          </div>

          <div className="space-y-2.5">
            {workflow.nodes.map((node, idx) => {
              const Icon = nodeIcons[node.type] || GitBranch;
              const isSelected = selectedNode?.id === node.id;
              const isSimulating = simulationStepIndex === idx;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between relative ${
                    isSimulating
                      ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/50 shadow-xl'
                      : isSelected
                      ? 'bg-slate-900 border-indigo-500/80 shadow-md'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSimulating && (
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold animate-ping" />
                  )}

                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSimulating
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-slate-800 text-indigo-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{node.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                          {node.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{node.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Editor Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-400" />
              Configuração do Nó
            </h2>
            {selectedNode && (
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="text-slate-500 hover:text-red-400 transition"
                title="Excluir Nó"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Título do Nó</label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedNode({ ...selectedNode, title: val });
                    setWorkflow((prev) => ({
                      ...prev,
                      nodes: prev.nodes.map((n) => (n.id === selectedNode.id ? { ...n, title: val } : n)),
                    }));
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tipo de Ação</label>
                <select
                  value={selectedNode.type}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setSelectedNode({ ...selectedNode, type: val });
                    setWorkflow((prev) => ({
                      ...prev,
                      nodes: prev.nodes.map((n) => (n.id === selectedNode.id ? { ...n, type: val } : n)),
                    }));
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Mensagem">Mensagem</option>
                  <option value="Pergunta">Pergunta</option>
                  <option value="Menu">Menu</option>
                  <option value="Condição">Condição</option>
                  <option value="Equipe">Equipe</option>
                  <option value="IA">IA</option>
                  <option value="Horário">Horário</option>
                  <option value="SLA">SLA</option>
                  <option value="Finalização">Finalização</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição Operacional</label>
                <textarea
                  rows={3}
                  value={selectedNode.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedNode({ ...selectedNode, description: val });
                    setWorkflow((prev) => ({
                      ...prev,
                      nodes: prev.nodes.map((n) => (n.id === selectedNode.id ? { ...n, description: val } : n)),
                    }));
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Regras automáticas aplicadas em tempo de execução ao receber eventos do webhook WhatsApp.
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              Selecione um nó ao lado para editar suas configurações.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
