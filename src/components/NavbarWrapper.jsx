// components/NavbarWrapper.jsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function NavbarWrapper({ locale }) {
  const pathname = usePathname()
  const isHomePage = pathname === `/${locale}`
  
  if (isHomePage) {
    return null
  }
  
  return <Navbar />
}