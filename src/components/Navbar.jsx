'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Profile from '@/components/Profile';
import { useUserStore } from '@/lib/store/userStore';

const Navbar = ({ isVisible }) => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';
  const t = useTranslations('Navbar');

  // Extract `userId` from the pathname
  const pathParts = pathname.split('/');
  const userId = pathParts.length >= 3 ? pathParts[2] : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (userId && userId.length === 24 && !user) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Update user in the store
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, [userId, user, setUser]);

  const navItems = [
    { key: 'home', label: t('Home'), path: '/' },
    { key: 'marketplace', label: t('Marketplace'), path: '/marketplace' },
    { key: 'skillbuilding', label: t('Skill Building'), path: '/skill-building' },
    { key: 'networking', label: t('Networking'), path: '/networking' },
    { key: 'mentorship', label: t('Mentorship'), path: '/mentorship' },
  ];

  // Add locale and user ID to href dynamically
  const localizedNavItems = navItems.map((item) => ({
    ...item,
    href: userId
      ? `/${currentLocale}/${userId}${item.path}` // Include user ID if it exists
      : `/${currentLocale}${item.path}`, // Fallback to locale-only paths
  }));

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-purple-700 bg-opacity-75 backdrop-filter backdrop-blur-xl text-white py-6 px-8 z-50"
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href={`/${currentLocale}`}>
          <span className="text-3xl font-bold">{t('title')}</span>
        </Link>
        <ul className="flex space-x-12 items-center">
          {localizedNavItems.map((item) => (
            <motion.li
              key={item.key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-2"
            >
              <Link href={item.href}>
                <span className="text-xl font-semibold hover:text-purple-200 transition-colors">
                  {item.label}
                </span>
              </Link>
            </motion.li>
          ))}
          <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            {userId && user ? (
              <Profile
                userName={user.name} // Pass user's name as userName prop
                currentRole={user.currentRole} // Pass currentRole from user object
                onLogout={() => {
                  setUser(null); // Clear user from store
                }}
                onChangeRole={() => {
                  console.log('Change role action triggered');
                  // Implement logic to change role here
                }}
              />
            ) : (
              <Link href={`/${currentLocale}/login`}>
                <button className="bg-white text-purple-700 px-8 py-3 rounded-full text-xl font-bold hover:bg-purple-100 transition-colors">
                  {t('login')}
                </button>
              </Link>
            )}
          </motion.li>
        </ul>
      </div>
    </motion.nav>
  );
};

export default Navbar;
