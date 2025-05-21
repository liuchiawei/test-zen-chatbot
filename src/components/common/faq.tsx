import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { FaqProps } from "@/lib/props";

export default function Faq({ textScale, question, handleSubmit, handleInputChange }: FaqProps) {
  const handleButtonClick = () => {
    if (handleInputChange) {
      handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <CarouselItem className="pl-2 py-2 md:basis-1/3 lg:basis-1/4">
      <form onSubmit={handleSubmit} className="w-full h-full">
        <input type="hidden" name="question" value={question} />
        <Button 
          type="submit"
          className="w-full h-full flex justify-center items-center wrap-break-word whitespace-normal shadow-sm dark:shadow-none cursor-pointer active:translate-y-1"
          onClick={handleButtonClick}
        >
          <span className={`text-left tracking-wide
            ${textScale === 'md'
              ? 'text-sm'
              : 'text-2xl leading-10'
            }`}>
            {question}
          </span>
        </Button>
      </form>
    </CarouselItem>
  );
}
