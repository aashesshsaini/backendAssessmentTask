import express, { Router } from 'express'

const router: Router = express.Router();

router.get("/termsAndCondition", (req, res) => {
    return res.render("termsAndCondition");
});

export default router;