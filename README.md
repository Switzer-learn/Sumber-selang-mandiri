# Sumber Selang Mandiri Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive management system for company PT Sumber Selang Mandiri.

![Admin Dashboard Preview](public/screenshot.png)

## Features

- **Role-Based Access Control**
  - Admin: Full system access
  - Cashier: Limited to sales transactions
  
- **Inventory Management**
  - Product registration and tracking
  - Purchase order management
  - Real-time stock updates
  - Purchase history tracking

- **Sales Management**
  - Point of Sale (POS) system
  - Cash/Credit transactions
  - Customer account management
  - Sales reporting

- **Reporting**
  - Daily/weekly/monthly sales reports
  - Inventory valuation reports
  - Purchase history analysis

## Technologies

- Frontend: 
  ![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
  ![Vite](https://img.shields.io/badge/Vite-4.0-B73BFE?logo=vite)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-06B6D4?logo=tailwind-css)

- Backend Services:
  ![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-4169E1?logo=postgresql)

## Installation

1. Clone repository:
```bash
git clone https://github.com/your-org/sumber-selang-management.git
cd sumber-selang-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Update Supabase credentials in `.env` file

4. Run development server:
```bash
npm run dev
```

## Database Setup

1. Create database using provided schema:
```sql
-- Run commands from src/table.sql
psql -U postgres -f src/table.sql
```

2. Enable Row Level Security policies as defined in SQL schema

## Documentation

- [User Manual](docs/product_management_manual.md) (Bahasa Indonesia)
- [API Documentation](docs/API_REFERENCE.md)
- [Database Schema](src/table.sql)

## License

MIT License - See [LICENSE](LICENSE) for details
