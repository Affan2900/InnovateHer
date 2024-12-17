'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import HeroNavbar from '@/components/HeroNavbar'

export default function Home() {
  const [activeTab, setActiveTab] = useState('marketplace')
  const t = useTranslations('Home');

  // Remove this function
  // const toggleLanguage = () => {
  //   i18n.changeLanguage(i18n.language === 'en' ? 'ur' : 'en')
  // }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 overflow-y-auto">
      <HeroNavbar />
    </div>
  )
}

