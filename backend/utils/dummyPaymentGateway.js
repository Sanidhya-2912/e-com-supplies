/**
 * Enhanced Dummy Payment Gateway Utility
 * 
 * This is a simulated payment gateway for testing purposes.
 * DO NOT use in production - this is for demonstration only.
 */

const crypto = require('crypto');

// In-memory storage for payment transactions
const transactions = new Map();

// Supported payment methods
const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet'
};

// Test card numbers for different scenarios
const TEST_CARDS = {
  success: '4242424242424242',
  declined: '4000000000000002',
  insufficient: '4000000000000009',
  error: '4000000000000127'
};

// Test UPI IDs
const TEST_UPI = {
  success: 'success@dummypay',
  declined: 'declined@dummypay',
  processing: 'processing@dummypay'
};

// Bank list for net banking
const BANK_LIST = [
  { id: 'SBI', name: 'State Bank of India' },
  { id: 'HDFC', name: 'HDFC Bank' },
  { id: 'ICICI', name: 'ICICI Bank' },
  { id: 'AXIS', name: 'Axis Bank' },
  { id: 'KOTAK', name: 'Kotak Mahindra Bank' }
];

// Wallet options
const WALLET_OPTIONS = [
  { id: 'paytm', name: 'Paytm' },
  { id: 'phonepe', name: 'PhonePe' },
  { id: 'gpay', name: 'Google Pay' },
  { id: 'amazonpay', name: 'Amazon Pay' }
];

// Health check function
const healthCheck = () => {
  return {
    status: 'available',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    gateway: 'DummyPay',
    supportedMethods: Object.values(PAYMENT_METHODS)
  };
};

// Get payment options and configuration
const getPaymentOptions = () => {
  return {
    success: true,
    methods: [
      {
        id: PAYMENT_METHODS.CREDIT_CARD,
        name: 'Credit Card',
        enabled: true,
        testCards: TEST_CARDS
      },
      {
        id: PAYMENT_METHODS.DEBIT_CARD,
        name: 'Debit Card',
        enabled: true,
        testCards: TEST_CARDS
      },
      {
        id: PAYMENT_METHODS.UPI,
        name: 'UPI',
        enabled: true,
        testUpi: TEST_UPI
      },
      {
        id: PAYMENT_METHODS.NET_BANKING,
        name: 'Net Banking',
        enabled: true,
        banks: BANK_LIST
      },
      {
        id: PAYMENT_METHODS.WALLET,
        name: 'Wallet',
        enabled: true,
        options: WALLET_OPTIONS
      }
    ],
    preferredMethod: PAYMENT_METHODS.CREDIT_CARD
  };
};

/**
 * Create a payment session
 * @param {Object} sessionData - Session data
 * @returns {Object} Session creation result
 */
const createPaymentSession = async (sessionData) => {
  console.log('Creating payment session:', {
    amount: sessionData.amount,
    orderId: sessionData.orderId,
    currency: sessionData.currency || 'INR',
  });

  // Validate required fields
  if (!sessionData.amount || !sessionData.orderId) {
    console.log('Session creation failed: Missing required fields');
    return {
      success: false,
      error: 'Missing required session information',
      code: 'VALIDATION_ERROR'
    };
  }

  // Generate session ID
  const sessionId = 'session_' + crypto.randomBytes(12).toString('hex');
  
  // Create session object
  const session = {
    id: sessionId,
    amount: sessionData.amount,
    currency: sessionData.currency || 'INR',
    orderId: sessionData.orderId,
    status: 'created',
    created: new Date().toISOString(),
    expires: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes expiry
    customer: sessionData.customer || {
      name: 'Guest Customer',
      email: sessionData.email || 'guest@example.com'
    },
    paymentMethods: Object.values(PAYMENT_METHODS),
    callbackUrl: sessionData.callbackUrl || null
  };
  
  // Store session
  transactions.set(sessionId, session);
  
  return {
    success: true,
    sessionId,
    amount: session.amount,
    currency: session.currency,
    orderId: session.orderId,
    status: session.status,
    created: session.created,
    expires: session.expires,
    checkoutUrl: `/api/payment/checkout/${sessionId}`
  };
};

/**
 * Process a payment
 * @param {Object} paymentData - Payment data
 * @returns {Object} Payment result
 */
