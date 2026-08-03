import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder, CharacterCount } from "@tiptap/extensions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LuBold,
  LuItalic,
  LuUnderline,
  LuStrikethrough,
  LuCode,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuList,
  LuListOrdered,
  LuQuote,
  LuCodeXml,
  LuMinus,
  LuLink,
  LuUndo2,
  LuRedo2,
  LuRemoveFormatting,
} from "react-icons/lu";

const ToolbarDivider = () => (
  <span className="w-px h-6 bg-border shrink-0 mx-1.5" aria-hidden="true" />
);

const ToolbarButton = ({ onClick, isActive, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    aria-pressed={isActive}
    className={cn(
      "p-2 rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center",
      isActive
        ? "bg-primary text-white shadow-sm"
        : "text-[#555] hover:bg-primary/10 hover:text-primary",
      disabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[#555]",
    )}
  >
    {children}
  </button>
);

const RichTextEditor = ({ setValue, errors, initialContent = "" }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { HTMLAttributes: { class: "list-disc ml-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-6" } },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline underline-offset-2",
            rel: "noopener noreferrer nofollow",
          },
        },
      }),
      Placeholder.configure({
        placeholder: "Describe your camp — schedule, activities, what referees should expect...",
      }),
      CharacterCount.configure({ limit: 10000 }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[420px] px-5 py-4 text-base",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("camp_details", editor.getHTML(), { shouldValidate: true });
    },
  });

  const characters = editor?.storage.characterCount.characters?.() ?? 0;
  const words = editor?.storage.characterCount.words?.() ?? 0;
  const limit = 10000;
  const nearLimit = characters >= limit - 500;

  const setLink = () => {
    const url = linkUrl.trim();
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setShowLinkInput(false);
  };

  return (
    <div className="w-full flex flex-col">
      <label className="capitalize font-medium text-[#333] text-base">
        Camp Details{" "}
        <span className="text-neutral-400 text-sm">(Optional)</span>
      </label>

      <div className="mt-2 border border-border rounded-[10px] overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 px-2.5 py-2 bg-[#FAFAFA] border-b border-border">
          <ToolbarButton
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo().run()}
            title="Undo"
          >
            <LuUndo2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo().run()}
            title="Redo"
          >
            <LuRedo2 size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor?.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <LuHeading1 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor?.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <LuHeading2 size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor?.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <LuHeading3 size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBold().run()}
            isActive={editor?.isActive("bold")}
            title="Bold"
          >
            <LuBold size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            isActive={editor?.isActive("italic")}
            title="Italic"
          >
            <LuItalic size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            isActive={editor?.isActive("underline")}
            title="Underline"
          >
            <LuUnderline size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            isActive={editor?.isActive("strike")}
            title="Strikethrough"
          >
            <LuStrikethrough size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCode().run()}
            isActive={editor?.isActive("code")}
            title="Inline code"
          >
            <LuCode size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            isActive={editor?.isActive("bulletList")}
            title="Bullet list"
          >
            <LuList size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            isActive={editor?.isActive("orderedList")}
            title="Numbered list"
          >
            <LuListOrdered size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            isActive={editor?.isActive("blockquote")}
            title="Quote"
          >
            <LuQuote size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            isActive={editor?.isActive("codeBlock")}
            title="Code block"
          >
            <LuCodeXml size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            title="Horizontal rule"
          >
            <LuMinus size={18} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => {
              setLinkUrl(editor?.getAttributes("link").href || "");
              setShowLinkInput((prev) => !prev);
            }}
            isActive={editor?.isActive("link")}
            title="Insert link"
          >
            <LuLink size={18} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor?.chain().focus().unsetAllMarks().clearNodes().run()
            }
            title="Clear formatting"
          >
            <LuRemoveFormatting size={18} />
          </ToolbarButton>
        </div>

        {/* Link input */}
        {showLinkInput && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-3 py-2.5 bg-white border-b border-border">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setLink();
                }
                if (e.key === "Escape") setShowLinkInput(false);
              }}
              placeholder="https://example.com"
              autoFocus
              className="flex-1 px-3 py-2 rounded-lg border border-black/20 bg-white text-sm text-[#333] outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={setLink}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition cursor-pointer"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  editor?.chain().focus().extendMarkRange("link").unsetLink().run();
                  setShowLinkInput(false);
                }}
                className="px-4 py-2 rounded-lg border border-border text-sm text-[#666] hover:bg-gray-50 transition cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="rich-editor">
          <EditorContent editor={editor} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAFAFA] border-t border-border text-xs text-[#666]">
          <span className="italic">
            Supports headings, lists, quotes & links
          </span>
          <span className="flex items-center gap-3">
            <span>{words.toLocaleString()} words</span>
            <span className={cn("font-medium", nearLimit && "text-red-500")}>
              {characters.toLocaleString()} / {limit.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {errors.camp_details && (
        <p className="text-red-500 text-sm mt-1">
          {errors.camp_details.message}
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;
