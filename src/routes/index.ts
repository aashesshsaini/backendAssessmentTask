import express, { Router } from "express"
import playerAuth from "./player/auth.routes"
import userStatic from "./static.routes"

const router: Router = express.Router();

const defaultRoutes = [
  {
    path: "/player/auth",
    route: playerAuth,
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