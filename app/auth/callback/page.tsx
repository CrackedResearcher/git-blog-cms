'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          setStatus('Authentication failed: Missing parameters');
          return;
        }

        const response = await fetch(`/api/callback?code=${code}&state=${state}`);
        const data = await response.json();

        if (data.success) {
          setStatus('Authentication successful! Redirecting...');

          setTimeout(() => router.push('/new'), 1500);
        } else {
          setStatus('Authentication failed: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        setStatus('Authentication failed: Server error');
        console.error('Callback error:', error);
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-black dark:border-t-white border-gray-200 rounded-full animate-spin mx-auto"/>
        <h2 className="text-2xl font-semibold">{status}</h2>
        <p className="text-gray-600 dark:text-gray-300">Please wait while we complete your authentication</p>
      </div>
    </div>
  );
}