import { useState, useEffect, useRef, useReducer } from 'react'
import {
  Routes, Route, useMatch, useNavigate
} from 'react-router-dom'

import loginService from './services/login'
import signUpService from './services/signup'
import decksService from './services/decks.js'

import StartPage from './components/StartPage'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import ErrorNotification from './components/ErrorNotification'

import { useNotificationDispatch } from './components/NoificationContext'
import { useErrorNotificationDispatch } from './components/ErrorNotificationContext'
import Notification from './components/Notification'
import MainPage from './components/MainPage'
import Profile from './components/Profile'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CreateNewDeck from './components/CreateNewDeck.jsx'

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

  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const [user, userDispatch] = useReducer(userReducer, null)

  // console.log(user)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [signUpUsername, setSignUpUsername] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')

  const errorNotificationDispatch = useErrorNotificationDispatch()
  const notificationDispatch = useNotificationDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedCardsAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: "SET_USER", payload: user })
      decksService.setToken(user.token)
    }
  }, [])

  const decksResult = useQuery({
    queryKey: ['decks'],
    queryFn: decksService.getAll,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!user
  })

  const decks = decksResult.data || []

  // console.log(decks)
  // console.log(decks[0].learnLang)
  // console.log(decks[0].cards.length)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedCardsAppUser')
    userDispatch({ type: "REMOVE_USER" })
    notificationDispatch({ type: "SET", payload: 'Logged out' })
    navigate('/')
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" })
      }, 6000)
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

      decksService.setToken(user.token)
      userDispatch({ type: "SET_USER", payload: user })
      setUsername('')
      setPassword('')
      navigate('/main')
      notificationDispatch({ type: "SET", payload: 'Logged in successfully' })
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" })
      }, 6000)

      // queryClient.invalidateQueries({ queryKey: ['cards'] })

    } catch (exception) {
      errorNotificationDispatch({ type: "SET", payload: 'Wrong credentials' })
      setTimeout(() => {
        errorNotificationDispatch({ type: "CLEAR" })
      }, 6000)
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
      navigate('/')
      notificationDispatch({ type: "SET", payload: 'Created new account' })
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" })
      }, 6000)
    } catch (exception) {
      errorNotificationDispatch({ type: "SET", payload: 'Wrong credentials' })
      setTimeout(() => {
        errorNotificationDispatch({ type: "CLEAR" })
      }, 6000)
    }
  }

  const handleAccountDeleting = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        signUpService.setToken(user.token)
        await signUpService.remove(user.id)
        window.localStorage.removeItem('loggedCardsAppUser')
        userDispatch({ type: "REMOVE_USER" })
        navigate('/')
        notificationDispatch({ type: "SET", payload: 'Account was deleted' })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 6000)
      } catch (exception) {
        errorNotificationDispatch({ type: "SET", payload: 'Something went wrong' })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    }
  }
  
  return (
    <main className="antialiased overflow-x-hidden">
 {/* || (result.error?.message === "Request failed with status code 401" && result.error?.config.method === "get") */}
    {user === null ? (
      <div>
        <Notification />
        <ErrorNotification />
        <Routes>
          <Route path='/' element={<StartPage />} />
          <Route path='/login' element={<LoginForm username={username} password={password} handleUsernameChange={({target}) => setUsername(target.value)} handlePasswordChange={({target}) => setPassword(target.value)} handleSubmit={handleLogin} />} />
          <Route path='/signup' element={<SignUpForm username={signUpUsername} name={signUpName} password={signUpPassword} handleUsernameChange={({target}) => setSignUpUsername(target.value)} handleNameChange={({target}) => setSignUpName(target.value)} handlePasswordChange={({target}) => setSignUpPassword(target.value)} handleSubmit={handleSignUp}/>} />
        </Routes>
      </div>
    ) : (
      <div>
        <Notification />
        <ErrorNotification />
        <Routes>
          <Route path='/main' element={<MainPage decks={decks} />} />
          <Route path='/profile' element={<Profile handleLogout={handleLogout} handleAccountDeleting={handleAccountDeleting} user={user}/>} />
          <Route path='/newdeck' element={<CreateNewDeck />} />
        </Routes>
      </div>
    )}

    </main>
  )
}

export default App
