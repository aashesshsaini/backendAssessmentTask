import express, { Router } from "express"
import adminAuth from "./admin/auth.routes"
import userAuth from "./user/auth.routes"
import userManage from "./admin/userManage.routes"
import userStatic from "./static.routes"

const router: Router = express.Router();

const defaultRoutes = [
  {
    path: "/admin/auth",
    route: adminAuth,
  },
  {
    path: "/user/auth",
    route: userAuth,
  },
  {
    path: "/admin/userManage",
    route: userManage,
  },
  {
    path: "/static",
    route: userStatic,
  },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;