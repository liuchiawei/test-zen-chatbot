import { TextSize } from "iconoir-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import content from "@/data/content.json";

export default function TextScaleButton({
  textScale,
  className,
  onTextScaleChange,
 }: {
  textScale: string,
  className?: string,
  onTextScaleChange: (scale: string) => void,
 }) {

  const handleTextScaleChange = () => {
    const nextScale = textScale === 'md' ? 'lg' : 'md';
    onTextScaleChange(nextScale);
  };

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Text Scale"
            className={cn("cursor-pointer", className)}
            onClick={() => handleTextScaleChange()}
          >
            <TextSize />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content.tooltip.textScale}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
