'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import HeroNavbar from '@/components/HeroNavbar'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setShowNavbar(scrollPosition > 100) // Show navbar after scrolling 100px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 overflow-y-auto">
      <HeroNavbar />
      <Navbar isVisible={showNavbar} />
      
      <section id="mission" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('missionTitle')}
          </motion.h2>
          <motion.p 
            className="text-xl text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('missionDescription')}
          </motion.p>
        </div>
      </section>

      <section id="about" className="py-20 bg-purple-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('aboutTitle')}
          </motion.h2>
          <motion.p 
            className="text-xl text-center max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t('aboutDescription')}
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {['education', 'technology', 'community'].map((item, index) => (
              <div key={item} className="bg-white p-6 rounded-lg shadow-md max-w-sm">
                <h3 className="text-2xl font-semibold mb-4">{t(`about${item}Title`)}</h3>
                <p>{t(`about${item}Description`)}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

