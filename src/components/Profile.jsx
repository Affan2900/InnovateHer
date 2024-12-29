// filepath: /D:/Semester 5/Web Engineering/innovateher/src/components/Profile.jsx
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react'; // Import signOut and useSession from next-auth
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import useLocaleStore from '@/lib/store/useLocaleStore';
import useRoleStore, { useSyncRoleWithSession } from '@/lib/store/useRoleStore'; // Import useRoleStore and useSyncRoleWithSession

const Profile = ({ userName }) => {
  useSyncRoleWithSession(); // Sync role with session
  const { currentLocale } = useLocaleStore();
  const { currentRole } = useRoleStore(); // Get current role from the Zustand store
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const t = useTranslations('Profile');
  const { data: session } = useSession();
  const user = session?.user;

  // Get initials from userName
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: `/${currentLocale}` }); // Use signOut from next-auth
    setIsOpen(false);
  };

  const handleChangeRole = () => {
    // Implement role change logic here
    signOut({ callbackUrl: `/${currentLocale}/login` }); // Use signOut from next-auth
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Circle */}
      <motion.button
        className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {getInitials(userName)}
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Current Role */}
            <div className="bg-purple-500 px-4 py-2 font-bold text-2xl text-white">
              <p className="text-lg font-bold">Current Role: {currentRole}</p> {/* Updated CSS classes */}
            </div>

            {/* Dropdown Actions */}
            <div className="p-2 space-y-1">
            <Link href={`/${currentLocale}/${user?.id}/dashboard`}>
                <div className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 rounded-md transition-colors">
                  Dashboard
                </div>
              </Link>
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 rounded-md transition-colors"
                onClick={handleChangeRole}
              >
                {t('changeRole')}
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 rounded-md transition-colors"
                onClick={handleLogout}
              >
                {t('logout')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;