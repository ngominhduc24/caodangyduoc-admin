import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import MenuBar from './menu-bar'
import React, { useCallback, useRef } from 'react'
import FixMenu from './fix-menu'
import { uploadImage } from '@/lib/cloudinary'
import { useApp } from '@/components/context/AppProvider'
import { toast } from 'sonner'

const extensions = [StarterKit, Document, Paragraph, Text, Image.configure({
    HTMLAttributes: {
        class: 'tiptap-image',
    },
}), Dropcursor]

interface RichTextProps {
    content?: string | null
    onChange?: (content: string) => void
}

function RichText({ content = 'Viết nội dung ở đây...', onChange }: RichTextProps) {
    const { setLoading } = useApp()
    const inputRef = useRef<HTMLDivElement>(null)

    const editor = useEditor({
        extensions,
        content,
        editorProps: {
            attributes: {
                class: 'prose !max-w-none p-3 outline-none transition-all border rounded focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange?.(html)
        },
    })

    const addImage = useCallback(async (file: File) => {
        if (file) {
            setLoading(true)
            toast.promise(uploadImage(file), {
                loading: 'Đang tải ảnh lên...',
                success: (res) => {
                    editor?.chain().focus().setImage({ src: res }).run()
                    return "Tải ảnh lên thành công"
                },
                error: (err) => {
                    console.error(err)
                    return 'Lỗi tải ảnh lên'
                },
                finally: () => setLoading(false),
            })
        }
    }, [editor])

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData.items
        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                const file = item.getAsFile()
                await addImage(file as File)
            }
        }
    }

    if (!editor) return null

    return (
        <div ref={inputRef} onPaste={handlePaste}>
            <FixMenu editor={editor} />
            <EditorContent editor={editor} />
            <BubbleMenu editor={editor}>
                <MenuBar editor={editor} />
            </BubbleMenu>
        </div>
    )
}

export default RichText
