import express, { Router } from "express";
import userAuth from "./user/auth.routes";
import userExpenses from "./user/expenses.routes";
import userStatistics from "./user/statistic.routes";

const router: Router = express.Router();

const defaultRoutes = [
  {
    path: "/user/auth",
    route: userAuth,
  },
  {
    path: "/user/expenses",
    route: userExpenses,
  },
  {
    path: "/user/statistic",
    route: userStatistics,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
