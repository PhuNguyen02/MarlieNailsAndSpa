import { ComponentType } from 'react'

export interface RouteConfig {
  path: string
  component: ComponentType
  exact?: boolean
}