const processPayment = async (paymentData) => {
  console.log('Processing payment:', {
    amount: paymentData.amount,
    orderId: paymentData.orderId,
    method: paymentData.method,
    sessionId: paymentData.sessionId || 'direct_payment'
  });

  // Validate required fields based on payment method
  if (!paymentData.amount) {
    console.log('Payment validation failed: Missing amount');
    return {
      success: false,
      error: 'Payment amount is required',
      code: 'VALIDATION_ERROR'
    };
  }

  // Method-specific validation
  if (paymentData.method === PAYMENT_METHODS.CREDIT_CARD || paymentData.method === PAYMENT_METHODS.DEBIT_CARD) {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      console.log('Card payment validation failed: Missing card details');
      return {
        success: false,
        error: 'Missing required card information',
        code: 'VALIDATION_ERROR'
      };
    }
  } else if (paymentData.method === PAYMENT_METHODS.UPI) {
    if (!paymentData.upiId) {
      console.log('UPI payment validation failed: Missing UPI ID');
      return {
        success: false,
        error: 'UPI ID is required',
        code: 'VALIDATION_ERROR'
      };
    }
  } else if (paymentData.method === PAYMENT_METHODS.NET_BANKING) {
    if (!paymentData.bankId) {
      console.log('Net banking validation failed: Missing bank ID');
      return {
        success: false,
        error: 'Bank selection is required',
        code: 'VALIDATION_ERROR'
      };
    }
  } else if (paymentData.method === PAYMENT_METHODS.WALLET) {
    if (!paymentData.walletId) {
      console.log('Wallet payment validation failed: Missing wallet ID');
      return {
        success: false,
        error: 'Wallet selection is required',
        code: 'VALIDATION_ERROR'
      };
    }
  }

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Handle different payment methods
  if (paymentData.method === PAYMENT_METHODS.CREDIT_CARD || paymentData.method === PAYMENT_METHODS.DEBIT_CARD) {
    return processCardPayment(paymentData);
  } else if (paymentData.method === PAYMENT_METHODS.UPI) {
    return processUpiPayment(paymentData);
  } else if (paymentData.method === PAYMENT_METHODS.NET_BANKING) {
    return processNetBankingPayment(paymentData);
  } else if (paymentData.method === PAYMENT_METHODS.WALLET) {
    return processWalletPayment(paymentData);
  } else {
    console.log(`Unsupported payment method: ${paymentData.method}`);
    return {
      success: false,
      error: 'Unsupported payment method',
      code: 'UNSUPPORTED_METHOD'
    };
  }
};

// Process card payment
const processCardPayment = async (paymentData) => {
  // Detect card type based on first digit
  const cardType = detectCardType(paymentData.cardNumber);
  
  // Get last 4 digits of card
  const last4 = paymentData.cardNumber.slice(-4);
  
  // Handle test card scenarios
  switch (paymentData.cardNumber) {
    case TEST_CARDS.success:
      // Success case
      console.log('Test card used: Success scenario');
      const transactionId = generateTransactionId();
      const transaction = {
        id: transactionId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        orderId: paymentData.orderId,
        sessionId: paymentData.sessionId || 'direct_payment',
        method: paymentData.method,
        status: 'completed',
        cardType,
        last4,
        timestamp: new Date().toISOString()
      };
      
      // Store transaction for later verification
      transactions.set(transactionId, transaction);
      
      return {
        success: true,
        transactionId,
        status: 'completed',
        message: 'Payment processed successfully',
        method: paymentData.method,
        cardType,
        last4,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        timestamp: transaction.timestamp
      };
      
    case TEST_CARDS.declined:
      console.log('Test card used: Declined scenario');
      return {
        success: false,
        error: 'Your card was declined',
        code: 'CARD_DECLINED',
        cardType,
        last4
      };
      
    case TEST_CARDS.insufficient:
      console.log('Test card used: Insufficient funds scenario');
      return {
        success: false,
        error: 'Insufficient funds',
        code: 'INSUFFICIENT_FUNDS',
        cardType,
        last4
      };
      
    case TEST_CARDS.error:
      console.log('Test card used: Processing error scenario');
      return {
        success: false,
        error: 'An error occurred while processing your card',
        code: 'PROCESSING_ERROR',
        cardType,
        last4
      };
      
    default:
      // For any other card number, simulate success 80% of the time
      if (Math.random() < 0.8) {
        console.log('Random success scenario');
        const transactionId = generateTransactionId();
        const transaction = {
          id: transactionId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          orderId: paymentData.orderId,
          sessionId: paymentData.sessionId || 'direct_payment',
          method: paymentData.method,
          status: 'completed',
          cardType,
          last4,
          timestamp: new Date().toISOString()
        };
        
        transactions.set(transactionId, transaction);
        
        return {
          success: true,
          transactionId,
          status: 'completed',
          message: 'Payment processed successfully',
          method: paymentData.method,
          cardType,
          last4,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          timestamp: transaction.timestamp
        };
      } else {
        console.log('Random failure scenario');
        return {
          success: false,
          error: 'Transaction declined by bank',
          code: 'BANK_DECLINE',
          cardType,
          last4
        };
      }
  }
};

