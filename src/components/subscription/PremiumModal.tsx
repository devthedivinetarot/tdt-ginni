import { useState, useEffect } from 'react';
import { loadRazorpayScript, openRazorpayCheckout, RazorpayOptions } from '@/lib/razorpay/client';
import { useSubscription } from '@/hooks/useSubscription';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { refetch } = useSubscription();

  useEffect(() => {
    if (!isOpen) return;

    loadRazorpayScript().then((loaded) => {
      setIsScriptLoaded(loaded);
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
      }
    });
  }, [isOpen]);

  const handleUpgrade = async () => {
    if (!isScriptLoaded) {
      setError('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/premium-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { orderId, amount, currency, keyId } = await response.json();

      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: 'Divine Tarot Premium',
        description: 'Unlock unlimited tarot readings for ₹199/month',
        order_id: orderId,
      };

      const paymentResponse = await openRazorpayCheckout(options);

      const verifyResponse = await fetch('/api/premium-order/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: paymentResponse.razorpay_order_id,
          paymentId: paymentResponse.razorpay_payment_id,
          signature: paymentResponse.razorpay_signature,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Payment verification failed');
      }

      setSuccess(true);
      await refetch();

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-yellow-500/20 max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            Unlock Premium
          </h2>
          <p className="text-gray-300 mb-6">
            Unlimited tarot readings for just ₹199/month
          </p>

          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg text-green-300">
              Payment successful! Welcome to Premium.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4 text-left mb-6">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400">✓</span>
              <span>Unlimited tarot readings</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-400">✓</span>
              <span>Unlimited messages with Ginni</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-400">✓</span>
              <span>Deep spiritual insights</span>
            </div>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading || !isScriptLoaded}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-300 text-black font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Unlock Premium'}
          </button>
        </div>
      </div>
    </div>
  );
}