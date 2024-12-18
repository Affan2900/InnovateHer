'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Clock, TrendingUp } from 'lucide-react'

export default function SkillBuilding() {
  const t = useTranslations()

  const courses = [
    { 
      name: { en: 'Basic Entrepreneurship', ur: 'بنیادی کاروباری مہارت' },
      image: '/images/entrepreneurship-course.jpg',
      description: { 
        en: 'Learn fundamental business skills and startup strategies', 
        ur: 'بنیادی کاروباری مہارتیں اور سٹارٹ اپ حکمت عملی سیکھیں' 
      },
      duration: { en: '4 Weeks', ur: '4 ہفتے' },
      difficulty: { en: 'Beginner', ur: 'مبتدی' }
    },
    { 
      name: { en: 'Digital Marketing', ur: 'ڈیجیٹل مارکیٹنگ' },
      image: '/images/digital-marketing-course.jpg',
      description: { 
        en: 'Master online marketing techniques and social media strategies', 
        ur: 'آن لائن مارکیٹنگ تکنیکیں اور سوشل میڈیا حکمت عملی سیکھیں' 
      },
      duration: { en: '6 Weeks', ur: '6 ہفتے' },
      difficulty: { en: 'Intermediate', ur: 'درمیانی' }
    },
    { 
      name: { en: 'Financial Management', ur: 'مالی انتظام' },
      image: '/images/financial-management-course.jpg',
      description: { 
        en: 'Develop financial planning and investment skills', 
        ur: 'مالی منصوبہ بندی اور سرمایہ کاری کی مہارتیں سیکھیں' 
      },
      duration: { en: '5 Weeks', ur: '5 ہفتے' },
      difficulty: { en: 'Advanced', ur: 'پیشرفتہ' }
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
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('skillBuilding')}
        </motion.h2>
        
        {courses.map((course, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2 }}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xl"
          >
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  {course.name[t('lng')]}
                </h3>
                <p className="text-white text-opacity-80 mb-6">
                  {course.description[t('lng')]}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-white text-opacity-80">
                  <Clock className="mr-3 text-white" size={24} />
                  <span>{course.duration[t('lng')]}</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <TrendingUp className="mr-3 text-white" size={24} />
                  <span>{course.difficulty[t('lng')]}</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <BookOpen className="mr-3 text-white" size={24} />
                  <span>{t('lessons')}</span>
                </div>
              </div>
              
              <Link href="/skill-building/enroll" className="mt-6">
                <motion.button 
                  className="w-full px-6 py-3 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('enrollNow')}
                </motion.button>
              </Link>
            </div>
            <div className="md:w-1/3 relative">
              <Image 
                src={course.image} 
                alt={course.name[t('lng')]} 
                width={300} 
                height={250}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}