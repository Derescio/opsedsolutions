export interface BlogPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  mainImage: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  body: PortableTextBlock[] // Portable Text content
  publishedAt: string
  author: {
    name: string
    bio?: string
    image?: {
      asset: {
        _id: string
        url: string
      }
    }
  }
  categories: Category[]
  estimatedReadingTime: number
}

export interface Category {
  _id: string
  title: string
  slug: {
    current: string
  }
  description?: string
}

export interface Author {
  _id: string
  name: string
  bio?: string
  image?: {
    asset: {
      _id: string
      url: string
    }
  }
}

// Portable Text types
export interface PortableTextBlock {
  _type: string
  _key: string
  children?: PortableTextChild[]
  style?: string
  listItem?: string
  level?: number
  markDefs?: PortableTextMarkDef[]
}

export interface PortableTextChild {
  _type: string
  _key: string
  text?: string
  marks?: string[]
}

export interface PortableTextMarkDef {
  _type: string
  _key: string
  href?: string
}

export interface ImageBlock {
  _type: 'image'
  asset: {
    _id: string
    url: string
  }
  alt?: string
  caption?: string
}

export interface CodeBlock {
  _type: 'codeBlock'
  code: string
  language?: string
  filename?: string
}

export interface CalloutBlock {
  _type: 'callout'
  type: 'info' | 'warning' | 'error' | 'success'
  title?: string
  content?: string
}

export interface PortableTextComponentProps {
  value: ImageBlock | CodeBlock | CalloutBlock
  children?: React.ReactNode
} 