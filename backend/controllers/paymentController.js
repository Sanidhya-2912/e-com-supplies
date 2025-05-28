const paymentGateway = require('../utils/dummyPaymentGateway');

/**
 * @desc    Create payment session
 * @route   POST /api/payment/create-session
 * @access  Private
 */
const createPaymentSession = async (req, res) => {
  try {
    console.log('Payment session request received:', {
      orderId: req.body.orderId,
      amount: req.body.amount
    });

    const { orderId, amount, currency, callbackUrl } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and amount are required'
      });
    }

    // Simulate session creation using dummy gateway
    const sessionResult = await paymentGateway.createPaymentSession({
      orderId,
      amount,
      currency: currency || 'INR',
      callbackUrl: callbackUrl || null,
      customer: {
        name: req.user?.name || 'Test User',
        email: req.user?.email || 'test@example.com'
      }
    });

    console.log('Payment session created:', sessionResult);

    res.status(200).json(sessionResult);

  } catch (error) {
    console.error('Payment session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not create payment session',
      error: error.message
    });
  }
};

/**
 * @desc    Process payment
 * @route   POST /api/payment/process
 * @access  Private
 */
const processPayment = async (req, res) => {
  try {
    console.log('Payment processing request received:', {
      orderId: req.body.orderId,
      amount: req.body.amount,
      method: req.body.method,
    });

    const { 
      orderId,
      amount,
      method,
      sessionId,
      cardNumber,
      expiryDate,
      cvv,
      cardName,
      upiId,
      bankId,
      walletId
    } = req.body;

    if (!orderId || !amount || !method) {
      console.log('Payment validation error: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide order ID, amount, and payment method'
      });
    }

    const paymentData = {
      orderId,
      amount,
      method,
      sessionId,
      currency: req.body.currency || 'INR'
    };

    if (method === paymentGateway.PAYMENT_METHODS.CREDIT_CARD || 
        method === paymentGateway.PAYMENT_METHODS.DEBIT_CARD) {
      Object.assign(paymentData, { cardNumber, expiryDate, cvv, cardName });
    } else if (method === paymentGateway.PAYMENT_METHODS.UPI) {
      Object.assign(paymentData, { upiId });
    } else if (method === paymentGateway.PAYMENT_METHODS.NET_BANKING) {
      Object.assign(paymentData, { bankId });
    } else if (method === paymentGateway.PAYMENT_METHODS.WALLET) {
      Object.assign(paymentData, { walletId });
    }

    const paymentResult = await paymentGateway.processPayment(paymentData);

    console.log('Payment gateway result:', {
      success: paymentResult.success,
      transactionId: paymentResult.transactionId || 'none',
      status: paymentResult.status || 'none',
      errorCode: paymentResult.code || 'none',
    });

    if (paymentResult.success) {
      res.status(200).json(paymentResult);
    } else {
      res.status(400).json(paymentResult);
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

/**
 * @desc    Verify payment status
 * @route   GET /api/payment/verify/:transactionId
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    console.log('Payment verification request received:', {
      transactionId: req.params.transactionId,
      userId: req.user._id
    });

    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    const verificationResult = await paymentGateway.verifyPayment(transactionId);

    console.log('Payment verification result:', {
      success: verificationResult.success,
      status: verificationResult.status || 'none',
      errorCode: verificationResult.code || 'none',
    });

    if (verificationResult.success) {
      res.status(200).json(verificationResult);
    } else {
      res.status(400).json(verificationResult);
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

/**
 * @desc    Get payment options
 * @route   GET /api/payment/options
 * @access  Public
 */
const getPaymentOptions = (req, res) => {
  try {
    console.log('Payment options request received');

    const options = paymentGateway.getPaymentOptions();

    res.status(200).json(options);
  } catch (error) {
    console.error('Payment options request error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve payment options',
      error: error.message
    });
  }
};

/**
 * @desc    Get test cards
 * @route   GET /api/payment/test-cards
 * @access  Public
 */
const getTestCards = (req, res) => {
  try {
    console.log('Test cards request received');

    res.status(200).json({
      success: true,
      testCards: paymentGateway.TEST_CARDS,
      testUpi: paymentGateway.TEST_UPI,
      banks: paymentGateway.BANK_LIST,
      wallets: paymentGateway.WALLET_OPTIONS,
      instructions: {
        credit_card: {
          success: "Use 4242424242424242 for successful payments",
          insufficient: "Use 4000000000000002 to simulate insufficient funds",
          declined: "Use 4000000000000009 to simulate declined payments",
          error: "Use 4000000000000127 to simulate a processing error"
        },
        upi: {
          success: "Use success@dummypay for successful payments",
          declined: "Use declined@dummypay for declined payments",
          processing: "Use processing@dummypay for payments that stay in pending status"
        }
      }
    });
  } catch (error) {
    console.error('Test cards request error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve test cards',
      error: error.message
    });
  }
};

/**
 * @desc    Get transaction details
 * @route   GET /api/payment/transaction/:transactionId
 * @access  Private
 */
const getTransactionDetails = async (req, res) => {
  try {
    console.log('Transaction details request received:', {
      transactionId: req.params.transactionId,
      userId: req.user._id
    });

    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    const transactionResult = await paymentGateway.getTransactionDetails(transactionId);

    console.log('Transaction details result:', {
      success: transactionResult.success,
      transactionId: transactionId,
    });

    if (transactionResult.success) {
      res.status(200).json(transactionResult);
    } else {
      res.status(400).json(transactionResult);
    }
  } catch (error) {
    console.error('Transaction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Could not retrieve transaction details',
      error: error.message
    });
  }
};

module.exports = {
  createPaymentSession,
  processPayment,
  verifyPayment,
  getPaymentOptions,
  getTestCards,
  getTransactionDetails
};
