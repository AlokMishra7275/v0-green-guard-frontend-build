"use client";

import { useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  name?: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchMe() {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!active) return;

      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    fetchMe();
    return () => {
      active = false;
    };
  }, []);

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { user, loading, signOut };
}
