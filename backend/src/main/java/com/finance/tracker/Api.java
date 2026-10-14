package com.finance.tracker;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class Api {
    private final Users users;
    private final Txs txs;
    private final Budgets budgets;
    private final Goals goals;
    private final PasswordEncoder enc;
    private final AuthenticationManager authManager;

    public Api(Users u, Txs t, Budgets b, Goals g, PasswordEncoder e, AuthenticationManager a) {
        this.users = u;
        this.txs = t;
        this.budgets = b;
        this.goals = g;
        this.enc = e;
        this.authManager = a;
    }

    record Register(@NotBlank @Size(min = 2, max = 80) String name, @Email @NotBlank String email, @NotBlank @Size(min = 8, max = 72) String password) {}
    record Login(@Email @NotBlank String email, @NotBlank String password) {}
    record TxInput(@NotBlank String type, @DecimalMin("0.01") BigDecimal amount, @NotBlank String category, String description, @NotNull LocalDate transactionDate) {}
    record BudgetInput(@NotBlank String category, @Min(1) @Max(12) int monthValue, @Min(2000) @Max(2200) int yearValue, @DecimalMin("0.01") BigDecimal limitAmount) {}
    record GoalInput(@NotBlank String name, @DecimalMin("0.01") BigDecimal targetAmount, @DecimalMin("0.00") BigDecimal currentAmount, LocalDate deadline) {}
    record DepositInput(@DecimalMin("0.01") BigDecimal amount, String note, Boolean createTransaction) {}

    User current(Authentication a) {
        if (a == null || !a.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return users.findByEmailIgnoreCase(a.getName()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    Map<String, Object> userJson(User u) {
        return Map.of("id", u.id, "name", u.name, "email", u.email);
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody Register r) {
        String email = r.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered"));
        }
        User u = users.save(new User(r.name().trim(), email, enc.encode(r.password())));
        return ResponseEntity.status(HttpStatus.CREATED).body(userJson(u));
    }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@Valid @RequestBody Login l, HttpServletRequest req) {
        Authentication a = authManager.authenticate(new UsernamePasswordAuthenticationToken(l.email().trim().toLowerCase(), l.password()));
        SecurityContext c = SecurityContextHolder.createEmptyContext();
        c.setAuthentication(a);
        SecurityContextHolder.setContext(c);
        req.getSession(true).setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, c);
        return userJson(users.findByEmailIgnoreCase(a.getName()).orElseThrow());
    }

    @GetMapping("/auth/me")
    public Map<String, Object> me(Authentication a) {
        return userJson(current(a));
    }

    record ProfileInput(@NotBlank @Size(min = 2, max = 80) String name, String password) {}

    @PutMapping("/auth/profile")
    public Map<String, Object> updateProfile(Authentication a, @Valid @RequestBody ProfileInput p) {
        User u = current(a);
        u.name = p.name().trim();
        if (p.password() != null && !p.password().isBlank()) {
            if (p.password().trim().length() < 8) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
            }
            u.passwordHash = enc.encode(p.password().trim());
        }
        return userJson(users.save(u));
    }

    @PostMapping("/auth/logout")
    public Map<String, String> logout(HttpServletRequest r) {
        SecurityContextHolder.clearContext();
        if (r.getSession(false) != null) {
            r.getSession(false).invalidate();
        }
        return Map.of("message", "Logged out");
    }

    @GetMapping("/transactions")
    public List<Map<String, Object>> listTx(Authentication a, @RequestParam(required = false) String search) {
        Long uid = current(a).id;
        return txs.findByUserIdOrderByTransactionDateDesc(uid).stream()
                .filter(t -> search == null || (t.category + " " + Objects.toString(t.description, "") + " " + t.type).toLowerCase().contains(search.toLowerCase()))
                .map(this::txJson)
                .toList();
    }

    Map<String, Object> txJson(Tx t) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", t.id);
        map.put("type", t.type);
        map.put("amount", t.amount);
        map.put("category", t.category);
        map.put("description", Objects.toString(t.description, ""));
        map.put("transactionDate", t.transactionDate.toString());
        return map;
    }

    void apply(Tx t, TxInput i) {
        String type = i.type().toUpperCase().trim();
        if (!List.of("INCOME", "EXPENSE").contains(type)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type must be INCOME or EXPENSE");
        }
        t.type = type;
        t.amount = i.amount();
        t.category = i.category().trim();
        t.description = Objects.toString(i.description(), "").trim();
        t.transactionDate = i.transactionDate();
    }

    @PostMapping("/transactions")
    public ResponseEntity<?> createTx(Authentication a, @Valid @RequestBody TxInput i) {
        Tx t = new Tx();
        t.user = current(a);
        apply(t, i);
        return ResponseEntity.status(HttpStatus.CREATED).body(txJson(txs.save(t)));
    }

    @PutMapping("/transactions/{id}")
    public Map<String, Object> updateTx(Authentication a, @PathVariable Long id, @Valid @RequestBody TxInput i) {
        Tx t = txs.findByIdAndUserId(id, current(a).id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        apply(t, i);
        return txJson(txs.save(t));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<?> deleteTx(Authentication a, @PathVariable Long id) {
        Tx t = txs.findByIdAndUserId(id, current(a).id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
        txs.delete(t);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/summary")
    public Map<String, Object> summary(Authentication a) {
        Long uid = current(a).id;
        List<Tx> all = txs.findByUserIdOrderByTransactionDateDesc(uid);

        List<Goal> userGoals = goals.findByUserIdOrderByIdDesc(uid);
        BigDecimal totalGoalsCurrent = userGoals.stream()
                .map(g -> g.currentAmount != null ? g.currentAmount : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal in = BigDecimal.ZERO;
        BigDecimal out = BigDecimal.ZERO;
        BigDecimal savingsTxTotal = BigDecimal.ZERO;
        Map<String, BigDecimal> cats = new LinkedHashMap<>();

        // Group transactions by month for trend and chart analysis
        Map<YearMonth, BigDecimal> monthlyIncome = new TreeMap<>();
        Map<YearMonth, BigDecimal> monthlyExpense = new TreeMap<>();
        Map<YearMonth, BigDecimal> monthlySavings = new TreeMap<>();

        YearMonth thisMonth = YearMonth.now();
        YearMonth lastMonth = thisMonth.minusMonths(1);

        for (Tx t : all) {
            YearMonth ym = YearMonth.from(t.transactionDate);
            if ("INCOME".equalsIgnoreCase(t.type)) {
                in = in.add(t.amount);
                monthlyIncome.merge(ym, t.amount, BigDecimal::add);
            } else if ("SAVINGS".equalsIgnoreCase(t.type) || "Savings".equalsIgnoreCase(t.category)) {
                savingsTxTotal = savingsTxTotal.add(t.amount);
                monthlySavings.merge(ym, t.amount, BigDecimal::add);
            } else {
                out = out.add(t.amount);
                cats.merge(t.category, t.amount, BigDecimal::add);
                monthlyExpense.merge(ym, t.amount, BigDecimal::add);
            }
        }

        // Display Savings: If user has savings in goals or savings txs, use that amount;
        // otherwise net savings (in - out)
        BigDecimal savingsDisplay;
        if (totalGoalsCurrent.signum() > 0) {
            savingsDisplay = totalGoalsCurrent;
        } else if (savingsTxTotal.signum() > 0) {
            savingsDisplay = savingsTxTotal;
        } else {
            savingsDisplay = in.subtract(out).max(BigDecimal.ZERO);
        }

        // Net Available Balance = Income minus Expenses minus Savings deposited into goals
        BigDecimal availableBalance = in.subtract(out).subtract(savingsDisplay).max(BigDecimal.ZERO);

        double rate = in.signum() == 0 ? 0.0 : savingsDisplay.multiply(BigDecimal.valueOf(100)).divide(in, 1, RoundingMode.HALF_UP).doubleValue();

        // Calculate trends vs last month
        BigDecimal thisMonthInc = monthlyIncome.getOrDefault(thisMonth, BigDecimal.ZERO);
        BigDecimal lastMonthInc = monthlyIncome.getOrDefault(lastMonth, BigDecimal.ZERO);
        double incTrend = lastMonthInc.signum() == 0 ? 0.0 : thisMonthInc.subtract(lastMonthInc).multiply(BigDecimal.valueOf(100)).divide(lastMonthInc, 1, RoundingMode.HALF_UP).doubleValue();

        BigDecimal thisMonthExp = monthlyExpense.getOrDefault(thisMonth, BigDecimal.ZERO);
        BigDecimal lastMonthExp = monthlyExpense.getOrDefault(lastMonth, BigDecimal.ZERO);
        double expTrend = lastMonthExp.signum() == 0 ? 0.0 : thisMonthExp.subtract(lastMonthExp).multiply(BigDecimal.valueOf(100)).divide(lastMonthExp, 1, RoundingMode.HALF_UP).doubleValue();

        BigDecimal thisMonthSav = thisMonthInc.subtract(thisMonthExp);
        BigDecimal lastMonthSav = lastMonthInc.subtract(lastMonthExp);
        double savTrend = lastMonthSav.signum() == 0 ? 0.0 : thisMonthSav.subtract(lastMonthSav).multiply(BigDecimal.valueOf(100)).divide(lastMonthSav.abs().max(BigDecimal.ONE), 1, RoundingMode.HALF_UP).doubleValue();

        // Prepare monthlyTotals chart data (ensure last 6 months are present)
        List<Map<String, Object>> monthlyTotals = new ArrayList<>();
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM");
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = thisMonth.minusMonths(i);
            BigDecimal mInc = monthlyIncome.getOrDefault(ym, BigDecimal.ZERO);
            BigDecimal mExp = monthlyExpense.getOrDefault(ym, BigDecimal.ZERO);
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("month", ym.format(monthFmt));
            item.put("yearMonth", ym.toString());
            item.put("income", mInc);
            item.put("expenses", mExp);
            item.put("savings", mInc.subtract(mExp));
            monthlyTotals.add(item);
        }

        // Category breakdown with percentages (purely real expenses, no savings)
        BigDecimal totalExp = out.signum() == 0 ? BigDecimal.ONE : out;
        List<Map<String, Object>> breakdown = new ArrayList<>();
        for (Map.Entry<String, BigDecimal> entry : cats.entrySet()) {
            double pct = entry.getValue().multiply(BigDecimal.valueOf(100)).divide(totalExp, 1, RoundingMode.HALF_UP).doubleValue();
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("category", entry.getKey());
            item.put("total", entry.getValue());
            item.put("percentage", pct);
            breakdown.add(item);
        }

        // Primary goal for dashboard gauge
        Map<String, Object> primaryGoal = userGoals.isEmpty() ? null : goalJson(userGoals.get(0));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("income", in);
        res.put("expenses", out);
        res.put("savings", savingsDisplay);
        res.put("availableBalance", availableBalance);
        res.put("savingsRate", rate);
        res.put("incomeTrend", incTrend);
        res.put("expensesTrend", expTrend);
        res.put("savingsTrend", savTrend);
        res.put("categoryBreakdown", breakdown);
        res.put("monthlyTotals", monthlyTotals);
        res.put("primaryGoal", primaryGoal);
        return res;
    }

    @GetMapping("/budgets")
    public List<Map<String, Object>> listBudgets(Authentication a) {
        Long uid = current(a).id;
        List<Budget> list = budgets.findByUserIdOrderByYearValueDescMonthValueDesc(uid);
        List<Tx> userTx = txs.findByUserIdOrderByTransactionDateDesc(uid);

        return list.stream().map(b -> {
            // Calculate actual spent for this category, month, and year!
            BigDecimal spent = userTx.stream()
                    .filter(t -> "EXPENSE".equalsIgnoreCase(t.type)
                            && t.category.trim().equalsIgnoreCase(b.category.trim())
                            && t.transactionDate.getYear() == b.yearValue
                            && t.transactionDate.getMonthValue() == b.monthValue)
                    .map(t -> t.amount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return budgetJsonWithSpent(b, spent);
        }).toList();
    }

    Map<String, Object> budgetJsonWithSpent(Budget b, BigDecimal spent) {
        BigDecimal limit = b.limitAmount.signum() == 0 ? BigDecimal.ONE : b.limitAmount;
        double pct = spent.multiply(BigDecimal.valueOf(100)).divide(limit, 1, RoundingMode.HALF_UP).doubleValue();
        BigDecimal remaining = b.limitAmount.subtract(spent);

        String status = spent.compareTo(b.limitAmount) > 0 ? "EXCEEDED" : (pct >= 85 ? "WARNING" : "ON_TRACK");

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", b.id);
        map.put("category", b.category);
        map.put("month", b.monthValue);
        map.put("year", b.yearValue);
        map.put("limitAmount", b.limitAmount);
        map.put("spent", spent);
        map.put("remaining", remaining);
        map.put("progressPercent", Math.min(100.0, Math.max(0.0, pct)));
        map.put("rawPercent", pct);
        map.put("status", status);
        return map;
    }

    @PostMapping("/budgets")
    public ResponseEntity<?> createBudget(Authentication a, @Valid @RequestBody BudgetInput i) {
        Budget b = new Budget();
        b.user = current(a);
        b.category = i.category().trim();
        b.monthValue = i.monthValue();
        b.yearValue = i.yearValue();
        b.limitAmount = i.limitAmount();
        Budget saved = budgets.save(b);

        // Compute initial spent
        List<Tx> userTx = txs.findByUserIdOrderByTransactionDateDesc(b.user.id);
        BigDecimal spent = userTx.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.type)
                        && t.category.trim().equalsIgnoreCase(saved.category.trim())
                        && t.transactionDate.getYear() == saved.yearValue
                        && t.transactionDate.getMonthValue() == saved.monthValue)
                .map(t -> t.amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.status(HttpStatus.CREATED).body(budgetJsonWithSpent(saved, spent));
    }

    @PutMapping("/budgets/{id}")
    public Map<String, Object> updateBudget(Authentication a, @PathVariable Long id, @Valid @RequestBody BudgetInput i) {
        Budget b = budgets.findByIdAndUserId(id, current(a).id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Budget not found"));
        b.category = i.category().trim();
        b.monthValue = i.monthValue();
        b.yearValue = i.yearValue();
        b.limitAmount = i.limitAmount();
        Budget saved = budgets.save(b);

        List<Tx> userTx = txs.findByUserIdOrderByTransactionDateDesc(b.user.id);
        BigDecimal spent = userTx.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.type)
                        && t.category.trim().equalsIgnoreCase(saved.category.trim())
                        && t.transactionDate.getYear() == saved.yearValue
                        && t.transactionDate.getMonthValue() == saved.monthValue)
                .map(t -> t.amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return budgetJsonWithSpent(saved, spent);
    }

    @DeleteMapping("/budgets/{id}")
    public ResponseEntity<?> deleteBudget(Authentication a, @PathVariable Long id) {
        Budget b = budgets.findByIdAndUserId(id, current(a).id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Budget not found"));
        budgets.delete(b);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/goals")
    public List<Map<String, Object>> listGoals(Authentication a) {
        return goals.findByUserIdOrderByIdDesc(current(a).id).stream().map(this::goalJson).toList();
    }

    Map<String, Object> goalJson(Goal g) {
        BigDecimal target = g.targetAmount.signum() == 0 ? BigDecimal.ONE : g.targetAmount;
        double pct = g.currentAmount.multiply(BigDecimal.valueOf(100)).divide(target, 1, RoundingMode.HALF_UP).doubleValue();
        BigDecimal remaining = g.targetAmount.subtract(g.currentAmount).max(BigDecimal.ZERO);

        Long daysLeft = null;
        if (g.deadline != null) {
            daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), g.deadline);
        }

        boolean isCompleted = g.currentAmount.compareTo(g.targetAmount) >= 0;

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", g.id);
        map.put("name", g.name);
        map.put("targetAmount", g.targetAmount);
        map.put("currentAmount", g.currentAmount);
        map.put("remainingAmount", remaining);
        map.put("progressPercent", Math.min(100.0, Math.max(0.0, pct)));
        map.put("rawPercent", pct);
        map.put("deadline", g.deadline != null ? g.deadline.toString() : "");
        map.put("daysLeft", daysLeft);
        map.put("isCompleted", isCompleted);
        return map;
    }

    @PostMapping("/goals")
    public ResponseEntity<?> createGoal(Authentication a, @Valid @RequestBody GoalInput i) {
        Goal g = new Goal();
        g.user = current(a);
        g.name = i.name().trim();
        g.targetAmount = i.targetAmount();
        g.currentAmount = i.currentAmount() == null ? BigDecimal.ZERO : i.currentAmount();
        g.deadline = i.deadline();
        return ResponseEntity.status(HttpStatus.CREATED).body(goalJson(goals.save(g)));
    }

    @PutMapping("/goals/{id}")
    public Map<String, Object> updateGoal(Authentication a, @PathVariable Long id, @Valid @RequestBody GoalInput i) {
        Goal g = goals.findByIdAndUserId(id, current(a).id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Goal not found"));
        g.name = i.name().trim();
        g.targetAmount = i.targetAmount();
        if (i.currentAmount() != null) {
            g.currentAmount = i.currentAmount();
        }
        g.deadline = i.deadline();
        return goalJson(goals.save(g));
    }

    @PostMapping("/goals/{id}/deposit")
    public Map<String, Object> depositToGoal(Authentication a, @PathVariable Long id, @Valid @RequestBody DepositInput d) {
        User u = current(a);
        Goal g = goals.findByIdAndUserId(id, u.id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Goal not found"));

        g.currentAmount = g.currentAmount.add(d.amount());
        goals.save(g);

        // Optionally record as a Savings transaction so it shows in the transaction history
        if (Boolean.TRUE.equals(d.createTransaction())) {
            Tx t = new Tx();
            t.user = u;
            t.type = "SAVINGS";
            t.category = "Savings";
            t.description = "Saved towards goal: " + g.name + (d.note() != null && !d.note().isBlank() ? " (" + d.note().trim() + ")" : "");
            t.amount = d.amount();
            t.transactionDate = LocalDate.now();
            txs.save(t);
        }

        return goalJson(g);
    }

    @DeleteMapping("/goals/{id}")
    public ResponseEntity<?> deleteGoal(Authentication a, @PathVariable Long id) {
        Goal g = goals.findByIdAndUserId(id, current(a).id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Goal not found"));
        goals.delete(g);
        return ResponseEntity.noContent().build();
    }
}
