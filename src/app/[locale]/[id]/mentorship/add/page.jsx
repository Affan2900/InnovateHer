'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FixedNavbar from '@/components/FixedNavbar';
import LanguageToggle from '@/components/LanguageToggle';
import useLocaleStore from '@/lib/store/useLocaleStore';
import { UploadButton } from "@/utils/uploadthing";

export default function AddMentorshipOpportunity() {
  const t = useTranslations("addMentorship")
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale } = useLocaleStore();
  const user = session?.user;
  const category = pathname.split('/')[3]; // Extract category from the URL
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    duration: '',
    description: '',
    price: '',
    imageUrl: '',
  })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      title: formData.name,
      expertise: formData.expertise,
      duration: formData.duration,
      description: formData.description,
      imageUrl: formData.imageUrl,
      price: formData.price, // Include price in the request body
      category, // Use category extracted from the URL
      sellerId: session?.user?.id, // Ensure seller ID comes from authenticated user
    };

    try {
      const response = await fetch(`/api/services/${user.id}/mentorship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || 'Failed to add the item.');
      } else {
        router.push(`/${currentLocale}/${user.id}/mentorship`); // Redirect to marketplace
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
    <div className="min-h-screen mt-28 flex items-center justify-center bg-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">{t('addMentorshipOpportunity')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('mentorName')}</label>
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
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">{t('mentorExpertise')}</label>
            <input
              type="text"
              id="expertise"
              name="expertise"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.expertise}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">{t('mentorshipDuration')}</label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('mentorshipDescription')}</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('mentorshipPrice')}</label>
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
              {loading ? 'Loading...' : t('addMentorship')}
          </motion.button>
        </form>
      </motion.div>
    </div>
    </>
  )
}

