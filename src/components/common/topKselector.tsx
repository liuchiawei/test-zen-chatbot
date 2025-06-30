import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import content from '@/data/content.json';

export default function TopKSelector({ currentTopK, setTopK, currentRange, setRange }: { currentTopK: number, setTopK: (topK: number) => void, currentRange: string, setRange: (range: string) => void }) {
  return (
    <div className="flex justify-between items-center p-2 text-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-foreground/40">{content.filter.title}</h2>
        <div className="flex items-center gap-2">
          {content.filter.range.map((range) => (
            <div key={range} className={`px-3 py-1 rounded-full border border-foreground hover:bg-foreground hover:text-background hover:shadow-lg cursor-pointer transition-all
              ${range === currentRange ? 'bg-foreground text-background' : 'bg-background text-foreground'}`} onClick={() => setRange(range)}>
              {range}
            </div>  
          ))}
        </div>
      </div>
      {/* Top K Selector */}
      <div className="flex items-center gap-4">
        <h2 className="text-foreground/40">{content.filter.topK}</h2>
        <Select defaultValue={currentTopK.toString()} onValueChange={(value) => setTopK(parseInt(value))}>
          <SelectTrigger className="text-sm cursor-pointer">
            <SelectValue placeholder={currentTopK.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}