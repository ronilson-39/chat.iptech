import React, { useState } from 'react';
import { useHelpdesk } from '../../context/HelpdeskContext';
import { Client, ClientContact } from '../../types';
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  Edit2,
  Trash2,
  MessageSquare,
  X,
  Check,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, setClients, verticals, navigate, simulateIncomingClientMessage, addAuditLog } = useHelpdesk();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVertical, setSelectedVertical] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    tradeName: '',
    document: '',
    registration: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    verticalIds: [] as string[],
    contacts: [] as ClientContact[],
  });

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      companyName: '',
      tradeName: '',
      document: '',
      registration: '',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      city: '',
      state: 'SP',
      zipCode: '',
      notes: '',
      verticalIds: ['vert-folha', 'vert-contabilidade'],
      contacts: [
        {
          id: 'c-' + Date.now(),
          name: '',
          role: 'Responsável',
          phone: '',
          whatsapp: '',
          email: '',
          active: true,
        },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      companyName: client.companyName,
      tradeName: client.tradeName,
      document: client.document,
      registration: client.registration || '',
      email: client.email,
      phone: client.phone,
      whatsapp: client.whatsapp,
      address: client.address,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      notes: client.notes || '',
      verticalIds: client.verticalIds,
      contacts: client.contacts.length
        ? client.contacts
        : [
            {
              id: 'c-' + Date.now(),
              name: '',
              role: 'Responsável',
              phone: '',
              whatsapp: '',
              email: '',
              active: true,
            },
          ],
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
                ...c,
                ...formData,
              }
            : c
        )
      );
      addAuditLog('Edição de Cliente', `Cliente ${editingClient.companyName}`, 'Dados cadastrais atualizados.');
    } else {
      const newClient: Client = {
        id: 'client-' + Date.now(),
        ...formData,
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients((prev) => [newClient, ...prev]);
      addAuditLog('Criação de Cliente', `Cliente ${newClient.companyName}`, 'Novo cliente cadastrado com sucesso.');
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja desativar o cliente "${name}"?`)) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      addAuditLog('Exclusão de Cliente', `Cliente ${name}`, 'Registro removido da base ativa.');
    }
  };

  const toggleVertical = (vId: string) => {
    setFormData((prev) => {
      const exists = prev.verticalIds.includes(vId);
      return {
        ...prev,
        verticalIds: exists ? prev.verticalIds.filter((id) => id !== vId) : [...prev.verticalIds, vId],
      };
    });
  };

  const filteredClients = clients.filter((c) => {
    const matchSearch =
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.document.includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVertical = selectedVertical === 'all' || c.verticalIds.includes(selectedVertical);
    return matchSearch && matchVertical;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Gestão de Clientes e Entidades
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Prefeituras, Câmaras Municipais, Autarquias e Empresas conveniadas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white shadow-lg shadow-indigo-950/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Razão Social, CNPJ ou Cidade..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedVertical}
          onChange={(e) => setSelectedVertical(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
        >
          <option value="all">Todas as Verticais</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Cliente / Entidade</th>
                <th className="py-3 px-4">CNPJ</th>
                <th className="py-3 px-4">Cidade / UF</th>
                <th className="py-3 px-4">WhatsApp Principal</th>
                <th className="py-3 px-4">Verticais Contratadas</th>
                <th className="py-3 px-4">Contatos</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-100">
                    <div className="font-semibold">{c.companyName}</div>
                    {c.tradeName && <div className="text-[11px] text-slate-400">{c.tradeName}</div>}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">{c.document}</td>
                  <td className="py-3.5 px-4">
                    {c.city}/{c.state}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-emerald-400">{c.whatsapp || c.phone}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {c.verticalIds.map((vId) => {
                        const vert = verticals.find((v) => v.id === vId);
                        if (!vert) return null;
                        return (
                          <span
                            key={vId}
                            className="text-[9px] px-1.5 py-0.5 rounded font-medium border"
                            style={{
                              backgroundColor: `${vert.color}20`,
                              borderColor: `${vert.color}50`,
                              color: vert.color,
                            }}
                          >
                            {vert.name}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {c.contacts.length ? `${c.contacts.length} contato(s)` : 'Nenhum'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          simulateIncomingClientMessage(c.id);
                          navigate('/helpdesk/inbox');
                        }}
                        className="p-1.5 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 rounded-lg transition"
                        title="Abrir novo atendimento deste cliente"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="Editar cliente"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.companyName)}
                        className="p-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 rounded-lg transition"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Client */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingClient ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">
                    Razão Social / Nome da Entidade <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nome Fantasia</label>
                  <input
                    type="text"
                    value={formData.tradeName}
                    onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">CNPJ</label>
                  <input
                    type="text"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    placeholder="00.000.000/0000-00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp de Atendimento</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="5511999998888"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">E-mail Principal</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Verticais Contratadas */}
              <div>
                <label className="block text-slate-300 font-medium mb-2">Verticais Contratadas:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {verticals
                    .filter((v) => !v.isDevelopment)
                    .map((v) => {
                      const selected = formData.verticalIds.includes(v.id);
                      return (
                        <button
                          type="button"
                          key={v.id}
                          onClick={() => toggleVertical(v.id)}
                          className={`p-2 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                            selected
                              ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300'
                              : 'bg-slate-800/60 border-slate-700 text-slate-400'
                          }`}
                        >
                          <span className="truncate">{v.name}</span>
                          {selected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold text-white shadow-lg shadow-indigo-950/50"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
