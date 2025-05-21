
import { Router } from "express";
import inquiries_tb from "../models/inquiries.js";
import { CheckAdmin } from "../middleware/authenicate.js";
const router=Router()

router.post('/new', (req, res) => {
    const { name, email, subject, message ,user} = req.body;
    const userId = user || null;   // if you allow logged-in users
    const sql = `
      INSERT INTO inquiries
        (user_id, name, email, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `;
    inquiries_tb.query(sql, [userId, name, email, subject, message], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      return res.json({ message: 'Thanks for contacting us! Our support team has received your message and will be in touch soon.' });
    });

  });

router.get('/show',CheckAdmin, (req, res) => {
    const sql = `SELECT * FROM inquiries ORDER BY created_at ASC;`;
    inquiries_tb.query(sql, (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      return res.json(result);
    });
  })

router.put('/update/:id',CheckAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if(status.status !== 'open' && status.status !== 'closed'){
      return res.json({ message: 'Invalid status' });
    }
    const sql = `UPDATE inquiries SET status = ? WHERE id = ?;`;
    inquiries_tb.query(sql, [status.status, id], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error',err });
      return res.json({ message: 'Inquiry updated!' });
    });
  })

router.delete('/delete/:id', CheckAdmin,(req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM inquiries WHERE id = ?;`;
    inquiries_tb.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      return res.json({ message: 'Inquiry deleted!' });
    });
  })

export default router;