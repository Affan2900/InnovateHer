'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Clock, TrendingUp } from 'lucide-react'
import FixedNavbar from '@/components/FixedNavbar'
import LanguageToggle from '@/components/LanguageToggle'
import { usePathname } from 'next/navigation'


export default function SkillBuilding() {
  const t = useTranslations("Skill Building")
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en'; // Extract locale from path

  

  const courses = [
    { 
      name: 'Basic Entrepreneurship',
      image: '/images/entrepreneurship-course.jpg',
      description: 'Learn fundamental business skills and startup strategies',
      duration: '4 Weeks',
      difficulty: 'Beginner',
    },
    { 
      name:'Digital Marketing',
      image: '/images/digital-marketing-course.jpg',
      description: 'Master online marketing techniques and social media strategies',
      duration: '6 Weeks',
      difficulty: 'Intermediate'
    },
    { 
      name: 'Financial Management',
      image: '/images/financial-management-course.jpg',
      description: 'Develop financial planning and investment skills',
      duration: '5 Weeks',
      difficulty:'Advanced',
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
    <>
    <FixedNavbar />
    <div className="fixed top-28 right-8 z-40">
                <LanguageToggle />
              </div>
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white">
      
      <div className="container mx-auto max-w-4xl space-y-8 pt-32">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('skillBuilding')}
        </motion.h2>

        <div className="mt-12 text-center">
            <Link href={`/${currentLocale}/skill-building/add`}>
              <motion.button 
                className="px-8 py-4 bg-white text-purple-700 rounded-full text-3xl font-extrabold hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('addSkillBuildingCourse')}
              </motion.button>
            </Link>
          </div>
        
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
                  {course.name}
                </h3>
                <p className="text-white text-opacity-80 mb-6">
                  {course.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-white text-opacity-80">
                  <Clock className="mr-3 text-white" size={24} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <TrendingUp className="mr-3 text-white" size={24} />
                  <span>{course.difficulty}</span>
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
                width={300} 
                height={250}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
        {/* <div className="mt-12 text-center">
            <Link href={`/${currentLocale}/skill-building/add`}>
              <motion.button 
                className="px-8 py-4 bg-white text-purple-700 rounded-full text-3xl font-extrabold hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('addSkillBuildingCourse')}
              </motion.button>
            </Link>
          </div> */}
      </div>
    </div>
    </>
  )
}