// filepath: /D:/Semester 5/Web Engineering/innovateher/src/components/Profile.jsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import useLocaleStore from '@/lib/store/useLocaleStore';

const Profile = ({ currentRole, onLogout, onChangeRole, userName }) => {
  const { currentLocale } = useLocaleStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const t = useTranslations('Profile');

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
    onLogout();
    router.push(`/${currentLocale}`);
    setIsOpen(false);
  };

  const handleChangeRole = () => {
    onChangeRole();
    router.push(`/${currentLocale}/login`);
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
            <div className="bg-purple-600 px-4 py-2 text-white">
              <p className="text-sm font-medium">Current Role: {currentRole}</p>
            </div>

            {/* Dropdown Actions */}
            <div className="p-2 space-y-1">
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