import { SidebarTrigger } from '@/components/ui/sidebar';
import NavOptionBar from '@/components/common/NavOpionBar';
import content from '@/data/content.json';
import Image from 'next/image';
import Link from 'next/link';

export default function Nav({ textScale, onTextScaleChange, style, onStyleChange }: { textScale: string, onTextScaleChange: (scale: string) => void, style: string, onStyleChange: (style: string) => void }) {
  return (
    <nav className='flex items-center justify-between w-full px-4'>
      <SidebarTrigger className='rounded hover:text-white' tooltipText={content.tooltip.sidebarOn}/>
      <div className='w-full mx-6 py-2 md:mx-36 border-l border-r'>
        <Link href="/">
          <Image 
            src="/logo.svg" 
            alt="logo" 
            width={140} 
            height={100} 
            className="object-contain dark:invert mx-auto" 
          />
        </Link>
        {/* <h1 className='py-3 text-center text-lg md:text-xl font-bold tracking-wide md:tracking-[1.5rem] select-none'>
          {content.navigation.title}
        </h1> */}
      </div>
      <NavOptionBar textScale={textScale} onTextScaleChange={onTextScaleChange} style={style} onStyleChange={onStyleChange} />
    </nav>
  );
}
