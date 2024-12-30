'use client'

import {motion} from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import LanguageToggle from '@/components/LanguageToggle'
import useLocaleStore from '@/lib/store/useLocaleStore'
import { useSession } from 'next-auth/react'

const HeroNavbar = () => {
  const t = useTranslations("HeroNavbar")
  const { currentLocale } = useLocaleStore()
  const { data: session } = useSession()
  const user = session?.user

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Dynamic background with wave-like motion */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ backgroundPosition: "0 0" }}
        animate={{ 
          backgroundPosition: "100% 0",
          y: [0, -20, 0]
        }}
        transition={{ 
          backgroundPosition: {
            duration: 20, 
            repeat: Infinity, 
            ease: "linear"
          },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1440 320\"%3E%3Cpath fill=\"%23ffffff\" fill-opacity=\"1\" d=\"M0,128L48,138.7C96,149,192,171,288,170.7C384,171,480,149,576,149.3C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\"%3E%3C/path%3E%3C/svg%3E')",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 bg-transparent z-50 p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 px-4">
          <Link href="/">
            <span className="text-2xl sm:text-3xl font-black">{t('title')}</span>
          </Link>
          <div className="flex items-center">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
        {/* Left Column - Hero Text */}
        <motion.div
          className="text-center lg:text-left lg:w-1/2 space-y-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            {t('title')}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* CTA Buttons */}
            { user ? (
              <Link href={`/${currentLocale}/${user.id}/marketplace`} className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 bg-white text-purple-700 rounded-full text-lg sm:text-xl font-semibold hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('exploreMarketplace')}
                </motion.button>
              </Link>
            ) : (
              <Link href={`/${currentLocale}/marketplace`} className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 bg-white text-purple-700 rounded-full text-lg sm:text-xl font-semibold hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('exploreMarketplace')}
                </motion.button>
              </Link>
            )}
            
            { user ? (
              <Link href={`/${currentLocale}/${user.id}/skill-building`} className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white rounded-full text-lg sm:text-xl font-semibold hover:bg-white hover:text-purple-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('startLearning')}
                </motion.button>
              </Link>
            ) : (
              <Link href={`/${currentLocale}/skill-building`} className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white text-white rounded-full text-lg sm:text-xl font-semibold hover:bg-white hover:text-purple-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('startLearning')}
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Column - Impact Stats */}
        <motion.div
          className="lg:w-1/2 lg:pl-8 w-full px-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('impactTitle')}</h2>
            <ul className="space-y-4">
              <motion.li
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{t('impactStat1')}</span>
              </motion.li>
              <motion.li
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{t('impactStat2')}</span>
              </motion.li>
              <motion.li
                className="flex items-center space-x-3 text-sm sm:text-base"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{t('impactStat3')}</span>
              </motion.li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Scroll Prompt */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-base sm:text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
      >
        {t('scrollPrompt')}
      </motion.div>
    </motion.div>
  )
}

export default HeroNavbar