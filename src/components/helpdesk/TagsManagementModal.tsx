import React, { useState } from 'react';
import {
  X,
  Tag as TagIcon,
  Plus,
  Building2,
  Layers,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  Shuffle,
} from 'lucide-react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Tag } from '../../types';

interface TagsManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagCreated?: (tag: Tag) => void;
}

const VIBRANT_COLORS = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#84CC16', // Lime
  '#F97316', // Orange
  '#A855F7', // Violet
];

export const TagsManagementModal: React.FC<TagsManagementModalProps> = ({
  isOpen,
  onClose,
  onTagCreated,
}) => {
  const { tags, setTags, clients, verticals, createTag, addAuditLog } = useHelpdesk();

  const [isCreating, setIsCreating] = useState(false);
  const [tagType, setTagType] = useState<'entity' | 'system'>('entity');
  const [selectedEntityId, setSelectedEntityId] = useState<string>(clients[0]?.id || '');
  const [selectedSystemId, setSelectedSystemId] = useState<string>(verticals[0]?.id || '');
  const [customTagName, setCustomTagName] = useState('');
  const [customColor, setCustomColor] = useState(VIBRANT_COLORS[0]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Pick a random color
  const rollRandomColor = () => {
    const random = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
    setCustomColor(random);
  };

  const handleStartCreating = (type: 'entity' | 'system') => {
    setTagType(type);
    setIsCreating(true);
    setError('');
    rollRandomColor();

    if (type === 'entity') {
      const ent = clients.find((c) => c.id === selectedEntityId) || clients[0];
      setCustomTagName(ent ? ent.tradeName || ent.companyName : '');
    } else {
      const sys = verticals.find((v) => v.id === selectedSystemId) || verticals[0];
      setCustomTagName(sys ? sys.name : '');
    }
  };

  const handleEntityChange = (id: string) => {
    setSelectedEntityId(id);
    const ent = clients.find((c) => c.id === id);
    if (ent) {
      setCustomTagName(ent.tradeName || ent.companyName);
    }
  };

  const handleSystemChange = (id: string) => {
    setSelectedSystemId(id);
    const sys = verticals.find((v) => v.id === id);
    if (sys) {
      setCustomTagName(sys.name);
    }
  };

  const handleSaveTag = () => {
    setError('');
    if (!customTagName.trim()) {
      setError('Por favor, informe o nome da etiqueta.');
      return;
    }

    let targetId = '';
    let targetName = '';

    if (tagType === 'entity') {
      const ent = clients.find((c) => c.id === selectedEntityId);
      targetId = selectedEntityId;
      targetName = ent ? ent.companyName : '';
    } else {
      const sys = verticals.find((v) => v.id === selectedSystemId);
      targetId = selectedSystemId;
      targetName = sys ? sys.name : '';
    }

    const newTag = createTag(customTagName, tagType, targetId, targetName, customColor);

    if (onTagCreated) {
      onTagCreated(newTag);
    }

    setIsCreating(false);
    setCustomTagName('');
  };

  const handleDeleteTag = (id: string) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('Exclusão de Etiqueta', `ID: ${id}`, 'Removida da gestão de etiquetas');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <TagIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Gestão de Etiquetas (Tags)</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {tags.length} cadastradas
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Organize atendimentos e contatos por Entidade e Sistema com cores dinâmicas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Action Area */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          {!isCreating ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-300">
                Cadastre novas etiquetas selecionando entre Entidade ou Sistema:
              </span>
              <button
                type="button"
                onClick={() => handleStartCreating('entity')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Etiqueta</span>
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3.5 bg-slate-850 p-4 rounded-xl border border-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                <span className="text-xs font-bold text-white">Criar Nova Etiqueta</span>
                {/* Random color indicator */}
                <button
                  type="button"
                  onClick={rollRandomColor}
                  className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700 cursor-pointer"
                  title="Sortear nova cor aleatória"
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: customColor }} />
                  <Shuffle className="w-3 h-3 text-amber-400" />
                  <span>Trocar Cor</span>
                </button>
              </div>

              {/* Botão com Duas Opções: Entidade ou Sistema */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  1. Escolha a Categoria da Etiqueta:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartCreating('entity')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                      tagType === 'entity'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Entidade (Prefeituras / Câmaras)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartCreating('system')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                      tagType === 'system'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Sistema (Folha, eSocial, etc.)</span>
                  </button>
                </div>
              </div>

              {/* Opção Entidade -> Campo para escolher as entidades cadastradas */}
              {tagType === 'entity' ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    2. Selecione a Entidade Cadastrada:
                  </label>
                  <select
                    value={selectedEntityId}
                    onChange={(e) => handleEntityChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.tradeName}) — {c.city}/{c.state}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* Opção Sistema -> Campo para escolher os sistemas cadastrados */
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    2. Selecione o Sistema Cadastrado:
                  </label>
                  <select
                    value={selectedSystemId}
                    onChange={(e) => handleSystemChange(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {verticals.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nome customizável da Etiqueta */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  3. Nome de Exibição da Etiqueta:
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-white shadow-sm border border-slate-700"
                    style={{ backgroundColor: customColor }}
                  >
                    <TagIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={customTagName}
                    onChange={(e) => setCustomTagName(e.target.value)}
                    placeholder="Ex: Folha Mensal, Gabinete, Pref. São Pedro..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {error && (
                <div className="text-[11px] text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons for Creation */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-750">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveTag}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Etiqueta</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tags List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tags.map((tag) => {
              const isEntity = tag.type === 'entity';
              return (
                <div
                  key={tag.id}
                  className="p-3 bg-slate-850 border border-slate-800 hover:border-slate-750 rounded-xl transition flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm ring-2 ring-slate-900"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>{tag.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                        <span className="font-semibold text-slate-300">
                          {isEntity ? 'Entidade:' : 'Sistema:'}
                        </span>
                        <span className="truncate">{tag.targetName || 'Geral'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold border"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        borderColor: `${tag.color}50`,
                        color: tag.color,
                      }}
                    >
                      {isEntity ? 'Entidade' : 'Sistema'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(tag.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="Excluir etiqueta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {tags.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              Nenhuma etiqueta cadastrada no momento.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            As etiquetas podem ser atribuídas aos clientes no topo da conversa.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
