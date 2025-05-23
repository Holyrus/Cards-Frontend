import { useState, useEffect, useRef, useReducer } from 'react'
import {
  Routes, Route, useMatch, useNavigate, Link
} from 'react-router-dom'

import loginService from './services/login'
import signUpService from './services/signup'
import decksService from './services/decks.js'
import cardsService from './services/cards.js'

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
import DeckSettings from './components/DeckSettings.jsx'
import CreateFirstDeck from './components/CreateFirstDeck.jsx'
import CreateNewCard from './components/CreateNewCard.jsx'
import CardSettings from './components/CardSettings.jsx'

import sadPanda from './assets/sadPanda.jpg'
import Learn from './components/Learn.jsx'

import { useTheme } from "../src/components/ThemeProvider.jsx";

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

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [signUpUsername, setSignUpUsername] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')

  const errorNotificationDispatch = useErrorNotificationDispatch()
  const notificationDispatch = useNotificationDispatch()

  const [globalCurrentDeck, setGlobalCurrentDeck] = useState('')

  const { theme } = useTheme()

  const handleCurrentDeckChange = (deck) => {
    setGlobalCurrentDeck(deck)
  }

  // Decks mutations

  const newDeckMutation = useMutation({
    mutationFn: decksService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['decks'] })
    }
  })

  const updateDeckMutation = useMutation({
    mutationFn: (updatedDeck) => decksService.update(updatedDeck.id, updatedDeck),
    onSuccess: (updatedDeck) => {
      queryClient.invalidateQueries({ queryKey: ['decks'] })
    }
  })

  const deleteDeckMutation = useMutation({
    mutationFn: (deletedDeck) => decksService.remove(deletedDeck.id),
    onSuccess: (deletedDeck) => {
      queryClient.invalidateQueries({ queryKey: ['decks'] })
    }
  })

  // ---------------------------------

  const decksResult = useQuery({
    queryKey: ['decks'],
    queryFn: decksService.getAll,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!user
  })

  useEffect(() => {
    async function getUserDataAndInit() {
      const loggedUserJSON = window.localStorage.getItem('loggedCardsAppUser')

      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)

        const userData = await loginService.checkUser(user.id);
        
        if (userData) {
          userDispatch({ type: "SET_USER", payload: user })
          decksService.setToken(user.token)
          cardsService.setToken(user.token)
        } else {
          console.log('Unauthorized error detected, logging out...')
          window.localStorage.removeItem('loggedCardsAppUser')
          userDispatch({ type: "REMOVE_USER" })
          navigate('/')
          notificationDispatch({ 
            type: "SET", 
            payload: 'Session expired. Please login again.'
          })
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 6000)
        }
        

        if (decksResult?.error?.response?.status === 401 || decksResult?.error?.response?.status === 500) {
          console.log('Unauthorized error detected, logging out...')
          window.localStorage.removeItem('loggedCardsAppUser')
          userDispatch({ type: "REMOVE_USER" })
          navigate('/')
          notificationDispatch({ 
            type: "SET", 
            payload: 'Session expired. Please login again.'
          })
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 6000)
        }
      }
    }

    getUserDataAndInit()
  }, [decksResult?.error])

  const decks = decksResult.data || []

  useEffect(() => {
    if (user && !decksResult.isLoading) {
      const currentPath = window.location.pathname
      const emptyDecks = Array.isArray(decks) && decks.length === 0
  
      if (emptyDecks && currentPath !== '/firstdeck') {
        navigate('/firstdeck')
      } else if (!emptyDecks && currentPath === '/firstdeck') {
        navigate('/main')
      } else if (!emptyDecks && currentPath === '/') {
        navigate('/main')
      }
    } else {
      const currentPath = window.location.pathname
      const emptyDecks = Array.isArray(decks) && decks.length === 0

      if (emptyDecks && currentPath === '/firstdeck') {
        navigate('/')
      }
    }
  }, [decks, user, decksResult.isLoading, navigate])

  const decksMatch = useMatch('/deck/:id')
  const selectedDeck = decksMatch ? decks.find(deck => deck.id === decksMatch.params.id) : null

  const cardsMatch = useMatch('/card/:id')
  // const selectedCard = cardsMatch ? globalCurrentDeck.cards.find(card => card.id === cardsMatch.params.id) : null
  const selectedCard = cardsMatch && globalCurrentDeck?.cards 
    ? globalCurrentDeck.cards.find(card => card.id === cardsMatch.params.id)
    : null

  if (decksResult.isLoading) {
    return (
      <div className={`flex flex-col justify-center items-center w-full h-[100vh]
      ${theme === 'Black' ? 'bg-[#0f1418]' : 'bg-white'}`}>
        <h1 className='text-[40px] font-bold bg-gradient-to-r from-green-700 to-yellow-300 text-transparent bg-clip-text'>UmCards</h1>
      </div>
    )
  }

  // console.log(decksResult)
  // console.log(decks)
  // console.log(decks[0].learnLang)
  // console.log(decks[0].cards.length)

  // -----------------------------------------------------------------

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
      cardsService.setToken(user.token)
      decksService.setToken(user.token)
      userDispatch({ type: "SET_USER", payload: user })
      setUsername('')
      setPassword('')
      navigate('/main')
      notificationDispatch({ type: "SET", payload: 'Logged in successfully' })
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" })
      }, 6000)

      queryClient.invalidateQueries({ queryKey: ['cards'] })

    } catch (exception) {
      if (exception.status === 500) {
        errorNotificationDispatch({ type: "SET", payload: 'Service unavailable' })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      } else {
        errorNotificationDispatch({ type: "SET", payload: 'Wrong credentials' })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
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
      navigate('/login')
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

  const createDeck = async (deckObject) => {
    newDeckMutation.mutate(deckObject, {
      onError: (error) => {
        navigate('/main')
        errorNotificationDispatch({ type: "SET", payload: `${error.response.data.error}` })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      },
      onSuccess: () => {
        navigate('/main')
        notificationDispatch({ type: "SET", payload: 'New deck was created!' })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    })
  }

  const updateDeck = (id, newObject) => {

    updateDeckMutation.mutate({...newObject, id: id}, {
      onError: (error) => {
        navigate('/main')
        errorNotificationDispatch({ type: "SET", payload: `${error.response.data.error}` })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      },
      onSuccess: () => {
        navigate('/main')
        notificationDispatch({ type: "SET", payload: 'Deck was edited!' })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    })
  }

  const deleteDeck = id => {
    const deckToDelete = decks.find(deck => deck.id === id)

    if (window.confirm(`Remove deck? All cards will be deleted.`)) {
      deleteDeckMutation.mutate(deckToDelete, {
        onError: (error) => {
          errorNotificationDispatch({ type: "SET", payload: `${error.response.data.error}` })
          setTimeout(() => {
            errorNotificationDispatch({ type: "CLEAR" })
          }, 6000)
        },
        onSuccess: () => {
          navigate('/main')
          notificationDispatch({ type: "SET", payload: 'Deck was deleted!' })
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" })
          }, 6000)
        }
      })
    }
  }
  
  return (
    <main className="antialiased overflow-x-hidden">
 
 {/* || (decks.error?.message === "Request failed with status code 401" && decks.error?.config.method === "get") */}

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
          <Route path='/main' element={<MainPage decks={decks} onDeckChange={handleCurrentDeckChange} />} />
          <Route path='/profile' element={<Profile handleLogout={handleLogout} handleAccountDeleting={handleAccountDeleting} user={user}/>} />
          <Route path='/newdeck' element={<CreateNewDeck createDeck={createDeck} />} />
          <Route path='/deck/:id' element={<DeckSettings selectedDeck={selectedDeck} updateDeck={updateDeck} deleteDeck={deleteDeck}/>} />
          <Route path='/firstdeck' element={<CreateFirstDeck createDeck={createDeck} />} />
          <Route path='/main/newcard' element={<CreateNewCard />} />
          <Route path='/card/:id' element={
            globalCurrentDeck && selectedCard
              ? <CardSettings selectedCard={selectedCard} currentDeck={globalCurrentDeck}/>
              : <div className='flex flex-col gap-2 justify-center items-center w-full h-[100vh]'>
                  <img className='w-[250px]' src={sadPanda} alt="sad panda" />
                  <h1 className='text-[40px] font-bold bg-gradient-to-r from-green-700 to-yellow-300 text-transparent bg-clip-text'>UmCards</h1>
                  <p className='text-[20px]'>Return to the previous page</p>
                  <Link to='/main' className='rounded-full text-white border-1 border-green-700 font-semibold py-2 px-5 bg-green-700 hover:bg-green-100 hover:text-green-700 transition-all duration-300 mt-2'>To main page</Link>
                </div>
          } />
          <Route path='/main/learn' element={<Learn />} />
        </Routes>
      </div>
    )}

    </main>
  )
}

export default App
