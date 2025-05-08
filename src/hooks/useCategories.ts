import { useApp } from "@/components/context/AppProvider"
import CategoryServices from "@/supabase/services/CategoryServices"
import type { Category } from "@/supabase/types"
import { useEffect, useState } from "react"

export const useCategories = () => {
    const { setLoading } = useApp()
    const [categories, setCategories] = useState<Category[] | null>(null)
    // fetch categories data
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            await CategoryServices.getAll({
                page: 1,
                limit: 10,
            }).then(({ data }) => {
                setCategories(data)
            })
            setLoading(false)
        }
        fetchCategories()
    }, [])

    return {
        categories,
        setCategories,
    }
}