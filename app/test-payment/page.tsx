'use client';

import React, { useState } from 'react';

export default function TestPaymentPage() {
  const [email, setEmail] = useState('test@example.com');
  const [customCart, setCustomCart] = useState('');
  const [result, setResult] = useState('Results will appear here...');

  async function testDefaultPayment() {
    try {
      setResult("Testing payment flow...");
      const response = await fetch(`/api/test-payment?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  }

  async function testWithLocalStorageCart() {
    try {
      const cart = localStorage.getItem('cart');
      if (!cart) {
        setResult("No cart found in localStorage!");
        return;
      }
      
      setResult("Testing with localStorage cart...");
      
      // Pass the cart data to the test endpoint
      const response = await fetch(`/api/test-payment?data=${encodeURIComponent(cart)}`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  }

  async function testWithCustomCart() {
    try {
      if (!customCart) {
        setResult("Please enter cart data!");
        return;
      }
      
      setResult("Testing with custom cart...");
      
      // For testing, we'll just pass the raw JSON
      const response = await fetch(`/api/test-payment?data=${encodeURIComponent(customCart)}`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Payment Flow</h1>
      
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Test with Default Mock Data</h2>
        <p className="mb-4">This will simulate a successful payment with a default test product</p>
        <div className="mb-4">
          <label htmlFor="test-email" className="block mb-2">Test Email:</label>
          <input 
            type="email" 
            id="test-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button 
          onClick={testDefaultPayment}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test Default Payment Flow
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Test with Cart from LocalStorage</h2>
        <p className="mb-4">This will use your actual cart data from localStorage (if available)</p>
        <button 
          onClick={testWithLocalStorageCart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test With Current Cart
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Test with Custom Cart Data</h2>
        <p className="mb-4">Paste your custom cart JSON here:</p>
        <textarea 
          id="custom-cart" 
          rows={10} 
          value={customCart}
          onChange={(e) => setCustomCart(e.target.value)}
          placeholder={`[{"image":"https://example.com/image.jpg","name":"iPhone 12","productId":"prod123","color":"Black","capacity":128,"grade":"A","price":500,"quantity":1},{"email":"test@example.com","total":500,"discount":0,"promo":""}]`}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button 
          onClick={testWithCustomCart}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Test With Custom Cart
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Response:</h2>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto">
          {result}
        </pre>
      </div>
    </div>
  );
}