import AuthServices from "@/supabase/services/AuthServices"
import supabase from "@/supabase/supabaseClient"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "sonner"

type AuthContextType = {
    user: any,
    session: any
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    loading: boolean
    error: any
}

const AuthContext = createContext<AuthContextType>(null as any)

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(null as any)
    const [session, setSession] = useState(null as any)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null as any)

    const login = async (email: string, password: string) => {
        setLoading(true)
        try {
            const { data } = await AuthServices.login(email, password)
            setUser(data.user)
            setError(null)
            toast("Đăng nhập thành công!")
        } catch (error) {
            toast("Đăng nhập thất bại!")
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)
        try {
            await AuthServices.logout()
            setUser(null)
            setError(null)
            setSession(null)
        } catch (error) {
            toast("Đăng xuất thất bại!")
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        async function getSession() {
            await supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session)
            })
            await supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session)
            })
            setError(null)
            setLoading(false)
        }
        getSession()
    }, [])

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, session, error }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthProvider
