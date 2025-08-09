"use client"

import { useEffect, useMemo, useState } from "react"
import {
  courses,
  type Course,
  type Correlativa,
  type CorrelativaType,
  byId,
  type CourseKind,
  type CourseArea,
} from "@/data/courses"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle2, Info, ListChecks, ShieldAlert, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "aprobada" | "regularizada" | "no-regularizada"

type Evaluation = {
  canEnroll: boolean
  reasonIfBlocked?: string
  overallLabel:
    | "Puede cursar sin restricciones"
    | "Cursa con restricciones"
    | "Cursada condicional (requiere autorización docente)"
    | "No puede cursar"
  activities: boolean
  exams: boolean
  promotion: boolean
  promotionPending: boolean
  notes: string[]
  strategy?: string
  missingA?: boolean
  rNotRegularized?: boolean
}

const STATUS_LABEL: Record<Status, string> = {
  aprobada: "Aprobada",
  regularizada: "Regularizada",
  "no-regularizada": "No regularizada",
}

const TYPE_LABEL: Record<CorrelativaType, string> = {
  A: "Obligatoria (debe estar Aprobada)",
  R: "Regularizable (al menos Regularizada)",
}

const UNIFIED_ACTIVITIES_TEXT =
  "Puedes cursar y realizar actividades y trabajos prácticos solo si el/la docente lo permite."

/**
 * Tipo de materia: colores como la referencia (imagen)
 * - Asignatura: azul
 * - Seminario-Taller: violeta
 * - Taller: naranja
 * - Seminario: verde
 * - UDI: oculto (no mostrar)
 */
const KIND_BADGE: Record<Exclude<CourseKind, "UDI">, string> = {
  Asignatura: "text-blue-700 bg-blue-50 border-blue-200",
  "Seminario-Taller": "text-violet-700 bg-violet-50 border-violet-200",
  Taller: "text-orange-700 bg-orange-50 border-orange-200",
  Seminario: "text-emerald-700 bg-emerald-50 border-emerald-200",
}

/**
 * Marco/Área: tonos sutiles; Variable en gris
 */
const AREA_BADGE: Record<CourseArea, string> = {
  General: "text-slate-700 bg-slate-50 border-slate-200",
  Específica: "text-indigo-700 bg-indigo-50 border-indigo-200",
  "Práctica Profesional": "text-rose-700 bg-rose-50 border-rose-200",
  Variable: "text-gray-700 bg-gray-50 border-gray-200",
}

function KindPill({ kind }: { kind: CourseKind }) {
  if (kind === "UDI") return null
  return (
    <Badge className={cn("rounded-full border px-2 py-0.5 text-xs font-medium shrink-0", KIND_BADGE[kind])}>
      {kind}
    </Badge>
  )
}
function AreaPill({ area }: { area: CourseArea }) {
  return (
    <Badge className={cn("rounded-full border px-2 py-0.5 text-xs font-medium shrink-0", AREA_BADGE[area])}>
      {area}
    </Badge>
  )
}

/**
 * Abreviatura: estilo de la imagen (píldora amarillo claro con borde dorado y texto marrón/mostaza)
 */
function AbbrPill({ value }: { value?: string }) {
  if (!value) return null
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        "text-amber-800 bg-amber-50 border-amber-300 shrink-0",
      )}
      aria-label={"Abreviatura " + value}
    >
      {value}
    </span>
  )
}

