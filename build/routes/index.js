"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./user/auth.routes"));
const expenses_routes_1 = __importDefault(require("./user/expenses.routes"));
const statistic_routes_1 = __importDefault(require("./user/statistic.routes"));
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: "/user/auth",
        route: auth_routes_1.default,
    },
    {
        path: "/user/expenses",
        route: expenses_routes_1.default,
    },
    {
        path: "/user/statistic",
        route: statistic_routes_1.default,
    },
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
