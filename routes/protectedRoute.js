// routes/admin.js
import express from 'express';
import { verifyToken, Admin } from '../middleware/auth';

const router = express.Router();

router.get('/admin', verifyToken, Admin, (req, res) => {
  res.send('Welcome Admin');
});

export default router;
