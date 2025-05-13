import { cn } from '@/lib/utils';
import content from '@/data/content.json';

export default function MessageTitle({ className }: { className?: string }) {
  return (
    <div className={cn('p-8 border border-b-0', className)}>
      <h1 className='text-xl text-center font-bold tracking-widest'>
        {content.chat.title}
      </h1>
    </div>
  );
}
