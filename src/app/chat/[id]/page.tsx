import { loadChat } from '@/ai/chat-store';
import Main from '@/components/layout/main';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // get the chat ID from the URL
  const messages = await loadChat(id);
  
  return (
    <Main chatId={id} initialMessages={messages} />
  );
}