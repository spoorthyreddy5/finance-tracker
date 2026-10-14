# 🌱 FinanceTracker — Fullstack Personal Finance Application

A modern, responsive full-stack Personal Finance Tracker built with **Spring Boot 3**, **React 18**, and **MySQL**.

![FinanceTracker](https://img.shields.io/badge/Spring_Boot-3.3.5-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)

---

## ✨ Features

- **Dynamic Landing Page**: Modern hero section, feature pills, interactive About & Contact sections with smooth scrolling.
- **Visual Onboarding Carousel**: Auto-advancing split-screen carousel with interactive pagination pills on Login & Register views.
- **Secure Authentication**: BCrypt password hashing with Spring Security session-based authentication.
- **Comprehensive Dashboard**:
  - 4 Key KPI metrics: Total Income (with Available Cash Balance), Total Expenses, Savings, and Savings Rate.
  - Interactive Income vs Expenses Bar Chart.
  - Dynamic Expense Breakdown Donut Chart with central total.
  - Interactive Savings Goal Progress Gauge.
  - Recent Transactions table and Spending by Category progress bars.
- **Transactions Management**:
  - Full CRUD operations (Add, Edit, Delete).
  - Search and filter by transaction type (`INCOME`, `EXPENSE`, `SAVINGS`) and category.
  - One-click CSV export.
- **Category Budgets**:
  - Set monthly category spending limits.
  - Live calculation of actual spent vs remaining budget with color-coded progress bars.
- **Savings Goals**:
  - Track target amounts, saved amounts, and deadlines.
  - Interactive **"+ Deposit Savings"** flow that dynamically updates saved amounts and available balance without treating savings as an expense.
- **Visual Analytics**: 4-chart analytical breakdown (Income vs Expenses, Donut Category Share, 6-Month Trends, Category-wise Spending).
- **Profile Management**: Update user display name and password with avatar initials.

---

## 🛠️ Technology Stack

- **Backend**: Java 17, Spring Boot 3.3.5, Spring Data JPA, Spring Security, Hibernate, MySQL.
- **Frontend**: React 18, Vite, Recharts, Lucide Icons, Pure CSS Design System.
- **Database**: MySQL 8.0.

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** & **Maven 3.8+**
- **Node.js 18+** & **npm**
- **MySQL 8.0+**

### 1. Database Setup
```sql
CREATE DATABASE finance_tracker;
```

Configure credentials in `backend/src/main/resources/application.properties` or set environment variables:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/finance_tracker?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 2. Backend Setup
```bash
cd backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8080/`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be accessible at `http://localhost:5173/`.

### 4. Build for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
mvn clean package
```
