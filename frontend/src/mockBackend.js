// In-browser mock backend with localStorage persistence
// Simulates Spring Boot REST API for personal finance tracker

const STORAGE_KEYS = {
  USER: 'ft_mock_user',
  TX: 'ft_mock_transactions',
  BUDGETS: 'ft_mock_budgets',
  GOALS: 'ft_mock_goals'
};

const delay = (ms = 40) => new Promise(resolve => setTimeout(resolve, ms));

const todayStr = () => new Date().toISOString().slice(0, 10);

const DEFAULT_USER = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex@financetracker.com'
};

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function generateInitialData() {
  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth(); // 0-indexed

  // Format YYYY-MM-DD helper
  const dateOffset = (monthsAgo, day) => {
    const d = new Date(currYear, currMonth - monthsAgo, day);
    return d.toISOString().slice(0, 10);
  };

  const initialTxs = [
    // Current month
    { id: 1, type: 'INCOME', amount: 4500, category: 'Salary', description: 'Monthly Tech Salary', transactionDate: dateOffset(0, 1) },
    { id: 2, type: 'EXPENSE', amount: 1120, category: 'Housing', description: 'Apartment Rent & Service', transactionDate: dateOffset(0, 3) },
    { id: 3, type: 'EXPENSE', amount: 640, category: 'Food', description: 'Whole Foods Grocery Store', transactionDate: dateOffset(0, 5) },
    { id: 4, type: 'EXPENSE', amount: 480, category: 'Transportation', description: 'Gas & Metro Pass', transactionDate: dateOffset(0, 7) },
    { id: 5, type: 'EXPENSE', amount: 320, category: 'Utilities', description: 'Power, Water & Fiber WiFi', transactionDate: dateOffset(0, 9) },
    { id: 6, type: 'EXPENSE', amount: 320, category: 'Entertainment', description: 'Streaming & Cinema Night', transactionDate: dateOffset(0, 11) },
    { id: 7, type: 'EXPENSE', amount: 320, category: 'Other', description: 'Weekend Shopping & Dining', transactionDate: dateOffset(0, 12) },

    // Previous month (1 month ago)
    { id: 8, type: 'INCOME', amount: 4500, category: 'Salary', description: 'Monthly Tech Salary', transactionDate: dateOffset(1, 1) },
    { id: 9, type: 'EXPENSE', amount: 1120, category: 'Housing', description: 'Apartment Rent', transactionDate: dateOffset(1, 3) },
    { id: 10, type: 'EXPENSE', amount: 580, category: 'Food', description: 'Supermarket Groceries', transactionDate: dateOffset(1, 6) },
    { id: 11, type: 'EXPENSE', amount: 420, category: 'Transportation', description: 'Fuel & Car Maintenance', transactionDate: dateOffset(1, 10) },
    { id: 12, type: 'EXPENSE', amount: 310, category: 'Utilities', description: 'Electricity & Gas Bill', transactionDate: dateOffset(1, 14) },
    { id: 13, type: 'EXPENSE', amount: 280, category: 'Entertainment', description: 'Concert & Restaurant', transactionDate: dateOffset(1, 18) },

    // 2 months ago
    { id: 14, type: 'INCOME', amount: 4300, category: 'Salary', description: 'Monthly Salary', transactionDate: dateOffset(2, 1) },
    { id: 15, type: 'EXPENSE', amount: 1120, category: 'Housing', description: 'Apartment Rent', transactionDate: dateOffset(2, 3) },
    { id: 16, type: 'EXPENSE', amount: 620, category: 'Food', description: 'Groceries & Farmers Market', transactionDate: dateOffset(2, 8) },
    { id: 17, type: 'EXPENSE', amount: 390, category: 'Transportation', description: 'Rideshare & Rail', transactionDate: dateOffset(2, 12) },

    // 3 months ago
    { id: 18, type: 'INCOME', amount: 4300, category: 'Salary', description: 'Monthly Salary', transactionDate: dateOffset(3, 1) },
    { id: 19, type: 'EXPENSE', amount: 1120, category: 'Housing', description: 'Apartment Rent', transactionDate: dateOffset(3, 3) },
    { id: 20, type: 'EXPENSE', amount: 540, category: 'Food', description: 'Supermarket', transactionDate: dateOffset(3, 7) },

    // 4 months ago
    { id: 21, type: 'INCOME', amount: 4200, category: 'Salary', description: 'Monthly Salary', transactionDate: dateOffset(4, 1) },
    { id: 22, type: 'EXPENSE', amount: 1100, category: 'Housing', description: 'Rent', transactionDate: dateOffset(4, 3) },
    { id: 23, type: 'EXPENSE', amount: 510, category: 'Food', description: 'Groceries', transactionDate: dateOffset(4, 8) },

    // 5 months ago
    { id: 24, type: 'INCOME', amount: 4200, category: 'Salary', description: 'Monthly Salary', transactionDate: dateOffset(5, 1) },
    { id: 25, type: 'EXPENSE', amount: 1100, category: 'Housing', description: 'Rent', transactionDate: dateOffset(5, 3) },
    { id: 26, type: 'EXPENSE', amount: 490, category: 'Food', description: 'Groceries', transactionDate: dateOffset(5, 9) }
  ];

  const thisMonthVal = currMonth + 1;
  const initialBudgets = [
    { id: 1, category: 'Housing', month: thisMonthVal, year: currYear, limitAmount: 1500 },
    { id: 2, category: 'Food', month: thisMonthVal, year: currYear, limitAmount: 800 },
    { id: 3, category: 'Transportation', month: thisMonthVal, year: currYear, limitAmount: 500 },
    { id: 4, category: 'Utilities', month: thisMonthVal, year: currYear, limitAmount: 400 },
    { id: 5, category: 'Entertainment', month: thisMonthVal, year: currYear, limitAmount: 400 }
  ];

  // Goals with future deadlines
  const futureDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().slice(0, 10);
  };

  const initialGoals = [
    { id: 1, name: 'New Laptop', targetAmount: 1500, currentAmount: 1200, deadline: futureDate(75) },
    { id: 2, name: 'Vacation Trip', targetAmount: 1500, currentAmount: 800, deadline: futureDate(45) },
    { id: 3, name: 'Emergency Fund', targetAmount: 1000, currentAmount: 500, deadline: futureDate(120) }
  ];

  return { initialTxs, initialBudgets, initialGoals };
}

