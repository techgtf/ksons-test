"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdInsertLink,
  MdUndo,
  MdRedo,
  MdFormatClear,
  MdCode,
} from "react-icons/md";

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50/50 p-2">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={<MdFormatBold size={18} />}
        title="Bold"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={<MdFormatItalic size={18} />}
        title="Italic"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        icon={<MdFormatUnderlined size={18} />}
        title="Underline"
      />

      <div className="mx-1 h-6 w-px bg-gray-200" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="H1"
        icon={<span className="text-xs font-bold">H1</span>}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="H2"
        icon={<span className="text-xs font-bold">H2</span>}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="H3"
        icon={<span className="text-xs font-bold">H3</span>}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        title="Paragraph"
        icon={<span className="text-xs">P</span>}
      />

      <div className="mx-1 h-6 w-px bg-gray-200" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon={<MdFormatListBulleted size={18} />}
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon={<MdFormatListNumbered size={18} />}
        title="Ordered List"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        icon={<MdFormatQuote size={18} />}
        title="Blockquote"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        icon={<MdCode size={18} />}
        title="Inline Code"
      />

      <div className="mx-1 h-6 w-px bg-gray-200" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        icon={<MdFormatAlignLeft size={18} />}
        title="Align Left"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        icon={<MdFormatAlignCenter size={18} />}
        title="Align Center"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        icon={<MdFormatAlignRight size={18} />}
        title="Align Right"
      />

      <div className="mx-1 h-6 w-px bg-gray-200" />

      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive("link")}
        icon={<MdInsertLink size={18} />}
        title="Insert Link"
      />
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
        icon={<MdFormatClear size={18} />}
        title="Clear Format"
      />

      <div className="mx-1 h-6 w-px bg-gray-200" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        icon={<MdUndo size={18} />}
        title="Undo"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        icon={<MdRedo size={18} />}
        title="Redo"
      />
    </div>
  );
};

const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  icon,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
      isActive
        ? "bg-[#0f3c78] text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
    }`}
  >
    {icon}
  </button>
);

export default function TiptapEditor({
  value,
  onChange,
  placeholder,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[250px] p-4 text-gray-800",
      },
    },
  });

  // Sync value from props if changed externally (but avoid loops)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
      <style jsx global>{`
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .tiptap blockquote {
          border-left: 4px solid #0f3c78;
          padding-left: 1rem;
          font-style: italic;
          color: #4b5563;
          margin: 1rem 0;
        }
        .tiptap code {
          background-color: #f3f4f6;
          padding: 0.2rem 0.4rem;
          rounded: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
        .tiptap a {
          color: #2563eb;
          text-decoration: underline;
        }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-container" />
    </div>
  );
}
