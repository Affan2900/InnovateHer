'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';
import FixedNavbar from '@/components/FixedNavbar';
import LanguageToggle from '@/components/LanguageToggle';
import useLocaleStore from '@/lib/store/useLocaleStore';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  const { currentLocale } = useLocaleStore();
  const { data: session } = useSession();
  const [servicesOffered, setServicesOffered] = useState([]);
  const [servicesBought, setServicesBought] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = session?.user;

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const { servicesOffered, servicesBought } = await response.json();
        setServicesOffered(servicesOffered);
        setServicesBought(servicesBought);
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
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
        <div className="container mx-auto max-w-7xl pt-32">
          <motion.h2
            className="text-5xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('dashboard')}
          </motion.h2>
          <div className="m-12">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <section className="mb-16">
                <h3 className="text-3xl font-bold mb-8">{t('servicesOffered')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {servicesOffered.map((service, index) => (
                    <motion.div
                      key={index}
                      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col"
                      variants={itemVariants}
                    >
                      <h4 className="text-2xl font-bold mb-2">{service.title}</h4>
                      <p className="text-xl mb-4">{t('category')}: {service.category}</p>
                      <p className="text-lg font-semibold mb-4">{t('price')}: {service.price}</p>
                    
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-3xl font-bold mb-8">{t('servicesBought')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {servicesBought.map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col"
                      variants={itemVariants}
                    >
                      {item.title ? (
                      <>
                        <h4 className="text-2xl font-bold mb-2">{item.title}</h4>
                        <p className="text-xl mb-4">{item.category}</p>
                        <p className="text-lg font-semibold mb-4">{t('price')}: {item.price}</p>
                      </>
                    ) : (
                      <p className="text-lg font-semibold mb-4">{t('noData')}</p>
                    )}
              
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
