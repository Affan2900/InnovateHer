'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import FixedNavbar from '@/components/FixedNavbar'
import LanguageToggle from '@/components/LanguageToggle'
import useLocaleStore from '@/lib/store/useLocaleStore';
import { useState, useEffect } from 'react'
import { useSession} from 'next-auth/react';
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'



export default function Networking() {
  const t = useTranslations("Networking")
  const { currentLocale } = useLocaleStore();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await fetch('/api/services');
          const data = await response.json();
          const filteredServices = data.filter((service) => service.category === 'networking');
          setEvents(filteredServices);
        } catch (error) {
          console.error('Error fetching services:', error.message);
        } finally {
          setLoading(false); // Ensure the loading state is updated
        }
      };
  
      fetchServices();
    }, []);

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

  const handleBuyNow =() => {
      router.push(`/${currentLocale}/login`);
    
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white">
        <p className="text-2xl font-semibold">Loading</p>
      </div>
    );
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

        <div className="m-12 text-center">
          
            <Link href={`/${currentLocale}/login`}>
              <motion.button 
                className="px-8 py-4 bg-white text-purple-700 rounded-full text-3xl font-extrabold hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('addNetworkingEvent')}
              </motion.button>
            </Link>
            
          </div>
        
          <motion.div
  className="space-y-8"
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {events.map((event) => (
    <motion.div
      key={event._id}
      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col space-y-6"
      variants={itemVariants}
    >
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <Image
            src={event.imageUrl || '/default.jpg'}
            width={200}
            height={200}
            className="w-48 h-48 object-cover rounded-xl transition-transform duration-300 hover:scale-110"
            alt={event.title}
          />
        </div>

        {/* Event Details */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
          <p className="text-lg mb-4">{event.description}</p>
          <div className="space-y-2">
            <div className="flex items-center text-white font-semibold text-opacity-100">
              <Clock className="mr-3 text-white" size={24} />
              <span>{dayjs(event.date).format('YYYY-MM-DD')}</span>
            </div>
            <div className="flex font-semibold items-center text-white text-opacity-120 text-xl">
              <p>{t('location')} {event.location}</p>
            </div>
            <div className="flex items-center font-semibold text-xl text-white text-opacity-100">
              <p>{t('price')}: {event.price} PKR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Now below the content */}
      <div className="flex justify-end space-x-4">
         
            <motion.button
              className="px-4 py-2 bg-white text-purple-700 rounded-full text-lg font-semibold hover:bg-purple-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
            >
              {t('viewDetails')}
            </motion.button>

      </div>
    </motion.div>
  ))}
</motion.div>
      </div>
    </div>
    </>
  )
}