import { useApp } from "@/components/context/AppProvider";
import PostServices from "@/supabase/services/PostServices";
import type { Post } from "@/supabase/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useNews = (params: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
}) => {
    const [news, setNews] = useState<Post[] | null>(null);
    const [count, setCount] = useState<number | null>(null);
    const { setLoading } = useApp();

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true)
            toast.promise(
                PostServices.getAll(params), {
                loading: 'Đang tải tin tức...',
                success: ({ data, count }) => {
                    setNews(data);
                    setCount(count);
                    return "Tải tin tức thành công"
                },
                error: (err) => {
                    console.error(err)
                    return 'Lỗi tải tin tức'
                },
                finally: () => setLoading(false),
            }
            )
        };

        fetchNews();
    }, [params.page, params.search])
    return {
        news,
        count,
        setNews,
    }
}

export const usePost = (id: string): { post: Post | null } => {
    const [post, setPost] = useState<Post | null>(null);
    const { setLoading } = useApp();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true)
            toast.promise(
                PostServices.getById(id), {
                loading: 'Đang tải bài viết...',
                success: ({ data }) => {
                    setPost(data);
                    return "Tải bài viết thành công"
                },
                error: (err) => {
                    console.error(err)
                    return 'Lỗi tải bài viết'
                },
                finally: () => setLoading(false),
            }
            )
        };

        fetchPost();
    }, [id])

    return {
        post,
    }

}