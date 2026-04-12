'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { useEffect, useState } from 'react'

export function RichTextEditor({ name, defaultValue }: { name: string, defaultValue?: string }) {
  const [html, setHtml] = useState(defaultValue || '')
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML())
    },
  })

  // Prevent hydration mismatch on toolbar buttons
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!editor || !mounted) {
    return null
  }

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden flex flex-col bg-white dark:bg-[#1a1c22]">
      {/* Hidden input to inject the selected HTML string into the parent FormData form submission */}
      <input type="hidden" name={name} value={html} />
      
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <div className="cursor-text flex-1">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
