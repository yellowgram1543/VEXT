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
    order,
    "chapterCount": count(*[_type == "chapter" && module._ref == ^._id]),
    "chapterIds": *[_type == "chapter" && module._ref == ^._id]._id
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
 * Fetches a single chapter or topic by slug.
 */
export const chapterBySlugQuery = groq`
  *[(_type == "chapter" || _type == "topic") && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    order,
    content,
    "module": module-> {
      _id,
      title
    },
    "nextChapter": *[(_type == "chapter" || _type == "topic") && module._ref == ^.module._ref && order > ^.order] | order(order asc)[0] {
      title,
      slug
    },
    understand {
      content[] {
        ...,
        _type == "socraticPrompt" => {
          question,
          hint,
          explanation
        }
      }
    },
    reinforce {
      practices[] {
        ...
      }
    },
    test {
      questions[] {
        question,
        type,
        "image": image.asset->url,
        options,
        correctAnswer,
        explanation
      }
    },
    apply {
      instruction,
      spec,
      sandbox {
        runtime,
        entryPoint,
        requirements
      }
    }
  }
`

/**
 * Fetches all modules and their chapters for the hierarchical sidebar.
 */
export const sidebarHierarchyQuery = groq`
  *[_type == "module"] | order(order asc) {
    _id,
    title,
    order,
    "chapters": *[(_type == "chapter" || _type == "topic") && module._ref == ^._id] | order(order asc) {
      _id,
      title,
      slug,
      order
    }
  }
`