// Process UPI payment
const processUpiPayment = async (paymentData) => {
  const upiId = paymentData.upiId;
  
  // Handle test UPI scenarios
  switch (upiId) {
    case TEST_UPI.success:
      console.log('Test UPI used: Success scenario');
      const transactionId = generateTransactionId();
      const transaction = {
        id: transactionId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        orderId: paymentData.orderId,
        sessionId: paymentData.sessionId || 'direct_payment',
        method: PAYMENT_METHODS.UPI,
        status: 'completed',
        upiId,
        timestamp: new Date().toISOString()
      };
      
      transactions.set(transactionId, transaction);
      
      return {
        success: true,
        transactionId,
        status: 'completed',
        message: 'UPI payment processed successfully',
        method: PAYMENT_METHODS.UPI,
        upiId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        timestamp: transaction.timestamp
      };
      
    case TEST_UPI.declined:
      console.log('Test UPI used: Declined scenario');
      return {
        success: false,
        error: 'UPI payment declined',
        code: 'UPI_DECLINED',
        upiId
      };
      
    case TEST_UPI.processing:
      console.log('Test UPI used: Processing scenario');
      const pendingTransactionId = generateTransactionId();
      const pendingTransaction = {
        id: pendingTransactionId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        orderId: paymentData.orderId,
        sessionId: paymentData.sessionId || 'direct_payment',
        method: PAYMENT_METHODS.UPI,
        status: 'pending',
        upiId,
        timestamp: new Date().toISOString()
      };
      
      transactions.set(pendingTransactionId, pendingTransaction);
      
      return {
        success: true,
        transactionId: pendingTransactionId,
        status: 'pending',
        message: 'UPI payment is processing',
        method: PAYMENT_METHODS.UPI,
        upiId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        timestamp: pendingTransaction.timestamp
      };
      
    default:
      // Random success/failure
      if (Math.random() < 0.8) {
        console.log('Random UPI success scenario');
        const transactionId = generateTransactionId();
        const transaction = {
          id: transactionId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          orderId: paymentData.orderId,
          sessionId: paymentData.sessionId || 'direct_payment',
          method: PAYMENT_METHODS.UPI,
          status: 'completed',
          upiId,
          timestamp: new Date().toISOString()
        };
        
        transactions.set(transactionId, transaction);
        
        return {
          success: true,
          transactionId,
          status: 'completed',
          message: 'UPI payment processed successfully',
          method: PAYMENT_METHODS.UPI,
          upiId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'INR',
          timestamp: transaction.timestamp
        };
      } else {
        console.log('Random UPI failure scenario');
        return {
          success: false,
          error: 'UPI payment failed',
          code: 'UPI_FAILED',
          upiId
        };
      }
  }
};

// Process net banking payment
const processNetBankingPayment = async (paymentData) => {
  const bankId = paymentData.bankId;
  
  // Find bank name from ID
  const bank = BANK_LIST.find(b => b.id === bankId);
  const bankName = bank ? bank.name : 'Unknown Bank';
  
  // 90% success rate for net banking
  if (Math.random() < 0.9) {
    console.log('Net banking success scenario');
    const transactionId = generateTransactionId();
    const transaction = {
      id: transactionId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      orderId: paymentData.orderId,
      sessionId: paymentData.sessionId || 'direct_payment',
      method: PAYMENT_METHODS.NET_BANKING,
      status: 'completed',
      bankId,
      bankName,
      timestamp: new Date().toISOString()
    };
    
    transactions.set(transactionId, transaction);
    
    return {
      success: true,
      transactionId,
      status: 'completed',
      message: 'Net banking payment processed successfully',
      method: PAYMENT_METHODS.NET_BANKING,
      bankId,
      bankName,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      timestamp: transaction.timestamp
    };
  } else {
    console.log('Net banking failure scenario');
    return {
      success: false,
      error: 'Net banking payment failed',
      code: 'NETBANKING_FAILED',
      bankId,
      bankName
    };
  }
};

// Process wallet payment
const processWalletPayment = async (paymentData) => {
  const walletId = paymentData.walletId;
  
  // Find wallet name from ID
  const wallet = WALLET_OPTIONS.find(w => w.id === walletId);
  const walletName = wallet ? wallet.name : 'Unknown Wallet';
  
  // 85% success rate for wallets
  if (Math.random() < 0.85) {
    console.log('Wallet payment success scenario');
    const transactionId = generateTransactionId();
    const transaction = {
      id: transactionId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      orderId: paymentData.orderId,
      sessionId: paymentData.sessionId || 'direct_payment',
      method: PAYMENT_METHODS.WALLET,
      status: 'completed',
      walletId,
      walletName,
      timestamp: new Date().toISOString()
    };
    
    transactions.set(transactionId, transaction);
    
    return {
      success: true,
      transactionId,
      status: 'completed',
      message: 'Wallet payment processed successfully',
      method: PAYMENT_METHODS.WALLET,
      walletId,
      walletName,
      amount: paymentData.amount,
      currency: paymentData.currency || 'INR',
      timestamp: transaction.timestamp
    };
  } else {
    console.log('Wallet payment failure scenario');
    return {
      success: false,
      error: 'Wallet payment failed',
      code: 'WALLET_FAILED',
      walletId,
      walletName
    };
  }
};

