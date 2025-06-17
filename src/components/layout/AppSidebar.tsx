import { Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import content from '@/data/content.json';
import { getAllChatMetadata } from '@/ai/chat-store';
import NewChatButton from '@/components/common/NewChatButton';

export default async function AppSidebar() {
  // サーバー側でチャットメタデータ一覧を取得
  const chatMetadata = await getAllChatMetadata();

  return (
    <Sidebar className="bg-background">
      <SidebarHeader className="items-center justify-center w-full py-3 text-stone-50 bg-cover bg-center" style={{ backgroundImage: 'url(/images/demo_3.jpg)' }}>
        <SidebarTrigger className="ml-2 rounded self-start hover:text-white" tooltipText={content.tooltip.sidebarOff}/>
        <h1 className="text-shadow-lg text-5xl font-bold tracking-[1.5rem] [writing-mode:vertical-rl] select-none">
          {content.sidebar.header.title}
        </h1>
      </SidebarHeader>
      <SidebarContent className="h-full mx-0 md:mx-4 border-t p-2">
        <SidebarGroup>
          <SidebarGroupLabel>
            {content.sidebar.menu.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatMetadata.map((chat) => (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                  <SidebarMenuButton className="relative w-full justify-start hover:text-stone-50 before:content-[''] before:absolute before:top-0 before:left-0 before:right-full before:z-0 before:h-full before:bg-accent hover:before:right-0 transition-all before:transition-all before:duration-500" title={chat.title}>
                    <span className="z-10 truncate">{chat.title}</span>
                  </SidebarMenuButton>
                </Link>
              ))}
              <NewChatButton />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="justify-center items-center px-4">
        <Link href="/">
          <Image 
            src="/logo.svg" 
            alt="logo" 
            width={140} 
            height={100} 
            className="object-contain dark:invert" 
          />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
