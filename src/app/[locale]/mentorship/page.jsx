'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default async function Mentorship({params}) {
  const t = useTranslations()

  //AS IN NEXT-15 THEY ARE MADE ASYNCHRONUS
  const { locale } = await params;

  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}`;

  const mentors = [
    { 
      name: { en: 'Fatima Ali', ur: 'فاطمہ علی' }, 
      expertise: { en: 'Business Strategy', ur: 'کاروباری حکمت عملی' },
      image: '/images/fatima-ali.jpg',
      bio: { en: 'Experienced business strategist with 10+ years of consulting', ur: 'دس سے زائد سالوں کا تجربہ رکھنے والی کاروباری مشاورت کار' }
    },
    { 
      name: { en: 'Ayesha Khan', ur: 'عائشہ خان' }, 
      expertise: { en: 'Marketing', ur: 'مارکیٹنگ' },
      image: '/images/ayesha-khan.jpg',
      bio: { en: 'Digital marketing expert specializing in growth strategies', ur: 'ترقیاتی مارکیٹنگ میں ماہر' }
    },
    { 
      name: { en: 'Zainab Hassan', ur: 'زینب حسن' }, 
      expertise: { en: 'Finance', ur: 'فنانس' },
      image: '/images/zainab-hassan.jpg',
      bio: { en: 'Financial advisor with expertise in startup funding', ur: 'اسٹارٹ اپ فنڈنگ میں مہارت رکھنے والی مالی مشاور' }
    },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white p-8">
      {!isHomePage && <Navbar />}
      <div className="container mx-auto max-w-7xl">
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
                  alt={mentor.name[t('lng')]} 
                  width={400} 
                  height={400}
                  className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-110"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">{mentor.name[t('lng')]}</h3>
              <p className="text-xl mb-4 text-white text-opacity-80">{mentor.expertise[t('lng')]}</p>
              <p className="text-md mb-6 text-white text-opacity-70">{mentor.bio[t('lng')]}</p>
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
  )
}