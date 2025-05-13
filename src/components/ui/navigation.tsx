import { SidebarTrigger } from '@/components/ui/sidebar';
import NavOptionBar from '@/components/layout/NavOpionBar';
import content from '@/data/content.json';

export default function Nav({ textScale, onTextScaleChange }: { textScale: string, onTextScaleChange: (scale: string) => void }) {
  return (
    <nav className='flex items-center justify-between w-full px-4'>
      <SidebarTrigger className='rounded-full' tooltipText={content.tooltip.sidebarOn}/>
      <div className='w-full mx-6 md:mx-36 border-l border-r'>
        <h1 className='py-3 text-center text-lg md:text-xl font-bold tracking-wide md:tracking-[1.5rem] select-none'>
          {content.navigation.title}
        </h1>
      </div>
      <NavOptionBar textScale={textScale} onTextScaleChange={onTextScaleChange} />
    </nav>
  );
}
