import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock check for active session
    const timer = setTimeout(() => {
      setUser({ email: 'user@receiptguardian.com' });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { user, loading };
}
