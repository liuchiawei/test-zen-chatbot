import { ChatMode, ModeTagsProps } from "@/lib/props";
import content from "@/data/content.json";

export default function ModeTags({ currentMode, setCurrentMode }: ModeTagsProps) {
  return (
    <div className="flex gap-2 p-2">
      {Object.keys(content.modes).map((mode) => (
        <div
          key={mode}
          className={`px-6 py-2 text-sm rounded-full hover:bg-accent hover:text-white hover:shadow-lg cursor-pointer transition-all
            ${mode === currentMode ? 'bg-accent text-white' : 'bg-foreground text-background'}`}
          onClick={() => setCurrentMode(mode as ChatMode)}>
          {content.modes[mode as keyof typeof content.modes]}
        </div>
      ))}
    </div>
  );
}