import { Router } from "express";
import { authenicator } from "../middleware/authenicate.js";
import baggage_tb from "../models/baggage_db.js";

const router=Router()

router.post("/new", authenicator, (req, res) => {
    try {
      const { booking_id, selectedBaggage } = req.body;
      const baggageOptions = {
        checked: [
          { weight: "10kg", price: 270, size_tag: "L" },
          { weight: "20kg", price: 540, size_tag: "XL" },
          { weight: "30kg", price: 810, size_tag: "XXL" },
        ],
        cabin: { weight: "7kg", price: 189, size_tag: "M" }
      };
      if (!booking_id || selectedBaggage == null) {
        return res.json({ message: "Missing booking_id or baggage data." });
      }
      const inserts = [];
      // Handle checked baggage 
      const checkedIndex = selectedBaggage.checked;
      if (checkedIndex >= 0 && checkedIndex < baggageOptions.checked.length) {
        const checked = baggageOptions.checked[checkedIndex];
        inserts.push([booking_id, checked.weight, checked.size_tag, checked.price]);
      }
      // Handle cabin baggage 
      if (selectedBaggage.cabin) {
        const cabin = baggageOptions.cabin;
        inserts.push([booking_id,cabin.weight,cabin.size_tag,cabin.price]); }
      if (inserts.length === 0) {
        return res.json({ message: "No valid baggage selected." });
      }
      const sql = `INSERT INTO baggage (booking_id, weight, size_tag, extra_charge) VALUES ?`;
      baggage_tb.query(sql, [inserts], (err, result) => {
        if (err) {
          console.error(err);
          return res.json({ message: "Failed to store baggage info." });
        }
        res.json({
          message: "Baggage saved successfully.",
          insertedCount: result.affectedRows,
          insertedIds: result.insertId
        });
      });
    } catch (err) {
      console.error(err);
      res.json({ message: "Internal server error." });
    }
  });

export default router;