const express = require('express');

const { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus } = require('../../controllers/admin/order-controllers');

const router = express.Router();

router.get('/get', getAllOrdersOfAllUsers);
router.get('/details/:id', getOrderDetailsForAdmin);
router.get('/update/:id', updateOrderStatus);


module.exports = router;
