import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const checkUser = async id => {
  const response = await axios.get(`http://localhost:3003/api/users/${id}`)
  return response.data
}

export default { login, checkUser }