"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./player/auth.routes"));
const static_routes_1 = __importDefault(require("./static.routes"));
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: "/player/auth",
        route: auth_routes_1.default,
    },
    {
        path: "/static",
        route: static_routes_1.default,
    },
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
