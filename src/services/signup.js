import axios from "axios"
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const signup = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { signup, remove, setToken }