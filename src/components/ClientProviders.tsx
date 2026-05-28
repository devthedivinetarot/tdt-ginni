'use client';

import { useState, useEffect } from 'react';
import { PersonalizationProvider } from '@/components/personalization/PersonalizationProvider';
import { supabase } from '@/lib/supabase/client';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      try {
        // Check for authenticated user first
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (user && !error) {
          setUserId(user.id);
        } else {
          // Fallback to anonymous ID
          const anonId = crypto.randomUUID();
          setUserId(anonId);
        }
      } catch (e) {
        console.warn('[User] Failed to get user session:', e);
        const anonId = crypto.randomUUID();
        setUserId(anonId);
      } finally {
        setIsReady(true);
      }
    };

    initUser();
  }, []);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isReady) {
        console.warn('[User] ClientProviders timeout reached');
        setIsReady(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isReady]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))]">
        <div className="text-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <PersonalizationProvider userId={userId}>
      <div>
        {children}
      </div>
    </PersonalizationProvider>
  );
}
