import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { FaqProps } from "@/lib/props";

export default function Faq({ question, input, handleSubmit, handleInputChange }: FaqProps) {
  const handleButtonClick = () => {
    if (handleInputChange) {
      handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <CarouselItem className="pl-2 py-2 md:basis-1/3 lg:basis-1/4">
      <form className="border border-red-500" onSubmit={handleSubmit}>
        <input type="hidden" name="question" value={question} />
        <Button 
          type="submit" 
          className="w-full h-full"
          onClick={handleButtonClick}
        >
          {question}
        </Button>
      </form>
    </CarouselItem>
  );
}
