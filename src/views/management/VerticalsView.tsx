import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Vertical } from '../../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
} from 'lucide-react';

export const VerticalsView: React.FC = () => {
  const { verticals, setVerticals, addAuditLog } = useHelpdesk();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVertical, setEditingVertical] = useState<Vertical | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    color: '#3B82F6',
    icon: 'Layers',
    customerAccess: true,
    technicalAccess: true,
  });

  const availableColors = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#06B6D4', // Cyan
    '#14B8A6', // Teal
    '#EF4444', // Red
    '#64748B', // Slate
  ];

  const openCreateModal = () => {
    setEditingVertical(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      color: '#8B5CF6',
      icon: 'Layers',
      customerAccess: true,
      technicalAccess: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (v: Vertical) => {
    setEditingVertical(v);
    setFormData({
      name: v.name,
      code: v.code,
      description: v.description,
      color: v.color,
      icon: v.icon,
      customerAccess: v.customerAccess,
      technicalAccess: v.technicalAccess,
    });
    setModalOpen(true);
  };

  const toggleActive = (id: string, name: string) => {
    const activeCount = verticals.filter((v) => v.active).length;
    const target = verticals.find((v) => v.id === id);
    if (target?.active && activeCount <= 1) {
      alert('Pelo menos uma vertical deve permanecer ativa na organização.');
      return;
    }

    setVerticals((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
    addAuditLog('Status de Vertical', `Vertical ${name}`, 'Status ativado/desativado alternado.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const code = formData.code.trim() || formData.name.trim().toUpperCase().replace(/\s+/g, '_');

    if (editingVertical) {
      setVerticals((prev) =>
        prev.map((v) => (v.id === editingVertical.id ? { ...v, ...formData, code } : v))
      );
      addAuditLog('Edição de Vertical', `Vertical ${formData.name}`, 'Dados atualizados.');
    } else {
      const newV: Vertical = {
        id: 'vert-' + Date.now(),
        ...formData,
        code,
        active: true,
      };
      setVerticals((prev) => [...prev, newV]);
      addAuditLog('Criação de Vertical', `Vertical ${newV.name}`, 'Nova vertical cadastrada.');
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Configuração de Verticais de Atendimento
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Áreas de especialidade responsáveis pelo direcionamento, SLA e equipes de atendimento.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Vertical</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {verticals.map((v) => (
          <div
            key={v.id}
            className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition ${
              v.active ? 'border-slate-800 hover:border-slate-700' : 'border-slate-900 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: v.color }}
                  />
                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{v.code}</span>
                  {v.isDevelopment && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/60 border border-red-800/60 text-red-300 font-medium">
                      Exclusivo Interno
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(v)}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-1">{v.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{v.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Acesso de Clientes no WhatsApp:</span>
                  <span className={v.customerAccess ? 'text-emerald-400' : 'text-slate-500'}>
                    {v.customerAccess ? 'Visível no menu' : 'Oculto para clientes'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Acesso Técnico:</span>
                  <span className="text-emerald-400">Habilitado</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Status: <strong className={v.active ? 'text-emerald-400' : 'text-slate-500'}>{v.active ? 'Ativa' : 'Desativada'}</strong>
              </span>

              <button
                onClick={() => toggleActive(v.id, v.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  v.active
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {v.active ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">
                {editingVertical ? 'Editar Vertical' : 'Nova Vertical'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nome da Vertical *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Código (Identificador Único)</label>
                <input
                  type="text"
                  placeholder="EX: TRIBUTOS"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Cor Temática</label>
                <div className="flex items-center gap-2">
                  {availableColors.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-6 h-6 rounded-full transition cursor-pointer flex items-center justify-center ${
                        formData.color === c ? 'ring-2 ring-white scale-110' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {formData.color === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.customerAccess}
                    onChange={(e) => setFormData({ ...formData, customerAccess: e.target.checked })}
                    className="rounded bg-slate-800 text-indigo-500"
                  />
                  <span>Exibir no menu inicial de seleção de WhatsApp dos clientes</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
