const express = require('express');

const {createOrder, capturePayment, getOrderDetails, getAllOrdersByUser } = require('../../controllers/shop/order-controllers');

const router = express.Router();

router.post('/create', createOrder);
router.post('/capture', capturePayment);
router.get('/list/:userId', getAllOrdersByUser);
router.get('/details/:id', getOrderDetails);

module.exports = router;
