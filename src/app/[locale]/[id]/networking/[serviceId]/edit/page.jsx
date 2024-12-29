// filepath: /D:/Semester 5/Web Engineering/innovateher/src/app/[locale]/[id]/networking/[serviceId]/edit/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Import NextAuth for session handling
import useLocaleStore from '@/lib/store/useLocaleStore';
import { UploadButton } from "@/utils/uploadthing";
import Image from 'next/image';

export default function EditNetworkingEvent() {
  const t = useTranslations("editNetworking");
  const { data: session, status } = useSession();
  const { currentLocale } = useLocaleStore();
  const user = session?.user;
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    price: '',
    description: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!user) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching service with ID: ${params.serviceId}`); // Debugging information
        const response = await fetch(`/api/services/${user.id}/networking?serviceId=${params.serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        const data = await response.json();
        const service = data.service;
        if (!service) {
          throw new Error('Service not found');
        }
        setFormData({
          name: service.title,
          date: service.date,
          location: service.location,
          price: service.price,
          imageUrl: service.imageUrl,
          description: service.description,
        });
      } catch (error) {
        console.error('Error fetching service:', error.message);
        setError('Failed to fetch service data.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.serviceId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const body = {
      id: params.serviceId,
      title: formData.name,
      date: formData.date,
      location: formData.location,
      price: formData.price,
      imageUrl: formData.imageUrl,
      description: formData.description,
      category: 'networking', // Use category extracted from the URL
      sellerId: session?.user?.id, // Ensure seller ID comes from authenticated user
    };

    try {
      const response = await fetch(`/api/services/${user.id}/networking`, {
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
        router.push(`/${currentLocale}/${user.id}/networking`); // Redirect to networking
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
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">{t('editNetworkingEvent')}</h2>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('eventName')}</label>
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">{t('eventDate')}</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">{t('eventLocation')}</label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('eventPrice')}</label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('eventDescription')}</label>
            <textarea
              id="description"
              name="description"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">{t('itemImage')}</label>
                      {formData.imageUrl && (
                        <div className="mb-4">
                          <Image
                            src={formData.imageUrl}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover rounded-xl"
                            alt="Current Image"
                          />
                        </div>
                      )}
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          console.log('Upload complete response:', res);
                          if (!res) {
                            console.log('No response received');
                            return;
                          }
                          try {
                            const fileUrl = res[0]?.url;
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
                        }}
                        onUploadError={(error) => {
                          alert(`Image upload failed: ${error.message}`);
                        }}
                      />
                    </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {t('updateEvent')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}