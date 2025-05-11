import { Button } from "../button"
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Undo2,
    Redo2,
    List,
    ListOrdered,
    Quote,
    Image,
} from "lucide-react"
import { useCallback } from "react"
import { useApp } from "@/components/context/AppProvider"
import { uploadImage } from "@/lib/cloudinary"
import { toast } from "sonner"

const FixMenu = ({ editor }: { editor: any }) => {
    const { setLoading } = useApp()

    if (!editor) return null

    const headingLevels: {
        level: 1 | 2 | 3 | 4 | 5 | 6
        Icon: React.FC<React.SVGProps<SVGSVGElement>>
    }[] = [
            { level: 1, Icon: Heading1 },
            { level: 2, Icon: Heading2 },
            { level: 3, Icon: Heading3 },
            { level: 4, Icon: Heading4 },
            { level: 5, Icon: Heading5 },
        ]

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

    const handleUploadImage = async () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                await addImage(file)
            }
        }
        input.click()
    }

    return (
        <div className="control-group mb-3">
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    variant={editor.isActive("bold") ? "default" : "outline"}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                >
                    <Bold />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive("italic") ? "default" : "outline"}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                >
                    <Italic />
                </Button>

                {headingLevels.map(({ level, Icon }) => (
                    <Button
                        type="button"
                        key={level}
                        variant={editor.isActive("heading", { level }) ? "default" : "outline"}
                        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                    >
                        <Icon />
                    </Button>
                ))}

                <Button
                    type="button"
                    variant={editor.isActive("bulletList") ? "default" : "outline"}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive("orderedList") ? "default" : "outline"}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered />
                </Button>

                <Button
                    type="button"
                    variant={editor.isActive("blockquote") ? "default" : "outline"}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadImage}
                >
                    <Image />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                >
                    <Undo2 />
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                >
                    <Redo2 />
                </Button>
            </div>
        </div>
    )
}

export default FixMenu
