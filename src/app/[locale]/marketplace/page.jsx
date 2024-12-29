'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import useLocaleStore from '@/lib/store/useLocaleStore';
import LanguageToggle from '@/components/LanguageToggle';
import FixedNavbar from '@/components/FixedNavbar';
import { useEffect, useState } from 'react';
import { useSession} from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function Marketplace() {
  const t = useTranslations("Marketplace");
  const { currentLocale } = useLocaleStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession(); // Access session data
  const user = session?.user; // Get user details from the session
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        const filteredServices = data.filter((service) => service.category === 'marketplace');
        setServices(filteredServices);
      } catch (error) {
        console.error('Error fetching services:', error.message);
      } finally {
        setLoading(false); // Ensure the loading state is updated
      }
    };

    fetchServices();
  }, []);

  const handleAddMarketplace = () => {
    if (!user) {
      router.push(`/${currentLocale}/login`);
      return;
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white">
        <p className="text-2xl font-semibold">Loading</p>
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
        <div className="container mx-auto max-w-7xl px-8 pt-32 pb-8">
          <motion.h2
            className="text-5xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('marketplace')}
          </motion.h2>
          <div className="mt-12 mb-8 text-center">
          
  <motion.button
    className="px-8 py-4 bg-white text-purple-700 rounded-full text-3xl font-extrabold hover:bg-purple-100 transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={handleAddMarketplace}
  >
    {t('addMarketplaceItem')}
  </motion.button>

          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service) => (
              <motion.div
                key={service._id}
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col"
                variants={itemVariants}
              >
                <div className="mb-6 overflow-hidden rounded-xl">
                  <Image
                    src={service.imageUrl || '/images/default-service.jpg'} // Fallback image
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-110"
                    alt={service.title}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <div className="text-lg  mb-4">{service.description}</div>
                <p className="text-2xl mb-6">{service.price} PKR</p>
                <Link href={`/${currentLocale}/login`} className="mt-auto">
                  <motion.button
                    className="w-full px-6 py-3 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('buyNow')}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
