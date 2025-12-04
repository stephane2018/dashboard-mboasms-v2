import regionsData from './regions-cities.json'
import type { Region, City, RegionsCitiesData } from './regions-cities.types'

/**
 * All regions and cities of Côte d'Ivoire (verified data only)
 */
export const regionsCitiesData: RegionsCitiesData = regionsData

/**
 * Get all regions
 */
export const regions: Region[] = regionsData.regions

/**
 * Get all cities
 */
export const cities: City[] = regionsData.cities

/**
 * Get cities by region code
 */
export function getCitiesByRegion(regionCode: string): City[] {
  return cities.filter(city => city.regionCode === regionCode)
}

/**
 * Get region by code
 */
export function getRegionByCode(code: string): Region | undefined {
  return regions.find(region => region.code === code)
}

/**
 * Get region by name
 */
export function getRegionByName(name: string): Region | undefined {
  return regions.find(region => region.name.toLowerCase() === name.toLowerCase())
}

/**
 * Get city by name
 */
export function getCityByName(name: string): City | undefined {
  return cities.find(city => city.name.toLowerCase() === name.toLowerCase())
}

/**
 * Search cities by name (partial match)
 */
export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase()
  return cities.filter(city => city.name.toLowerCase().includes(lowerQuery))
}

/**
 * Get all region codes
 */
export function getRegionCodes(): string[] {
  return regions.map(region => region.code)
}

/**
 * Get all region names
 */
export function getRegionNames(): string[] {
  return regions.map(region => region.name)
}

/**
 * Get all city names
 */
export function getCityNames(): string[] {
  return cities.map(city => city.name)
}
