// API configuration and base setup
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const apiClient = {
  baseURL: API_BASE_URL,
  // Add your API methods here
}

export default apiClient

