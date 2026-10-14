package com.finance.tracker;
import jakarta.persistence.*;import java.math.BigDecimal;import java.time.LocalDate;
@Entity @Table(name="savings_goals") public class Goal {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false,fetch=FetchType.EAGER) public User user;
 @Column(nullable=false) public String name;
 @Column(nullable=false,precision=12,scale=2) public BigDecimal targetAmount;
 @Column(nullable=false,precision=12,scale=2) public BigDecimal currentAmount;
 public LocalDate deadline;
 public Goal(){}
}
