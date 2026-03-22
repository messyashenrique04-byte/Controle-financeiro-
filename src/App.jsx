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
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

// Definição de Estilos Inline para evitar erro de importação de CSS externo no Canvas
const styles = `
  :root {
    --primary: #3b82f6;
    --primary-dark: #1d4ed8;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --bg-main: #f8fafc;
    --bg-card: #ffffff;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
  }

  .app-container {
    min-height: 100vh;
    padding-bottom: 3rem;
    font-family: sans-serif;
    background-color: var(--bg-main);
    color: var(--text-main);
  }

  .max-width-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .main-header {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    padding: 1.5rem 0;
    margin-bottom: 2rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 800;
    font-size: 1.25rem;
  }

  .logo-icon { color: var(--primary); }

  .date-filter-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--bg-main);
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
  }

  .date-input {
    border: none;
    background: transparent;
    font-weight: 700;
    color: var(--text-muted);
    outline: none;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .card {
    background: var(--bg-card);
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid var(--border);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .card-label {
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .icon-box {
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .bg-blue { background: #eff6ff; color: var(--primary); }
  .bg-green { background: #ecfdf5; color: var(--success); }
  .bg-red { background: #fef2f2; color: var(--danger); }

  .amount-display {
    font-size: 1.875rem;
    font-weight: 900;
  }

  .text-success { color: var(--success); }
  .text-danger { color: var(--danger); }

  .main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .main-grid { grid-template-columns: 350px 1fr; }
  }

  .form-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    margin-bottom: 1.5rem;
  }

  .form-group { margin-bottom: 1rem; }

  .label-small {
    display: block;
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  .input-field {
    width: 100%;
    background: var(--bg-main);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 0.75rem;
    outline: none;
  }

  .currency-input-wrapper { position: relative; }
  .currency-prefix {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 700;
    color: var(--text-muted);
  }
  .pl-10 { padding-left: 2.5rem; font-weight: 800; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .toggle-group {
    display: flex;
    background: var(--bg-main);
    padding: 0.25rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
  }

  .toggle-btn {
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    background: transparent;
    color: var(--text-muted);
  }

  .toggle-btn.active {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .toggle-btn.active.saida { color: var(--danger); }
  .toggle-btn.active.entrada { color: var(--success); }

  .btn-submit {
    width: 100%;
    background: var(--primary);
    color: white;
    padding: 0.875rem;
    border: none;
    border-radius: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .chart-container {
    height: 250px;
    margin-top: 1rem;
  }

  .table-card {
    padding: 0;
    overflow: hidden;
  }

  .table-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .transaction-table {
    width: 100%;
    border-collapse: collapse;
  }

  .transaction-table th {
    background: var(--bg-main);
    font-size: 0.65rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    padding: 1rem 1.5rem;
    text-align: left;
  }

  .transaction-table td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .category-tag {
    font-size: 0.65rem;
    background: #f1f5f9;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-weight: 800;
    color: var(--text-muted);
  }

  .action-btns {
    display: flex;
    justify-content: flex-end;
    gap: 0.25rem;
  }

  .btn-icon {
    background: transparent;
    border: none;
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    color: var(--text-muted);
  }

  .empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    font-style: italic;
  }

  .space-y {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

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

  useEffect(() => {
    const savedData = localStorage.getItem('finly_data_v1');
    if (savedData) setTransactions(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem('finly_data_v1', JSON.stringify(transactions));
  }, [transactions]);

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
    <div className="app-container">
      <style>{styles}</style>
      <header className="main-header">
        <div className="max-width-wrapper header-content">
          <div className="logo-area">
            <LayoutDashboard className="logo-icon" size={28} />
            <span>Finly</span>
          </div>
          <div className="date-filter-wrapper">
            <Calendar size={18} color="#64748b" />
            <input 
              type="month" 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)} 
              className="date-input" 
            />
          </div>
        </div>
      </header>

      <main className="max-width-wrapper">
        <div className="summary-grid">
          <div className="card">
            <div className="card-header">
              <div className="icon-box bg-blue"><LayoutDashboard size={20}/></div>
              <span className="card-label">Saldo Atual</span>
            </div>
            <h2 className={`amount-display ${stats.income - stats.expense >= 0 ? '' : 'text-danger'}`}>
              {formatCurrency(stats.income - stats.expense)}
            </h2>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="icon-box bg-green"><ArrowUpCircle size={20}/></div>
              <span className="card-label">Entradas</span>
            </div>
            <h2 className="amount-display text-success">{formatCurrency(stats.income)}</h2>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="icon-box bg-red"><ArrowDownCircle size={20}/></div>
              <span className="card-label">Saídas</span>
            </div>
            <h2 className="amount-display text-danger">{formatCurrency(stats.expense)}</h2>
          </div>
        </div>

        <div className="main-grid">
          <aside className="form-card card">
            <h3 className="form-title">
              <PlusCircle size={20} color="#3b82f6" />
              {isEditing ? 'Editar Registo' : 'Novo Registo'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label-small">Valor</label>
                <div className="currency-input-wrapper">
                  <span className="currency-prefix">R$</span>
                  <input 
                    type="text" 
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleInputChange} 
                    className="input-field pl-10" 
                    placeholder="0,00"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label-small">Descrição</label>
                <input 
                  type="text" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="input-field" 
                  placeholder="Ex: Aluguer, Compras..." 
                  required 
                />
              </div>

              <div className="form-row form-group">
                <div>
                  <label className="label-small">Categoria</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-small">Data</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="input-field" required />
                </div>
              </div>

              <div className="toggle-group">
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'saida'})}
                  className={`toggle-btn ${formData.type === 'saida' ? 'active saida' : ''}`}
                >Saída</button>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, type: 'entrada'})}
                  className={`toggle-btn ${formData.type === 'entrada' ? 'active entrada' : ''}`}
                >Entrada</button>
              </div>

              <button type="submit" className="btn-submit">
                {isEditing ? 'Atualizar Dados' : 'Confirmar Registo'}
              </button>
              
              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => { setIsEditing(null); setFormData({ amount: '', category: 'Alimentação', date: new Date().toISOString().split('T')[0], description: '', type: 'saida' }); }}
                  className="toggle-btn" 
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  Cancelar Edição
                </button>
              )}
            </form>
          </aside>

          <section className="space-y">
            <div className="card">
              <h3 className="card-label mb-4 flex items-center gap-2">
                <BarChart3 size={16} /> Despesas por Categoria
              </h3>
              <div className="chart-container">
                {chartDataPie.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={chartDataPie} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={60} 
                        outerRadius={80} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {chartDataPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => formatCurrency(v)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">Adicione saídas para gerar o gráfico.</div>
                )}
              </div>
            </div>

            <div className="card table-card">
              <div className="table-header">
                <h3 style={{fontWeight: 'bold'}}>Histórico de Movimentações</h3>
                <button className="btn-icon" title="Limpar Tudo" onClick={() => { if(window.confirm("Apagar todos os registos?")) setTransactions([]); }}>
                  <RefreshCcw size={16}/>
                </button>
              </div>
              <div style={{overflowX: 'auto'}}>
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Data</th>
                      <th>Valor</th>
                      <th style={{textAlign: 'right'}}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                      <tr key={t.id}>
                        <td className="desc-cell">
                          <div style={{fontWeight: 700, marginBottom: '0.25rem'}}>{t.description}</div>
                          <span className="category-tag">{t.category}</span>
                        </td>
                        <td style={{fontSize: '0.8rem', color: '#64748b'}}>
                          {new Date(t.date).toLocaleDateString('pt-PT')}
                        </td>
                        <td className={`amount-display ${t.type === 'entrada' ? 'text-success' : 'text-danger'}`} style={{fontSize: '1rem'}}>
                          {t.type === 'entrada' ? '+' : '-'} {formatCurrency(t.amount)}
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-icon" onClick={() => startEdit(t)} title="Editar"><Edit2 size={14}/></button>
                            <button className="btn-icon" onClick={() => deleteTransaction(t.id)} title="Eliminar"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                          Nenhum registo encontrado para este mês.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;