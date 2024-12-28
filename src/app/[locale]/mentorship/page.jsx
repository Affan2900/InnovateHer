'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import FixedNavbar from '@/components/FixedNavbar';
import LanguageToggle from '@/components/LanguageToggle';
import useLocaleStore from '@/lib/store/useLocaleStore';
import { useState, useEffect } from 'react';
import { useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Mentorship() {
  const t = useTranslations("Mentorship");
  const { currentLocale } = useLocaleStore();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession(); // Access session data
  const user = session?.user; // Get user details from the session


  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/services'); // Replace with your actual API endpoint
        const data = await response.json();
        const filteredMentors = data.filter((service) => service.category === 'mentorship');
        setMentors(filteredMentors);
      } catch (error) {
        console.error('Error fetching mentors:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  

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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white">
        <p className="text-2xl font-semibold">Loading</p>
      </main>
    );
  }

  return (
    <main>
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
          <div className="m-12 text-center">
            {user ? (<Link href={`/${currentLocale}/${user.id}/mentorship/add`}>
              <motion.button
                className="px-8 py-4 bg-white text-purple-700 rounded-full text-3xl font-extrabold hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('addMentorshipOpportunity')}
              </motion.button>
            </Link>) : (
              <Link href={`/${currentLocale}/login`}>
              <motion.button
                className="px-8 py-4 bg-white text-purple-700 rounded-full text-3xl font-extrabold hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('addMentorshipOpportunity')}
              </motion.button>
            </Link>
            )}
            
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {mentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col"
                variants={itemVariants}
              >
                <div className="mb-6 overflow-hidden rounded-xl">
                  <Image
                    src={mentor.image || '/images/default-mentor.jpg'} // Fallback image
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-110"
                    alt={mentor.title}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2">{mentor.title}</h3>
                <p className="text-xl mb-4 text-white text-opacity-80">{mentor.expertise}</p>
                <p className="text-md mb-6 text-white text-opacity-70">{mentor.description}</p>
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
    </main>
  );
}
