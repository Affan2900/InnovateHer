'use client'

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import useLocaleStore from '@/lib/store/useLocaleStore';
import LanguageToggle from '@/components/LanguageToggle';
import FixedNavbar from '@/components/FixedNavbar';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Import NextAuth for session handling
import { TrendingUp, BookOpen, Clock } from 'lucide-react'; // Import Clock from lucide-react
import Footer from '@/components/Footer';



export default function SkillBuilding() {
  const t = useTranslations("Skill Building")
  const { currentLocale } = useLocaleStore();
  const { data: session } = useSession(); // Fetch session details
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = session?.user;


  useEffect(() => {
    // Fetch courses from the backend
    const fetchCourses = async () => {
      if (!user?.id) {
        console.warn('User ID is not available yet.');
        return; // Exit if `user.id` is not available
      }
      try {
        const response = await fetch(`/api/services/${user.id}`); // Adjust the endpoint if necessary
        if (!response.ok) throw new Error('Failed to fetch courses');
        const data = await response.json();
        const filteredServices = data.filter((service) => service.category === 'skill-building');
        setCourses(filteredServices);
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

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
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1
    }
  }

  const onDelete = async (serviceId) => {
    try {
      const response = await fetch(`/api/services/${user.id}/skill-building?serviceId=${serviceId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const { error } = await response.json();
        console.error('Error deleting service:', error);
        return;
      }
  
      // Update the local state to remove the deleted course
      setCourses((prevCourses) => prevCourses.filter(course => course._id !== serviceId));
    } catch (err) {
      console.error('Error during deletion:', err.message);
    }
  };

  const handleBuyNow = async (serviceId) => {
    try {
      const response = await fetch(`/api/services/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        console.error('Error adding user to customers array:', error);
        return;
      }

      
    } catch (err) {
      console.error('Error during buy now:', err.message);
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
          {t('skillBuilding')}
        </motion.h2>

        <div className="mt-12 text-center">
        {session?.user?.currentRole === 'seller' && (
            <Link href={`/${currentLocale}/${user.id}/skill-building/add`}>
              <motion.button 
                className="px-8 py-4 bg-white text-purple-700 rounded-full text-3xl font-extrabold hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('addSkillBuildingCourse')}
              </motion.button>
            </Link>
        )}
          </div>
        
        
          {courses.map((course, index) => (
  <motion.div 
    key={index}
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: index * 0.2 }}
    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xl"
  >
    <div className="md:w-2/3 p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-3xl font-bold mb-4">
          {course.title}
        </h3>
        <p className="text-white text-opacity-80 mb-6">
          {course.description}
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center text-white text-opacity-80">
          <Clock className="mr-3 text-white" size={24} />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center text-white text-opacity-80">
          <TrendingUp className="mr-3 text-white" size={24} />
          <span>{course.difficulty}</span>
        </div>
        <div className="flex items-center text-white text-opacity-80">
          <p className="text-xl font-semibold mb-4">{t('price')} {course.price} PKR</p>
        </div>
        <div className="flex items-center text-white text-opacity-80">
          <BookOpen className="mr-3 text-white" size={24} />
          <span>{t('lessons')}</span>
        </div>
      </div>

      {course.seller === session?.user?.id && session?.user?.currentRole === 'buyer' ? null : (
  course.seller === session?.user?.id ? (
    <div className="mt-auto flex gap-4">
      {/* Edit Button */}
      <Link href={`/${currentLocale}/${session.user.id}/skill-building/${course._id}/edit`}>
        <motion.button
          className="w-full px-6 py-3 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors mt-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('edit')}
        </motion.button>
      </Link>
      {/* Delete Button */}
      <motion.button
        className="w-24 px-6 py-3 bg-red-600 text-white rounded-full text-xl font-semibold hover:bg-red-700 transition-colors mt-4 flex items-center justify-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onDelete(course._id)}
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
    course.customers && course.customers.includes(session?.user?.id) ? (
      <motion.button
        className="w-full px-6 py-3 mt-6 bg-gray-400 text-white rounded-full text-xl font-semibold cursor-not-allowed"
        disabled
      >
        {t('registered')}
      </motion.button>
    ) : (
      <motion.button
        className="w-full px-6 py-3 mt-6 bg-white text-purple-700 rounded-full text-xl font-semibold hover:bg-purple-100 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleBuyNow(course._id)}
      >
        {t('enrollNow')}
      </motion.button>
    )
  )
)}

    </div>
    <div className="md:w-1/3 relative">
      <Image 
        src={course.imageUrl || '/default.jpg'} 
        width={300} 
        height={250}
        className="w-full h-48 md:h-full object-cover"
        alt={course.title}
      />
    </div>
  </motion.div>
))}

      </div>
    </div>
    <Footer/>
    </>
  )
}