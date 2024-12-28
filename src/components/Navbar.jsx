'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Profile from '@/components/Profile';
import { useSession } from 'next-auth/react';
import useLocaleStore from '@/lib/store/useLocaleStore';

const Navbar = ({ isVisible }) => {
  const { data: session } = useSession();
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

  const localizedNavItems = navItems.map((item) => ({
    ...item,
    href: session
      ? `/${currentLocale}/${user.id}${item.path}`
      : `/${currentLocale}${item.path}`,
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
            {user ? (
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