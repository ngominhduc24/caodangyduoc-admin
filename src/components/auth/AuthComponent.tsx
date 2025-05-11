import { type ReactNode } from "react"
import { useAuth } from "../context/AuthProvider"
import { useNavigate } from "react-router-dom"

function AuthComponent({ children }: { children: ReactNode }) {
    const { session, error, loading } = useAuth()
    const navigate = useNavigate()
    if (!loading && !session || error) navigate("/login")

    return children
}

export default AuthComponent
