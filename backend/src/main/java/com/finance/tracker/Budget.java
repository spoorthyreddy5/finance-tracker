package com.finance.tracker;
import jakarta.persistence.*;import java.math.BigDecimal;
@Entity @Table(name="budgets") public class Budget {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false,fetch=FetchType.EAGER) public User user;
 @Column(nullable=false) public String category; public int monthValue; public int yearValue;
 @Column(nullable=false,precision=12,scale=2) public BigDecimal limitAmount;
 public Budget(){}
}
