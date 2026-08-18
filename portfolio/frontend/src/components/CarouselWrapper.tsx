import type { CollectionEntry } from "astro:content"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type Props = {
  projects: CollectionEntry<"projects">[]
}

export function CarouselWrapper({ projects }: Props) {
  return (
    <Carousel className="w-full max-w-3xl">
      <CarouselContent>
        {projects.map((project) => (
          <CarouselItem key={project.id}>
            <div className="p-1">
              <Card className="bg-gradient-to-r from-primary to-secondary shadow-lg border-0">
                <CardHeader className="flex items-center justify-center">
                  <CardTitle className="text-xl font-bold">{project.data.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <img
                    src={project.data.coverImage}
                    alt={project.data.title}
                    className="w-full aspect-video object-cover rounded-md"
                  />
                  <p className="text-sm text-black/80">{project.data.summary}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                  <a
                    href={`/projects/${project.id}`}
                    className="text-sm font-semibold underline underline-offset-2"
                  >
                    Tell me more →
                  </a>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-primary hover:enabled:bg-secondary hover:disabled:bg-primary border-current border-1 hover:enabled:border-white text-black"/>
      <CarouselNext className="bg-secondary hover:enabled:bg-primary hover:disabled:bg-secondary border-current border-1 hover:enabled:border-white text-black" />
    </Carousel>
  )
}