function ensureInitialized() {
  if (!localStorage.getItem(STORAGE_KEYS.TX)) {
    const { initialTxs, initialBudgets, initialGoals } = generateInitialData();
    setStored(STORAGE_KEYS.TX, initialTxs);
    setStored(STORAGE_KEYS.BUDGETS, initialBudgets);
    setStored(STORAGE_KEYS.GOALS, initialGoals);
  }
}

// Ensure initial demo data is ready
ensureInitialized();

function formatGoal(g) {
  const target = Number(g.targetAmount) > 0 ? Number(g.targetAmount) : 1;
  const current = Number(g.currentAmount) || 0;
  const rawPct = (current * 100) / target;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawPct * 10) / 10));
  const remainingAmount = Math.max(0, target - current);

  let daysLeft = null;
  if (g.deadline) {
    const diffTime = new Date(g.deadline).getTime() - new Date().setHours(0, 0, 0, 0);
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return {
    id: g.id,
    name: g.name,
    targetAmount: target,
    currentAmount: current,
    remainingAmount,
    progressPercent,
    rawPercent: Math.round(rawPct * 10) / 10,
    deadline: g.deadline || '',
    daysLeft,
    isCompleted: current >= target
  };
}

function formatBudget(b, allTxs) {
  const limit = Number(b.limitAmount) || 1;
  const bMonth = Number(b.month || b.monthValue);
  const bYear = Number(b.year || b.yearValue);

  // Compute spent for matching category, month, and year
  const spent = allTxs
    .filter(t => {
      if (t.type !== 'EXPENSE') return false;
      if (!t.category || t.category.trim().toLowerCase() !== b.category.trim().toLowerCase()) return false;
      const d = new Date(t.transactionDate);
      return (d.getMonth() + 1 === bMonth) && (d.getFullYear() === bYear);
    })
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const rawPct = (spent * 100) / limit;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawPct * 10) / 10));
  const remaining = limit - spent;
  const status = spent > limit ? 'EXCEEDED' : (rawPct >= 85 ? 'WARNING' : 'ON_TRACK');

  return {
    id: b.id,
    category: b.category,
    month: bMonth,
    year: bYear,
    limitAmount: limit,
    spent,
    remaining,
    progressPercent,
    rawPercent: Math.round(rawPct * 10) / 10,
    status
  };
}

