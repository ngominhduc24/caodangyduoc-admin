import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import type { CategoryWithChildren } from "@/supabase/types"
import CategoryServices from "@/supabase/services/CategoryServices"
import LoaderOverlay from "../ui/loader-overlay"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import CategoryTable from "../ui/category-table"
import { toast } from "sonner"
import { useApp } from "../context/AppProvider"

function CreateUpdateCategory() {
    const { id, parentId } = useParams()
    const isUpdate = Boolean(id)
    const isCreateChild = Boolean(parentId)
    const navigate = useNavigate()
    const { loading, setLoading } = useApp()
    const [category, setCategory] = useState<CategoryWithChildren | null>(null)

    // fetch category data
    useEffect(() => {
        const fetchCategory = async () => {
            if (!isUpdate) return
            setLoading(true)
            if (isUpdate && id) {
                const { data } = await CategoryServices.getById(id, true)
                setCategory(data)
                form.setValue("name", data?.name || "")
                form.setValue("content", data?.content || "")
            }
            setLoading(false)
        }
        fetchCategory()
    }, [id])

    useEffect(() => {
        if (isCreateChild && parentId) {
            form.setValue("name", "")
            form.setValue("content", "")
        }
    }, [parentId])

    const title = isUpdate ? "Cập nhật danh mục" : "Tạo mới danh mục"

    const form = useForm({
        defaultValues: {
            name: category?.name || "",
            content: category?.content || "",
        },
    })

    const handleSubmit = async (data: any) => {
        setLoading(true)
        if (isUpdate && id) {
            await CategoryServices.update(id, data)
        } else {
            const res = await CategoryServices.create(data)
            if (isCreateChild && parentId) {
                await CategoryServices.addBulkChildren(parentId, [res.newCategory])
                navigate(`/category/update/${parentId}`)
                return
            }
            navigate(`/category/update/${res.newCategory.id}`)
        }
        setLoading(false)
    }

    const handleDeleteCategory = async (id: string) => {
        toast.promise(
            async () => {
                setLoading(true)
                const { error } = await CategoryServices.delete(id)
                if (!error) {
                    setCategory(prev => ({
                        ...prev,
                        children: prev?.children?.filter((category) => category.id !== id) || [],
                    }) as CategoryWithChildren)
                }
                setLoading(false)
                return error
            },
            {
                loading: "Đang xóa danh mục",
                success: "Xóa danh mục thành công",
                error: "Đã có lỗi xảy ra khi xóa danh mục",
            },
        )
    }


    return (
        <div className="w-2xl min-h-screen px-5 container">
            {loading && <LoaderOverlay />}
            <h1 className="text-2xl font-semibold">{title}</h1>
            <form
                className="mt-5 flex flex-col space-y-4 border-b pb-10"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="name">
                        Tên danh mục
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder="Tên danh mục"
                        {...form.register("name", { required: true })}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="content">
                        Mô tả
                    </Label>
                    <Input
                        id="content"
                        {...form.register("content")}
                    ></Input>
                </div>
                <Button type="submit" disabled={loading}>
                    {isUpdate ? "Cập nhật" : "Tạo mới"}
                </Button>
            </form>
            {
                isUpdate && (
                    <div className="mt-10">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">Danh sách danh mục con</h1>
                            <Button>
                                <Link to={`/category/create/${category?.id}`} className="flex items-center space-x-2">
                                    Tạo mới danh mục con
                                </Link>
                            </Button>
                        </div>
                        {
                            category?.children && (
                                <CategoryTable categories={category?.children} handleDeleteCategory={handleDeleteCategory} />
                            )
                        }
                    </div>


                )
            }
        </div>
    )
}

export default CreateUpdateCategory
