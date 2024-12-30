'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import HeroNavbar from '@/components/HeroNavbar'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false)
  const t = useTranslations('Home')

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
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      <motion.div 
        className="lg:w-1/2 order-2 lg:order-1"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2 
          className="text-4xl font-bold mb-8 lg:text-left text-purple-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('missionTitle')}
        </motion.h2>
        <p className="text-xl">
          {t('missionDescription')}
        </p>
      </motion.div>
      <motion.div 
        className="lg:w-1/2 order-1 lg:order-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-purple-100 rounded-lg shadow-lg overflow-hidden">
          <img 
            src="/rural-women-2.jpg" 
            alt="Rural Women Empowerment"
            className="w-full h-96 object-cover"
          />
        </div>
      </motion.div>
    </div>
  </div>
</section>

<section id="about" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      <motion.div 
        className="lg:w-1/2 order-2 lg:order-1"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="bg-purple-100 rounded-lg shadow-lg overflow-hidden">
          <img 
            src="/rural-women-1.jpg" 
            alt="Rural Women Empowerment"
            className="w-full h-96 object-cover"
          />
        </div>
      </motion.div>
      <motion.div 
        className="lg:w-1/2 order-1 lg:order-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2 
          className="text-4xl font-bold mb-8 lg:text-left text-purple-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t('aboutTitle')}
        </motion.h2>
        <p className="text-xl">
          {t('aboutDescription')}
        </p>
      </motion.div>
    </div>
  </div>
</section>
      <Footer />
    </div>
  )
}

