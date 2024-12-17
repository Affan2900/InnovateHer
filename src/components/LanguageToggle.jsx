"use client";

import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";
import { motion } from 'framer-motion';

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const localeNames = {
    en: "English",
    ur: "اردو",
  };

  const currentLocale = pathname.split("/")[1] || routing.defaultLocale;

  const changeLanguage = (newLocale) => {
    const pathWithoutLocale = pathname.split("/").slice(2).join("/") || "";
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
        className="appearance-none bg-purple-600 text-white px-4 py-2 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc} className="bg-purple-700">
            {localeNames[loc]}
          </option>
        ))}
      </motion.select>
      <motion.div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

