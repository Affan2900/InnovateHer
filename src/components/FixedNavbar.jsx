'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FixedNavbar = () => {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en'; // Extract locale from path
  const t = useTranslations("Navbar");

  const navItems = [
    { key: 'home', label: t('Home'), path: '/' },
    { key: 'marketplace', label: t('Marketplace'), path: '/marketplace' },
    { key: 'skillbuilding', label: t('Skill Building'), path: '/skill-building' },
    { key: 'networking', label: t('Networking'), path: '/networking' },
    { key: 'mentorship', label: t('Mentorship'), path: '/mentorship' },
  ];

  // Add locale to href dynamically
  const localizedNavItems = navItems.map((item) => ({
    ...item,
    href: `/${currentLocale}${item.path}`,
  }));

  // Check if current pathname includes "login" or "register"
  const shouldHideLoginButton = pathname.includes('/login') || pathname.includes('/register');

  return (
    <nav className="fixed top-0 left-0 right-0 bg-purple-700 bg-opacity-75 backdrop-filter backdrop-blur-xl text-white py-6 px-8 z-50">
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
          {!shouldHideLoginButton && (
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
        </ul>
      </div>
    </nav>
  );
};

export default FixedNavbar;
