import { useApp } from "@/components/context/AppProvider"
import BannerServices from "@/supabase/services/BannerServices"
import type { Banner } from "@/supabase/types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const useBanners = () => {
    const { setLoading } = useApp()
    const [banners, setBanners] = useState<Banner[]>([])
    const [key, setKey] = useState(false)

    useEffect(() => {
        const fetchBanners = async () => {
            setLoading(true)
            toast.promise(
                BannerServices.getAll().then(({ data }) => {
                    setBanners(data)
                    setLoading(false)
                }),
                {
                    loading: "Đang tải banner...",
                    success: "Tải banner thành công",
                    error: (err) => `Error: ${err.message}`,
                },
            )
        }
        fetchBanners()
    }, [key])

    const refresh = () => {
        setKey((prev) => !prev)
    }

    return {
        banners,
        refresh,
    }
}