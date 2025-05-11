import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChartBar, GalleryThumbnails, Newspaper, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { useAuth } from "../context/AuthProvider"
import Loader from "../ui/loader"

function AppSidebar() {
    // Menu items.
    const items = [
        {
            title: "Banner",
            url: "/banner",
            icon: GalleryThumbnails,
        },
        {
            title: "Bài viết",
            url: "/post",
            icon: Newspaper,
        },
        {
            title: "Danh mục",
            url: "/category",
            icon: ChartBar,
        },
        {
            title: "Đối tác",
            url: "/partner",
            icon: Users,
        },
    ]

    const { logout, loading } = useAuth()

    const handleLogout = async () => {
        await logout()
        window.location.href = "/login"
    }


    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>CDYD Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button variant="outline" onClick={handleLogout}>
                    {loading ? <Loader /> : "Đăng xuất"}
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
