import supabase from "../supabaseClient"

const BannerServices = {
    async getAll() {
        const { data, error } = await supabase
            .from("banner")
            .select("*")
            .order("created_at", { ascending: false })
        if (error) {
            throw new Error(error.message)
        }
        return { data, error }
    },
    async create(banner: { link: string; image: string }) {
        const { data, error } = await supabase
            .from("banner")
            .insert([banner])
            .select()
        if (error) {
            throw new Error(error.message)
        }
        return { data, error }
    },
    async update(banner: { id: number; link: string; image: string }) {
        const { data, error } = await supabase
            .from("banner")
            .update(banner)
            .eq("id", banner.id)
            .select()
        if (error) {
            throw new Error(error.message)
        }
        return { data, error }
    },
}

export default BannerServices