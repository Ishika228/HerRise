import { Router } from 'express';
import {
  getFinanceOverview,
  getTransactions,
  createTransaction,
  deleteTransaction,
  getBudgetCategories,
  updateBudgetCategoryLimit,
  getSavingsGoals,
  createSavingsGoal,
  depositToGoal,
  processOcrReceipt,
  aiConsult
} from '../controllers/financeController.js';

const router = Router();

router.get('/overview', getFinanceOverview);
router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);
router.delete('/transactions/:id', deleteTransaction);

router.get('/budget', getBudgetCategories);
router.put('/budget/categories/:categoryId', updateBudgetCategoryLimit);

router.get('/goals', getSavingsGoals);
router.post('/goals', createSavingsGoal);
router.post('/goals/:id/deposit', depositToGoal);

router.post('/ocr-receipt', processOcrReceipt);
router.post('/ai-consult', aiConsult);

export default router;
