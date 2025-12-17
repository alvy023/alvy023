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
      <Card className="bg-gradient-to-r from-primary to-secondary shadow-lg border-0">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-2xl font-bold">About Me</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center min-h-[300px]">
          <p className="text-lg font-medium">
            I am a senior software engineer at RTX.
            <br />
            <br />
            (Add your bio here)
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <span className="text-sm opacity-80">Based in [Location]</span>
        </CardFooter>
      </Card>
    </div>
  )
}