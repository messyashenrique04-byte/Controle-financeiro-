import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trash2, 
  Edit2, 
  Calendar,
  RefreshCcw,
  BarChart3,
  PlusCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  LayoutDashboard
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const CATEGORIES = [
  "Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Salário", "Investimentos", "Outros"
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  
  const [filterDate, setFilterDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [formData, setFormData] = useState({
    amount: '', 
    category: 'Alimentação',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'saida'
  });

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem('finances_data_v3');
    if (savedData) setTransactions(JSON.parse(savedData));
  }, []);

  // Salvar dados automaticamente
  useEffect(() => {
    localStorage.setItem('finances_data_v3', JSON.stringify(transactions));
  }, [transactions]);

  // Formatação de moeda estilo digital (centavos automáticos)
  const formatCurrencyInput = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return "";
    const amount = (Number(cleanValue) / 100).toFixed(2);
    return amount.replace(".", ",");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, amount: formatCurrencyInput(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(formData.amount.replace('.', '').replace(',', '.'));
    
    if (isNaN(numericAmount) || numericAmount <= 0 || !formData.description) return;

    if (isEditing) {
      setTransactions(transactions.map(t => t.id === isEditing ? { ...formData, id: isEditing, amount: numericAmount } : t));
      setIsEditing(null);
    } else {
      const newTransaction = { ...formData, id: Date.now(), amount: numericAmount };
      setTransactions([newTransaction, ...transactions]);
    }

    setFormData({
      amount: '', category: 'Alimentação',
      date: new Date().toISOString().split('T')[0],
      description: '', type: 'saida'
    });
  };

  const deleteTransaction = (id) => {
    if(window.confirm("Eliminar esta transação?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const startEdit = (transaction) => {
    const formattedAmount = transaction.amount.toFixed(2).replace('.', ',');
    setFormData({ ...transaction, amount: formattedAmount });
    setIsEditing(transaction.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTransactions = useMemo(() => 
    transactions.filter(t => t.date.startsWith(filterDate)), 
    [transactions, filterDate]
  );

  const stats = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === 'entrada') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [filteredTransactions]);

  const chartDataPie = useMemo(() => {
    const data = {};
    filteredTransactions.filter(t => t.type === 'saida').forEach(t => {
      data[t.category] = (data[t.category] || 0) + t.amount;
    });
    return Object.keys(data).map(name => ({ name, value: data[name] }));
  }, [filteredTransactions]);

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(v);

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 mb-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold tracking-tight">Finanças Online</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <Calendar size={18} className="text-slate-500 ml-2" />
            <input 
              type="month" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)} 
              className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 p-2 cursor-pointer" 
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Sumário */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><LayoutDashboard size={20}/></span>
              <span className="text-xs font-bold text-slate-400 uppercase">Saldo Atual</span>
            </div>
            <h2 className={`text-3xl font-black ${stats.income - stats.expense >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
              {formatCurrency(stats.income - stats.expense)}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpCircle size={20}/></span>
              <span className="text-xs font-bold text-slate-400 uppercase">Entradas</span>
            </div>
            <h2 className="text-3xl font-black text-emerald-600">{formatCurrency(stats.income)}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ArrowDownCircle size={20}/></span>
              <span className="text-xs font-bold text-slate-400 uppercase">Saídas</span>
            </div>
            <h2 className="text-3xl font-black text-rose-600">{formatCurrency(stats.expense)}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-600" />
                {isEditing ? 'Editar Registro' : 'Novo Registro'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-1">Valor</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input 
                      type="text" 
                      name="amount" 
                      value={formData.amount} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                      placeholder="0,00"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase mb-1">Descrição</label>
                  <input 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Ex: Aluguel, Mercado..." 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-1">Categoria</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase mb-1">Data</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'saida'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'saida' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Saída
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: 'entrada'})}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.type === 'entrada' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Entrada
                  </button>
                </div>

                <div className="pt-2 flex gap-2">
                  {isEditing && (
                    <button 
                      type="button" 
                      onClick={() => { setIsEditing(null); setFormData({ amount: '', category: 'Alimentação', date: new Date().toISOString().split('T')[0], description: '', type: 'saida' }); }}
                      className="flex-1 py-3 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200"
                    >
                      Cancelar
                    </button>
                  )}
                  <button type="submit" className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                    {isEditing ? 'Atualizar' : 'Confirmar'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Coluna Direita: Gráficos e Tabela */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gráficos */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-sm font-black text-slate-400 uppercase mb-6 flex items-center gap-2">
                <BarChart3 size={16} /> Gráfico de Despesas
              </h3>
              <div className="w-full h-64">
                {chartDataPie.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartDataPie} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                        {chartDataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                    Adicione saídas para visualizar o gráfico.
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Transações */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Histórico de Transações</h3>
                <button 
                  onClick={() => { if(window.confirm("Deseja limpar todos os dados do sistema?")) setTransactions([]); }}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                  title="Resetar tudo"
                >
                  <RefreshCcw size={18} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Descrição</th>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-700 leading-none mb-1">{t.description}</p>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold">{t.category}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(t.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className={`px-6 py-4 font-black ${t.type === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'entrada' ? '+' : '-'} {formatCurrency(t.amount)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(t)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                            <button onClick={() => deleteTransaction(t.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <p className="text-slate-400 text-sm">Nenhuma movimentação registada para este mês.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;