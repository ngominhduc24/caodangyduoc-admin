
import {
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useNavigate } from "react-router-dom"
import AppSidebar from "./Sidebar"
import AuthComponent from "../auth/AuthComponent"
import { Button } from "../ui/button"
import AppProvider from "../context/AppProvider"

function MainLayout() {
    const navigate = useNavigate()
    return (
        <AppProvider>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full relative">
                    <div className="flex items-center space-x-2 p-2">
                        <SidebarTrigger className="p-4 bg-white border" />
                        <Button onClick={() => navigate(-1)} variant={"outline"} size={"sm"}>Trang trước</Button>
                    </div>
                    <AuthComponent>
                        <Outlet />
                    </AuthComponent>
                </main>
            </SidebarProvider>
        </AppProvider>
    )
}

export default MainLayout
