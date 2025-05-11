import { useNews } from "@/hooks/useNews"
import PostCard from "../ui/post-card"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { useCategories } from "@/hooks/useCategories"

const limit = 10

function News() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [category_id, setCategoryId] = useState("")
    const { categories } = useCategories()
    const { news, count } = useNews({
        page,
        limit,
        search,
        category_id: category_id,
    })

    return (
        <div className="px-5 pb-20 container">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl font-bold mb-5">Bài viết</h1>
                <Link to="/post/create">
                    <Button variant="outline" className="mb-5">
                        Tạo bài viết
                    </Button>
                </Link>
            </div>
            {
                news?.length === 0 && (
                    <div className="flex items-center justify-center h-96">
                        <h1 className="text-2xl font-bold">Không có bài viết nào</h1>
                    </div>
                )
            }
            <div className="flex items-center mb-5 space-x-2">
                <Input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-lg"
                />
                <div className="w-lg">
                    <Select onValueChange={(value) => setCategoryId(value)}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {
                    news?.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                }
            </div>
            {news && (<div className="flex items-center space-x-2 mt-5">
                <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Trang trước
                </Button>
                <Badge>Trang {page}</Badge>
                <Button
                    variant="outline"
                    disabled={page * limit >= count!}
                    onClick={() => setPage(page + 1)}
                >
                    Trang sau
                </Button>
            </div>)}
        </div>
    )
}

export default News
