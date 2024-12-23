'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import FixedNavbar from '@/components/FixedNavbar'
import LanguageToggle from '@/components/LanguageToggle'

export default function Networking() {
  const t = useTranslations("Networking")




  const events = [
    { 
      name: 'Women Entrepreneurs Meetup' , 
      date: '2023-07-15',
      image: '/images/entrepreneurs-meetup.jpg',
      location: 'Lahore Convention Center',
      description: 
       'Connecting and empowering women entrepreneurs across different sectors' ,
      participants: 150
    },
    { 
      name: 'Rural Business Forum', 
      date: '2023-08-01',
      image: '/images/rural-business-forum.jpg',
      location:'Islamabad Tech Park',
      description:'Exploring growth opportunities in rural entrepreneurship',
      participants: 200
    },
    { 
      name:'Artisan Networking Event', 
      date: '2023-08-20',
      image: '/images/artisan-networking.jpg',
      location: 'Karachi Art Gallery',
      description: 'Connecting local artisans and creating collaborative opportunities',
      participants: 100
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
    <FixedNavbar/>
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
          {t('networking')}
        </motion.h2>
        
        {events.map((event, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2 }}
            className="bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xl"
          >
            <div className="md:w-2/3 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  {event.name}
                </h3>
                <p className="text-white text-opacity-80 mb-6">
                  {event.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-white text-opacity-80">
                  <Calendar className="mr-3 text-white" size={24} />
                  <span>{t('date')}: { event.date }</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <MapPin className="mr-3 text-white" size={24} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <Users className="mr-3 text-white" size={24} />
                  <span>{event.participants}  {t('participants')}</span>
                </div>
              </div>
              
              <Link href="/networking/register" className="mt-6">
                <motion.button 
                  className="w-full px-6 py-3 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('register')}
                </motion.button>
              </Link>
            </div>
            <div className="md:w-1/3 relative">
              <Image 
                src={event.image} 
                width={300} 
                height={250}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    </>
  )
}