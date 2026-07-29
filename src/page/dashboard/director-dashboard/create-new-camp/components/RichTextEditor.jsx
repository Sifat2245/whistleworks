import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  RiBold,
  RiItalic,
  RiH2,
  RiListUnordered,
  RiListOrdered,
} from "react-icons/ri";

const ToolbarButton = ({ onClick, isActive, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-200 ${
      isActive ? "bg-gray-300" : ""
    }`}
    title={title}
  >
    {children}
  </button>
);

const RichTextEditor = ({ setValue, errors, initialContent = "" }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { HTMLAttributes: { class: "list-disc ml-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-6" } },
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        className:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] p-4 border border-gray-300 border-t-0 rounded-b-xl bg-white",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("camp_details", editor.getHTML(), { shouldValidate: true });
    },
  });

  return (
    <div className="w-full flex flex-col">
      <label className="capitalize font-medium text-[#333] text-sm sm:text-base lg:text-lg">
        Camp Details{" "}
        <span className="text-neutral-400 text-sm">(Optional)</span>
      </label>

      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 border border-gray-300 rounded-t-xl">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive("bold")}
          title="Bold"
        >
          <RiBold size={20} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive("italic")}
          title="Italic"
        >
          <RiItalic size={20} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor?.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <RiH2 size={20} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive("bulletList")}
          title="Bullet List"
        >
          <RiListUnordered size={20} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          isActive={editor?.isActive("orderedList")}
          title="Numbered List"
        >
          <RiListOrdered size={20} />
        </ToolbarButton>
      </div>

      <div className="border border-gray-300 rounded-b-xl overflow-hidden bg-white">
        <EditorContent editor={editor} />
      </div>

      {errors.camp_details && (
        <p className="text-red-500 text-sm mt-1">
          {errors.camp_details.message}
        </p>
      )}

      <input type="hidden" name="camp_details" />
    </div>
  );
};

export default RichTextEditor;
