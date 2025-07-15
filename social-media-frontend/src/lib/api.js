import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Include cookies for JWT authentication
})

export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials)
  return response.data
}

export const registerUser = async (formData) => {
  const response = await api.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export default api