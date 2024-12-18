'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const Navbar = ({ isVisible }) => {
  const t = useTranslations()

  const navItems = [
    { key: 'marketplace', label: t('marketplace'), href: '/marketplace' },
    { key: 'skillbuilding', label: t('skillBuilding'), href: '/skillbuilding' },
    { key: 'networking', label: t('networking'), href: '/networking' },
    { key: 'mentorship', label: t('mentorship'), href: '/mentorship' },
  ]

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 bg-purple-700 bg-opacity-80 backdrop-filter backdrop-blur-md text-white p-4 z-50"
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold">{t('title')}</span>
        </Link>
        <ul className="flex space-x-6 items-center">
          {navItems.map((item) => (
            <motion.li 
              key={item.key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={item.href}>
                <span className="text-lg font-semibold hover:text-purple-200 transition-colors">
                  {item.label}
                </span>
              </Link>
            </motion.li>
          ))}
          <motion.li
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button className="bg-white text-purple-700 px-6 py-2 rounded-full text-lg font-bold hover:bg-purple-100 transition-colors">
              {t('login')}
            </button>
          </motion.li>
        </ul>
      </div>
    </motion.nav>
  )
}

export default Navbar

