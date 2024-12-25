'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import LanguageToggle from '@/components/LanguageToggle' 
import FixedNavbar from '@/components/FixedNavbar'

export default function Login() {
  const t = useTranslations("Login")
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en'; // Extract locale from path
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  })
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to log in");
      }

      const userData = await response.json();
      console.log('Login successful:', userData);
      router.push(`/${currentLocale}/${userData._id}`);
    } catch (err) {
      console.error('Error during login:', err.message);
      setError(err.message);
    }
  }

  return (
    <>
    <FixedNavbar/>
    <div className="fixed top-28 right-8 z-40">
        <LanguageToggle />
      </div>
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">{t('login')}</h2>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {t('loginButton')}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-medium text-gray-600">
          {t('noAccount')} {' '}
          <Link href={`/${currentLocale}/register`} className="font-medium text-purple-600 hover:text-purple-500">
            {t('registerHere')}
          </Link>
        </p>
      </motion.div>
    </div>
    </>
  )
}