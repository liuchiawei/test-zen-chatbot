import Faq from '@/components/common/faq';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FaqCarouselProps } from "@/lib/props";
import content from '@/data/content.json';

export default function FaqCarousel({ textScale, style, input, handleSubmit, handleInputChange }: FaqCarouselProps) {
  return (
    <Carousel className="w-full max-w-lm">
      <CarouselContent className="-ml-1 cursor-grab active:cursor-grabbing  ">
        {content.defaultQuestions.map((question, index) => (
          <Faq
            key={index}
            textScale={textScale}
            style={style}
            question={question}
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        ))}
      </CarouselContent>
      <CarouselPrevious className="cursor-pointer hover:text-white" />
      <CarouselNext className="cursor-pointer hover:text-white" />
    </Carousel>
  );
}
