import { Router } from "express";
import { getCompanyInfo } from "../controllers/company.controller.js";

const router = Router();

router.get("/", getCompanyInfo);

export default router;
