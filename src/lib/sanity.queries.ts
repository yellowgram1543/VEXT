import { groq } from 'next-sanity'

/**
 * Fetches all modules ordered by 'order' ascending.
 */
export const modulesQuery = groq`
  *[_type == "module"] | order(order asc) {
    _id,
    title,
    description,
    level,
    order
  }
`

/**
 * Fetches a single module by ID, including its chapters.
 */
export const moduleByIdQuery = groq`
  *[_type == "module" && _id == $id][0] {
    _id,
    title,
    description,
    level,
    order,
    "chapters": *[_type == "chapter" && module._ref == ^._id] | order(order asc) {
      _id,
      title,
      slug,
      order
    }
  }
`

/**
 * Fetches a single chapter by slug.
 */
export const chapterBySlugQuery = groq`
  *[_type == "chapter" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    order,
    content,
    "module": module-> {
      _id,
      title,
      "slug": slug.current
    },
    "nextChapter": *[_type == "chapter" && module._ref == ^.module._ref && order > ^.order] | order(order asc)[0] {
      title,
      slug
    }
  }
`
