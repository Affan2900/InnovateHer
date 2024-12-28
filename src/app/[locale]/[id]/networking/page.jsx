// filepath: /D:/Semester 5/Web Engineering/innovateher/src/app/[locale]/[id]/networking/page.jsx
'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import useLocaleStore from '@/lib/store/useLocaleStore';
import LanguageToggle from '@/components/LanguageToggle';
import FixedNavbar from '@/components/FixedNavbar';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import NextAuth for session handling
import { Clock } from 'lucide-react'; 

export default function Networking() {
  const t = useTranslations("Networking");
  const { currentLocale } = useLocaleStore();
  const { data: session } = useSession(); // Fetch session details
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = session?.user;

  useEffect(() => {
    // Fetch networking events from the backend
    const fetchEvents = async () => {
      if (!user?.id) {
        console.warn('User ID is not available yet.');
        return; // Exit if `user.id` is not available
      }
      try {
        const response = await fetch(`/api/services/${user.id}`); // Adjust the endpoint if necessary
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        const filteredServices = data.filter((service) => service.category === 'networking');
        setEvents(filteredServices);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };


  const onDelete = async (serviceId) => {

    
    try {
      const response = await fetch(`/api/services/${user.id}/networking?serviceId=${serviceId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const { error } = await response.json();
        console.error('Error deleting service:', error);
        return;
      }
  
      router.push(`/${currentLocale}/${user.id}/networking`); // Refresh the page to update the list
    } catch (err) {
      console.error('Error during deletion:', err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white">
        <p className="text-2xl font-semibold">Loading...</p>
      </div>
    );
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
            {t('networking')}
          </motion.h2>
          <div className="m-12 text-center">
            <Link href={`/${currentLocale}/${user.id}/networking/add`}>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {events.map((event) => (
  <motion.div
    key={event._id}
    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col"
    variants={itemVariants}
  >
    <div className="mb-6 overflow-hidden rounded-xl">
      <Image
        src={event.image || '/images/default-event.jpg'} // Use a default image if none is provided
        width={400}
        height={300}
        className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-110"
        alt={event.title}
      />
    </div>
    <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
    <p className="text-xl mb-6">{event.description}</p>
    <div className="space-y-4">
      <div className="flex items-center text-white text-opacity-80">
        <Clock className="mr-3 text-white" size={24} />
        <span>{event.date}</span>
      </div>
      <div className="flex items-center text-white text-opacity-80">
        <p className="text-lg mb-4">{t('location')} {event.location}</p>
      </div>
      <div className="flex items-center text-white text-opacity-80">
        <p className="text-lg mb-4">{t('price')}: {event.price} PKR</p>
      </div>
    </div>

    {event.seller === session?.user?.id ? ( // Check if the event is owned by the current session user
      <div className="mt-auto flex gap-4">
        {/* Edit Button */}
        <Link href={`/${currentLocale}/${session.user.id}/networking/${event._id}/edit`}>
          <motion.button
            className="w-full px-6 py-3 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('edit')}
          </motion.button>
        </Link>
        {/* Delete Button */}
        <motion.button
          className="w-32 px-6 py-1 bg-red-600 text-white rounded-full text-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(service._id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7L5 7M10 11V17M14 11V17M4 7L4 19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7M9 7V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7"
            />
          </svg>
        </motion.button>
      </div>
    ) : (
      <Link href={`/networking/${event._id}`} className="mt-6">
        <motion.button
          className="w-full px-6 py-3 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('viewDetails')}
        </motion.button>
      </Link>
    )}
  </motion.div>
))}


              </motion.div>
        </div>
      </div>
    </>
  );
}