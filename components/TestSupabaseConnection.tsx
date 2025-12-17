'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Status = 'idle' | 'ok' | 'error';

export default function TestSupabaseConnection() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('skus')
          .select('id, name')
          .limit(1);

        if (error) throw error;

        if (!data || data.length === 0) {
          setStatus('ok');
          setMessage('Connected, but no SKUs found');
        } else {
          setStatus('ok');
          setMessage(`Connected. Sample SKU: ${data[0].name}`);
        }
      } catch (err) {
        setStatus('error');
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setMessage(errorMessage);
      }
    };

    checkConnection();
  }, []);

  if (status === 'idle') return <p>Checking Supabase connection…</p>;
  if (status === 'error') return <p>❌ Supabase error: {message}</p>;
  return <p>✅ Supabase OK — {message}</p>;
}
