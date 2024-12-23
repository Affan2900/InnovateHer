'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import LanguageToggle from '@/components/LanguageToggle'
import FixedNavbar from '@/components/FixedNavbar'

export default function Marketplace() {
  const t = useTranslations("Marketplace");

  const products = [
    { 
      name: 'Handmade Shawl', 
      price: 2000,
      image: '/images/handmade-shawl.jpg'
    },
    { 
      name: 'Embroidered Cushion', 
      price: 1500,
      image: '/images/embroidered-cushion.jpg'
    },
    { 
      name: 'Traditional Jewelry', 
      price: 3000,
      image: '/images/traditional-jewelry.jpg'
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
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product, index) => (
              <motion.div 
                key={index} 
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl flex flex-col"
                variants={itemVariants}
              >
                <div className="mb-6 overflow-hidden rounded-xl">
                  <Image 
                    src={product.image} 
                    width={400} 
                    height={300}
                    className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4">{product.name}</h3>
                <p className="text-xl mb-6">{ product.price } PKR</p>
                <Link href="/checkout" className="mt-auto">
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
  )
}