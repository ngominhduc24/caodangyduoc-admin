import { Button } from "../button"
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    List,
    ListOrdered,
    Quote,
} from "lucide-react"

const MenuBar = ({ editor }: { editor: any }) => {

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

    return (
        <div className="flex flex-wrap gap-1 p-2 bg-white border rounded-md shadow-sm">
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
        </div>
    )
}

export default MenuBar
