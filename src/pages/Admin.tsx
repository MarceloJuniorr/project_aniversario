import { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, Search, 
  RefreshCw, LogOut, Download, UserCheck, Settings,
  Users, Trash2, ChevronDown, ChevronUp, User
} from 'lucide-react';
import { toast } from 'sonner';
import ConfigPanel from '../components/admin/ConfigPanel';
import { useConfig, type GuestWithCompanions } from '../context/ConfigContext';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'declined'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'guests' | 'config'>('guests');
  const [expandedGuests, setExpandedGuests] = useState<string[]>([]);

  const { 
    guests, 
    fetchGuests, 
    updateGuestStatus, 
    deleteGuest
  } = useConfig();

  // Check authentication on mount
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadGuests();
    }
  }, []);

  const loadGuests = async () => {
    setIsLoading(true);
    await fetchGuests();
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'rafael2026') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      loadGuests();
      toast.success('Login realizado com sucesso!');
    } else {
      toast.error('Senha incorreta!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    toast.success('Logout realizado!');
  };

  const handleUpdateStatus = async (id: string, status: GuestWithCompanions['status']) => {
    try {
      await updateGuestStatus(id, status);
      toast.success(`Status atualizado para: ${status === 'confirmed' ? 'Confirmado' : status === 'declined' ? 'Não Vai' : 'Pendente'}`);
    } catch (e) {
      toast.error('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir ${name}?`)) {
      try {
        await deleteGuest(id);
        toast.success('Convidado excluído com sucesso!');
      } catch (e) {
        toast.error('Erro ao excluir convidado');
      }
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedGuests(prev => 
      prev.includes(id) 
        ? prev.filter(g => g !== id)
        : [...prev, id]
    );
  };

  const exportToCSV = () => {
    const headers = ['Tipo', 'Nome', 'Telefone', 'Responsável', 'Comparecerá', 'Mensagem', 'Data', 'Status'];
    const rows: string[] = [];
    
    guests.forEach(g => {
      // Convidado principal
      rows.push([
        'Convidado',
        g.name,
        g.phone,
        '-',
        g.attending ? 'Sim' : 'Não',
        (g.message || '').replace(/,/g, ' '),
        new Date(g.created_at || '').toLocaleString('pt-BR'),
        g.status
      ].join(','));
      
      // Acompanhantes
      g.companions.forEach(c => {
        rows.push([
          'Acompanhante',
          c.name,
          '-',
          g.name,
          'Sim',
          '-',
          new Date(c.created_at || '').toLocaleString('pt-BR'),
          '-'
        ].join(','));
      });
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `confirmacoes_rafael_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Arquivo CSV exportado!');
  };

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         g.phone.includes(searchTerm) ||
                         g.companions.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || 
                         (filter === 'confirmed' && g.status === 'confirmed') ||
                         (filter === 'pending' && g.status === 'pending') ||
                         (filter === 'declined' && g.status === 'declined');
    return matchesSearch && matchesFilter;
  });

  // Estatísticas
  const totalGuests = guests.filter(g => g.attending).length;
  const totalCompanions = guests.reduce((acc, g) => acc + g.companions.length, 0);
  const stats = {
    total: guests.length,
    confirmed: guests.filter(r => r.status === 'confirmed').length,
    pending: guests.filter(r => r.status === 'pending').length,
    declined: guests.filter(r => r.status === 'declined').length,
    attending: totalGuests,
    totalPeople: totalGuests + totalCompanions,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F0E6] to-[#EDE8DC] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full border-2 border-[#D4AF37]/30">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#3D2914] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#3D2914] mb-2">
              Área Administrativa
            </h1>
            <p className="font-body text-[#5C4024]">
              Aniversário Rafael Medeiros
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-body text-sm text-[#5C4024] mb-2 block">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-3 bg-[#F5F0E6] border border-[#D4AF37]/30 rounded-xl text-[#3D2914] focus:outline-none focus:border-[#D4AF37]"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-[#3D2914] font-semibold py-4 rounded-xl hover:bg-[#C4A030] transition-colors"
            >
              Entrar
            </button>
          </form>

          <a 
            href="/"
            className="block text-center mt-6 text-[#8B6914] hover:text-[#3D2914] transition-colors"
          >
            Voltar para o site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0E6] to-[#EDE8DC]">
      {/* Header */}
      <header className="bg-[#3D2914] text-white py-4 px-4 sm:px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-[#3D2914]" />
            </div>
            <div>
              <h1 className="font-display text-xl">Admin - Aniversário Rafael</h1>
              <p className="font-body text-xs text-[#F5F0E6]/70">Gerenciamento do Site</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#5C4024] rounded-lg hover:bg-[#8B6914] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('guests')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'guests'
                  ? 'border-[#D4AF37] text-[#3D2914]'
                  : 'border-transparent text-[#8B6914] hover:text-[#3D2914]'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Convidados ({stats.total})</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'config'
                  ? 'border-[#D4AF37] text-[#3D2914]'
                  : 'border-transparent text-[#8B6914] hover:text-[#3D2914]'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações do Site</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {activeTab === 'guests' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white/90 rounded-xl p-4 border border-[#D4AF37]/20">
                <p className="font-body text-xs text-[#8B6914]">Total Respostas</p>
                <p className="font-display text-2xl text-[#3D2914]">{stats.total}</p>
              </div>
              <div className="bg-white/90 rounded-xl p-4 border border-[#4A5D23]/20">
                <p className="font-body text-xs text-[#4A5D23]">Confirmados</p>
                <p className="font-display text-2xl text-[#4A5D23]">{stats.confirmed}</p>
              </div>
              <div className="bg-white/90 rounded-xl p-4 border border-[#D4AF37]/20">
                <p className="font-body text-xs text-[#8B6914]">Pendentes</p>
                <p className="font-display text-2xl text-[#8B6914]">{stats.pending}</p>
              </div>
              <div className="bg-white/90 rounded-xl p-4 border border-[#8B6914]/20">
                <p className="font-body text-xs text-[#8B6914]">Não Vão</p>
                <p className="font-display text-2xl text-[#8B6914]">{stats.declined}</p>
              </div>
              <div className="bg-white/90 rounded-xl p-4 border border-[#D4AF37]/20">
                <p className="font-body text-xs text-[#5C4024]">Vão Comparecer</p>
                <p className="font-display text-2xl text-[#3D2914]">{stats.attending}</p>
              </div>
              <div className="bg-white/90 rounded-xl p-4 border border-[#D4AF37]/20">
                <p className="font-body text-xs text-[#5C4024]">Total Pessoas</p>
                <p className="font-display text-2xl text-[#3D2914]">{stats.totalPeople}</p>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B6914]" />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone ou acompanhante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/90 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-4 py-3 bg-white/90 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all">Todos</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="pending">Pendentes</option>
                  <option value="declined">Não Vão</option>
                </select>
                <button
                  onClick={loadGuests}
                  className="flex items-center gap-2 px-4 py-3 bg-[#3D2914] text-white rounded-xl hover:bg-[#5C4024] transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-3 bg-[#D4AF37] text-[#3D2914] rounded-xl hover:bg-[#C4A030] transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
              </div>
            </div>

            {/* Guest Cards */}
            <div className="space-y-4">
              {filteredGuests.length === 0 ? (
                <div className="bg-white/90 rounded-2xl p-8 text-center text-[#8B6914] border border-[#D4AF37]/20">
                  {isLoading ? 'Carregando...' : 'Nenhuma confirmação encontrada'}
                </div>
              ) : (
                filteredGuests.map((guest) => (
                  <div 
                    key={guest.id} 
                    className="bg-white/90 rounded-2xl border border-[#D4AF37]/20 overflow-hidden"
                  >
                    {/* Guest Header */}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Guest Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-[#3D2914]" />
                            </div>
                            <div>
                              <h3 className="font-display text-lg text-[#3D2914] font-semibold">
                                {guest.name}
                              </h3>
                              <p className="font-body text-sm text-[#8B6914]">
                                {guest.phone}
                              </p>
                            </div>
                          </div>
                          
                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {/* Attending Badge */}
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              guest.attending
                                ? 'bg-[#4A5D23]/20 text-[#4A5D23]'
                                : 'bg-[#8B6914]/20 text-[#8B6914]'
                            }`}>
                              {guest.attending ? (
                                <><CheckCircle className="w-3 h-3" /> Vai Comparecer</>
                              ) : (
                                <><XCircle className="w-3 h-3" /> Não Vai</>
                              )}
                            </span>
                            
                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              guest.status === 'confirmed'
                                ? 'bg-[#4A5D23]/20 text-[#4A5D23]'
                                : guest.status === 'declined'
                                ? 'bg-red-100 text-red-600'
                                : 'bg-[#D4AF37]/20 text-[#8B6914]'
                            }`}>
                              {guest.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                              {guest.status === 'pending' && <Clock className="w-3 h-3" />}
                              {guest.status === 'declined' && <XCircle className="w-3 h-3" />}
                              {guest.status === 'confirmed' ? 'Confirmado' : 
                               guest.status === 'declined' ? 'Não Vai' : 'Pendente'}
                            </span>
                            
                            {/* Companions Count */}
                            {guest.companions.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4AF37]/20 text-[#8B6914] rounded-full text-xs font-semibold">
                                <Users className="w-3 h-3" /> 
                                {guest.companions.length} Acompanhante{guest.companions.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          
                          {/* Message */}
                          {guest.message && (
                            <p className="mt-3 text-sm text-[#5C4024] italic bg-[#F5F0E6] p-3 rounded-lg">
                              "{guest.message}"
                            </p>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {guest.companions.length > 0 && (
                            <button
                              onClick={() => toggleExpand(guest.id!)}
                              className="flex items-center gap-1 px-3 py-2 bg-[#F5F0E6] hover:bg-[#EDE8DC] rounded-lg transition-colors text-sm text-[#5C4024]"
                            >
                              {expandedGuests.includes(guest.id!) ? (
                                <><ChevronUp className="w-4 h-4" /> Ocultar</>
                              ) : (
                                <><ChevronDown className="w-4 h-4" /> Ver</>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(guest.id!, 'confirmed')}
                            className="p-2 hover:bg-[#4A5D23]/20 rounded-lg transition-colors"
                            title="Marcar como Confirmado"
                          >
                            <CheckCircle className="w-5 h-5 text-[#4A5D23]" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(guest.id!, 'pending')}
                            className="p-2 hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
                            title="Marcar como Pendente"
                          >
                            <Clock className="w-5 h-5 text-[#8B6914]" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(guest.id!, 'declined')}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Marcar como Não Vai"
                          >
                            <XCircle className="w-5 h-5 text-red-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(guest.id!, guest.name)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Excluir convidado"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Companions List */}
                    {expandedGuests.includes(guest.id!) && guest.companions.length > 0 && (
                      <div className="border-t border-[#D4AF37]/20 bg-[#F5F0E6]/50 p-4 sm:p-6">
                        <h4 className="font-body text-sm text-[#8B6914] mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Acompanhantes de <span className="font-semibold text-[#3D2914]">{guest.name}</span>:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {guest.companions.map((companion) => (
                            <div 
                              key={companion.id}
                              className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#D4AF37]/20"
                            >
                              <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-[#8B6914]" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-body text-sm text-[#3D2914] font-medium truncate">
                                  {companion.name}
                                </p>
                                <p className="font-body text-xs text-[#8B6914]">
                                  Acompanhante de {guest.name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <ConfigPanel />
        )}
      </main>

      {/* Footer */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 text-center">
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-[#8B6914] hover:text-[#3D2914] transition-colors"
        >
          ← Voltar para o site
        </a>
      </div>
    </div>
  );
};

export default Admin;
