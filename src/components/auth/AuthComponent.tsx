import { type ReactNode } from "react"
import { useAuth } from "../context/AuthProvider"
import { useNavigate } from "react-router-dom"

function AuthComponent({ children }: { children: ReactNode }) {
    const { session, loading } = useAuth()
    const navigate = useNavigate()
    // useEffect(() => {
    //     if (loading) return
    // }, [session, loading])
    if (!loading && !session) navigate("/login")

    return children
}

export default AuthComponent