// Lógica de evaluación intacta
function evaluateCourse(course: Course, statusMap: Record<string, Status>): Evaluation {
  const aItems = course.correlativas.filter((c) => c.type === "A")
  const rItems = course.correlativas.filter((c) => c.type === "R")

  const anyNoReg = course.correlativas.some((c) => statusMap[c.id] === "no-regularizada")
  const aAllApproved = aItems.every((c) => statusMap[c.id] === "aprobada")
  const rAllAtLeastReg = rItems.every((c) => {
    const s = statusMap[c.id]
    return s === "aprobada" || s === "regularizada"
  })
  const rAllApproved = rItems.every((c) => statusMap[c.id] === "aprobada")

  if (anyNoReg) {
    return {
      canEnroll: false,
      reasonIfBlocked: "Existen correlativas sin regularizar. No puedes cursar.",
      overallLabel: "No puede cursar",
      activities: false,
      exams: false,
      promotion: false,
      promotionPending: false,
      notes: [
        "Con correlativas no regularizadas no puedes asistir ni realizar actividades.",
        "Debes, como mínimo, regularizar o aprobar las correlativas pendientes para habilitar la cursada.",
      ],
      strategy: "Regulariza/aprueba las correlativas faltantes antes de inscribirte.",
      missingA: !aAllApproved,
      rNotRegularized: !rAllAtLeastReg,
    }
  }

  const missingA = !aAllApproved

  if (missingA) {
    return {
      canEnroll: false,
      reasonIfBlocked: "Faltan correlativas obligatorias (A) aprobadas.",
      overallLabel: "Cursada condicional (requiere autorización docente)",
      activities: false,
      exams: false,
      promotion: false,
      promotionPending: false,
      notes: [
        UNIFIED_ACTIVITIES_TEXT,
        "Parciales y promoción no habilitados hasta aprobar previamente las correlativas pendientes en mesa extraordinaria (u otra habilitada).",
      ],
      strategy: "Gestiona la autorización y prioriza aprobar las (A) en la próxima mesa.",
      missingA: true,
      rNotRegularized: false,
    }
  }

  if (rAllApproved) {
    return {
      canEnroll: true,
      overallLabel: "Puede cursar sin restricciones",
      activities: true,
      exams: true,
      promotion: true,
      promotionPending: false,
      notes: [
        "Puedes hacer actividades, rendir parciales y promocionar directamente.",
        "Si cumples asistencia y notas mínimas, no necesitas rendir final.",
      ],
      strategy: "Mantén calificaciones y asistencia para promocionar.",
      missingA: false,
      rNotRegularized: false,
    }
  }

  return {
    canEnroll: true,
    overallLabel: "Cursa con restricciones",
    activities: true,
    exams: false,
    promotion: false,
    promotionPending: false,
    notes: [
      UNIFIED_ACTIVITIES_TEXT,
      "Parciales y promoción bloqueados: podrás acceder a parciales solo si apruebas previamente en mesa extraordinaria (u otra habilitada) las correlativas pendientes.",
      "Una vez aprobadas, podrás consolidar la regularidad y luego rendir examen final.",
    ],
    strategy: "Aprobar las correlativas (R) cuanto antes para habilitar evaluación y cierre.",
    missingA: false,
    rNotRegularized: false,
  }
}

