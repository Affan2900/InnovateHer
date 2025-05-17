'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useLocaleStore from '@/lib/store/useLocaleStore';
import { UploadButton } from "@/utils/uploadthing";
import Image from 'next/image';

export default function EditMarketplaceItem() {
  const t = useTranslations("editMarketplace");
  const { data: session } = useSession();
  const { currentLocale } = useLocaleStore();
  const user = session?.user;
  const router = useRouter();
  const params = useParams();

  const [formData, setFormData] = useState({
    name: '',
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
        const response = await fetch(`/api/services/${user.id}/marketplace?serviceId=${params.serviceId}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        const data = await response.json();
        const service = data.service;
        if (!service) {
          throw new Error('Service not found');
        }
        setFormData({
          name: service.title,
          price: service.price,
          description: service.description,
          imageUrl: service.imageUrl,
        });
      } catch (error) {
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
      price: formData.price,
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: 'marketplace',
      sellerId: session?.user?.id,
    };

    try {
      const response = await fetch(`/api/services/${user.id}/marketplace`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update the item.');
      } else {
        router.push(`/${currentLocale}/${user.id}/marketplace`);
      }
    } catch (err) {
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
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">{t('editMarketplaceItem')}</h2>
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('itemName')}</label>
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
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">{t('itemPrice')}</label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min={1}
              max={10000}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              value={formData.price}
              onChange={handleChange}
            />
            <span className="text-xs text-gray-500">Allowed range: 1 to 10,000</span>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('itemDescription')}</label>
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
                if (!res) return;
                try {
                  const fileUrl = res[0]?.url;
                  if (fileUrl) {
                    setFormData(prev => ({
                      ...prev,
                      imageUrl: fileUrl
                    }));
                  }
                } catch (err) {
                  setError('Error processing upload response.');
                }
              }}
              onUploadError={(error) => {
                setError(`Image upload failed: ${error.message}`);
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
            {t('updateItem')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}