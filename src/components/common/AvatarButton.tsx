import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import content from "@/data/content.json";

export default function AvatarButton({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className={cn("cursor-pointer", className)}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content.tooltip.mypage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
