import Faq from '@/components/common/faq';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FaqCarouselProps } from "@/lib/props";

export default function FaqCarousel({ input, handleSubmit, handleInputChange }: FaqCarouselProps) {
  return (
    <Carousel className="w-full max-w-lm">
      <CarouselContent className="-ml-1 cursor-grab active:cursor-grabbing  ">
        {Array.from({ length: 5 }).map((_, index) => (
          <Faq
            key={index}
            question={`質問${index + 1}`}
            input={input}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
          />
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
