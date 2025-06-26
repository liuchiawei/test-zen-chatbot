import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import content from "@/data/content.json";

export default function AvatarButton({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger
            className={cn(className, 'cursor-pointer')}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content.tooltip.mypage}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
