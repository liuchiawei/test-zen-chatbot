import ThemeToggle from "../common/ThemeToggle";
import AvatarButton from "../common/AvatarButton";
import TextScaleButton from "../common/TextScaleButton";

export default function NavOptionBar({ textScale, onTextScaleChange }: { textScale: string, onTextScaleChange: (scale: string) => void }) {
  return (
    <div className='flex items-center justify-between gap-1 md:gap-2'>
      <TextScaleButton textScale={textScale} onTextScaleChange={onTextScaleChange} className='rounded-full' />
      <ThemeToggle className='rounded-full' />
      <AvatarButton className='rounded-full' />
    </div>
  );
}
