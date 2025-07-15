import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const config = {
  projectId: 'vsm3z9xo',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
}

export const client = createClient({
  projectId: config.projectId,
  dataset: config.dataset,
  apiVersion: config.apiVersion,
  useCdn: config.useCdn,
})

// Set up the image URL builder
const builder = imageUrlBuilder(client)

// Helper function to get image URL
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
} 