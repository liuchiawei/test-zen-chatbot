import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import content from '@/data/content.json';
export default function AppSidebar() {
  return (
    <Sidebar className="bg-sidebar">
      <SidebarHeader className="items-center justify-center w-full py-3">
        <SidebarTrigger className="ml-2 rounded-full self-start hover:text-white" tooltipText={content.tooltip.sidebarOff}/>
        <h1 className="text-white md:text-foreground text-shadow-lg md:text-shadow-none text-5xl font-bold tracking-[1.5rem] [writing-mode:vertical-rl] select-none">
          {content.sidebar.header.title}
        </h1>
      </SidebarHeader>
      <SidebarContent className="mx-0 md:mx-4 border-t">
        <SidebarGroup>
          <SidebarGroupLabel>
            {content.sidebar.menu.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* TODO: メニュー追加(map) */}
              <SidebarMenuButton>{content.chat.title}</SidebarMenuButton>
              <SidebarMenuButton>{content.chat.title}</SidebarMenuButton>
              <SidebarMenuButton>{content.chat.title}</SidebarMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        Footer
      </SidebarFooter>
    </Sidebar>
  );
}
