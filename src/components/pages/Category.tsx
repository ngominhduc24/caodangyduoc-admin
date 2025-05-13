import CategoryServices from "@/supabase/services/CategoryServices"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import CategoryTable from "../ui/category-table"
import { useApp } from "../context/AppProvider"
import { toast } from "sonner"
import { useCategories } from "@/hooks/useCategories"

function Category() {
    const { categories, setCategories } = useCategories()
    const { setLoading } = useApp()

    const handleDeleteCategory = async (id: string) => {
        toast.promise(
            async () => {
                setLoading(true)
                const { error } = await CategoryServices.delete(id)
                if (!error) {
                    setCategories((prev) => prev?.filter((category) => category.id !== id) || [])
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
        <div className="max-w-5xl min-h-screen px-5 container">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl !font-semibold">Quản lý danh mục</h1>
                <Button>
                    <Link to="/category/create" className="flex items-center space-x-2">
                        Thêm danh mục
                    </Link>
                </Button>
            </div>
            <CategoryTable categories={categories} handleDeleteCategory={handleDeleteCategory} />
        </div>
    )
}

export default Category
