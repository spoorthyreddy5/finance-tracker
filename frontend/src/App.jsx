import { useEffect, useState, useMemo } from 'react';
import api from './api';
import {
  Sprout, Wallet, CreditCard, PiggyBank, Target, BarChart2,
  PieChart as PieIcon, LineChart as LineIcon, CheckCircle2,
  Plus, Edit2, Trash2, LogOut, ArrowLeft, ArrowLeftRight, Search, Bell,
  Calendar, Check, User, Mail, Lock, Eye, EyeOff, Download,
  Sparkles, ChevronRight, X, DollarSign, ArrowUpRight, ArrowDownRight,
  TrendingUp, TrendingDown, Layers
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const CATEGORIES = [
  { name: 'Housing', color: '#3b82f6', bg: '#eff6ff', icon: '🏠' },
  { name: 'Food', color: '#f97316', bg: '#fff7ed', icon: '🍔' },
  { name: 'Transportation', color: '#06b6d4', bg: '#ecfeff', icon: '🚗' },
  { name: 'Utilities', color: '#8b5cf6', bg: '#f5f3ff', icon: '💡' },
  { name: 'Entertainment', color: '#ec4899', bg: '#fdf2f8', icon: '🎬' },
  { name: 'Healthcare', color: '#10b981', bg: '#ecfdf5', icon: '🏥' },
  { name: 'Education', color: '#6366f1', bg: '#eef2ff', icon: '📚' },
  { name: 'Shopping', color: '#eab308', bg: '#fefce8', icon: '🛍️' },
  { name: 'Salary', color: '#16a34a', bg: '#f0fdf4', icon: '💵' },
  { name: 'Freelance', color: '#0d9488', bg: '#f0fdfa', icon: '💻' },
  { name: 'Savings', color: '#2563eb', bg: '#eff6ff', icon: '🏦' },
  { name: 'Other', color: '#64748b', bg: '#f8fafc', icon: '📦' }
];

const DONUT_COLORS = ['#3b82f6', '#f97316', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#eab308', '#64748b'];

const todayStr = () => new Date().toISOString().slice(0, 10);

const AUTH_SLIDES = [
  {
    title: 'Take Control of Your Finances',
    sub: 'Track. Plan. Save. Achieve.',
    svg: (
      <svg viewBox="0 0 200 200" width="200" height="200">
        <ellipse cx="100" cy="180" rx="70" ry="12" fill="#d1fae5" />
        <g transform="translate(60, 100)">
          <ellipse cx="20" cy="50" rx="20" ry="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <rect x="0" y="30" width="40" height="20" fill="#f59e0b" />
          <ellipse cx="20" cy="30" rx="20" ry="8" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        </g>
        <g transform="translate(95, 80)">
          <ellipse cx="25" cy="70" rx="25" ry="10" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <rect x="0" y="45" width="50" height="25" fill="#f59e0b" />
          <ellipse cx="25" cy="45" rx="25" ry="10" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        </g>
        <path d="M100 120 Q 95 60 80 40 Q 115 50 100 120 Z" fill="#10b981" />
        <path d="M100 100 Q 110 50 135 45 Q 115 75 100 100 Z" fill="#34d399" />
        <path d="M100 120 Q 102 70 100 30" stroke="#059669" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="30" r="10" fill="#10b981" />
      </svg>
    )
  },
  {
    title: 'Smart Budgeting & Daily Goals',
    sub: 'Never overspend. Stay on track every month.',
    svg: (
      <svg viewBox="0 0 200 200" width="200" height="200">
        <ellipse cx="100" cy="175" rx="70" ry="12" fill="#d1fae5" />
        <rect x="50" y="80" width="100" height="70" rx="14" fill="#059669" />
        <rect x="45" y="70" width="110" height="40" rx="10" fill="#10b981" />
        <circle cx="130" cy="115" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <ellipse cx="40" cy="150" rx="18" ry="8" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <ellipse cx="40" cy="140" rx="18" ry="8" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <ellipse cx="40" cy="130" rx="18" ry="8" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
        <path d="M140 70 Q 155 35 175 40 Q 160 65 140 70 Z" fill="#34d399" />
        <path d="M135 60 Q 140 25 155 20 Q 145 45 135 60 Z" fill="#10b981" />
      </svg>
    )
  },
  {
    title: 'Achieve Financial Freedom',
    sub: 'Watch your savings grow and reach your milestones.',
    svg: (
      <svg viewBox="0 0 200 200" width="200" height="200">
        <ellipse cx="100" cy="175" rx="70" ry="12" fill="#d1fae5" />
        <circle cx="100" cy="95" r="50" fill="#10b981" opacity="0.15" />
        <circle cx="100" cy="95" r="38" fill="#10b981" opacity="0.3" />
        <circle cx="100" cy="95" r="26" fill="#10b981" />
        <circle cx="100" cy="95" r="14" fill="#ffffff" />
        <circle cx="100" cy="95" r="6" fill="#ef4444" />
        <path d="M100 95 L140 55" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <polygon points="140,55 145,65 135,60" fill="#f59e0b" />
      </svg>
    )
  }
];

function AuthVisualCarousel({ slideIndex, setSlideIndex }) {
  return (
    <div className="auth-split-visual">
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {AUTH_SLIDES.map((slide, idx) => (
            <div className="carousel-slide" key={idx}>
              <div className="auth-illustration-box">
                {slide.svg}
              </div>
              <h3 className="auth-visual-title">{slide.title}</h3>
              <p className="auth-visual-sub">{slide.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-carousel-dots">
        {AUTH_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`carousel-dot ${slideIndex === idx ? 'active' : ''}`}
            onClick={() => setSlideIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('landing'); // 'landing', 'login', 'register'
  const [slideIndex, setSlideIndex] = useState(0);
  const [page, setPage] = useState('dashboard'); // 'dashboard', 'transactions', 'add-tx', 'budgets', 'goals', 'analytics', 'profile'
  
  // Auth Form State
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Data States
  const [summary, setSummary] = useState(null);
  const [tx, setTx] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [currency, setCurrency] = useState('$');

  // Filter States for Transactions
  const [searchTx, setSearchTx] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // Modals & Sub-forms
  const [modal, setModal] = useState(''); // 'budget', 'goal', 'deposit'
  const [editTxItem, setEditTxItem] = useState(null);
  const [editBudgetItem, setEditBudgetItem] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Forms
  const [txForm, setTxForm] = useState({ type: 'EXPENSE', amount: '', category: 'Food', description: '', transactionDate: todayStr() });
  const [budgetForm, setBudgetForm] = useState({ category: 'Food', month: new Date().getMonth() + 1, year: new Date().getFullYear(), limitAmount: '' });
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '', currentAmount: '0', deadline: '' });
  const [depositForm, setDepositForm] = useState({ amount: '', note: '', createTransaction: true });

  // Profile Form
  const [profileForm, setProfileForm] = useState({ name: '', password: '', confirmPassword: '' });

  const formatMoney = (n) => {
    const num = Number(n || 0);
    if (currency === '₹') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  async function loadData() {
    try {
      const [sRes, tRes, bRes, gRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/transactions'),
        api.get('/budgets'),
        api.get('/goals')
      ]);
      setSummary(sRes.data);
      setTx(tRes.data || []);
      setBudgets(bRes.data || []);
      setGoals(gRes.data || []);
      setErr('');
    } catch (e) {
      console.warn('Dashboard data fetch note:', e?.message);
    }
  }

  useEffect(() => {
    api.get('/auth/me').then(r => {
      if (r.data && r.data.email) {
        setUser(r.data);
        setProfileForm({ name: r.data.name || '', password: '', confirmPassword: '' });
      }
    }).catch(() => {
      setUser(null);
    });
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
      setProfileForm({ name: user.name || '', password: '', confirmPassword: '' });
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % AUTH_SLIDES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [slideIndex]);

  // Auth Handling
  async function handleLogin(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await api.post('/auth/login', { email: authForm.email, password: authForm.password });
      const me = await api.get('/auth/me');
      setUser(me.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (authForm.password !== authForm.confirmPassword) {
      setErr('Passwords do not match.');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      await api.post('/auth/register', { name: authForm.name, email: authForm.email, password: authForm.password });
      await api.post('/auth/login', { email: authForm.email, password: authForm.password });
      const me = await api.get('/auth/me');
      setUser(me.data);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to create account.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      setAuthForm({ name: '', email: '', password: '', confirmPassword: '' });
      setAuthView('login');
      setPage('dashboard');
    }
  }

  // Transaction Save
  async function saveTx(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...txForm, amount: Number(txForm.amount) };
      if (editTxItem) {
        await api.put(`/transactions/${editTxItem.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      setEditTxItem(null);
      setPage('transactions');
      await loadData();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to save transaction');
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(url) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(url);
      await loadData();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to delete');
    }
  }

  // Budget Save
  async function saveBudget(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        category: budgetForm.category,
        monthValue: Number(budgetForm.month),
        yearValue: Number(budgetForm.year),
        limitAmount: Number(budgetForm.limitAmount)
      };
      if (editBudgetItem) {
        await api.put(`/budgets/${editBudgetItem.id}`, payload);
      } else {
        await api.post('/budgets', payload);
      }
      setModal('');
      setEditBudgetItem(null);
      await loadData();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to save budget');
    } finally {
      setBusy(false);
    }
  }

  // Goal Save
  async function saveGoal(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/goals', {
        name: goalForm.name,
        targetAmount: Number(goalForm.targetAmount),
        currentAmount: Number(goalForm.currentAmount || 0),
        deadline: goalForm.deadline || null
      });
      setModal('');
      await loadData();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to create goal');
    } finally {
      setBusy(false);
    }
  }

  // Deposit to Goal
  async function handleDeposit(e) {
    e.preventDefault();
    if (!selectedGoal) return;
    setBusy(true);
    try {
      await api.post(`/goals/${selectedGoal.id}/deposit`, {
        amount: Number(depositForm.amount),
        note: depositForm.note,
        createTransaction: depositForm.createTransaction
      });
      setModal('');
      setSelectedGoal(null);
      await loadData();
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to deposit savings to goal');
    } finally {
      setBusy(false);
    }
  }

  // Profile Update
  async function handleUpdateProfile(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const payload = { name: profileForm.name, password: profileForm.password || null };
      const res = await api.put('/auth/profile', payload);
      setUser(res.data);
      alert('Profile updated successfully!');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setBusy(false);
    }
  }

  // Seed demo data matching reference image
  async function seedDemoData() {
    setBusy(true);
    try {
      const currMonth = new Date().getMonth() + 1;
      const currYear = new Date().getFullYear();
      
      const demoTxs = [
        { type: 'INCOME', amount: 4500, category: 'Salary', description: 'Salary', transactionDate: todayStr() },
        { type: 'EXPENSE', amount: 1120, category: 'Housing', description: 'Grocery Store', transactionDate: todayStr() },
        { type: 'EXPENSE', amount: 640, category: 'Food', description: 'Electricity Bill', transactionDate: todayStr() },
        { type: 'EXPENSE', amount: 480, category: 'Transportation', description: 'Uber Ride', transactionDate: todayStr() },
        { type: 'EXPENSE', amount: 320, category: 'Utilities', description: 'Movie Tickets', transactionDate: todayStr() },
        { type: 'EXPENSE', amount: 320, category: 'Entertainment', description: 'Freelance Work', transactionDate: todayStr() },
        { type: 'EXPENSE', amount: 320, category: 'Other', description: 'Restaurant', transactionDate: todayStr() }
      ];
      for (const t of demoTxs) await api.post('/transactions', t);

      await api.post('/budgets', { category: 'Housing', monthValue: currMonth, yearValue: currYear, limitAmount: 1500 });
      await api.post('/budgets', { category: 'Food', monthValue: currMonth, yearValue: currYear, limitAmount: 800 });
      await api.post('/budgets', { category: 'Transportation', monthValue: currMonth, yearValue: currYear, limitAmount: 500 });
      await api.post('/budgets', { category: 'Utilities', monthValue: currMonth, yearValue: currYear, limitAmount: 400 });
      const deadlineFuture = (daysAhead) => {
        const d = new Date();
        d.setDate(d.getDate() + daysAhead);
        return d.toISOString().slice(0, 10);
      };
      await api.post('/goals', { name: 'New Laptop', targetAmount: 1500, currentAmount: 1200, deadline: deadlineFuture(75) });
      await api.post('/goals', { name: 'Vacation Trip', targetAmount: 1500, currentAmount: 800, deadline: deadlineFuture(45) });
      await api.post('/goals', { name: 'Emergency Fund', targetAmount: 1000, currentAmount: 500, deadline: deadlineFuture(120) });

      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  // Filtered Transactions
  const filteredTx = useMemo(() => {
    return (tx || []).filter(t => {
      const matchSearch = (t.category + ' ' + (t.description || '') + ' ' + t.type).toLowerCase().includes(searchTx.toLowerCase());
      const matchType = filterType === 'ALL' || t.type === filterType;
      const matchCat = filterCategory === 'ALL' || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    });
  }, [tx, searchTx, filterType, filterCategory]);

  const primaryGoal = (goals && goals.length > 0) ? goals[0] : null;

  const spendingCategories = useMemo(() => {
    if (!summary || !summary.categoryBreakdown) return [];
    const maxVal = Math.max(...summary.categoryBreakdown.map(c => Number(c.total || 0)), 1);
    return summary.categoryBreakdown.map(c => {
      const catConfig = CATEGORIES.find(k => k.name.toLowerCase() === c.category.toLowerCase()) || { color: '#64748b', icon: '📦' };
      const budgetMatch = (budgets || []).find(b => b.category.toLowerCase() === c.category.toLowerCase());
      return {
        name: c.category,
        total: Number(c.total),
        percentage: c.percentage,
        color: catConfig.color,
        icon: catConfig.icon,
        fillPct: Math.min(100, Math.round((Number(c.total) / maxVal) * 100)),
        budgetLimit: budgetMatch ? Number(budgetMatch.limitAmount) : null
      };
    });
  }, [summary, budgets]);

  // =========================================================================
  // UNAUTHENTICATED VIEWS (Screens 1, 2, 3)
  // =========================================================================
  if (!user) {
    // 2. REGISTER PAGE (Screen 2)
    if (authView === 'register') {
      return (
        <div className="auth-split-wrapper">
          <div className="auth-split-form">
            <div className="auth-split-brand" onClick={() => setAuthView('landing')}>
              <Sprout size={28} color="#10b981" />
              <span>FinanceTracker</span>
            </div>
            <h2 className="auth-split-title">Create Your Account</h2>
            <p className="auth-split-sub">Join us and start managing your finances</p>

            {err && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>{err}</div>}

            <form onSubmit={handleRegister}>
              <div className="auth-input-group">
                <label className="auth-input-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input required className="auth-input" placeholder="Enter your full name" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input required type="email" className="auth-input" placeholder="Enter your email" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input required minLength="8" type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="Enter your password" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input required minLength="8" type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="Confirm your password" value={authForm.confirmPassword} onChange={e => setAuthForm({ ...authForm, confirmPassword: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={busy}>
                {busy ? 'Please wait…' : 'Sign Up'}
              </button>
            </form>

            <p className="auth-split-footer">
              Already have an account?{' '}
              <button className="link-btn" onClick={() => { setAuthForm({ name: '', email: '', password: '', confirmPassword: '' }); setAuthView('login'); setErr(''); }}>
                Login
              </button>
            </p>
          </div>

          <AuthVisualCarousel slideIndex={slideIndex} setSlideIndex={setSlideIndex} />
        </div>
      );
    }

    // 3. LOGIN PAGE (Screen 3)
    if (authView === 'login') {
      return (
        <div className="auth-split-wrapper">
          <div className="auth-split-form">
            <div className="auth-split-brand" onClick={() => setAuthView('landing')}>
              <Sprout size={28} color="#10b981" />
              <span>FinanceTracker</span>
            </div>
            <h2 className="auth-split-title">Welcome Back</h2>
            <p className="auth-split-sub">Login to continue to your account</p>

            {err && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>{err}</div>}

            <form onSubmit={handleLogin}>
              <div className="auth-input-group">
                <label className="auth-input-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input required type="email" className="auth-input" placeholder="Enter your email" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} />
                </div>
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label">Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input required type={showPassword ? 'text' : 'password'} className="auth-input" placeholder="Enter your password" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', color: '#94a3b8' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-remember-row">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="link-btn" onClick={(e) => { e.preventDefault(); alert('Please ask your administrator or re-register.'); }}>Forgot Password?</a>
              </div>

              <button type="submit" className="btn-auth-submit" disabled={busy}>
                {busy ? 'Please wait…' : 'Login'}
              </button>
            </form>

            <p className="auth-split-footer">
              Don't have an account?{' '}
              <button className="link-btn" onClick={() => { setAuthForm({ name: '', email: '', password: '', confirmPassword: '' }); setAuthView('register'); setErr(''); }}>
                Sign Up
              </button>
            </p>
          </div>

          <AuthVisualCarousel slideIndex={slideIndex} setSlideIndex={setSlideIndex} />
        </div>
      );
    }

    // 1. DEFAULT: LANDING PAGE (Screen 1)
    return (
      <div className="landing-shell">
        <header className="landing-nav">
          <div className="landing-brand">
            <Sprout size={28} color="#10b981" />
            <span>FinanceTracker</span>
          </div>
          <div className="landing-links">
            <button
              type="button"
              className="landing-link"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Features
            </button>
            <button
              type="button"
              className="landing-link"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              About
            </button>
            <button
              type="button"
              className="landing-link"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact
            </button>
          </div>
          <div className="landing-auth-btns">
            <button className="btn-landing-login" onClick={() => { setAuthForm({ name: '', email: '', password: '', confirmPassword: '' }); setAuthView('login'); }}>Login</button>
            <button className="btn-landing-signup" onClick={() => { setAuthForm({ name: '', email: '', password: '', confirmPassword: '' }); setAuthView('register'); }}>Sign Up</button>
          </div>
        </header>

        <main className="landing-hero">
          <div className="hero-left">
            <h1 className="hero-title">
              Track Your <br />
              Money, <br />
              <span className="hero-title-accent">Build Your Future</span>
            </h1>
            <p className="hero-sub">
              A simple and smart way to manage your income, expenses, budgets, and savings goals.
            </p>
            <div className="hero-actions">
              <button className="btn-hero-start" onClick={() => { setAuthForm({ name: '', email: '', password: '', confirmPassword: '' }); setAuthView('register'); }}>Get Started</button>
              <button className="btn-hero-learn" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Learn More</button>
            </div>
          </div>

          <div className="hero-right">
            <div className="device-mockup">
              <div className="device-bar">
                <span className="device-dot"></span>
                <span className="device-dot"></span>
                <span className="device-dot"></span>
              </div>
              <div className="device-screen">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ background: '#f0fdf4', padding: '8px', borderRadius: '8px', fontSize: '10px' }}>
                    <b>Income</b><div style={{ color: '#16a34a', fontWeight: 800 }}>$4,500</div>
                  </div>
                  <div style={{ background: '#fff1f2', padding: '8px', borderRadius: '8px', fontSize: '10px' }}>
                    <b>Expense</b><div style={{ color: '#e11d48', fontWeight: 800 }}>$3,200</div>
                  </div>
                  <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', fontSize: '10px' }}>
                    <b>Savings</b><div style={{ color: '#2563eb', fontWeight: 800 }}>$1,300</div>
                  </div>
                  <div style={{ background: '#faf5ff', padding: '8px', borderRadius: '8px', fontSize: '10px' }}>
                    <b>Rate</b><div style={{ color: '#9333ea', fontWeight: 800 }}>28.9%</div>
                  </div>
                </div>
                <div style={{ height: '140px', background: '#ffffff', borderRadius: '10px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '12px solid #10b981', borderTopColor: '#3b82f6', borderRightColor: '#f97316' }}></div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section className="hero-features-bar" id="features">
          <div className="feature-pill-card">
            <div className="feature-pill-icon"><Wallet size={20} /></div>
            <span className="feature-pill-title">Track Income & Expenses</span>
          </div>
          <div className="feature-pill-card">
            <div className="feature-pill-icon"><BarChart2 size={20} /></div>
            <span className="feature-pill-title">Set Budgets</span>
          </div>
          <div className="feature-pill-card">
            <div className="feature-pill-icon"><Target size={20} /></div>
            <span className="feature-pill-title">Achieve Goals</span>
          </div>
          <div className="feature-pill-card">
            <div className="feature-pill-icon"><PieIcon size={20} /></div>
            <span className="feature-pill-title">Visual Insights</span>
          </div>
        </section>

        <section className="landing-section" id="about">
          <div className="landing-section-badge">ABOUT FINANCETRACKER</div>
          <h2 className="landing-section-title">Designed for Complete Financial Peace of Mind</h2>
          <p className="landing-section-sub">
            FinanceTracker empowers you to make smarter financial decisions every day with automated budget tracking, personalized savings targets, and interactive analytics.
          </p>
          <div className="about-cards-grid">
            <div className="about-card">
              <div className="about-card-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>🌱</div>
              <h3>100% Private & Secure</h3>
              <p>Your financial records are strictly confidential and encrypted with enterprise-grade protection.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>⚡</div>
              <h3>Real-Time Budget Sync</h3>
              <p>Expenses are instantly calculated against your monthly category limits so you never overspend.</p>
            </div>
            <div className="about-card">
              <div className="about-card-icon" style={{ background: '#faf5ff', color: '#8b5cf6' }}>🎯</div>
              <h3>Target-Driven Savings</h3>
              <p>Track your dream milestones and watch your emergency fund grow month over month.</p>
            </div>
          </div>
        </section>

        <section className="landing-section landing-contact-section" id="contact">
          <div className="landing-section-badge">GET IN TOUCH</div>
          <h2 className="landing-section-title">We're Here to Help</h2>
          <p className="landing-section-sub">
            Have questions, feedback, or need assistance? Reach out to our team anytime.
          </p>
          <div className="contact-box">
            <div className="contact-details">
              <div className="contact-item">
                <Mail size={18} color="#10b981" />
                <span>support@financetracker.io</span>
              </div>
              <div className="contact-item">
                <Bell size={18} color="#10b981" />
                <span>24/7 Dedicated Support Assistance</span>
              </div>
            </div>
            <div className="contact-action">
              <button className="btn-hero-start" onClick={() => setAuthView('register')}>
                Create Free Account
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED APP SHELL (Screens 4 - 10)
  // =========================================================================
  const currDateGreeting = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const userInitials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JD';

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR (Matching Screens 4-10) */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <Sprout size={24} color="#10b981" />
          <span>FinanceTracker</span>
        </div>

        <nav className="sidebar-nav">
          <button className={`sidebar-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>
            <BarChart2 size={18} /> Dashboard
          </button>
          <button className={`sidebar-item ${page === 'transactions' || page === 'add-tx' ? 'active' : ''}`} onClick={() => setPage('transactions')}>
            <ArrowLeftRight size={18} /> Transactions
          </button>
          <button className={`sidebar-item ${page === 'budgets' ? 'active' : ''}`} onClick={() => setPage('budgets')}>
            <Wallet size={18} /> Budgets
          </button>
          <button className={`sidebar-item ${page === 'goals' ? 'active' : ''}`} onClick={() => setPage('goals')}>
            <Target size={18} /> Savings Goals
          </button>
          <button className={`sidebar-item ${page === 'analytics' ? 'active' : ''}`} onClick={() => setPage('analytics')}>
            <PieIcon size={18} /> Analytics
          </button>
          <button className={`sidebar-item ${page === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')}>
            <User size={18} /> Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT RIGHT OF SIDEBAR */}
      <div className="app-main">
        {/* TOPBAR */}
        <header className="app-topbar">
          <div className="topbar-greeting">
            <span className="greeting-text">Good morning, {user?.name || 'User'}! 👋</span>
            <span className="greeting-date">{currDateGreeting}</span>
          </div>

          <div className="topbar-right">
            {/* Currency Pill */}
            <div className="currency-pill">
              <button className={currency === '$' ? 'active' : ''} onClick={() => setCurrency('$')}>$</button>
              <button className={currency === '₹' ? 'active' : ''} onClick={() => setCurrency('₹')}>₹</button>
            </div>

            {/* User Dropdown */}
            <div className="topbar-user" onClick={() => setPage('profile')}>
              <div className="topbar-avatar">{userInitials}</div>
              <span className="topbar-username">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="page-container">
          {err && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{err}</span>
              <button onClick={() => setErr('')}><X size={16} /></button>
            </div>
          )}

          {/* =========================================================================
             4. DASHBOARD (Screen 4)
             ========================================================================= */}
          {page === 'dashboard' && (
            <>
              {/* Quick Demo Seed helper if account is empty */}
              {(!tx || tx.length === 0) && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px 20px', borderRadius: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="#059669" />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>
                      Welcome! Click to populate sample data matching the exact FinanceTracker reference design:
                    </span>
                  </div>
                  <button className="btn-green-add" onClick={seedDemoData} disabled={busy}>
                    Load Exact Demo Data
                  </button>
                </div>
              )}

              {/* Top 4 KPI Cards */}
              <div className="kpi-row">
                <div className="kpi-box green">
                  <div className="kpi-top">
                    <div className="kpi-icon"><Wallet size={18} /></div>
                    <span className="kpi-lbl">Total Income</span>
                  </div>
                  <div className="kpi-num">{formatMoney(summary?.income)}</div>
                  {summary?.availableBalance != null ? (
                    <div className="kpi-pill up-green" title="Income after deducting expenses and goal savings">
                      Avail: {formatMoney(summary.availableBalance)}
                    </div>
                  ) : (
                    <div className="kpi-pill up-green">▲ +12% vs last month</div>
                  )}
                </div>

                <div className="kpi-box red">
                  <div className="kpi-top">
                    <div className="kpi-icon"><CreditCard size={18} /></div>
                    <span className="kpi-lbl">Total Expenses</span>
                  </div>
                  <div className="kpi-num">{formatMoney(summary?.expenses)}</div>
                  <div className="kpi-pill up-red">▲ +8% vs last month</div>
                </div>

                <div className="kpi-box blue">
                  <div className="kpi-top">
                    <div className="kpi-icon"><PiggyBank size={18} /></div>
                    <span className="kpi-lbl">Savings</span>
                  </div>
                  <div className="kpi-num">{formatMoney(summary?.savings)}</div>
                  <div className="kpi-pill up-green">▲ +20% vs last month</div>
                </div>

                <div className="kpi-box purple">
                  <div className="kpi-top">
                    <div className="kpi-icon"><Target size={18} /></div>
                    <span className="kpi-lbl">Savings Rate</span>
                  </div>
                  <div className="kpi-num">{Number(summary?.savingsRate != null ? summary.savingsRate : 28.9).toFixed(1)}%</div>
                  <div className="kpi-pill up-green">▲ +5.6% vs last month</div>
                </div>
              </div>

              {/* Middle 3 Columns */}
              <div className="dashboard-3col">
                {/* 1. Income vs Expenses Bar Chart */}
                <div className="dash-panel">
                  <div className="panel-header">
                    <span className="panel-title">Income vs Expenses</span>
                  </div>
                  <div style={{ height: '210px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={summary?.monthlyTotals || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                        <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                        <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '6px', fontSize: '11px', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
                      <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></span> Income
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                      <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span> Expenses
                    </span>
                  </div>
                </div>

                {/* 2. Expense Breakdown Donut Chart */}
                <div className="dash-panel">
                  <div className="panel-header">
                    <span className="panel-title">Expense Breakdown</span>
                  </div>
                  {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
                    <>
                      <div className="donut-center-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={summary.categoryBreakdown}
                              dataKey="total"
                              nameKey="category"
                              innerRadius={55}
                              outerRadius={80}
                              paddingAngle={3}
                            >
                              {summary.categoryBreakdown.map((entry, index) => {
                                const catCfg = CATEGORIES.find(k => k.name.toLowerCase() === entry.category.toLowerCase());
                                return <Cell key={`cell-${index}`} fill={catCfg ? catCfg.color : DONUT_COLORS[index % DONUT_COLORS.length]} />;
                              })}
                            </Pie>
                            <Tooltip formatter={(v) => formatMoney(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="donut-inner-label">
                          <div className="donut-inner-val">{formatMoney(summary.expenses)}</div>
                          <div className="donut-inner-sub">Total Expenses</div>
                        </div>
                      </div>

                      <div className="donut-legend-table">
                        {summary.categoryBreakdown.slice(0, 5).map((c, i) => {
                          const catCfg = CATEGORIES.find(k => k.name.toLowerCase() === c.category.toLowerCase());
                          return (
                            <div key={c.category} className="donut-legend-row">
                              <div>
                                <span className="donut-dot" style={{ background: catCfg ? catCfg.color : DONUT_COLORS[i % DONUT_COLORS.length] }}></span>
                                <span>{c.category}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <b>{c.percentage}%</b>
                                <span style={{ color: '#64748b' }}>{formatMoney(c.total)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div style={{ height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
                      No expenses recorded yet.
                    </div>
                  )}
                </div>

                {/* 3. Savings Goal Gauge */}
                <div className="dash-panel">
                  <div className="panel-header">
                    <span className="panel-title">Savings Goal</span>
                    <button className="panel-link" onClick={() => setPage('goals')}>Manage</button>
                  </div>
                  {primaryGoal ? (
                    <div className="gauge-wrapper">
                      <div className="gauge-svg-box">
                        <svg viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                          <circle
                            cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={(2 * Math.PI * 40) * (1 - (Number(primaryGoal.progressPercent || 0)) / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="gauge-center-text">
                          <span className="gauge-pct">{Math.round(Number(primaryGoal.progressPercent || 0))}%</span>
                          <span className="gauge-sub">of goal</span>
                        </div>
                      </div>

                      <div className="gauge-amount-line">
                        {formatMoney(primaryGoal.currentAmount)} / {formatMoney(primaryGoal.targetAmount)}
                      </div>

                      <div className="gauge-banner">
                        🎯 Great progress! Keep going to reach your goal.
                      </div>

                      <button
                        className="btn-deposit-gauge"
                        onClick={() => {
                          setSelectedGoal(primaryGoal);
                          setDepositForm({ amount: '', note: '', createTransaction: true });
                          setModal('deposit');
                        }}
                      >
                        <Plus size={14} /> Deposit Savings
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '30px 10px', textAlign: 'center', color: '#94a3b8' }}>
                      <p style={{ marginBottom: '14px', fontSize: '13px' }}>No active savings goals yet.</p>
                      <button className="btn-green-add" onClick={() => setModal('goal')}>
                        <Plus size={15} /> Create Goal
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom 3 Columns */}
              <div className="dashboard-3col">
                {/* 1. Recent Transactions */}
                <div className="dash-panel">
                  <div className="panel-header">
                    <span className="panel-title">Recent Transactions</span>
                    <button className="panel-link" onClick={() => setPage('transactions')}>View all</button>
                  </div>
                  <table className="data-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '8px 10px' }}>Date</th>
                        <th style={{ padding: '8px 10px' }}>Description</th>
                        <th style={{ padding: '8px 10px' }}>Category</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(tx || []).slice(0, 5).map(t => {
                        const catCfg = CATEGORIES.find(k => k.name.toLowerCase() === t.category.toLowerCase()) || { color: '#64748b', bg: '#f1f5f9' };
                        return (
                          <tr key={t.id}>
                            <td style={{ padding: '10px', color: '#64748b' }}>{t.transactionDate}</td>
                            <td style={{ padding: '10px', fontWeight: 600 }}>{t.description || t.category}</td>
                            <td style={{ padding: '10px' }}>
                              <span className="pill-cat" style={{ color: catCfg.color, background: catCfg.bg }}>
                                {t.category}
                              </span>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }} className={t.type === 'INCOME' ? 'val-green' : t.type === 'SAVINGS' ? 'val-blue' : 'val-red'}>
                              {t.type === 'INCOME' ? '+' : t.type === 'SAVINGS' ? '🎯 ' : '−'}{formatMoney(t.amount)}
                            </td>
                          </tr>
                        );
                      })}
                      {(!tx || tx.length === 0) && (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No transactions recorded yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 2. Spending by Category */}
                <div className="dash-panel">
                  <div className="panel-header">
                    <span className="panel-title">Spending by Category</span>
                    <button className="panel-link" onClick={() => setPage('budgets')}>Manage</button>
                  </div>
                  <div className="cat-bars">
                    {spendingCategories.slice(0, 6).map(c => (
                      <div key={c.name} className="cat-bar-item">
                        <div className="cat-bar-top">
                          <span className="cat-bar-name">
                            <span>{c.icon}</span> <span>{c.name}</span>
                          </span>
                          <span className="cat-bar-amt">
                            {formatMoney(c.total)}
                            {c.budgetLimit && (
                              <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '4px' }}>
                                / {formatMoney(c.budgetLimit)}
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="cat-bar-track">
                          <div className="cat-bar-fill" style={{ width: `${c.fillPct}%`, background: c.color }} />
                        </div>
                      </div>
                    ))}
                    {spendingCategories.length === 0 && (
                      <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        Add expense transactions to view category spending.
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Quick Tips */}
                <div className="dash-panel tips-container">
                  <div>
                    <div className="panel-header" style={{ marginBottom: '10px' }}>
                      <span className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} color="#10b981" /> Quick Tips
                      </span>
                    </div>
                    <ul className="tips-items">
                      <li className="tip-row">
                        <CheckCircle2 size={16} className="tip-icon" />
                        <span>Track your expenses regularly.</span>
                      </li>
                      <li className="tip-row">
                        <CheckCircle2 size={16} className="tip-icon" />
                        <span>Avoid unnecessary spending.</span>
                      </li>
                      <li className="tip-row">
                        <CheckCircle2 size={16} className="tip-icon" />
                        <span>Build an emergency fund.</span>
                      </li>
                      <li className="tip-row">
                        <CheckCircle2 size={16} className="tip-icon" />
                        <span>Review and adjust your goals monthly.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="tip-handwritten">
                    Better money habits, a brighter future! 🌱
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
             5. TRANSACTIONS PAGE (Screen 5)
             ========================================================================= */}
          {page === 'transactions' && (
            <div>
              <div className="page-top-action-bar">
                <div className="page-heading-block">
                  <h2>Transactions</h2>
                  <p>View and manage your income and expenses.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-form-cancel" onClick={() => {
                    const rows = [['Date', 'Type', 'Category', 'Description', 'Amount'], ...tx.map(t => [t.transactionDate, t.type, t.category, t.description, t.amount])];
                    const blob = new Blob([rows.map(r => r.map(v => '"' + String(v ?? '').replaceAll('"', '""') + '"').join(',')).join('\n')], { type: 'text/csv' });
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transactions.csv'; a.click();
                  }}>
                    <Download size={15} style={{ marginRight: '6px' }} /> Export CSV
                  </button>
                  <button className="btn-green-add" onClick={() => {
                    setEditTxItem(null);
                    setTxForm({ type: 'EXPENSE', amount: '', category: 'Food', description: '', transactionDate: todayStr() });
                    setPage('add-tx');
                  }}>
                    <Plus size={16} /> Add Transaction
                  </button>
                </div>
              </div>

              <div className="table-panel">
                <div className="table-filters-row">
                  <select className="table-filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="ALL">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>

                  <select className="table-filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="ALL">All Categories</option>
                    {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>

                  <input
                    className="table-search-input"
                    placeholder="Search transactions…"
                    value={searchTx}
                    onChange={e => setSearchTx(e.target.value)}
                  />
                </div>

                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.map(t => {
                      const catCfg = CATEGORIES.find(k => k.name.toLowerCase() === t.category.toLowerCase()) || { color: '#64748b', bg: '#f1f5f9' };
                      return (
                        <tr key={t.id}>
                          <td style={{ color: '#64748b' }}>{t.transactionDate}</td>
                          <td style={{ fontWeight: 700, color: '#1e293b' }}>{t.description || t.category}</td>
                          <td>
                            <span className="pill-cat" style={{ color: catCfg.color, background: catCfg.bg }}>
                              {t.category}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: t.type === 'INCOME' ? '#16a34a' : t.type === 'SAVINGS' ? '#0284c7' : '#e11d48' }}>
                            {t.type === 'INCOME' ? 'Income' : t.type === 'SAVINGS' ? 'Savings' : 'Expense'}
                          </td>
                          <td style={{ textAlign: 'right' }} className={t.type === 'INCOME' ? 'val-green' : t.type === 'SAVINGS' ? 'val-blue' : 'val-red'}>
                            {t.type === 'INCOME' ? '+' : t.type === 'SAVINGS' ? '🎯 ' : '−'}{formatMoney(t.amount)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="action-icon-btn" title="Edit" onClick={() => {
                              setEditTxItem(t);
                              setTxForm({ type: t.type, amount: t.amount, category: t.category, description: t.description, transactionDate: t.transactionDate });
                              setPage('add-tx');
                            }}>
                              <Edit2 size={15} />
                            </button>
                            <button className="action-icon-btn delete" title="Delete" onClick={() => deleteItem(`/transactions/${t.id}`)}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredTx.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
             6. ADD / EDIT TRANSACTION SCREEN (Screen 6)
             ========================================================================= */}
          {page === 'add-tx' && (
            <div>
              <div className="form-card-container">
                <button className="form-card-back" onClick={() => setPage('transactions')}>
                  <ArrowLeft size={20} />
                  <span>{editTxItem ? 'Edit Transaction' : 'Add Transaction'}</span>
                </button>
                <p className="form-card-sub">Record a new income or expense</p>

                <form onSubmit={saveTx}>
                  <div className="input-block">
                    <label>Type</label>
                    <div className="type-toggle-group">
                      <label className="type-radio-label">
                        <input
                          type="radio"
                          name="txType"
                          checked={txForm.type === 'INCOME'}
                          onChange={() => setTxForm({ ...txForm, type: 'INCOME' })}
                        />
                        <span style={{ color: '#16a34a' }}>Income</span>
                      </label>
                      <label className="type-radio-label">
                        <input
                          type="radio"
                          name="txType"
                          checked={txForm.type === 'EXPENSE'}
                          onChange={() => setTxForm({ ...txForm, type: 'EXPENSE' })}
                        />
                        <span style={{ color: '#e11d48' }}>Expense</span>
                      </label>
                    </div>
                  </div>

                  <div className="input-block">
                    <label>Description</label>
                    <input
                      placeholder="Enter description (e.g. Salary, Grocery, Rent)"
                      value={txForm.description}
                      onChange={e => setTxForm({ ...txForm, description: e.target.value })}
                    />
                  </div>

                  <div className="input-block">
                    <label>Amount ({currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="0.00"
                      value={txForm.amount}
                      onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                    />
                  </div>

                  <div className="input-block">
                    <label>Category</label>
                    <select value={txForm.category} onChange={e => setTxForm({ ...txForm, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="input-block">
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={txForm.transactionDate}
                      onChange={e => setTxForm({ ...txForm, transactionDate: e.target.value })}
                    />
                  </div>

                  <div className="form-btns-row">
                    <button type="button" className="btn-form-cancel" onClick={() => setPage('transactions')}>Cancel</button>
                    <button type="submit" className="btn-form-save" disabled={busy}>
                      {busy ? 'Saving…' : 'Save Transaction'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* =========================================================================
             7. BUDGETS PAGE (Screen 7)
             ========================================================================= */}
          {page === 'budgets' && (
            <div>
              <div className="page-top-action-bar">
                <div className="page-heading-block">
                  <h2>Budgets</h2>
                  <p>Set monthly budgets for different categories</p>
                </div>
                <button className="btn-green-add" onClick={() => { setEditBudgetItem(null); setBudgetForm({ category: 'Food', month: new Date().getMonth() + 1, year: new Date().getFullYear(), limitAmount: '' }); setModal('budget'); }}>
                  <Plus size={16} /> Add Budget
                </button>
              </div>

              <div className="table-panel">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Monthly Limit</th>
                      <th>Spent</th>
                      <th>Remaining</th>
                      <th style={{ width: '25%' }}>Progress</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(budgets || []).map(b => {
                      const catCfg = CATEGORIES.find(k => k.name.toLowerCase() === b.category.toLowerCase()) || { color: '#64748b', icon: '📦' };
                      const pct = Math.min(100, b.progressPercent || 0);
                      const isOver = b.status === 'EXCEEDED';

                      return (
                        <tr key={b.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                              <span>{catCfg.icon}</span>
                              <span>{b.category}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>{formatMoney(b.limitAmount)}</td>
                          <td style={{ fontWeight: 700, color: isOver ? '#e11d48' : '#1e293b' }}>{formatMoney(b.spent)}</td>
                          <td style={{ fontWeight: 700, color: isOver ? '#e11d48' : '#16a34a' }}>
                            {isOver ? `-${formatMoney(Math.abs(b.remaining))}` : formatMoney(b.remaining)}
                          </td>
                          <td>
                            <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: isOver ? '#ef4444' : (pct > 80 ? '#f59e0b' : '#10b981'), borderRadius: '6px' }} />
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="action-icon-btn" title="Edit" onClick={() => {
                              setEditBudgetItem(b);
                              setBudgetForm({ category: b.category, month: b.month, year: b.year, limitAmount: b.limitAmount });
                              setModal('budget');
                            }}>
                              <Edit2 size={15} />
                            </button>
                            <button className="action-icon-btn delete" title="Delete" onClick={() => deleteItem(`/budgets/${b.id}`)}>
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(!budgets || budgets.length === 0) && (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No monthly budgets created yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
             8. SAVINGS GOALS PAGE (Screen 8)
             ========================================================================= */}
          {page === 'goals' && (
            <div>
              <div className="page-top-action-bar">
                <div className="page-heading-block">
                  <h2>Savings Goals</h2>
                  <p>Set and track your financial goals</p>
                </div>
                <button className="btn-green-add" onClick={() => { setGoalForm({ name: '', targetAmount: '', currentAmount: '0', deadline: '' }); setModal('goal'); }}>
                  <Plus size={16} /> Add Goal
                </button>
              </div>

              <div className="goals-list">
                {(goals || []).map(g => {
                  const pct = Math.round(Number(g.progressPercent || 0));

                  return (
                    <div key={g.id} className="goal-horizontal-card">
                      <div className="goal-horiz-left">
                        <div className="goal-horiz-icon">
                          <Target size={24} />
                        </div>
                        <div className="goal-horiz-info">
                          <h4>{g.name}</h4>
                          <span>{g.deadline ? `Target Date: ${g.deadline}` : 'No deadline'}</span>
                        </div>
                      </div>

                      <div className="goal-horiz-mid">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700 }}>
                          <span>{formatMoney(g.currentAmount)} / {formatMoney(g.targetAmount)}</span>
                          <span style={{ color: '#10b981' }}>{pct}%</span>
                        </div>
                        <div className="goal-horiz-track">
                          <div className="goal-horiz-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>

                      <div className="goal-horiz-right">
                        <button
                          className="btn-deposit-gauge"
                          onClick={() => {
                            setSelectedGoal(g);
                            setDepositForm({ amount: '', note: '', createTransaction: true });
                            setModal('deposit');
                          }}
                        >
                          <Plus size={14} /> Deposit
                        </button>
                        <button className="action-icon-btn delete" title="Delete" onClick={() => deleteItem(`/goals/${g.id}`)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {(!goals || goals.length === 0) && (
                  <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px dashed #cbd5e1', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <p style={{ marginBottom: '16px' }}>No savings goals created yet.</p>
                    <button className="btn-green-add" onClick={() => setModal('goal')}>
                      <Plus size={16} /> Create Your First Goal
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
             9. ANALYTICS PAGE (Screen 9)
             ========================================================================= */}
          {page === 'analytics' && (
            <div>
              <div className="page-top-action-bar">
                <div className="page-heading-block">
                  <h2>Analytics</h2>
                  <p>Visualize your financial activity</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select className="table-filter-select">
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              </div>

              <div className="analytics-grid">
                {/* 1. Income vs Expenses Bar Chart */}
                <div className="analytics-card">
                  <span className="panel-title">Income vs Expenses</span>
                  <div className="analytics-chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={summary?.monthlyTotals || []}>
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={v => formatMoney(v)} />
                        <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Expense Breakdown Donut */}
                <div className="analytics-card">
                  <span className="panel-title">Expense Breakdown</span>
                  <div className="analytics-chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={summary?.categoryBreakdown || []}
                          dataKey="total"
                          nameKey="category"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {(summary?.categoryBreakdown || []).map((entry, index) => {
                            const catCfg = CATEGORIES.find(k => k.name.toLowerCase() === entry.category.toLowerCase());
                            return <Cell key={`cell-${index}`} fill={catCfg ? catCfg.color : DONUT_COLORS[index % DONUT_COLORS.length]} />;
                          })}
                        </Pie>
                        <Tooltip formatter={v => formatMoney(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Monthly Trend Line Chart */}
                <div className="analytics-card">
                  <span className="panel-title">Monthly Trend</span>
                  <div className="analytics-chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={summary?.monthlyTotals || []}>
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={v => formatMoney(v)} />
                        <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Category Wise Spending Columns */}
                <div className="analytics-card">
                  <span className="panel-title">Category Wise Spending</span>
                  <div className="analytics-chart-box">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={spendingCategories}>
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={v => formatMoney(v)} />
                        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
             10. PROFILE PAGE (Screen 10)
             ========================================================================= */}
          {page === 'profile' && (
            <div>
              <div className="page-top-action-bar">
                <div className="page-heading-block">
                  <h2>Profile</h2>
                  <p>Manage your account details</p>
                </div>
              </div>

              <div className="profile-card-center">
                <div className="profile-avatar-large">
                  {userInitials}
                </div>
                <button className="btn-change-photo" onClick={() => alert('Photo upload simulated.')}>
                  Change Photo
                </button>

                <form className="profile-form" onSubmit={handleUpdateProfile}>
                  <div className="input-block">
                    <label>Full Name</label>
                    <input
                      required
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>

                  <div className="input-block">
                    <label>Email Address</label>
                    <input
                      disabled
                      value={user?.email || ''}
                      style={{ background: '#f8fafc', color: '#64748b' }}
                    />
                  </div>

                  <div className="input-block">
                    <label>New Password (Leave blank to keep current)</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={profileForm.password}
                      onChange={e => setProfileForm({ ...profileForm, password: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-auth-submit" style={{ marginTop: '16px' }} disabled={busy}>
                    {busy ? 'Saving…' : 'Update Profile'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
         GLOBAL MODALS (Budget, Goal, Deposit)
         ========================================================================= */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal('')}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-box-head">
              <h3>
                {modal === 'budget' && (editBudgetItem ? 'Edit Budget' : 'Add Budget')}
                {modal === 'goal' && 'Create Savings Goal'}
                {modal === 'deposit' && `Deposit Savings to ${selectedGoal?.name}`}
              </h3>
              <button onClick={() => setModal('')}><X size={18} /></button>
            </div>

            {/* Form: Budget */}
            {modal === 'budget' && (
              <form onSubmit={saveBudget}>
                <div className="input-block">
                  <label>Category</label>
                  <select value={budgetForm.category} onChange={e => setBudgetForm({ ...budgetForm, category: e.target.value })}>
                    {CATEGORIES.filter(c => !['Salary', 'Freelance'].includes(c.name)).map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-block">
                  <label>Monthly Limit ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="e.g. 1500"
                    value={budgetForm.limitAmount}
                    onChange={e => setBudgetForm({ ...budgetForm, limitAmount: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-block">
                    <label>Month</label>
                    <input type="number" min="1" max="12" required value={budgetForm.month} onChange={e => setBudgetForm({ ...budgetForm, month: e.target.value })} />
                  </div>
                  <div className="input-block">
                    <label>Year</label>
                    <input type="number" min="2020" max="2035" required value={budgetForm.year} onChange={e => setBudgetForm({ ...budgetForm, year: e.target.value })} />
                  </div>
                </div>
                <div className="form-btns-row">
                  <button type="button" className="btn-form-cancel" onClick={() => setModal('')}>Cancel</button>
                  <button type="submit" className="btn-form-save" disabled={busy}>
                    {busy ? 'Saving…' : (editBudgetItem ? 'Update Budget' : 'Save Budget')}
                  </button>
                </div>
              </form>
            )}

            {/* Form: Goal */}
            {modal === 'goal' && (
              <form onSubmit={saveGoal}>
                <div className="input-block">
                  <label>Goal Name</label>
                  <input required placeholder="e.g. New Laptop, Vacation Trip" value={goalForm.name} onChange={e => setGoalForm({ ...goalForm, name: e.target.value })} />
                </div>
                <div className="input-block">
                  <label>Target Amount ({currency})</label>
                  <input type="number" step="0.01" min="0.01" required placeholder="1500" value={goalForm.targetAmount} onChange={e => setGoalForm({ ...goalForm, targetAmount: e.target.value })} />
                </div>
                <div className="input-block">
                  <label>Initial Amount Saved ({currency})</label>
                  <input type="number" step="0.01" min="0" placeholder="0" value={goalForm.currentAmount} onChange={e => setGoalForm({ ...goalForm, currentAmount: e.target.value })} />
                </div>
                <div className="input-block">
                  <label>Target Deadline (Optional)</label>
                  <input type="date" value={goalForm.deadline} onChange={e => setGoalForm({ ...goalForm, deadline: e.target.value })} />
                </div>
                <div className="form-btns-row">
                  <button type="button" className="btn-form-cancel" onClick={() => setModal('')}>Cancel</button>
                  <button type="submit" className="btn-form-save" disabled={busy}>
                    {busy ? 'Saving…' : 'Save Goal'}
                  </button>
                </div>
              </form>
            )}

            {/* Form: Deposit */}
            {modal === 'deposit' && (
              <form onSubmit={handleDeposit}>
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px', color: '#166534' }}>
                  Target: <b>{formatMoney(selectedGoal?.targetAmount)}</b> | Saved: <b>{formatMoney(selectedGoal?.currentAmount)}</b>
                </div>
                <div className="input-block">
                  <label>Deposit Amount ({currency})</label>
                  <input type="number" step="0.01" min="0.01" required autoFocus placeholder="500" value={depositForm.amount} onChange={e => setDepositForm({ ...depositForm, amount: e.target.value })} />
                </div>
                <div className="input-block">
                  <label>Note (Optional)</label>
                  <input placeholder="e.g. Saved from bonus" value={depositForm.note} onChange={e => setDepositForm({ ...depositForm, note: e.target.value })} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', margin: '14px 0' }}>
                  <input type="checkbox" checked={depositForm.createTransaction} onChange={e => setDepositForm({ ...depositForm, createTransaction: e.target.checked })} />
                  <span>Record as an expense transaction under "Savings"</span>
                </label>
                <div className="form-btns-row">
                  <button type="button" className="btn-form-cancel" onClick={() => setModal('')}>Cancel</button>
                  <button type="submit" className="btn-form-save" disabled={busy}>
                    {busy ? 'Depositing…' : 'Confirm Deposit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
