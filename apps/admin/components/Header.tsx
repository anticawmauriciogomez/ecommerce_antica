export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
      <div className="flex items-center">
        {/* Placeholder for Breadcrumbs or title */}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  )
}
