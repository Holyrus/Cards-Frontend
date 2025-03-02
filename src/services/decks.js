import axios from 'axios'

const baseUrl = '/api/decks'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}