import Link from 'next/link'
import { fetchSanity } from '@/lib/sanity'
import { modulesQuery } from '@/lib/sanity.queries'
import { Module } from '@/types'

export default async function Home() {
  let modules: Module[] = []
  let error = false

  try {
    modules = await fetchSanity<Module[]>(modulesQuery)
  } catch (e) {
    console.error('Error fetching modules:', e)
    error = true
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            JLPT Learning Platform
          </h1>
          <p className="text-xl text-gray-600">
            A modular approach to mastering Japanese, from N5 to N1.
          </p>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Modules</h2>
          
          {error ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700">Failed to load modules. Please try again later.</p>
            </div>
          ) : modules && modules.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {modules.map((module) => (
                <Link 
                  key={module._id}
                  href={`/modules/${module._id}`}
                  className="block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                      {module.level}
                    </span>
                    <span className="text-gray-400 text-sm">Module {module.order}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{module.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No modules found. Please check back later!</p>
          )}
        </section>
      </div>
    </main>
  )
}
