# Expense Tracker - Backend

This is a Node.js backend for tracking user expenses with analytics such as:
- Top 3 spending days
- Monthly spending percentage change
- Next month's predicted expenditure (based on the last 3 months average)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

2. Install dependencies
npm install



3. create .env
PORT
MONGODB_URL
JWT_SECRET
JWT_ACCESS_EXPIRATION_MINUTES
API_BASE_URL

3. Start the server
npm start

| Method | Route                 | Description                           |
| ------ | --------------------- | ------------------------------------- |
| POST   | /user/auth/signup             | Signup a new user  
| POST   | /user/login            | login user 
| POST   | /user/expenses             | Add a new expense                     |
| PUT    | /user/expenses       | Update an existing expense            |
| DELETE | /user/expenses       | Soft delete an expense                |
| GET    | /user/statistic/topDays      | Top 3 spending days per user          |
| GET    | /user/statistic/monthlyChange | Monthly % change in user spending     |
| GET    | /user/statistic/prediction     | Predict next month spending (average) |


Contact
Made by Aashessh Saini
email aashesshsaini@gmail.com
