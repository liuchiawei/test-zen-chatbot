import { CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { FaqProps } from "@/lib/props";

export default function Faq({ textScale, style, question, handleSubmit, handleInputChange }: FaqProps) {
  const handleButtonClick = () => {
    if (handleInputChange) {
      handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <CarouselItem className={`pl-2 py-2 md:basis-1/3 lg:basis-1/4`}>
      <form onSubmit={handleSubmit} className="w-full h-full">
        <input type="hidden" name="question" value={question} />
        <Button 
          type="submit"
          className={`w-full h-full flex justify-center items-center wrap-break-word whitespace-normal shadow-sm dark:shadow-none cursor-pointer transition-all active:translate-y-1
          ${style === 'default'
          ? 'hover:bg-[url(/images/demo_3.jpg)] hover:shadow-md bg-cover bg-center hover:text-stone-50'
          : 'bg-stone-800/50 dark:bg-stone-950/50 hover:bg-stone-800 hover:dark:bg-stone-950 border border-stone-200 dark:border-stone-400'}
          `}
          onClick={handleButtonClick}
        >
          <span className={`text-left tracking-wide
            ${textScale === 'md'
              ? 'text-sm'
              : 'text-2xl leading-10'
            }
            `}>
            {question}
          </span>
        </Button>
      </form>
    </CarouselItem>
  );
}
