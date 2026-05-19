/**
 * data/index.ts — punto de entrada de la capa de datos
 *
 * SOLO re-exports y la instancia del DataStore activo.
 * La lógica de queries (findCaseById, etc.) vive en domain/.
 *
 * Para cambiar de mock a CMS:
 *   import { cmsDataStore as store } from './adapters/cms'
 *
 * [ISSUE-3] Sin lógica de negocio aquí. Solo configuración de fuente de datos.
 */
import { mockDataStore } from './adapters/mock'
import type { DataStore } from '@/types'

// Instancia activa — swap sin tocar ningún componente
export const dataStore: DataStore = mockDataStore
