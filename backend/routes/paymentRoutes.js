const express = require('express');
const { 
  createPaymentSession,
  processPayment, 
  verifyPayment, 
  getPaymentOptions,
  getTestCards,
  getTransactionDetails
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
// @route   GET /api/payment/options
// @desc    Get payment options
// @access  Public
router.get('/options', getPaymentOptions);

// @route   GET /api/payment/test-cards
// @desc    Get test card information
// @access  Public
router.get('/test-cards', getTestCards);

// @route   GET /api/payment/health
// @desc    Health check for payment service
// @access  Public
router.get('/health', (req, res) => {
  const paymentGateway = require('../utils/dummyPaymentGateway');
  
  try {
    const healthStatus = paymentGateway.healthCheck();
    
    res.status(200).json({
      success: true,
      service: 'payment-gateway',
      status: healthStatus.status,
      timestamp: healthStatus.timestamp,
      version: healthStatus.version,
      methods: healthStatus.supportedMethods
    });
  } catch (error) {
    console.error('Payment health check error:', error);
    res.status(500).json({
      success: false,
      service: 'payment-gateway',
      status: 'error',
      error: error.message
    });
  }
});

// Checkout page route
// @route   GET /api/payment/checkout/:sessionId
// @desc    Render payment checkout page
// @access  Public
router.get('/checkout/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  
  // In a real implementation, this would render a payment page
  // For our simulation, we'll just return JSON with info about what to render
  res.status(200).json({
    success: true,
    message: 'This would normally be a checkout page',
    sessionId,
    checkoutUrl: `/checkout?session=${sessionId}`
  });
});

// Protected routes
// @route   POST /api/payment/create-session
// @desc    Create payment session
// @access  Private
router.post('/create-session', protect, createPaymentSession);

// @route   POST /api/payment/process
// @desc    Process payment
// @access  Private
router.post('/process', protect, processPayment);

// @route   GET /api/payment/verify/:transactionId
// @desc    Verify payment status
// @access  Private
router.get('/verify/:transactionId', protect, verifyPayment);

// @route   GET /api/payment/transaction/:transactionId
// @desc    Get transaction details
// @access  Private
router.get('/transaction/:transactionId', protect, getTransactionDetails);

module.exports = router; 