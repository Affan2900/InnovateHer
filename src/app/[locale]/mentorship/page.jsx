'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import FixedNavbar from '@/components/FixedNavbar'
import LanguageToggle from '@/components/LanguageToggle'

export default function Mentorship() {
  const t = useTranslations("Mentorship")

  

  const mentors = [
    { 
      name: 'Fatima Ali', 
      expertise: 'Business Strategy',
      image: '/images/fatima-ali.jpg',
      bio: 'Experienced business strategist with 10+ years of consulting'
    },
    { 
      name: 'Ayesha Khan', 
      expertise:'Marketing',
      image: '/images/ayesha-khan.jpg',
      bio: 'Digital marketing expert specializing in growth strategies'
    },
    { 
      name:'Zainab Hassan', 
      expertise:'Finance',
      image: '/images/zainab-hassan.jpg',
      bio: 'Financial advisor with expertise in startup funding'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <>
    <FixedNavbar />
      <div className="fixed top-28 right-8 z-40">
        <LanguageToggle />
      </div>
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white">
      <div className="container mx-auto max-w-7xl pt-32">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('mentorship')}
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mentors.map((mentor, index) => (
            <motion.div 
              key={index} 
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col"
              variants={itemVariants}
            >
              <div className="mb-6 overflow-hidden rounded-xl">
                <Image 
                  src={mentor.image} 
                  width={400} 
                  height={400}
                  className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">{mentor.name}</h3>
              <p className="text-xl mb-4 text-white text-opacity-80">{mentor.expertise}</p>
              <p className="text-md mb-6 text-white text-opacity-70">{mentor.bio}</p>
              <Link href="/mentorship/request" className="mt-auto">
                <motion.button 
                  className="w-full px-6 py-3 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('requestMentorship')}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
    </>
  )
}