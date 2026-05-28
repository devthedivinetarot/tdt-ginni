// src/lib/subscription/verifySubscription.ts
'use client';

import { supabase } from '@/lib/supabase/client';

export interface SubscriptionVerificationResult {
  isValid: boolean;
  plan: 'free' | 'premium';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
  expiryDate: string | null;
  userId: string | null;
}

/**
 * Verify subscription status from database
 */
export async function verifySubscriptionStatus(userId: string): Promise<SubscriptionVerificationResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, subscription_status, subscription_end_date, subscription_id, payment_provider')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return {
        isValid: false,
        plan: 'free',
        status: null,
        expiryDate: null,
        userId: null,
      };
    }

    const plan = (user.plan || 'free') as 'free' | 'premium';
    const status = (user.subscription_status || 'inactive') as 
      | 'active' | 'inactive' | 'cancelled' | 'past_due' | null;
    const expiryDate = user.subscription_end_date || null;
    const subscriptionId = user.subscription_id || null;
    const paymentProvider = user.payment_provider || null;

    // Check if subscription is active
    const isValid = 
      plan === 'premium' && 
      status === 'active' && 
      (!expiryDate || new Date(expiryDate) > new Date());

    return {
      isValid,
      plan,
      status,
      expiryDate,
      userId,
    };
  } catch (error) {
    console.error('[verifySubscriptionStatus] Error:', error);
    return {
      isValid: false,
      plan: 'free',
      status: null,
      expiryDate: null,
      userId: null,
    };
  }
}

/**
 * Verify if user has active premium subscription
 */
export async function hasActivePremiumSubscription(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const result = await verifySubscriptionStatus(userId);
  return result.isValid;
}

/**
 * Get subscription details for user
 */
export async function getSubscriptionDetails(userId: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, subscription_status, subscription_end_date, subscription_id, payment_provider, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return null;
    }

    return {
      plan: user.plan,
      status: user.subscription_status,
      expiryDate: user.subscription_end_date,
      subscriptionId: user.subscription_id,
      paymentProvider: user.payment_provider,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  } catch (error) {
    console.error('[getSubscriptionDetails] Error:', error);
    return null;
  }
}