export default function CorrelativasCalculator() {
  const [selectedYear, setSelectedYear] = useState<2 | 3 | 4>(2)
  const availableCourses = useMemo(() => courses.filter((c) => c.year === selectedYear), [selectedYear])
  const [courseId, setCourseId] = useState<string>(availableCourses[0]?.id ?? "")

  useEffect(() => {
    if (!availableCourses.find((c) => c.id === courseId)) {
      setCourseId(availableCourses[0]?.id ?? "")
    }
  }, [availableCourses, courseId])

  const course = useMemo(() => courses.find((c) => c.id === courseId), [courseId])
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({})

  useEffect(() => {
    if (!course) return
    const next: Record<string, Status> = {}
    course.correlativas.forEach((c) => {
      next[c.id] = "no-regularizada"
    })
    setStatusMap(next)
  }, [course])

  const evaluation = useMemo(() => {
    if (!course) {
      return {
        canEnroll: false,
        overallLabel: "No puede cursar",
        activities: false,
        exams: false,
        promotion: false,
        promotionPending: false,
        notes: ["Selecciona un año y una materia para comenzar."],
      } as Evaluation
    }
    return evaluateCourse(course, statusMap)
  }, [course, statusMap])

  const setOne = (id: string, value: Status) =>
    setStatusMap((prev) => ({
      ...prev,
      [id]: value,
    }))

  return (
    <div className="grid gap-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{"🧮 Calculadora de Estado Académico"}</CardTitle>
          <CardDescription className="text-base">
            {"Elegí el año y la materia objetivo, luego marca el estado de sus correlativas."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Año */}
            <div className="relative z-50 grid gap-2">
              <Label htmlFor="anio" className="font-medium">
                {"Año"}
              </Label>
              <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v) as 2 | 3 | 4)}>
                <SelectTrigger id="anio" className="w-full min-h-[44px] h-auto items-center" title="Seleccionar año">
                  <SelectValue placeholder="Seleccionar año..." />
                </SelectTrigger>
                <SelectContent className="min-w-[240px]">
                  <SelectItem value="2">{"2° año"}</SelectItem>
                  <SelectItem value="3">{"3° año"}</SelectItem>
                  <SelectItem value="4">{"4° año"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Materia */}
            <div className="relative z-40 grid gap-2">
              <Label htmlFor="materia" className="font-medium">
                {"Materia"}
              </Label>
              <Select value={courseId} onValueChange={setCourseId} disabled={availableCourses.length === 0}>
                <SelectTrigger
                  id="materia"
                  className="w-full h-auto min-h-[48px] items-center text-left whitespace-normal break-words"
                  title={course ? course.name : "Seleccionar materia"}
                >
                  <SelectValue
                    placeholder={availableCourses.length ? "Seleccionar materia..." : "No hay materias para este año"}
                  />
                </SelectTrigger>
                {/* Ampliamos y permitimos wrap interno para que nada se salga */}
                <SelectContent className="w-fit min-w-[280px] max-w-[min(92vw,760px)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                  {availableCourses.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      className="whitespace-normal break-words leading-snug py-2"
                      title={c.name}
                    >
                      {/* UNA SOLA FILA FLEXIBLE: nombre + abrev + tipo + área, que envuelve junto */}
                      <div className="inline-flex flex-wrap items-baseline gap-1.5 max-w-full">
                        <span className="font-medium break-words">{c.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {course ? (
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-[16px]">{"Correlativas exigidas"}</h3>
              </div>

              {/* No repetimos el nombre de la materia aquí */}

              <div className="grid gap-3">
                {course.correlativas.length === 0 ? (
                  <div className="text-sm text-black">{"No presenta correlativas para cursar."}</div>
                ) : (
                  course.correlativas.map((c) => (
                    <CorrelativaRow
                      key={c.id}
                      correlativa={c}
                      value={statusMap[c.id] ?? "no-regularizada"}
                      onChange={(val) => setOne(c.id, val)}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="font-semibold text-black">{"Selecciona un año y una materia"}</AlertTitle>
              <AlertDescription className="text-black">
                {"Usá los selectores para comenzar la evaluación."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {course && <ResultCard evaluation={evaluation} course={course} />}

      <RulesSummary />
    </div>
  )
}

function MetaBadges({ id }: { id: string }) {
  const meta = byId(id)
  if (!meta) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <KindPill kind={meta.kind} />
      <AreaPill area={meta.area} />
    </div>
  )
}

function CorrelativaRow({
  correlativa,
  value,
  onChange,
}: {
  correlativa: Correlativa
  value: Status
  onChange: (s: Status) => void
}) {
  const meta = byId(correlativa.id)
  const isNonRegularizable =
    meta?.kind === "Seminario" || meta?.kind === "Seminario-Taller" || meta?.kind === "Taller" || meta?.kind === "UDI"

  function renderBtn(s: Status) {
    const id = `${correlativa.id}-${s}`
    const selected = value === s
    return (
      <Label
        key={s}
        htmlFor={id}
        onClick={() => onChange(s)}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border px-4 py-2 cursor-pointer text-sm select-none transition whitespace-nowrap",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
          selected ? "bg-blue-50 border-blue-500 text-blue-700" : "hover:bg-muted",
        )}
      >
        <RadioGroupItem value={s} id={id} className="sr-only" />
        <span className="text-black whitespace-nowrap">{STATUS_LABEL[s]}</span>
      </Label>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3">
      <div className="space-y-1 min-w-0">
        {/* Una sola línea flexible: nombre + abrev + tipo correlativa */}
        <div className="inline-flex flex-wrap items-center gap-2">
          <span className="font-semibold text-black break-words">{meta?.name ?? correlativa.name}</span>
          {meta?.abbr && <AbbrPill value={meta.abbr} />}
          <Badge variant="secondary" className="text-blue-700 bg-blue-50 border-blue-100">
            {TYPE_LABEL[correlativa.type]}
          </Badge>
        </div>
        <MetaBadges id={correlativa.id} />
        <p className="text-xs text-black leading-snug sm:max-w-[52ch] md:max-w-[64ch]">
          {correlativa.type === "A"
            ? "Debe estar Aprobada para habilitar la cursada."
            : isNonRegularizable
              ? "Esta unidad no se regulariza: solo Aprobada o No regularizada."
              : `${UNIFIED_ACTIVITIES_TEXT} Parciales y promoción quedan bloqueados hasta aprobar.`}
        </p>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as any)}
        className="flex items-center gap-2 -translate-x-1 sm:-translate-x-2 whitespace-nowrap"
      >
        {renderBtn("aprobada")}
        {!isNonRegularizable && renderBtn("regularizada")}
        {renderBtn("no-regularizada")}
      </RadioGroup>
    </div>
  )
}

function Capability({
  title,
  state,
  hint,
}: {
  title: string
  state: "on" | "warn" | "off"
  hint?: string
}) {
  const Icon = state === "on" ? CheckCircle2 : state === "warn" ? AlertTriangle : XCircle
  const color = state === "on" ? "text-emerald-600" : state === "warn" ? "text-yellow-600" : "text-red-600"

  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", color)} />
        <div className="font-semibold text-black">{title}</div>
      </div>
      {hint && <div className="text-xs text-black mt-1">{hint}</div>}
    </div>
  )
}

function ResultCard({
  evaluation,
  course,
}: {
  evaluation: Evaluation
  course: Course
}) {
  const isConditional = evaluation.overallLabel === "Cursada condicional (requiere autorización docente)"
  const isRestrict = evaluation.overallLabel === "Cursa con restricciones"
  const isBlocked = evaluation.overallLabel === "No puede cursar"

  const HeaderIcon = isBlocked ? XCircle : isConditional || isRestrict ? AlertTriangle : CheckCircle2
  const headerIconColor = isBlocked
    ? "text-red-600"
    : isConditional
      ? "text-yellow-600"
      : isRestrict
        ? "text-amber-600"
        : "text-emerald-600"

  const toneClasses = isBlocked
    ? "border-red-500/50 bg-red-50 text-red-800"
    : isConditional
      ? "border-yellow-500/50 bg-yellow-50 text-yellow-800"
      : isRestrict
        ? "border-amber-500/50 bg-amber-50 text-amber-800"
        : "border-emerald-500/50 bg-emerald-50 text-emerald-800"

  const activitiesState: "on" | "warn" | "off" = isBlocked ? "off" : isConditional ? "warn" : isRestrict ? "warn" : "on"
  const examsState: "on" | "warn" | "off" = isBlocked ? "off" : isConditional ? "warn" : isRestrict ? "warn" : "on"
  const promoState: "on" | "warn" | "off" = evaluation.overallLabel === "Puede cursar sin restricciones" ? "on" : "off"

  const activitiesHint = isBlocked
    ? "No habilitado."
    : isConditional || isRestrict
      ? UNIFIED_ACTIVITIES_TEXT
      : "Puedes realizar actividades y asistencia."

  const examsHint = isBlocked
    ? "No habilitado."
    : isConditional || isRestrict
      ? "Podrás acceder a parciales solo si apruebas previamente en mesa habilitada las correlativas pendientes."
      : "Puedes rendir parciales."

  const promoHint = promoState === "on" ? "Promoción directa disponible." : "Promoción no disponible."

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[18px] sm:text-[20px] text-black">
          <HeaderIcon className={cn("h-5 w-5", headerIconColor)} />
          {isConditional ? "Puede cursar si el/la docente lo permite" : evaluation.overallLabel}
        </CardTitle>
        <CardDescription className="text-base text-black">
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="font-medium break-words">{course.name}</span>
            <AbbrPill value={course.abbr} />
            <KindPill kind={course.kind} />
            <AreaPill area={course.area} />
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className={cn("rounded-md border p-3 text-sm", toneClasses)}>
          {isBlocked ? (
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-semibold">{"Bloqueado para cursar"}</div>
                <ul className="list-disc ms-5">
                  <li>{"Con correlativas no regularizadas no puedes asistir ni realizar actividades."}</li>
                  <li>{"Regulariza o aprueba primero las correlativas para habilitar la cursada."}</li>
                </ul>
              </div>
            </div>
          ) : isConditional ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-semibold">{"Cursada condicional"}</div>
                <ul className="list-disc ms-5">
                  <li>{UNIFIED_ACTIVITIES_TEXT}</li>
                  <li>
                    {
                      "Parciales y promoción no habilitados hasta aprobar previamente las correlativas en mesa habilitada."
                    }
                  </li>
                </ul>
              </div>
            </div>
          ) : isRestrict ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-semibold">{"Cursada con restricciones"}</div>
                <ul className="list-disc ms-5">
                  <li>{UNIFIED_ACTIVITIES_TEXT}</li>
                  <li>{"Parciales y promoción bloqueados hasta aprobar previamente las correlativas pendientes."}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <div>
                <div className="font-semibold">{"Cursada completa habilitada"}</div>
                <ul className="list-disc ms-5">
                  <li>{"Puedes hacer actividades y rendir parciales."}</li>
                  <li>{"Si cumples requisitos (notas, asistencia, trabajos), promocionas sin final."}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <Capability title="Actividades" state={activitiesState} hint={activitiesHint} />
          <Capability title="Parciales" state={examsState} hint={examsHint} />
          <Capability title="Promoción" state={promoState} hint={promoHint} />
        </div>

        {evaluation.strategy && (
          <Alert>
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="font-semibold text-black">{"Estrategia sugerida"}</AlertTitle>
            <AlertDescription className="text-black">{evaluation.strategy}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function RulesSummary() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-[18px] sm:text-[20px] text-black">{"📌 Resumen de Reglas"}</CardTitle>
        <CardDescription className="text-base text-black">
          {"Cómo interpretar las correlativas para cursar, rendir parciales y promocionar."}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-[15px] sm:text-[16px] grid gap-3 text-black">
        <div>
          <span className="font-semibold">{"Correlativas aprobadas (A)"}</span>
          {" → "}
          <span>{"Actividades, parciales y promoción directa habilitadas."}</span>
        </div>
        <div>
          <span className="font-semibold">{"Correlativas regularizadas (R)"}</span>
          {" → "}
          <span>
            {UNIFIED_ACTIVITIES_TEXT} {"Parciales y promoción bloqueados hasta aprobar las correlativas."}
          </span>
        </div>
        <div>
          <span className="font-semibold">{"Correlativas no regularizadas"}</span>
          {" → "}
          <span>{"No puedes cursar ni realizar actividades."}</span>
        </div>
        <div className="text-sm text-black">
          {
            "Nota: Seminarios, Seminario‑Taller, Taller y UDI no se regularizan; solo aplican estados Aprobada / No regularizada."
          }
        </div>
      </CardContent>
    </Card>
  )
}
