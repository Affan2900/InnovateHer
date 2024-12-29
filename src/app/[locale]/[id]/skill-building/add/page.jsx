// filepath: /D:/Semester 5/Web Engineering/innovateher/src/app/[locale]/[id]/skill-building/add/page.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FixedNavbar from '@/components/FixedNavbar';
import LanguageToggle from '@/components/LanguageToggle';
import useLocaleStore from '@/lib/store/useLocaleStore';
import { UploadButton } from "@/utils/uploadthing";

export default function AddSkillBuildingCourse() {
  const t = useTranslations('addSkillBuilding');
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale } = useLocaleStore();
  const user = session?.user;
  const category = pathname.split('/')[3]; // Extract category from the URL

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    difficulty: '',
    price: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      title: formData.name,
      duration: formData.duration,
      difficulty: formData.difficulty,
      price: formData.price,
      description: formData.description,
      imageUrl: formData.imageUrl,
      category, // Use category extracted from the URL
      sellerId: session?.user?.id, // Ensure seller ID comes from authenticated user
    };

    try {
      const response = await fetch(`/api/services/${user.id}/skill-building`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || 'Failed to add the course.');
      } else {
        router.push(`/${currentLocale}/${user.id}/skill-building`); // Redirect to skill-building
      }
    } catch (err) {
      console.error('Error submitting form:', err.message);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FixedNavbar />
      <div className="fixed top-28 right-8 z-40">
        <LanguageToggle />
      </div>
      <div className="min-h-screen flex mt-14 items-center justify-center bg-purple-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">{t('addSkillBuildingCourse')}</h2>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
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
            <div>
                          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            {t('itemImage')}
                          </label>
                          <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Log the complete response
                console.log('Upload complete response:', res);
                
                // Check if we have a response at all
                if (!res) {
                  console.log('No response received');
                  return;
                }
            
                // Try to access the file URL safely
                try {
                  const fileUrl = res[0]?.url;  // Note: might be .url instead of .fileUrl
                  console.log('File URL:', fileUrl);
                  
                  if (fileUrl) {
                    setFormData(prev => ({
                      ...prev,
                      imageUrl: fileUrl
                    }));
                    console.log('Form data updated with URL:', fileUrl);
                  } else {
                    console.log('No file URL found in response');
                  }
                } catch (err) {
                  console.error('Error processing upload response:', err);
                }
                
                alert('Image uploaded successfully!');
              }}
              onUploadProgress={(progress) => {
                console.log('Upload progress:', progress);
              }}
              onUploadError={(error) => {
                console.error('Upload error:', error);
                alert(`Image upload failed: ${error.message}`);
              }}
            />
                        </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : t('addCourse')}
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
}