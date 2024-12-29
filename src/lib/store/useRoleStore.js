import { create } from 'zustand';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const useRoleStore = create((set) => ({
  currentRole: 'buyer', // Default value
  setRole: (role) => set({ currentRole: role }),
}));

// Initialize Zustand role on the client side
export const useSyncRoleWithSession = () => {
  const { data: session } = useSession();
  const setRole = useRoleStore((state) => state.setRole);

  useEffect(() => {
    if (session?.user?.currentRole) {
      setRole(session.user.currentRole);
    }
  }, [session, setRole]);
};

export default useRoleStore;
