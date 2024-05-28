const SecureCheckout = () => {
  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Secure Checkout:</h2>
      <div className="flex items-center space-x-4 mb-4">
        <button className="bg-blue-500 py-2 px-4 rounded">PayPal</button>
        <button className="bg-blue-500 py-2 px-4 rounded">VISA</button>
        <button className="bg-blue-500 py-2 px-4 rounded">Mastercard</button>
      </div>
      <div className="flex justify-between items-center">
        <button className="bg-yellow-500 py-2 px-4 rounded">
          Buy for 2750 credits
        </button>
        <button className="bg-green-500 py-2 px-4 rounded">
          Buy for $27.99
        </button>
      </div>
    </div>
  );
};

export default SecureCheckout;
