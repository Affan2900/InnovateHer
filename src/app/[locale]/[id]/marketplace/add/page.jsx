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

export default function AddMarketplaceItem() {
  const t = useTranslations('addMarketplace');
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { currentLocale } = useLocaleStore();
  const user = session?.user;
  const category = pathname.split('/')[3];

  const [formData, setFormData] = useState({
    name: '',
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

    try {
      const body = {
        title: formData.name,
        price: formData.price,
        description: formData.description,
        imageUrl: formData.imageUrl,
        category,
        sellerId: user?.id,
      };

      const response = await fetch(`/api/services/${user?.id}/marketplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add service');
        setLoading(false);
        return;
      }

      router.push(`/${currentLocale}/${user?.id}/marketplace`);
    } catch (err) {
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
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">
            {t('addMarketplaceItem')}
          </h2>
          
          {/* Enhanced error display */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {t('itemName')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                {t('itemPrice')}
              </label>
              <input
                type="text"
                id="price"
                name="price"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t('itemDescription')}
              </label>
              <textarea
                id="description"
                name="description"
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
                  if (res?.[0]?.url) {
                    setFormData(prev => ({
                      ...prev,
                      imageUrl: res[0].url
                    }));
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
              {loading ? 'Loading...' : t('addItem')}
            </motion.button>
          </form>
        </div>
      </div>
    </>
  );
}