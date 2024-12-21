'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default async function Networking({params}) {
  const t = useTranslations()

  //AS IN NEXT-15 THEY ARE MADE ASYNCHRONUS
  const { locale } = await params;

  const pathname = usePathname();
  const isHomePage = pathname === `/${locale}`;
  const events = [
    { 
      name: { en: 'Women Entrepreneurs Meetup', ur: 'خواتین کاروباری ملاقات' }, 
      date: '2023-07-15',
      image: '/images/entrepreneurs-meetup.jpg',
      location: { en: 'Lahore Convention Center', ur: 'لاہور کنونشن سینٹر' },
      description: { 
        en: 'Connecting and empowering women entrepreneurs across different sectors', 
        ur: 'مختلف شعبوں میں خواتین کاروباریوں کو جوڑنا اور ان کو طاقت دینا' 
      },
      participants: 150
    },
    { 
      name: { en: 'Rural Business Forum', ur: 'دیہی کاروبار فورم' }, 
      date: '2023-08-01',
      image: '/images/rural-business-forum.jpg',
      location: { en: 'Islamabad Tech Park', ur: 'اسلام آباد ٹیک پارک' },
      description: { 
        en: 'Exploring growth opportunities in rural entrepreneurship', 
        ur: 'دیہی کاروباری سرگرمیوں میں ترقیاتی مواقع کی کھوج' 
      },
      participants: 200
    },
    { 
      name: { en: 'Artisan Networking Event', ur: 'دستکار نیٹ ورکنگ تقریب' }, 
      date: '2023-08-20',
      image: '/images/artisan-networking.jpg',
      location: { en: 'Karachi Art Gallery', ur: 'کراچی آرٹ گیلری' },
      description: { 
        en: 'Connecting local artisans and creating collaborative opportunities', 
        ur: 'مقامی دستکاروں کو جوڑنا اور اشتراکی مواقع بنانا' 
      },
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white p-8">
      {!isHomePage && <Navbar />}
      <div className="container mx-auto max-w-4xl space-y-8">
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
                  {event.name[t('lng')]}
                </h3>
                <p className="text-white text-opacity-80 mb-6">
                  {event.description[t('lng')]}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-white text-opacity-80">
                  <Calendar className="mr-3 text-white" size={24} />
                  <span>{t('date', { date: event.date })}</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <MapPin className="mr-3 text-white" size={24} />
                  <span>{event.location[t('lng')]}</span>
                </div>
                <div className="flex items-center text-white text-opacity-80">
                  <Users className="mr-3 text-white" size={24} />
                  <span>{t('participants', { count: event.participants })}</span>
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
                alt={event.name[t('lng')]} 
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