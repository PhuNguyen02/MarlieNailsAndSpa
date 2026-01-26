import { RouteConfig } from './types'
import HomePage from '@/pages/HomePage'
import PricingPage from '@/pages/PricingPage'

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/pricing',
    component: PricingPage,
  },
]

