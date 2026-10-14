package com.finance.tracker;
import jakarta.persistence.*;
@Entity @Table(name="app_users") public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false,length=80) public String name;
 @Column(nullable=false,unique=true,length=160) public String email;
 @Column(nullable=false) public String passwordHash;
 public User(){}
 public User(String n,String e,String p){name=n;email=e;passwordHash=p;}
}
