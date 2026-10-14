package com.finance.tracker;
import jakarta.persistence.*;import java.math.BigDecimal;import java.time.LocalDate;
@Entity @Table(name="transactions") public class Tx {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false,fetch=FetchType.EAGER) public User user;
 @Column(nullable=false) public String type;
 @Column(nullable=false,precision=12,scale=2) public BigDecimal amount;
 @Column(nullable=false,length=60) public String category;
 @Column(length=180) public String description;
 @Column(nullable=false) public LocalDate transactionDate;
 public Tx(){}
}
