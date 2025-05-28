const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductsByCategory,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getProducts);
router.route('/top').get(getTopProducts);
router.route('/category/:category').get(getProductsByCategory);
router.route('/:id').get(getProductById);

// Protected routes
router.route('/:id/reviews').post(protect, createProductReview);

// Admin routes
router.route('/')
  .post(protect, admin, createProduct);

router.route('/:id')
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router; 