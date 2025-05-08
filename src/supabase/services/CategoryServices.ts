import { toast } from "sonner"
import supabase from "../supabaseClient"
import type { Category, CategoryWithChildren } from "../types"

type GetAllPayload = {
    parent_id?: string | null
    query?: string | null
    page?: number
    limit?: number
}

type GetAllResponse = Promise<{
    data: Category[] | null
    error: Error | null
}>

type GetOneResponse = Promise<{
    data: Category | CategoryWithChildren | null
    error: Error | null
}>

type DeleteResponse = Promise<{
    error: Error | null
}>

const CategoryServices = {
    async getAll({
        parent_id = null,
        query = "",
        page = 1,
        limit = 2,
    }: GetAllPayload): GetAllResponse {
        let request = supabase.from("category").select("*")

        if (parent_id === null) {
            request = request.is('parent_id', null)
        } else {
            request = request.eq('parent_id', parent_id)
        }

        request = request.ilike("name", `%${query}%`).range((page - 1) * limit, page * limit - 1)

        const { data, error } = await request

        if (error) {
            toast.error("Lỗi khi lấy danh sách danh mục")
        }

        return { data, error }
    },
    async delete(id: string): DeleteResponse {
        const { error: deleteChild } = await supabase.from("category").delete().eq("parent_id", id)
        const { error } = await supabase.from("category").delete().eq("id", id)
        if (error) {
            throw new Error(error.message)
        }
        if (deleteChild) {
            throw new Error(deleteChild.message)
        }
        return { error }
    },
    async getById(id: string, withChildren: boolean = false): GetOneResponse {
        const { data, error } = await supabase.from("category").select("*").eq("id", id).single()
        if (withChildren) {
            const { data: children, error: childrenError } = await this.getAll({ parent_id: id, page: 1, limit: 10 })
            if (childrenError) {
                toast.error("Lỗi khi lấy danh mục con")
            } else {
                data.children = children
            }
        }
        if (error) {
            toast.error("Lỗi khi lấy danh mục")
        }
        return { data, error }
    },
    async create(data: { name: string, content: string }) {
        const { name, content } = data
        const { data: newCategory, error } = await supabase.from("category").insert({
            name: name.trim(),
            content,
        }).select().single()
        if (error) {
            toast.error("Lỗi khi tạo danh mục")
        } else {
            toast.success("Tạo danh mục thành công")
        }
        return { newCategory, error }
    },
    async update(id: string, data: { name: string, content: string }) {
        const { error } = await supabase.from("category").update(data).eq("id", id)
        if (error) {
            toast.error("Lỗi khi cập nhật danh mục")
        } else {
            toast.success("Cập nhật danh mục thành công")
        }
        return { error }
    },
    async addBulkChildren(parent_id: string, children: { id: string, name: string, content: string }[]) {
        const { data, error } = await supabase.from("category").update({ parent_id }).in("id", children.map((child) => child.id))
        if (error) {
            toast.error("Lỗi khi thêm danh mục con")
        } else {
            toast.success("Thêm danh mục con thành công")
        }
        return { data, error }
    }
}

export default CategoryServices