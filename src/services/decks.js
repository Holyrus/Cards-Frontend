import axios from 'axios'

const baseUrl = '/api/decks'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  try {
    const config = {
      headers: { Authorization: token },
    }
  
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (error) {
    throw error
  }

}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default { getAll, setToken, create }

