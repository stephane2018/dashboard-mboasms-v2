export interface Agence {
  libelleAgence: string
  situationGeographique: string | null
  telephone: string | null
}

export interface AgenceRaw {
  "LIBELLE AGENCE": string
  "SITUATION GEOGRAPHIQUE": string | null
  "TELEPHONE": string | null
}
