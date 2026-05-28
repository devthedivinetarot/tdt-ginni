import { logEvent } from '@/lib/utils/tracking';
import { loadRazorpayScript, isRazorpayLoaded } from '@/lib/razorpay/client';
import { supabase } from '@/lib/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentId?: string;
  subscriptionId?: string;
}

/**
 * Get authenticated user ID from Supabase session
 * This ensures we never trust client-provided userId for security-critical operations
 */
async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return null;
    }
    return user.id;
  } catch (e) {
    console.error('[handlePremiumCheckout] Auth error:', e);
    return null;
  }
}

export async function handlePremiumCheckout(
  triggerSource: string = 'unknown',
): Promise<PaymentResult> {
  try {
    // SECURITY FIX: Get authenticated user from session instead of trusting client input
    const userId = await getAuthenticatedUserId();
    
    if (!userId) {
      return { success: false, error: 'User not authenticated' };
    }

    logEvent('premium_payment_initiated', { triggerSource, userId });

    const subscriptionResponse = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!subscriptionResponse.ok) {
      const errorData = await subscriptionResponse.json();
      return { success: false, error: errorData.error || 'Failed to create subscription' };
    }

    const subscriptionData = await subscriptionResponse.json();

    if (!subscriptionData.subscriptionId) {
      return { success: false, error: 'Failed to create subscription' };
    }

    // Check if we're in development and Razorpay is not properly configured
    const isDevMode = process.env.NODE_ENV === 'development';
    const hasValidKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && 
                         !process.env.RAZORPAY_KEY_ID.includes('placeholder') &&
                         !process.env.RAZORPAY_KEY_SECRET.includes('placeholder');
    
    if (isDevMode && !hasValidKeys) {
      console.warn('[handlePremiumCheckout] Using mock mode due to invalid/missing Razorpay keys in development');
      // Still return success but with mock data - this allows development to proceed
      return {
        success: true,
        paymentId: `mock_payment_${Date.now()}`,
        subscriptionId: subscriptionData.subscriptionId,
      };
    }

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded || !isRazorpayLoaded()) {
      return { success: false, error: 'Razorpay SDK failed to load' };
    }

    return new Promise((resolve) => {
      const options = {
        key: subscriptionData.key,
        subscription_id: subscriptionData.subscriptionId,
        name: 'The Divine Tarot',
        description: 'Premium Monthly Subscription',
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId, // Use authenticated userId
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              logEvent('premium_payment_success', {
                userId,
                paymentId: response.razorpay_payment_id,
                subscriptionId: response.razorpay_subscription_id,
                triggerSource,
              });

              logEvent('premium_conversion', {
                userId,
                triggerSource,
                amount: 199,
                currency: 'INR',
              });

              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                subscriptionId: response.razorpay_subscription_id,
              });
            } else {
              resolve({ success: false, error: verifyData.error || 'Payment verification failed' });
            }
          } catch (err: any) {
            resolve({ success: false, error: err.message || 'Payment verification failed' });
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#FFD700',
        },
        modal: {
          ondismiss: () => {
            resolve({ success: false, error: 'Payment cancelled' });
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        logEvent('premium_payment_failed', {
          userId,
          error: response.error?.reason,
          triggerSource,
        });
        resolve({ success: false, error: response.error?.reason || 'Payment failed' });
      });

      rzp.open();
    });
  } catch (err: any) {
    console.error('[handlePremiumCheckout] Error:', err);
    logEvent('error_occurred', {
      userId: 'unknown',
      error: err.message,
      triggerSource,
    });
    return { success: false, error: err.message || 'Payment initialization failed' };
  }
}