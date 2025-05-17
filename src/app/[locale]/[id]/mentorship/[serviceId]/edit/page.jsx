'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import useLocaleStore from '@/lib/store/useLocaleStore'
import Image from 'next/image'
import { UploadButton } from "@/utils/uploadthing"

export default function EditMentorshipOpportunity() {
  const t = useTranslations("editMentorship")
  const { data: session } = useSession()
  const { currentLocale } = useLocaleStore()
  const user = session?.user
  const router = useRouter()
  const params = useParams()

  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    duration: '',
    description: '',
    price: '',
    imageUrl: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchService = async () => {
      if (!user) {
        setError('User not logged in.')
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`/api/services/${user.id}/mentorship?serviceId=${params.serviceId}`)
        if (!response.ok) throw new Error('Failed to fetch service')
        const data = await response.json()
        const service = data.service
        setFormData({
          name: service.title,
          price: service.price,
          description: service.description,
          expertise: service.expertise,
          duration: service.duration,
          imageUrl: service.imageUrl,
        })
      } catch (error) {
        setError('Failed to fetch service data.')
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [params.serviceId, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const body = {
      id: params.serviceId,
      title: formData.name,
      expertise: formData.expertise,
      duration: formData.duration,
      description: formData.description,
      imageUrl: formData.imageUrl,
      price: formData.price,
      category: 'mentorship',
      sellerId: session?.user?.id,
    }

    try {
      const response = await fetch(`/api/services/${user.id}/mentorship`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update the item.')
      } else {
        router.push(`/${currentLocale}/${user.id}/mentorship`)
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
        <p className="text-2xl font-semibold">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">{t('editMentorshipOpportunity')}</h2>
        {/* Error display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
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
            <span className="text-xs text-gray-500">Allowed range: 1 to 10,000</span>
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
            {t('updateMentorship')}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}