import supabase from "../supabaseClient"

const AuthServices = {
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) {
            throw new Error(error.message)
        }
        return { data, error }
    },
    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw new Error(error.message)
        }
    }
}

export default AuthServices