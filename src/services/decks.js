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

export default { getAll, setToken }

