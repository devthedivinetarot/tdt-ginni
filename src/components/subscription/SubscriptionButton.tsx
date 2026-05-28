'use client';

import { useState, useCallback } from 'react';
import { useUser } from '@/lib/auth/useUser';
import { useSubscription } from '@/hooks/useSubscription';

interface SubscriptionButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SubscriptionButton({
  variant = 'primary',
  size = 'md',
  className = '',
}: SubscriptionButtonProps) {
  const { user, isLoading: userLoading } = useUser();
  const { isActive: premiumActive, refresh } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = premiumActive;
  const userId = user?.id || null;

  const getButtonStyles = useCallback(() => {
    const baseStyles = 'rounded-xl font-semibold transition-all duration-300 ';
    
    if (variant === 'primary') {
      return baseStyles + 'bg-gradient-to-r from-[#FFD700] to-[#FFC400] text-black hover:shadow-lg hover:shadow-[#FFD700]/25';
    } else {
      return baseStyles + 'bg-white/10 text-[#EAEAF0] hover:bg-white/20 border border-white/20';
    }
  }, [variant]);

  const getSizeStyles = useCallback(() => {
    switch (size) {
      case 'sm': return 'py-2.5 px-4 text-sm';
      case 'lg': return 'py-4 px-6 text-lg';
      default: return 'py-3.5 px-5 text-base';
    }
  }, [size]);

  const handleClick = useCallback(async () => {
    if (isProcessing || isPremium) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { handlePremiumCheckout } = await import('@/lib/payments/handlePremiumCheckout');
      
      // Updated: handlePremiumCheckout now gets userId from authenticated session
      const result = await handlePremiumCheckout('subscription-button');

      if (result.success) {
        await refresh();
      } else if (result.error !== 'Payment cancelled') {
        setError(result.error || 'Payment failed');
        setIsProcessing(false);
      } else {
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('[SubscriptionButton] Payment error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }, [isProcessing, isPremium, refresh]);

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing || isPremium || userLoading}
      className={`${getButtonStyles()} ${getSizeStyles()} ${className} w-full`}
    >
      {isProcessing ? (
        <>
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
          Processing...
        </>
      ) : isPremium ? (
        <>
          <span className="mr-2">✓</span> Active Premium
        </>
      ) : (
        <>
           <Crown className="w-4 h-4 mr-2" /> Unlock Premium — ₹199/month
        </>
      )}
    </button>
  );
}

function Crown({ className = 'w-4 h-4' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v5.25c0 .564.18 1.083.507 1.5L12 20l8.493-5.247c.327-.417.507-.936.507-1.5V6.253C19.168 5.477 17.582 5 16 5s-3.168.477-4.5 1.253z" /></svg>;
}