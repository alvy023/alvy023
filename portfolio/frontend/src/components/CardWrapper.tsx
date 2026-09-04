import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardWrapper() {
  return (
    <div className="w-full max-w-3xl p-1">
      <Card className="bg-background shadow-lg border-2">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-2xl text-foreground font-bold">About Me</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10 text-center min-h-[300px]">
          {/* Add Image Here */}
          <p className="text-lg text-foreground font-medium text-justify">
            I'm a Senior Software Engineer at RTX where I develop and maintain sensor data adaptation services 
            for combat systems on the Zumwalt Destroyer platform.
            <br />
            <br />
            When I'm not working, I'm usually running or cycling, gaming with friends, or spending time with my partner.
            Feel free to reach out with interesting opportunities or if you want to chat about similar interests!
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <span className="text-sm text-foreground opacity-80">Based in Nottingham, NH</span>
        </CardFooter>
      </Card>
    </div>
  )
}