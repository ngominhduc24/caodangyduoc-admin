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
} from "@/components/ui/sidebar";
import {
  ChartBar,
  GalleryThumbnails,
  Newspaper,
  Users,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "../context/AuthProvider";
import Loader from "../ui/loader";

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
    {
      title: "Đơn đăng ký",
      url: "/application-form",
      icon: FileText,
    },
  ];

  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="!font-bold text-orange-600">CDYD Dashboard</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="group/sidebar-item">
                      <item.icon />
                      <span className="!font-semibold group-hover/sidebar-item:text-orange-600">
                        {item.title}
                      </span>
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
  );
}

export default AppSidebar;