/**
 * Verify a payment by transaction ID
 * @param {string} transactionId - Transaction ID to verify
 * @returns {Object} Verification result
 */
const verifyPayment = async (transactionId) => {
  console.log(`Verifying payment transaction: ${transactionId}`);
  
  if (!transactionId) {
    console.log('Verification failed: No transaction ID provided');
    return {
      success: false,
      error: 'Transaction ID is required',
      code: 'MISSING_TRANSACTION_ID'
    };
  }
  
  // Check if transaction exists
  if (!transactions.has(transactionId)) {
    console.log(`Verification failed: Transaction ${transactionId} not found`);
    return {
      success: false,
      error: 'Transaction not found',
      code: 'TRANSACTION_NOT_FOUND'
    };
  }
  
  // Retrieve transaction
  const transaction = transactions.get(transactionId);
  
  // Handle pending transactions (randomly resolve them)
  if (transaction.status === 'pending') {
    const isSuccess = Math.random() < 0.7; // 70% chance of success for pending transactions
    if (isSuccess) {
      transaction.status = 'completed';
      transaction.completedAt = new Date().toISOString();
      transactions.set(transactionId, transaction);
      console.log(`Pending transaction ${transactionId} resolved as successful`);
    } else {
      transaction.status = 'failed';
      transaction.failedAt = new Date().toISOString();
      transaction.failureReason = 'Transaction timed out';
      transactions.set(transactionId, transaction);
      console.log(`Pending transaction ${transactionId} resolved as failed`);
    }
  }
  
  console.log(`Transaction ${transactionId} verified with status: ${transaction.status}`);
  
  return {
    success: true,
    transactionId,
    status: transaction.status,
    amount: transaction.amount,
    currency: transaction.currency,
    orderId: transaction.orderId,
    method: transaction.method,
    timestamp: transaction.timestamp,
    completedAt: transaction.completedAt,
    failedAt: transaction.failedAt,
    failureReason: transaction.failureReason
  };
};

/**
 * Get transaction details
 * @param {string} transactionId - Transaction ID
 * @returns {Object} Transaction details
 */
const getTransactionDetails = async (transactionId) => {
  console.log(`Getting transaction details: ${transactionId}`);
  
  if (!transactionId) {
    console.log('Get transaction failed: No transaction ID provided');
    return {
      success: false,
      error: 'Transaction ID is required',
      code: 'MISSING_TRANSACTION_ID'
    };
  }
  
  // Check if transaction exists
  if (!transactions.has(transactionId)) {
    console.log(`Get transaction failed: Transaction ${transactionId} not found`);
    return {
      success: false,
      error: 'Transaction not found',
      code: 'TRANSACTION_NOT_FOUND'
    };
  }
  
  // Retrieve transaction
  const transaction = transactions.get(transactionId);
  
  console.log(`Retrieved transaction ${transactionId} details`);
  
  return {
    success: true,
    transaction: {
      id: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      orderId: transaction.orderId,
      status: transaction.status,
      method: transaction.method,
      timestamp: transaction.timestamp,
      completedAt: transaction.completedAt,
      failedAt: transaction.failedAt,
      // Include method-specific details
      ...(transaction.cardType && { cardType: transaction.cardType }),
      ...(transaction.last4 && { last4: transaction.last4 }),
      ...(transaction.upiId && { upiId: transaction.upiId }),
      ...(transaction.bankId && { bankId: transaction.bankId }),
      ...(transaction.bankName && { bankName: transaction.bankName }),
      ...(transaction.walletId && { walletId: transaction.walletId }),
      ...(transaction.walletName && { walletName: transaction.walletName })
    }
  };
};

// Helper function to generate a random transaction ID
const generateTransactionId = () => {
  return 'txn_' + crypto.randomBytes(12).toString('hex');
};

// Helper function to detect card type
const detectCardType = (cardNumber) => {
  const firstDigit = cardNumber.charAt(0);
  
  switch (firstDigit) {
    case '4':
      return 'visa';
    case '5':
      return 'mastercard';
    case '3':
      return 'amex';
    case '6':
      return 'discover';
    default:
      return 'unknown';
  }
};

module.exports = {
  TEST_CARDS,
  TEST_UPI,
  PAYMENT_METHODS,
  BANK_LIST,
  WALLET_OPTIONS,
  healthCheck,
  getPaymentOptions,
  createPaymentSession,
  processPayment,
  verifyPayment,
  getTransactionDetails
}; 