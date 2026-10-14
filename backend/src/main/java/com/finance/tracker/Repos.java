package com.finance.tracker;
import org.springframework.data.jpa.repository.JpaRepository;import java.util.*;
interface Users extends JpaRepository<User,Long>{Optional<User> findByEmailIgnoreCase(String email);boolean existsByEmailIgnoreCase(String email);}
interface Txs extends JpaRepository<Tx,Long>{List<Tx> findByUserIdOrderByTransactionDateDesc(Long id);Optional<Tx> findByIdAndUserId(Long id,Long userId);}
interface Budgets extends JpaRepository<Budget,Long>{List<Budget> findByUserIdOrderByYearValueDescMonthValueDesc(Long id);Optional<Budget> findByIdAndUserId(Long id,Long uid);}
interface Goals extends JpaRepository<Goal,Long>{List<Goal> findByUserIdOrderByIdDesc(Long id);Optional<Goal> findByIdAndUserId(Long id,Long uid);}
