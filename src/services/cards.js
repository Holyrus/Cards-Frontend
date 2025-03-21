import axios from 'axios'

const baseUrl = '/api/cards'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async (deckId) => {
  try {
    const config = {
      headers: { Authorization: token },
    }
  
    const response = await axios.get(`${baseUrl}/${deckId}`, config)
    return response.data
  } catch (error) {
    throw error
  }
}

const create = async (newObject, deckId) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(`${baseUrl}/${deckId}`, newObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export default { setToken, getAll, create, remove, update }