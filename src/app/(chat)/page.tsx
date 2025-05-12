import Chat from '@/components/layout/Chat';
import Nav from '@/components/ui/navigation';
export default function Page() {

  return (
    <main className='h-full min-h-screen w-full'>
      <Nav />
      <Chat />
    </main>
  );
}