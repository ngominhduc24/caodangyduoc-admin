import supabase from '../supabaseClient';
import type { Post } from '../types';

type GetAllResponse = {
    data: Post[] | null;
    error: Error | null;
    count: number | null;
}

type GetAllParams = {
    page?: number
    limit?: number
    search?: string
    category_id?: string
}

type GetOneResponse = {
    data: Post | null;
    error: Error | null;
}

const PostServices = {
    async getAll({
        page = 1,
        limit = 10,
        search = "",
        category_id = "",
    }: GetAllParams): Promise<GetAllResponse> {
        if (!page || !limit) {
            page = 1
            limit = 10
        }
        let query = supabase
            .from("post")
            .select("*", { count: "exact" })

        if (search) {
            query = query.ilike("title", `%${search}%`)
        }

        if (category_id) {
            query = query.eq("category_id", category_id)
        }

        const from = (page - 1) * limit
        const to = from + limit - 1

        query = query.range(from, to)

        const { data, count, error } = await query

        if (error) {
            return { data: null, count: null, error }
        }

        return { data, count, error: null }
    },

    async create(post: Post) {
        const { data, error } = await supabase
            .from("post")
            .insert([post]);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async getById(id: string): Promise<GetOneResponse> {
        if (!id) return { data: null, error: new Error("ID is required") };
        const { data, error } = await supabase
            .from("post")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return { data, error };
    },

    async update(id: string, post: Partial<Post>) {
        if (!id) return { data: null, error: new Error("ID is required") };
        const { data, error } = await supabase
            .from("post")
            .update(post)
            .eq("id", id);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },
};

export default PostServices;