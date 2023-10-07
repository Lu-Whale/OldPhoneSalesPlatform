const express = require('express');

const router = express.Router();
const {getCartDataByUserId, updateAfterCheckout, updateNumWhenUserChangeItemNum, deleteCartItem, addToCart, AddCartItem} = require('../controller/cartController');

router.get('/checkout/get-cart-data',getCartDataByUserId);
router.post('/checkout/add-to-cart', AddCartItem);
router.post('/checkout/update-after-pay', updateAfterCheckout);
router.post('/checkout/update-num', updateNumWhenUserChangeItemNum);
router.post('/checkout/delete-item', deleteCartItem);

module.exports = router;