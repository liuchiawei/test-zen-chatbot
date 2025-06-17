'use client';

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function NewChatButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  // 新しいチャットを作成する関数
  const handleCreateNewChat = async () => {
    try {
      setIsCreating(true);
      
      // APIを使用して新しいチャットを作成
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const { id } = await response.json();
        // 新しいチャットページにリダイレクト
        router.push(`/chat/${id}`);
      } else {
        console.error('チャット作成に失敗しました');
      }
    } catch (error) {
      console.error('チャット作成エラー:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SidebarMenuButton 
      onClick={handleCreateNewChat}
      disabled={isCreating}
      className="w-full justify-start"
    >
      <Plus className="w-4 h-4 mr-2" />
      <span>{isCreating ? '作成中...' : '新しい会話'}</span>
    </SidebarMenuButton>
  );
} 