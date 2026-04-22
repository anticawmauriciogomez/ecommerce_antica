"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Strikethrough } from "lucide-react";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
  name?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
}

export function RichTextEditor({
  name,
  defaultValue,
  onChange,
}: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue || "");

  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-sm sm:prose-base focus:outline-none min-h-[150px] p-4",
        style: "color: var(--foreground)",
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      const val = editor.getHTML();
      setHtml(val);
      onChange?.(val);
    },
  } as any);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!editor || !mounted) {
    return null;
  }

  return (
    <div className="border border-(--card-border) rounded-2xl overflow-hidden flex flex-col bg-(--card-bg) shadow-[0_2px_10px_rgba(26,21,18,0.01)] transition-all focus-within:border-accent-gold/30">
      {/* Hidden input para FormData (cuando se usa con name) */}
      {name && <input type="hidden" name={name} value={html} />}

      <div className="flex flex-wrap items-center gap-1.5 border-b border-(--card-border) p-2.5 bg-accent-gold/[0.03]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-xl transition-all hover:bg-accent-gold/10 text-accent-gold/60 hover:text-accent-gold ${editor.isActive("bold") ? "bg-accent-gold/10 text-accent-gold" : ""}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-xl transition-all hover:bg-accent-gold/10 text-accent-gold/60 hover:text-accent-gold ${editor.isActive("italic") ? "bg-accent-gold/10 text-accent-gold" : ""}`}
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded-xl transition-all hover:bg-accent-gold/10 text-accent-gold/60 hover:text-accent-gold ${editor.isActive("strike") ? "bg-accent-gold/10 text-accent-gold" : ""}`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-(--card-border) mx-1.5" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-xl transition-all hover:bg-accent-gold/10 text-accent-gold/60 hover:text-accent-gold ${editor.isActive("bulletList") ? "bg-accent-gold/10 text-accent-gold" : ""}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-xl transition-all hover:bg-accent-gold/10 text-accent-gold/60 hover:text-accent-gold ${editor.isActive("orderedList") ? "bg-accent-gold/10 text-accent-gold" : ""}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <div className="cursor-text flex-1">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
