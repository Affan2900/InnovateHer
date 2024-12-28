'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'; // Import NextAuth for session handling
import useLocaleStore from '@/lib/store/useLocaleStore';

export default function EditSkillBuildingCourse() {
  const t = useTranslations("editSkillBuilding")
  const { data: session } = useSession();
  const { currentLocale } = useLocaleStore();
  const user = session?.user;
  const router = useRouter();
  const params = useParams();


  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    description: '',
    price: '',
    difficulty: '',
  })

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        console.log(`Fetching service with ID: ${params.serviceId}`); // Debugging information
        const response = await fetch(`/api/services/${user.id}/skill-building?serviceId=${params.serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        const data = await response.json();
        const service = data.service;
        setFormData({
          name: service.title,
          price: service.price,
          description: service.description,
          difficulty: service.difficulty,
          duration: service.duration,
        });
      } catch (error) {
        console.error('Error fetching service:', error.message);
        setError('Failed to fetch service data.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      id: params.serviceId,
      title: formData.name,
      price: formData.price,
      description: formData.description,
      difficulty: formData.difficulty,
      duration: formData.duration,
      category: 'skill-building', // Use category extracted from the URL
      sellerId: session?.user?.id, // Ensure seller ID comes from authenticated user
    };

    try {
      const response = await fetch(`/api/services/${user.id}/skill-building`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || 'Failed to update the item.');
      } else {
        router.push(`/${currentLocale}/${user.id}/skill-building`); // Redirect to marketplace
      }
    } catch (err) {
      console.error('Error submitting form:', err.message);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
        <p className="text-2xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">{t('editSkillBuildingCourse')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('courseName')}</label>
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
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">{t('courseDuration')}</label>
              <input
                type="text"
                id="duration"
                name="duration"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">{t('courseDifficulty')}</label>
              <input
                type="text"
                id="difficulty"
                name="difficulty"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.difficulty}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('coursePrice')}</label>
              <input
                type="number"
                id="price"
                name="price"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('courseDescription')}</label>
              <textarea
                id="description"
                name="description"
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {t('updateCourse')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}