export type CorrelativaType = "A" | "R"

export type CourseKind = "Asignatura" | "Seminario" | "Seminario-Taller" | "Taller" | "UDI"
export type CourseArea = "General" | "Específica" | "Práctica Profesional" | "Variable"

export type Correlativa = {
  id: string
  name: string
  type: CorrelativaType
}

export type Course = {
  id: string
  name: string
  abbr: string
  kind: CourseKind
  area: CourseArea
  correlativas: Correlativa[]
  year?: 1 | 2 | 3 | 4
}

/**
 * Helper to access course metadata by ID.
 */
export const byId = (id: string) => courses.find((c) => c.id === id) || specialCorrelativas[id]

/**
 * Courses with abbreviations (abbr), type (kind) and area.
 * IDs are kept stable to preserve existing correlativas logic.
 * Notes:
 * - Seminario, Seminario-Taller, Taller, and UDI are considered non-regularizable in the UI (only Aprobada / No regularizada).
 * - Names updated to your latest list where applicable.
 */
export const courses: Course[] = [
  // 1° AÑO
  {
    id: "pedagogia",
    name: "Pedagogía",
    abbr: "PED",
    kind: "Asignatura",
    area: "General",
    correlativas: [],
    year: 1,
  },
  {
    id: "problematica",
    name: "Problemática del Conocimiento Histórico",
    abbr: "PCH",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [],
    year: 1,
  },
  {
    id: "antiguedad",
    name: "Procesos Sociales, Políticos, Económicos y Culturales de la Antigüedad",
    abbr: "ANT",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [],
    year: 1,
  },
  {
    id: "ideas1",
    name: "Historia de las Ideas I",
    abbr: "HI1",
    kind: "Seminario",
    area: "Específica",
    correlativas: [],
    year: 1,
  },
  {
    id: "pueblos",
    name: "Procesos Sociales, Políticos, Económicos y Culturales de los Pueblos Originarios de América",
    abbr: "POA",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [],
    year: 1,
  },
  {
    id: "oralidad-lectura-escritura-tic",
    name: "Oralidad, Lectura, Escritura y TIC",
    abbr: "OLT",
    kind: "Taller",
    area: "General",
    correlativas: [],
    year: 1,
  },
  {
    id: "corporeidad",
    name: "Corporeidad, Juego y Lenguajes Artísticos",
    abbr: "CJA",
    kind: "Taller",
    area: "General",
    correlativas: [],
    year: 1,
  },
  {
    id: "practica-1",
    name: "Práctica Docente I - Sujetos y Contextos",
    abbr: "PD1",
    kind: "Seminario-Taller",
    area: "Práctica Profesional",
    correlativas: [],
    year: 1,
  },
  {
    id: "didactica-general",
    name: "Didáctica General",
    abbr: "DG",
    kind: "Asignatura",
    area: "General",
    correlativas: [],
    year: 1,
  },

  // 2° AÑO
  {
    id: "filosofia",
    name: "Filosofía",
    abbr: "FIL",
    kind: "Asignatura",
    area: "General",
    correlativas: [{ id: "pedagogia", name: "Pedagogía", type: "R" }],
    year: 2,
  },
  {
    id: "psicologia-educacional",
    name: "Psicología Educacional",
    abbr: "PE",
    kind: "Asignatura",
    area: "General",
    correlativas: [{ id: "pedagogia", name: "Pedagogía", type: "R" }],
    year: 2,
  },
  {
    id: "educacion-sexual-integral",
    name: "Educación Sexual Integral",
    abbr: "ESI",
    kind: "Taller",
    area: "General",
    correlativas: [{ id: "corporeidad", name: "Corporeidad, Juego y Lenguajes Artísticos", type: "R" }],
    year: 2,
  },
  {
    id: "feudalismo-modernidad",
    name: "Procesos Sociales, Políticos, Económicos y Culturales del Feudalismo y la Modernidad",
    abbr: "FM",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [
      { id: "antiguedad", name: "Antigüedad", type: "A" },
      { id: "ideas1", name: "Historia de las Ideas I", type: "A" },
      { id: "pueblos", name: "Pueblos Originarios de América", type: "R" },
      { id: "problematica", name: "PCH", type: "R" },
    ],
    year: 2,
  },
  {
    id: "americanos-1",
    name: "Procesos Sociales, Políticos, Económicos y Culturales Americanos I",
    abbr: "AM1",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [{ id: "pueblos", name: "Pueblos Originarios de América", type: "R" }],
    year: 2,
  },
  {
    id: "ideas2",
    name: "Historia de las Ideas II",
    abbr: "HI2",
    kind: "Seminario",
    area: "Específica",
    correlativas: [
      { id: "ideas1", name: "Historia de las Ideas I", type: "A" },
      { id: "problematica", name: "PCH", type: "R" },
    ],
    year: 2,
  },
  {
    id: "mundo-nuevas-territorialidades",
    name: "El Mundo y las Nuevas Territorialidades",
    abbr: "MT",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [
      { id: "ideas1", name: "Historia de las Ideas I", type: "R" },
      { id: "pueblos", name: "Pueblos Originarios de América", type: "R" },
      { id: "antiguedad", name: "Antigüedad", type: "R" },
    ],
    year: 2,
  },
  {
    id: "economia-politica",
    name: "Economía Política",
    abbr: "EP",
    kind: "Seminario",
    area: "Específica",
    correlativas: [
      { id: "antiguedad", name: "Antigüedad", type: "R" },
      { id: "ideas1", name: "Historia de las Ideas I", type: "R" },
    ],
    year: 2,
  },
  {
    id: "didactica-ciencias-sociales",
    name: "Didáctica de las Ciencias Sociales",
    abbr: "DCS",
    kind: "Seminario",
    area: "Específica",
    correlativas: [
      { id: "didactica-general", name: "Didáctica General", type: "A" },
      { id: "problematica", name: "PCH", type: "R" },
      { id: "antiguedad", name: "Antigüedad", type: "A" },
      { id: "ideas1", name: "Historia de las Ideas I", type: "A" },
    ],
    year: 2,
  },
  {
    id: "sujetos-educ-secundaria",
    name: "Sujetos de la Educación Secundaria",
    abbr: "SE",
    kind: "Seminario",
    area: "General",
    correlativas: [
      { id: "pedagogia", name: "Pedagogía", type: "R" },
      { id: "didactica-general", name: "Didáctica General", type: "R" },
    ],
    year: 2,
  },
  {
    id: "practica-docente-2",
    name: "Práctica Docente II - Educación Secundaria y Práctica Docente",
    abbr: "PD2",
    kind: "Seminario-Taller",
    area: "Práctica Profesional",
    correlativas: [
      { id: "practica-1", name: "Práctica Docente I", type: "A" },
      { id: "pedagogia", name: "Pedagogía", type: "R" },
      { id: "didactica-general", name: "Didáctica General", type: "A" },
    ],
    year: 2,
  },

  // 3° AÑO
  {
    id: "historia-politica-educacion-argentina",
    name: "Historia y Política de la Educación Argentina",
    abbr: "HPE",
    kind: "Asignatura",
    area: "General",
    correlativas: [{ id: "pedagogia", name: "Pedagogía", type: "A" }],
    year: 3,
  },
  {
    id: "sociologia-educacion",
    name: "Sociología de la Educación",
    abbr: "SOE",
    kind: "Asignatura",
    area: "General",
    correlativas: [],
    year: 3,
  },
  {
    id: "instituciones-educativas",
    name: "Análisis y Organización de las Instituciones Educativas",
    abbr: "IE",
    kind: "Asignatura",
    area: "General",
    correlativas: [
      { id: "sujetos-educ-secundaria", name: "SE", type: "R" },
      { id: "practica-1", name: "PD1", type: "A" },
      { id: "practica-docente-2", name: "PD2", type: "R" },
    ],
    year: 3,
  },
  {
    id: "contemporaneos-1",
    name: "Procesos Sociales, Políticos, Económicos y Culturales Contemporáneos I",
    abbr: "C1",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [
      { id: "feudalismo-modernidad", name: "FM", type: "A" },
      { id: "didactica-ciencias-sociales", name: "DCS", type: "A" },
      { id: "americanos-1", name: "AM1", type: "R" },
      { id: "ideas2", name: "HI2", type: "R" },
      { id: "economia-politica", name: "EP", type: "R" },
    ],
    year: 3,
  },
  {
    id: "americanos-2",
    name: "Procesos Sociales, Políticos, Económicos y Culturales Americanos II",
    abbr: "AM2",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [
      { id: "feudalismo-modernidad", name: "FM", type: "R" },
      { id: "americanos-1", name: "AM1", type: "R" },
    ],
    year: 3,
  },
  {
    id: "argentina-1",
    name: "Procesos Sociales, Políticos, Económicos y Culturales de Argentina I",
    abbr: "AR1",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [
      { id: "americanos-1", name: "AM1", type: "R" },
      { id: "mundo-nuevas-territorialidades", name: "MT", type: "R" },
    ],
    year: 3,
  },
  {
    id: "epistemologia-historia",
    name: "Epistemología de la Historia",
    abbr: "EH",
    kind: "Seminario",
    area: "Específica",
    correlativas: [
      { id: "filosofia", name: "FIL", type: "R" },
      { id: "problematica", name: "PCH", type: "R" },
      { id: "ideas2", name: "HI2", type: "R" },
    ],
    year: 3,
  },
  {
    id: "didactica-historia",
    name: "Didáctica de la Historia",
    abbr: "DH",
    kind: "Seminario",
    area: "Específica",
    correlativas: [
      { id: "didactica-ciencias-sociales", name: "DCS", type: "A" },
      { id: "sujetos-educ-secundaria", name: "SE", type: "R" },
    ],
    year: 3,
  },
  {
    id: "udi-1",
    name: "UDI I",
    abbr: "UDI1",
    kind: "UDI",
    area: "Variable",
    correlativas: [],
    year: 3,
  },
  {
    id: "practica-docente-3",
    name: "Práctica Docente III - Cotidianeidad en las Aulas",
    abbr: "PD3",
    kind: "Seminario-Taller",
    area: "Práctica Profesional",
    correlativas: [
      { id: "practica-docente-2", name: "PD2", type: "A" },
      { id: "psicologia-educacional", name: "PE", type: "R" },
      { id: "sujetos-educ-secundaria", name: "SE", type: "R" },
      { id: "feudalismo-modernidad", name: "FM", type: "A" },
      { id: "didactica-ciencias-sociales", name: "DCS", type: "R" },
      { id: "americanos-1", name: "AM1", type: "R" },
      { id: "ideas2", name: "HI2", type: "R" },
      { id: "mundo-nuevas-territorialidades", name: "MT", type: "R" },
      { id: "economia-politica", name: "EP", type: "R" },
      { id: "todas-uc-primer-ano", name: "Todas las UC de 1° año", type: "A" },
    ],
    year: 3,
  },

  // 4° AÑO
  {
    id: "derechos-humanos-etica-ciudadania",
    name: "Derechos Humanos: Ética y Ciudadanía",
    abbr: "DHU",
    kind: "Asignatura",
    area: "General",
    correlativas: [
      { id: "filosofia", name: "FIL", type: "R" },
      { id: "sujetos-educ-secundaria", name: "SE", type: "A" },
    ],
    year: 4,
  },
  {
    id: "contemporaneos-2",
    name: "Procesos Sociales, Políticos, Económicos y Culturales Contemporáneos II",
    abbr: "C2",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [
      { id: "contemporaneos-1", name: "C1", type: "A" },
      { id: "didactica-historia", name: "DH", type: "R" },
      { id: "americanos-2", name: "AM2", type: "R" },
      { id: "argentina-1", name: "AR1", type: "R" },
    ],
    year: 4,
  },
  {
    id: "americanos-3",
    name: "Procesos Sociales, Políticos, Económicos y Culturales Americanos III",
    abbr: "AM3",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [
      { id: "contemporaneos-1", name: "C1", type: "R" },
      { id: "americanos-2", name: "AM2", type: "R" },
      { id: "argentina-1", name: "AR1", type: "R" },
    ],
    year: 4,
  },
  {
    id: "argentina-2",
    name: "Procesos Sociales, Políticos, Económicos y Culturales de Argentina II",
    abbr: "AR2",
    kind: "Seminario-Taller",
    area: "Específica",
    correlativas: [
      { id: "americanos-2", name: "AM2", type: "R" },
      { id: "argentina-1", name: "AR1", type: "R" },
      { id: "contemporaneos-1", name: "C1", type: "R" },
    ],
    year: 4,
  },
  {
    id: "problematica-regional-local",
    name: "Problemáticas Históricas Regionales y Locales",
    abbr: "PR",
    kind: "Taller",
    area: "Específica",
    correlativas: [
      { id: "didactica-historia", name: "DH", type: "R" },
      { id: "americanos-2", name: "AM2", type: "R" },
      { id: "argentina-1", name: "AR1", type: "R" },
      { id: "epistemologia-historia", name: "EH", type: "R" },
    ],
    year: 4,
  },
  {
    id: "udi-2",
    name: "UDI II",
    abbr: "UDI2",
    kind: "UDI",
    area: "Variable",
    correlativas: [],
    year: 4,
  },
  {
    id: "practica-docente-4",
    name: "Práctica Docente IV - Residencia",
    abbr: "RES",
    kind: "Seminario-Taller",
    area: "Práctica Profesional",
    correlativas: [
      { id: "practica-docente-3", name: "PD3", type: "A" },
      { id: "instituciones-educativas", name: "IE", type: "R" },
      { id: "contemporaneos-1", name: "C1", type: "A" },
      { id: "didactica-historia", name: "DH", type: "A" },
      { id: "americanos-2", name: "AM2", type: "R" },
      { id: "argentina-1", name: "AR1", type: "R" },
      { id: "epistemologia-historia", name: "EH", type: "R" },
      { id: "todas-uc-primer-segundo-ano", name: "Todas las UC de 1° y 2° año", type: "A" },
    ],
    year: 4,
  },

  // Extra/compat
  {
    id: "campo-especifico-1",
    name: "Campo Específico 1º año",
    abbr: "CE1",
    kind: "Asignatura",
    area: "Específica",
    correlativas: [],
    year: 1,
  },
]

/**
 * Special correlativas that are not selectable courses but appear as requirements
 */
export const specialCorrelativas: Record<string, Course> = {
  "todas-uc-primer-ano": {
    id: "todas-uc-primer-ano",
    name: "Todas las UC de 1° año",
    abbr: "",
    kind: "Asignatura",
    area: "General",
    correlativas: [],
    year: 1,
  },
  "todas-uc-primer-segundo-ano": {
    id: "todas-uc-primer-segundo-ano",
    name: "Todas las UC de 1° y 2° año",
    abbr: "",
    kind: "Asignatura",
    area: "General",
    correlativas: [],
    year: 2,
  },
}
