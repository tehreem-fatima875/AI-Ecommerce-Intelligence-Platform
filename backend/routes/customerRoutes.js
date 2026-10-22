const express = require("express");

const {
  getCustomers,
  getCustomerById,
  createCustomer,
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);

module.exports = router;