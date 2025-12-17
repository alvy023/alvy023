import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function CarouselWrapper() {
  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="bg-gradient-to-r from-primary to-secondary shadow-lg border-0">
                <CardHeader className="flex items-center justify-center">Header</CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">Card {index + 1}</span>
                </CardContent>
                <CardFooter className="flex items-center justify-center">Footer</CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-primary hover:bg-secondary border-0 text-black"/>
      <CarouselNext className="bg-secondary hover:bg-primary border-0 text-black" />
    </Carousel>
  )
}