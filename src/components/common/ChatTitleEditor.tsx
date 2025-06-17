'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PencilIcon, CheckIcon, XIcon } from 'lucide-react';

interface ChatTitleEditorProps {
  initialTitle: string;
  chatId: string;
  onTitleUpdate: (newTitle: string) => void;
}

export default function ChatTitleEditor({ initialTitle, chatId, onTitleUpdate }: ChatTitleEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleSave = async () => {
    try {
      // API呼び出しでタイトルを更新
      const response = await fetch(`/api/chats/${chatId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        onTitleUpdate(title);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('タイトル更新エラー:', error);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
        />
        <Button size="sm" variant="ghost" onClick={handleSave}>
          <CheckIcon className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel}>
          <XIcon className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="flex-1 truncate">{title}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <PencilIcon className="w-4 h-4" />
      </Button>
    </div>
  );
} 