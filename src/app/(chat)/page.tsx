import Chat from '@/components/layout/Chat';

export default function Page() {

  return (
    <main className='flex flex-col items-center justify-center gap-2 h-full min-h-screen w-full max-w-4xl mx-auto p-2'>
      <Chat />
    </main>
  );
}