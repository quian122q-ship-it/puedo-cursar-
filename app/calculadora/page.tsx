import { GraduationCap } from "lucide-react"
import CorrelativasCalculator from "@/components/correlativas-calculator"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export default function CalculatorPage() {
  return (
    <main className={`${inter.className} min-h-dvh bg-white text-[16px] sm:text-[18px]`}>
      <header className="bg-gradient-to-b from-blue-700 to-blue-600 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-2xl sm:text-3xl font-extrabold">{"Calculadora de Estado Académico"}</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 grid gap-4">
        <CorrelativasCalculator />
      </div>
    </main>
  )
}
