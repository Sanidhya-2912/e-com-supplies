import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";
import { ChevronLeft, CreditCard, Truck, CheckCircle } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "credit"
  });
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Calculate shipping cost (free shipping over $50)
  const shippingCost = cartTotal > 50 ? 0 : 4.99;
  
  // Calculate tax (8% of subtotal)
  const taxRate = 0.08;
  const taxAmount = cartTotal * taxRate;
  
  // Calculate order total
  const orderTotal = cartTotal + shippingCost + taxAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      processOrder();
    }
  };
  
  const processOrder = () => {
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && !isComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ChevronLeft size={16} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mb-6">
            <CheckCircle size={36} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Complete!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order has been received and will be processed shortly.
          </p>
          <div className="mb-8 py-4 px-6 bg-background border border-border rounded-lg">
            <p className="font-medium">Order Total: {formatPrice(orderTotal)}</p>
            <p className="text-sm text-muted-foreground">A confirmation email has been sent to {formData.email}</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                1
              </div>
              <span className="font-medium">Shipping Information</span>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                2
              </div>
              <span className="font-medium">Payment Details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-6">
            {step === 1 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-sm">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block mb-2 text-sm">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-border rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block mb-2 text-sm">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block mb-2 text-sm">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block mb-2 text-sm">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-border rounded-md"
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="au">Australia</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <input
                      type="radio"
                      id="credit"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === "credit"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="credit" className="flex items-center">
                      <CreditCard size={18} className="mr-2" />
                      Credit / Debit Card
                    </label>
                  </div>
                  
                  {formData.paymentMethod === "credit" && (
                    <div className="border border-border rounded-md p-4 ml-6">
                      <div className="mb-4">
                        <label htmlFor="cardNumber" className="block mb-2 text-sm">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="w-full p-2 border border-border rounded-md"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expDate" className="block mb-2 text-sm">
                            Expiration Date
                          </label>
                          <input
                            type="text"
                            id="expDate"
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block mb-2 text-sm">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            className="w-full p-2 border border-border rounded-md"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="paypal">
                      PayPal
                    </label>
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-primary hover:text-primary-700 transition-colors"
                  >
                    &larr; Back to shipping information
                  </button>
                </div>
              </>
            )}

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    </span>
                    Processing...
                  </>
                ) : step === 1 ? (
                  "Continue to Payment"
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="md:w-1/3">
          <div className="bg-background rounded-lg shadow-sm border border-border p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="border-b border-border pb-4 mb-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-1">x{item.quantity}</span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="flex items-center">
                  {shippingCost === 0 ? (
                    <>
                      <Truck size={14} className="mr-1" />
                      Free
                    </>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div className="h-px bg-border my-3"></div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 