/**
 * Types for Côte d'Ivoire regions and cities
 */

export interface Region {
  id: number
  name: string
  code: string
}

export interface City {
  id: number
  name: string
  region: string
  regionCode: string
}

export interface RegionsCitiesData {
  regions: Region[]
  cities: City[]
}
