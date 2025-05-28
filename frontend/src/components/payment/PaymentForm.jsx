import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertCircle, Info, Smartphone, Building, Wallet, CreditCard as CardIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../lib/api';

const PaymentForm = ({ orderId, amount, onPaymentSuccess, onPaymentError }) => {
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentOptions, setPaymentOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [apiStatus, setApiStatus] = useState({ checked: false, available: false });
  const [sessionId, setSessionId] = useState(null);
  
  // Credit/Debit card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // UPI fields
  const [upiId, setUpiId] = useState('');
  
  // Net banking fields
  const [selectedBank, setSelectedBank] = useState('');
  
  // Wallet fields
  const [selectedWallet, setSelectedWallet] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check API availability and get payment options
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        // First check the health endpoint
        const healthResponse = await axios.get(`${BASE_URL}/payment/health`, { timeout: 3000 });
        
        if (healthResponse.data.success) {
          setApiStatus({ checked: true, available: true });
          
          // Then get payment options
          const optionsResponse = await axios.get(`${BASE_URL}/payment/options`);
          setPaymentOptions(optionsResponse.data);
          
          // Get test cards for development
          const testCardsResponse = await axios.get(`${BASE_URL}/payment/test-cards`);
          console.log('Test payment data:', testCardsResponse.data);
          
          // Create a payment session
          await createPaymentSession();
        }
      } catch (error) {
        console.error('Payment API unavailable:', error);
        setApiStatus({ checked: true, available: false });
        setError(`Payment service connection issue: ${error.message || 'Cannot reach payment service'}`);
      }
    };

    checkApiAvailability();
  }, []);
  
  // Create a payment session
  const createPaymentSession = async () => {
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await axios.post(
        `${BASE_URL}/payment/create-session`,
        {
          orderId,
          amount,
          currency: 'INR',
          callbackUrl: window.location.origin + '/payment-callback'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        console.log('Payment session created:', response.data);
        setSessionId(response.data.sessionId);
      }
    } catch (error) {
      console.error('Failed to create payment session:', error);
      setError('Failed to initialize payment. Please try again.');
    }
  };

  // Format card number with spaces for better readability
  const formatCardNumber = (value) => {
    const val = value.replace(/\s+/g, '');
    if (val.length === 0) return '';
    
    // Split into groups of 4 digits
    const parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.slice(i, i + 4));
    }
    
    return parts.join(' ');
  };

  // Handle card number input with formatting
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 16) {
      setCardNumber(formatCardNumber(value));
    }
  };

  // Format expiry date with slash
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    
    if (value.length <= 4) {
      if (value.length > 2) {
        // Format as MM/YY
        setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiryDate(value);
      }
    }
  };

  // Limit CVV to 3 or 4 digits
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  // Use test card number
  const useTestCard = (cardNumber) => {
    setCardNumber(formatCardNumber(cardNumber));
    setExpiryDate('12/25');
    setCvv('123');
    setCardName('Test User');
  };
  
  // Use test UPI ID
  const useTestUpi = (upiId) => {
    setUpiId(upiId);
  };

  // Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    if (!apiStatus.available) {
      setError('Payment service is currently unavailable. Please try again later.');
      setLoading(false);
      return;
    }
    
    if (!user) {
      setError('You must be logged in to make a payment');
      setLoading(false);
      return;
    }
    
    try {
      // Get token from local storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Build payment data based on method
      const paymentData = {
        orderId,
        amount,
        method: paymentMethod,
        sessionId
      };
      
      // Add method-specific fields
      if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
        // Validate card details
        if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardName.trim()) {
          setError('Please fill all card details');
          setLoading(false);
          return;
        }
        
        Object.assign(paymentData, {
          cardNumber: cardNumber.replace(/\s+/g, ''),  // Remove spaces
          expiryDate,
          cvv,
          cardName
        });
      } else if (paymentMethod === 'upi') {
        // Validate UPI ID
        if (!upiId.trim()) {
          setError('Please enter a valid UPI ID');
          setLoading(false);
          return;
        }
        
        Object.assign(paymentData, { upiId });
      } else if (paymentMethod === 'net_banking') {
        // Validate bank selection
        if (!selectedBank) {
          setError('Please select a bank');
          setLoading(false);
          return;
        }
        
        Object.assign(paymentData, { bankId: selectedBank });
      } else if (paymentMethod === 'wallet') {
        // Validate wallet selection
        if (!selectedWallet) {
          setError('Please select a wallet');
          setLoading(false);
          return;
        }
        
        Object.assign(paymentData, { walletId: selectedWallet });
      }
      
      console.log('Processing payment with data:', {
        ...paymentData,
        // Hide sensitive fields from logs
        cardNumber: paymentData.cardNumber ? `${paymentData.cardNumber.slice(0, 4)}...${paymentData.cardNumber.slice(-4)}` : undefined,
        cvv: paymentData.cvv ? '***' : undefined
      });
      
      // Process payment
      const response = await axios.post(
        `${BASE_URL}/payment/process`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Payment response:', response.data);
      
      if (response.data.success) {
        setSuccess(true);
        setPaymentResult(response.data);
        
        // Notify parent component
        if (onPaymentSuccess) {
          onPaymentSuccess(response.data);
        }
        
        // Clear form fields
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardName('');
        setUpiId('');
        setSelectedBank('');
        setSelectedWallet('');
      } else {
        throw new Error(response.data.error || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Extract more detailed error information
      const errorResponse = error.response?.data;
      const errorMessage = errorResponse?.error || 
                         errorResponse?.message ||
                         error.message || 
                         'Payment processing failed. Please try again.';
      
      setError(errorMessage);
      
      // Notify parent component
      if (onPaymentError) {
        onPaymentError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to show API status
  const renderApiStatus = () => {
    if (!apiStatus.checked) {
      return (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 flex items-center gap-2 rounded-md">
          <Info size={16} />
          <span>Checking payment service availability...</span>
        </div>
      );
    }
    
    if (!apiStatus.available) {
      return (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md">
          <AlertCircle size={16} />
          <span>Payment service is currently unavailable. Please try again later.</span>
        </div>
      );
    }
    
    return null;
  };
  
  // Render method selection tabs
  const renderPaymentMethodTabs = () => {
    const methods = [
      { id: 'credit_card', name: 'Credit Card', icon: <CardIcon size={18} /> },
      { id: 'debit_card', name: 'Debit Card', icon: <CardIcon size={18} /> },
      { id: 'upi', name: 'UPI', icon: <Smartphone size={18} /> },
      { id: 'net_banking', name: 'Net Banking', icon: <Building size={18} /> },
      { id: 'wallet', name: 'Wallet', icon: <Wallet size={18} /> }
    ];
    
    return (
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {methods.map((method) => (
            <button
              key={method.id}
              type="button"
              className={`px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                paymentMethod === method.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-muted-foreground hover:bg-accent/80'
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              {method.icon}
              <span>{method.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  // Render credit/debit card form
  const renderCardForm = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="card-name">
          Name on Card
        </label>
        <input
          type="text"
          id="card-name"
          className="w-full p-2 border border-border rounded-md bg-background"
          placeholder="John Doe"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="card-number">
          Card Number
        </label>
        <input
          type="text"
          id="card-number"
          className="w-full p-2 border border-border rounded-md bg-background"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="expiry-date">
            Expiry Date
          </label>
          <input
            type="text"
            id="expiry-date"
            className="w-full p-2 border border-border rounded-md bg-background"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="cvv">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            className="w-full p-2 border border-border rounded-md bg-background"
            placeholder="123"
            value={cvv}
            onChange={handleCvvChange}
            required
          />
        </div>
      </div>
      
      {/* Test cards */}
      <div className="mb-6 p-3 bg-primary/10 rounded-lg text-sm">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-primary mt-0.5" />
          <div>
            <p className="font-medium mb-1">Test Cards:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => useTestCard('4242424242424242')}
                className="text-left hover:underline flex items-center gap-1 text-primary"
              >
                <span>Success:</span> 4242424242424242
              </button>
              <button
                type="button"
                onClick={() => useTestCard('4000000000000002')}
                className="text-left hover:underline flex items-center gap-1 text-primary"
              >
                <span>Declined:</span> 4000000000000002
              </button>
              <button
                type="button"
                onClick={() => useTestCard('4000000000000009')}
                className="text-left hover:underline flex items-center gap-1 text-primary"
              >
                <span>Insufficient funds:</span> 4000000000000009
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  // Render UPI form
  const renderUpiForm = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1" htmlFor="upi-id">
          UPI ID
        </label>
        <input
          type="text"
          id="upi-id"
          className="w-full p-2 border border-border rounded-md bg-background"
          placeholder="username@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          required
        />
      </div>
      
      {/* Test UPI IDs */}
      <div className="mb-6 p-3 bg-primary/10 rounded-lg text-sm">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-primary mt-0.5" />
          <div>
            <p className="font-medium mb-1">Test UPI IDs:</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => useTestUpi('success@dummypay')}
                className="text-left hover:underline flex items-center gap-1 text-primary"
              >
                <span>Success:</span> success@dummypay
              </button>
              <button
                type="button"
                onClick={() => useTestUpi('declined@dummypay')}
                className="text-left hover:underline flex items-center gap-1 text-primary"
              >
                <span>Declined:</span> declined@dummypay
              </button>
              <button
                type="button"
                onClick={() => useTestUpi('processing@dummypay')}
                className="text-left hover:underline flex items-center gap-1 text-primary"
              >
                <span>Processing:</span> processing@dummypay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  // Render net banking form
  const renderNetBankingForm = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2" htmlFor="bank-select">
        Select Bank
      </label>
      <select
        id="bank-select"
        className="w-full p-2 border border-border rounded-md bg-background"
        value={selectedBank}
        onChange={(e) => setSelectedBank(e.target.value)}
        required
      >
        <option value="">Select a bank</option>
        <option value="SBI">State Bank of India</option>
        <option value="HDFC">HDFC Bank</option>
        <option value="ICICI">ICICI Bank</option>
        <option value="AXIS">Axis Bank</option>
        <option value="KOTAK">Kotak Mahindra Bank</option>
      </select>
    </div>
  );
  
  // Render wallet form
  const renderWalletForm = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2" htmlFor="wallet-select">
        Select Wallet
      </label>
      <select
        id="wallet-select"
        className="w-full p-2 border border-border rounded-md bg-background"
        value={selectedWallet}
        onChange={(e) => setSelectedWallet(e.target.value)}
        required
      >
        <option value="">Select a wallet</option>
        <option value="paytm">Paytm</option>
        <option value="phonepe">PhonePe</option>
        <option value="gpay">Google Pay</option>
        <option value="amazonpay">Amazon Pay</option>
      </select>
    </div>
  );
  
  // Render payment form based on selected method
  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'credit_card':
      case 'debit_card':
        return renderCardForm();
      case 'upi':
        return renderUpiForm();
      case 'net_banking':
        return renderNetBankingForm();
      case 'wallet':
        return renderWalletForm();
      default:
        return renderCardForm();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Payment Details</h2>
        <CreditCard className="text-primary" size={24} />
      </div>
      
      {renderApiStatus()}
      
      {success ? (
        <div className="text-center py-6">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h3 className="text-lg font-bold mb-2">Payment Successful!</h3>
          <p className="mb-2">Amount: ${amount.toFixed(2)}</p>
          {paymentResult && (
            <div className="text-sm text-muted-foreground mb-4">
              <p>Transaction ID: {paymentResult.transactionId}</p>
              {paymentResult.last4 && <p>Card: **** **** **** {paymentResult.last4}</p>}
              {paymentResult.upiId && <p>UPI: {paymentResult.upiId}</p>}
              {paymentResult.bankName && <p>Bank: {paymentResult.bankName}</p>}
              {paymentResult.walletName && <p>Wallet: {paymentResult.walletName}</p>}
              <p>Time: {new Date(paymentResult.timestamp).toLocaleString()}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            View Your Orders
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="order-amount">
              Order Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="text"
                id="order-amount"
                className="w-full p-2 pl-7 border border-border rounded-md bg-background"
                value={amount ? amount.toFixed(2) : '0.00'}
                disabled
              />
            </div>
          </div>
          
          {/* Payment method selection */}
          {renderPaymentMethodTabs()}
          
          {/* Method-specific payment form */}
          {renderPaymentForm()}
          
          <button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
            disabled={loading || !apiStatus.available}
          >
            {loading ? 'Processing...' : `Pay $${amount ? amount.toFixed(2) : '0.00'}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentForm; 