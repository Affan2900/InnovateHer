'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useLocaleStore from '@/lib/store/useLocaleStore';
import Profile from '@/components/Profile';

const FixedNavbar = () => {
  const { data: session } = useSession(); // Access session data
  const user = session?.user;
  const { currentLocale } = useLocaleStore();
  const t = useTranslations('Navbar');

  const navItems = [
    { key: 'home', label: t('Home'), path: '/' },
    { key: 'marketplace', label: t('Marketplace'), path: '/marketplace' },
    { key: 'skillbuilding', label: t('Skill Building'), path: '/skill-building' },
    { key: 'networking', label: t('Networking'), path: '/networking' },
    { key: 'mentorship', label: t('Mentorship'), path: '/mentorship' },
  ];

  // Add locale to href dynamically, fallback to a generic URL if `user.id` is not available
  const localizedNavItems = navItems.map((item) => ({
    ...item,
    href: user?.id
      ? `/${currentLocale}/${user.id}${item.path}`
      : `/${currentLocale}${item.path}`, // No user-specific segment if `user.id` is undefined
  }));

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-purple-700 bg-opacity-75 backdrop-filter backdrop-blur-xl text-white py-6 px-8 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
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
          {!user && (
            <motion.li
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/${currentLocale}/login`}>
                <button className="bg-white text-purple-700 px-8 py-3 rounded-full text-xl font-bold hover:bg-purple-100 transition-colors">
                  {t('login')}
                </button>
              </Link>
            </motion.li>
          )}
          {user && (
            <motion.li
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Profile
                userName={user.name}
                currentRole={user.currentRole}
                onLogout={() => {
                  // Implement logout logic here
                }}
                onChangeRole={() => {
                  console.log('Change role action triggered');
                  // Implement logic to change role here
                }}
              />
            </motion.li>
          )}
        </ul>
      </div>
    </motion.nav>
  );
};

export default FixedNavbar;
