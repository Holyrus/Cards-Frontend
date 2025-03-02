import { useState, useEffect, useRef, useReducer } from 'react'
import {
  Routes, Route, useMatch
} from 'react-router-dom'

import loginService from './services/login'
import signUpService from './services/signup'

import StartPage from './components/StartPage'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'


const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload
    case "REMOVE_USER":
      return null
    default:
      return state
  }
}

const App = () => {

  const [user, userDispatch] = useReducer(userReducer, null)

  const [signUpUsername, setSignUpUsername] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedCardsAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: "SET_USER", payload: user })
      // cardService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedCardsAppUser')
    userDispatch({ type: "REMOVE_USER" })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedCardsAppUser', JSON.stringify(user)
      )

      // cardService.setToken(user.token)
      userDispatch({ type: "SET_USER", payload: user })
      // setUsername('')
      // setPassword('')
    } catch (exception) {
      // ------
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()

    try {

      const username = signUpUsername
      const name = signUpName
      const password = signUpPassword

      await signUpService.signup({
        username, name, password
      })

      setSignUpUsername('')
      setSignUpName('')
      setSignUpPassword('')
    } catch (exception) {
      // -------
    }
  }

  const handleAccountDeleting = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        signUpService.setToken(user.token)
        await signUpService.remove(user.id)
        window.localStorage.removeItem('loggedCardsAppUser')
        userDispatch({ type: "REMOVE_USER" })
      } catch (exception) {
        // -------
      }
    }
  }
  
  return (
    <main className="antialiased overflow-x-hidden">

    {user === null || (result.error?.message === "Request failed with status code 401" && result.error?.config.method === "get") ? (
      <div>
        <Routes>
          <Route path='/' element={<StartPage />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/signup' element={<SignUpForm username={signUpUsername} name={signUpName} password={signUpPassword} handleUsernameChange={({target}) => setSignUpUsername(target.value)} handleNameChange={({target}) => setSignUpName(target.value)} handlePasswordChange={({target}) => setSignUpPassword(target.value)} handleSubmit={handleSignUp}/>} />
        </Routes>
      </div>
    ) : (
      <p>Logged</p>
    )}

    </main>
  )
}

export default App