function computeSummary(allTxs, userGoals) {
  let inAmount = 0;
  let outAmount = 0;
  let savingsTxTotal = 0;
  const cats = {};

  const monthlyIncome = {};
  const monthlyExpense = {};
  const monthlySavings = {};

  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth(); // 0-indexed

  allTxs.forEach(t => {
    const amt = Number(t.amount) || 0;
    const tDate = new Date(t.transactionDate);
    const ymKey = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, '0')}`;

    if (t.type === 'INCOME') {
      inAmount += amt;
      monthlyIncome[ymKey] = (monthlyIncome[ymKey] || 0) + amt;
    } else if (t.type === 'SAVINGS' || (t.category && t.category.toLowerCase() === 'savings')) {
      savingsTxTotal += amt;
      monthlySavings[ymKey] = (monthlySavings[ymKey] || 0) + amt;
    } else {
      outAmount += amt;
      const cat = t.category || 'Other';
      cats[cat] = (cats[cat] || 0) + amt;
      monthlyExpense[ymKey] = (monthlyExpense[ymKey] || 0) + amt;
    }
  });

  const totalGoalsCurrent = userGoals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0);

  let savingsDisplay = 0;
  if (totalGoalsCurrent > 0) {
    savingsDisplay = totalGoalsCurrent;
  } else if (savingsTxTotal > 0) {
    savingsDisplay = savingsTxTotal;
  } else {
    savingsDisplay = Math.max(0, inAmount - outAmount);
  }

  const availableBalance = Math.max(0, inAmount - outAmount - savingsDisplay);
  const savingsRate = inAmount > 0 ? Number(((savingsDisplay * 100) / inAmount).toFixed(1)) : 0;

  // Monthly totals for last 6 months
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTotals = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currYear, currMonth - i, 1);
    const ymKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const mInc = monthlyIncome[ymKey] || 0;
    const mExp = monthlyExpense[ymKey] || 0;
    monthlyTotals.push({
      month: monthNames[d.getMonth()],
      yearMonth: ymKey,
      income: mInc,
      expenses: mExp,
      savings: mInc - mExp
    });
  }

  // Category breakdown for expenses
  const totalExp = outAmount === 0 ? 1 : outAmount;
  const categoryBreakdown = Object.entries(cats).map(([category, total]) => ({
    category,
    total,
    percentage: Number(((total * 100) / totalExp).toFixed(1))
  }));

  // Primary goal
  const primaryGoal = userGoals.length > 0 ? formatGoal(userGoals[0]) : null;

  return {
    income: inAmount,
    expenses: outAmount,
    savings: savingsDisplay,
    availableBalance,
    savingsRate,
    incomeTrend: 8.5,
    expensesTrend: -3.2,
    savingsTrend: 12.0,
    categoryBreakdown,
    monthlyTotals,
    primaryGoal
  };
}

export const mockBackend = {
  async get(url) {
    await delay(30);
    const cleanUrl = url.split('?')[0];

    // Auth Me
    if (cleanUrl === '/auth/me') {
      const user = getStored(STORAGE_KEYS.USER, null);
      if (!user) {
        return Promise.reject({
          response: { status: 401, data: { message: 'Not authenticated' } }
        });
      }
      return { data: user };
    }

    // Transactions
    if (cleanUrl === '/transactions') {
      const txs = getStored(STORAGE_KEYS.TX, []);
      // Sort newest date first, then highest ID first
      const sorted = [...txs].sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate) || b.id - a.id);
      return { data: sorted };
    }

    // Budgets
    if (cleanUrl === '/budgets') {
      const budgets = getStored(STORAGE_KEYS.BUDGETS, []);
      const txs = getStored(STORAGE_KEYS.TX, []);
      const formatted = budgets.map(b => formatBudget(b, txs));
      return { data: formatted };
    }

    // Goals
    if (cleanUrl === '/goals') {
      const goals = getStored(STORAGE_KEYS.GOALS, []);
      const sorted = [...goals].sort((a, b) => b.id - a.id);
      const formatted = sorted.map(formatGoal);
      return { data: formatted };
    }

    // Summary
    if (cleanUrl === '/dashboard/summary') {
      const txs = getStored(STORAGE_KEYS.TX, []);
      const goals = getStored(STORAGE_KEYS.GOALS, []);
      const summary = computeSummary(txs, goals);
      return { data: summary };
    }

    return { data: {} };
  },

  async post(url, payload = {}) {
    await delay(40);
    const cleanUrl = url.split('?')[0];

    // Login
    if (cleanUrl === '/auth/login') {
      const email = payload.email?.trim() || '';
      const rawName = email ? email.split('@')[0] : 'User';
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const user = { id: 1, name: formattedName, email };
      setStored(STORAGE_KEYS.USER, user);
      ensureInitialized();
      return { data: user };
    }

    // Register
    if (cleanUrl === '/auth/register') {
      const email = payload.email?.trim() || '';
      const name = payload.name?.trim() || (email ? email.split('@')[0] : 'User');
      const user = { id: Date.now(), name, email };
      setStored(STORAGE_KEYS.USER, user);
      ensureInitialized();
      return { data: user };
    }

    // Logout
    if (cleanUrl === '/auth/logout') {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return { data: { message: 'Logged out successfully' } };
    }

    // Transactions Create
    if (cleanUrl === '/transactions') {
      const txs = getStored(STORAGE_KEYS.TX, []);
      const newTx = {
        id: Date.now(),
        type: payload.type || 'EXPENSE',
        amount: Number(payload.amount),
        category: payload.category || 'Other',
        description: payload.description || '',
        transactionDate: payload.transactionDate || todayStr()
      };
      txs.unshift(newTx);
      setStored(STORAGE_KEYS.TX, txs);
      return { data: newTx };
    }

    // Budgets Create
    if (cleanUrl === '/budgets') {
      const budgets = getStored(STORAGE_KEYS.BUDGETS, []);
      const newBudget = {
        id: Date.now(),
        category: payload.category,
        month: Number(payload.monthValue || payload.month || (new Date().getMonth() + 1)),
        year: Number(payload.yearValue || payload.year || new Date().getFullYear()),
        limitAmount: Number(payload.limitAmount)
      };
      budgets.push(newBudget);
      setStored(STORAGE_KEYS.BUDGETS, budgets);
      const txs = getStored(STORAGE_KEYS.TX, []);
      return { data: formatBudget(newBudget, txs) };
    }

    // Goals Create
    if (cleanUrl === '/goals') {
      const goals = getStored(STORAGE_KEYS.GOALS, []);
      const newGoal = {
        id: Date.now(),
        name: payload.name,
        targetAmount: Number(payload.targetAmount),
        currentAmount: Number(payload.currentAmount || 0),
        deadline: payload.deadline || null
      };
      goals.push(newGoal);
      setStored(STORAGE_KEYS.GOALS, goals);
      return { data: formatGoal(newGoal) };
    }

    // Goal Deposit
    const depositMatch = cleanUrl.match(/^\/goals\/(\d+)\/deposit$/);
    if (depositMatch) {
      const goalId = Number(depositMatch[1]);
      const goals = getStored(STORAGE_KEYS.GOALS, []);
      const goal = goals.find(g => Number(g.id) === goalId);

      if (!goal) {
        return Promise.reject({
          response: { status: 404, data: { message: 'Goal not found' } }
        });
      }

      const depositAmt = Number(payload.amount || 0);
      goal.currentAmount = (Number(goal.currentAmount) || 0) + depositAmt;
      setStored(STORAGE_KEYS.GOALS, goals);

      if (payload.createTransaction) {
        const txs = getStored(STORAGE_KEYS.TX, []);
        const savingsTx = {
          id: Date.now(),
          type: 'SAVINGS',
          category: 'Savings',
          description: `Saved towards goal: ${goal.name}${payload.note ? ' (' + payload.note.trim() + ')' : ''}`,
          amount: depositAmt,
          transactionDate: todayStr()
        };
        txs.unshift(savingsTx);
        setStored(STORAGE_KEYS.TX, txs);
      }

      return { data: formatGoal(goal) };
    }

    return { data: {} };
  },

  async put(url, payload = {}) {
    await delay(40);
    const cleanUrl = url.split('?')[0];

    // Profile Update
    if (cleanUrl === '/auth/profile') {
      const user = getStored(STORAGE_KEYS.USER, DEFAULT_USER);
      if (payload.name) user.name = payload.name.trim();
      setStored(STORAGE_KEYS.USER, user);
      return { data: user };
    }

    // Transaction Update
    const txMatch = cleanUrl.match(/^\/transactions\/(\d+)$/);
    if (txMatch) {
      const txId = Number(txMatch[1]);
      const txs = getStored(STORAGE_KEYS.TX, []);
      const idx = txs.findIndex(t => Number(t.id) === txId);
      if (idx !== -1) {
        txs[idx] = {
          ...txs[idx],
          type: payload.type || txs[idx].type,
          amount: Number(payload.amount) || txs[idx].amount,
          category: payload.category || txs[idx].category,
          description: payload.description !== undefined ? payload.description : txs[idx].description,
          transactionDate: payload.transactionDate || txs[idx].transactionDate
        };
        setStored(STORAGE_KEYS.TX, txs);
        return { data: txs[idx] };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Transaction not found' } } });
    }

    // Budget Update
    const budgetMatch = cleanUrl.match(/^\/budgets\/(\d+)$/);
    if (budgetMatch) {
      const budgetId = Number(budgetMatch[1]);
      const budgets = getStored(STORAGE_KEYS.BUDGETS, []);
      const idx = budgets.findIndex(b => Number(b.id) === budgetId);
      if (idx !== -1) {
        budgets[idx] = {
          ...budgets[idx],
          category: payload.category || budgets[idx].category,
          month: Number(payload.monthValue || payload.month || budgets[idx].month),
          year: Number(payload.yearValue || payload.year || budgets[idx].year),
          limitAmount: Number(payload.limitAmount) || budgets[idx].limitAmount
        };
        setStored(STORAGE_KEYS.BUDGETS, budgets);
        const txs = getStored(STORAGE_KEYS.TX, []);
        return { data: formatBudget(budgets[idx], txs) };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Budget not found' } } });
    }

    // Goal Update
    const goalMatch = cleanUrl.match(/^\/goals\/(\d+)$/);
    if (goalMatch) {
      const goalId = Number(goalMatch[1]);
      const goals = getStored(STORAGE_KEYS.GOALS, []);
      const idx = goals.findIndex(g => Number(g.id) === goalId);
      if (idx !== -1) {
        goals[idx] = {
          ...goals[idx],
          name: payload.name || goals[idx].name,
          targetAmount: Number(payload.targetAmount) || goals[idx].targetAmount,
          currentAmount: payload.currentAmount !== undefined ? Number(payload.currentAmount) : goals[idx].currentAmount,
          deadline: payload.deadline !== undefined ? payload.deadline : goals[idx].deadline
        };
        setStored(STORAGE_KEYS.GOALS, goals);
        return { data: formatGoal(goals[idx]) };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Goal not found' } } });
    }

    return { data: {} };
  },

  async delete(url) {
    await delay(30);
    const cleanUrl = url.split('?')[0];

    // Transaction Delete
    const txMatch = cleanUrl.match(/^\/transactions\/(\d+)$/);
    if (txMatch) {
      const txId = Number(txMatch[1]);
      const txs = getStored(STORAGE_KEYS.TX, []);
      setStored(STORAGE_KEYS.TX, txs.filter(t => Number(t.id) !== txId));
      return { data: { message: 'Deleted' } };
    }

    // Budget Delete
    const budgetMatch = cleanUrl.match(/^\/budgets\/(\d+)$/);
    if (budgetMatch) {
      const budgetId = Number(budgetMatch[1]);
      const budgets = getStored(STORAGE_KEYS.BUDGETS, []);
      setStored(STORAGE_KEYS.BUDGETS, budgets.filter(b => Number(b.id) !== budgetId));
      return { data: { message: 'Deleted' } };
    }

    // Goal Delete
    const goalMatch = cleanUrl.match(/^\/goals\/(\d+)$/);
    if (goalMatch) {
      const goalId = Number(goalMatch[1]);
      const goals = getStored(STORAGE_KEYS.GOALS, []);
      setStored(STORAGE_KEYS.GOALS, goals.filter(g => Number(g.id) !== goalId));
      return { data: { message: 'Deleted' } };
    }

    return { data: { message: 'Deleted' } };
  }
};
