// GROQ queries for fetching data from Sanity

export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage {
    asset -> {
      _id,
      url
    },
    alt
  },
  publishedAt,
  author -> {
    name,
    image {
      asset -> {
        _id,
        url
      }
    }
  },
  categories[] -> {
    _id,
    title,
    slug
  },
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
}`

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  mainImage {
    asset -> {
      _id,
      url
    },
    alt
  },
  body,
  publishedAt,
  author -> {
    name,
    bio,
    image {
      asset -> {
        _id,
        url
      }
    }
  },
  categories[] -> {
    _id,
    title,
    slug,
    description
  },
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
}`

export const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  description
}`

export const POSTS_BY_CATEGORY_QUERY = `*[_type == "post" && $categoryId in categories[]._ref] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  mainImage {
    asset -> {
      _id,
      url
    },
    alt
  },
  publishedAt,
  author -> {
    name,
    image {
      asset -> {
        _id,
        url
      }
    }
  },
  categories[] -> {
    _id,
    title,
    slug
  },
  "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
}` 