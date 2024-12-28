'use client';

import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";
import { motion } from 'framer-motion';
import useLocaleStore from '@/lib/store/useLocaleStore';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale, setLocale } = useLocaleStore();

  const localeNames = {
    en: "English",
    ur: "اردو",
  };

  const changeLanguage = (newLocale) => {
    const pathWithoutLocale = pathname.split("/").slice(2).join("/") || "";
    setLocale(newLocale);
    router.push(`/${newLocale}/${pathWithoutLocale}`);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.select
        value={currentLocale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="appearance-none bg-purple-600 text-white px-6 py-3 pr-10 text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc} className="bg-purple-700 text-base">
            {localeNames[loc]}
          </option>
        ))}
      </motion.select>
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </motion.div>
    </motion.div>
  );
}