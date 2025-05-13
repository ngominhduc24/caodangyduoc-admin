import { useForm } from "react-hook-form"
import { Label } from "../ui/label"
import RichText from "../ui/RichTextEditor/hot-text"
import { Input } from "../ui/input"
import React, { useEffect, useState } from "react"
import { useApp } from "../context/AppProvider"
import { Button } from "../ui/button"
import { useCategories } from "@/hooks/useCategories"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import PostServices from "@/supabase/services/PostServices"
import { toast } from "sonner"
import { uploadImage } from "@/lib/cloudinary"
import { useNavigate, useParams } from "react-router-dom"
import { usePost } from "@/hooks/useNews"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { TAGS } from "@/contansts"

interface FormSchema {
    title: string
    content: string
    description: string
    category_id: string
    thumbnail: string
    tags: string[] | null
}

function CreatePost() {
    const navigate = useNavigate()
    const { loading, setLoading } = useApp()
    const { categories } = useCategories()
    const { id } = useParams()
    const isEditMode = Boolean(id)
    const { post } = usePost(id as string)
    const [selectedTags, setSelectedTags] = useState<string[] | null>(post?.tags as string[] || null)

    useEffect(() => {
        if (isEditMode && post) {
            setSelectedTags(post.tags as string[])
        }
    }, [post])

    const form = useForm<FormSchema>({
        defaultValues: {
            title: "",
            content: "",
            description: "",
            category_id: "",
            thumbnail: "",
            tags: [],
        },
    })

    useEffect(() => {
        if (isEditMode && post) {
            form.setValue("title", post.title)
            form.setValue("content", post.content)
            form.setValue("description", post.description)
            form.setValue("category_id", post?.category_id || "")
            form.setValue("thumbnail", post.thumbnail)
            form.setValue("tags", Array.isArray(post.tags) ? post.tags as string[] : null)
        }
    }, [post])

    const handleSubmit = async (data: any) => {
        setLoading(true)
        if (isEditMode) {
            toast.promise(PostServices.update(id as string, data), {
                loading: "Đang cập nhật bài viết...",
                success: () => {
                    navigate("/post")
                    return "Cập nhật bài viết thành công"
                },
                error: (err) => {
                    console.error(err)
                    return "Lỗi cập nhật bài viết"
                },
                finally: () => setLoading(false),
            })
            return
        }
        toast.promise(PostServices.create(data), {
            loading: "Đang tạo bài viết...",
            success: () => {
                navigate("/post")
                return "Tạo bài viết thành công"
            },
            error: (err) => {
                console.error(err)
                return "Lỗi tạo bài viết"
            },
            finally: () => setLoading(false),
        })
    }

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLoading(true)
            toast.promise(uploadImage(file), {
                loading: "Đang tải ảnh lên...",
                success: (res) => {
                    form.setValue("thumbnail", res)
                    return "Tải ảnh lên thành công"
                },
                error: (err) => {
                    console.error(err)
                    return "Lỗi tải ảnh lên"
                },
                finally: () => setLoading(false),
            })
        }
    }

    useEffect(() => {
        if (selectedTags) {
            form.setValue("tags", selectedTags)
        }
    }, [selectedTags])

    if (isEditMode && !post) return null

    return (
        <form className="max-w-5xl min-h-screen px-5 container pb-20" onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl !font-bold mb-5">
                        {isEditMode ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
                    </h1>
                    <Button disabled={loading} type="submit">
                        {isEditMode ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="mb-4">
                        <Label htmlFor="title" className="mb-2">Tiêu đề</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Nhập tiêu đề bài viết"
                            {...form.register("title", { required: true })}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="title" className="mb-2">Danh mục</Label>
                        <Select defaultValue={post?.category_id as string} onValueChange={(value) => form.setValue("category_id", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mb-4">
                    <Label className="mb-2" htmlFor="description">Mô tả</Label>
                    <Textarea
                        id="description"
                        {...form.register("description", { required: true })}
                        placeholder="Nhập mô tả bài viết"
                        className="mt-1 block w-full border rounded-md p-3 focus:ring focus:ring-opacity-50"
                    />
                </div>

                <div className="mb-4">
                    <Label className="mb-2" htmlFor="content">Nội dung</Label>
                    <RichText content={post?.content} onChange={(content) => form.setValue("content", content)} />
                </div>

                <div className="mb-4">
                    <Label className="mb-2" htmlFor="thumbnail">Hình ảnh đại diện</Label>
                    <Input
                        type="file"
                        id="thumbnail"
                        onChange={handleUploadImage}
                    />
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                    <Label className="mb-2 col-span-12" htmlFor="tags">Tags</Label>
                    {
                        TAGS.map((tag) => (
                            <div key={tag.id} className="flex items-center space-x-2 mb-2 p-2 border rounded-md">
                                <Checkbox
                                    id={tag.id}
                                    value={tag.id}
                                    checked={selectedTags?.includes(tag.id) || false}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setSelectedTags((prev) => [...(prev || []), tag.id])
                                        } else {
                                            setSelectedTags((prev) => prev?.filter((t) => t !== tag.id) || null)
                                        }
                                    }}
                                />
                                <Label htmlFor={tag.id} className="cursor-pointer">{tag.name}</Label>
                            </div>
                        ))
                    }
                </div>

            </fieldset>
        </form>
    )
}

export default CreatePost
