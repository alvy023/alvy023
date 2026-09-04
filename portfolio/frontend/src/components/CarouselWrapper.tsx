import type { CollectionEntry } from "astro:content"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
              <Card className="bg-background shadow-lg border-1">
                <CardHeader className="flex items-center justify-center">
                  <CardTitle className="text-xl text-foreground font-bold">{project.data.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <img
                    src={project.data.coverImage}
                    alt={project.data.title}
                    className="w-full aspect-video object-cover rounded-md"
                  />
                  <p className="text-lg text-foreground font-medium text-center">{project.data.summary}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                  <Button variant="link">
                    <a href={`/projects/${project.id}`}>tell me more →</a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hover:enabled:bg-muted border-2"/>
      <CarouselNext className="hover:enabled:bg-muted border-2" />
    </Carousel>
  )
}