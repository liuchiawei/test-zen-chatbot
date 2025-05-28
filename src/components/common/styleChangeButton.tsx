import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TreePine } from "lucide-react";

export default function StyleChangeButton({ style, onStyleChange, className }: { style: string, onStyleChange: (style: string) => void, className?: string }) {

  const handleStyleChange = () => {
    const nextStyle = style === 'default' ? 'forest' : 'default';
    onStyleChange(nextStyle);
  };

  return <Button title="change style" variant="ghost" className={cn(className)} onClick={handleStyleChange}>
    <TreePine className="size-4" />
  </Button>
}
