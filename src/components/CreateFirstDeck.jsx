import { useState, useEffect, useRef } from 'react'
import { MAIN_LANGUAGES, OTHER_LANGUAGES } from "../constants/languages"
import { useErrorNotificationDispatch } from './ErrorNotificationContext'
import { useTheme } from "./ThemeProvider.jsx";
import '../scrollbar.css';

const CreateFirstDeck = ({ createDeck }) => {

    const [isLearnSearchOpen, setIsLearnSearchOpen] = useState(false)
    const [isNatSearchOpen, setIsNatSearchOpen] = useState(false)
  
    const [learnLanguage, setLearnLanguage] = useState(' 🏳️ Select a language ')
    const [natLanguage, setNatLanguage] = useState(' 🏳️ Select a language')
    const [learnFlag, setLearnFlag] = useState('')
    const [natFlag, setNatFlag] = useState('')
  
    const [learnSearch, setLearnSearch] = useState('')
    const [natSearch, setNatSearch] = useState('')

    const [voices, setVoices] = useState([])
    const [currentVoices, setCurrentVoices] = useState([])
    const [chosenVoice, setChosenVoice] = useState(null)
  
    const [voicesMenu, setVoicesMenu] = useState(false)
  
    const errorNotificationDispatch = useErrorNotificationDispatch()

    const { theme } = useTheme()

    useEffect(() => {
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)
      }
  
      speechSynthesis.onvoiceschanged = loadVoices
      loadVoices()
    }, [])

    useEffect(() => {
        if (learnLanguage !== ' 🏳️ Select a language ') {
          const filteredVoices = voices.filter((v) => v.name.includes(learnLanguage))
    
          setCurrentVoices(filteredVoices)
        }
      }, [voices, learnLanguage])

    useEffect(() => {
      const filteredVoices = currentVoices.filter((v) => v.name.includes(learnLanguage))
      if (filteredVoices.length === 0) {
        setChosenVoice(null)
      }
    }, [learnLanguage, currentVoices])

    const trySpeak = (voice) => {
      speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(learnLanguage)
      utterance.voice = voice
      utterance.volume = 3
      utterance.rate = 1
      utterance.pitch = 1
  
      speechSynthesis.speak(utterance)
    }

    const createDeckHandler = (event) => {
      event.preventDefault()
      if (learnLanguage !== ' 🏳️ Select a language ' && natLanguage !== ' 🏳️ Select a language' && chosenVoice !== null) {
        createDeck({
          learnLang: learnLanguage,
          natLang: natLanguage,
          firstFlag: learnFlag,
          secondFlag: natFlag,
          mainDeck: true,
          voice: chosenVoice.name,
        })
        dimOverlayHandler()
        setLearnLanguage(' 🏳️ Select a language ')
        setNatLanguage(' 🏳️ Select a language')
        setLearnFlag('')
        setNatFlag('')
        setChosenVoice(null)
      } else {
        errorNotificationDispatch({ type: "SET", payload: 'Select two languages and voice' })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    }
  
    const searchLearnClickHandler = () => {
      setIsLearnSearchOpen(true)
    }
  
    const searchLearnCancelHandler = () => {
      setIsLearnSearchOpen(false)
    }
  
    const searchNatClickHandler = () => {
      setIsNatSearchOpen(true)
    }
  
    const searchNatCancelHandler = () => {
      setIsNatSearchOpen(false)
    }
  
    const dimOverlayHandler = () => {
      searchLearnCancelHandler()
      searchNatCancelHandler()
    }
  
    const clickLearnHandler = (language, flag) => {
      setLearnLanguage(language)
      setLearnFlag(flag)
      dimOverlayHandler()
    }
  
    const clickNatHandler = (language, flag) => {
      setNatLanguage(language)
      setNatFlag(flag)
      dimOverlayHandler()
    }
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape" && isLearnSearchOpen) {
          searchLearnCancelHandler()
        }
      }
  
      window.addEventListener("keydown", handleKeyDown)
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [isLearnSearchOpen])
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape" && isNatSearchOpen) {
          searchNatCancelHandler()
        }
      }
  
      window.addEventListener("keydown", handleKeyDown)
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [isNatSearchOpen])
  
    const learnInputRef = useRef(null)
    const natInputRef = useRef(null)
  
    useEffect(() => {
      if (isLearnSearchOpen && learnInputRef.current) {
        learnInputRef.current.focus()
      } else if (!isLearnSearchOpen && learnInputRef.current) {
        learnInputRef.current.blur()
      }
    }, [isLearnSearchOpen])
  
    useEffect(() => {
      if (isNatSearchOpen && natInputRef.current) {
        natInputRef.current.focus()
      } else if (!isNatSearchOpen && natInputRef.current) {
        natInputRef.current.blur()
      }
    }, [isNatSearchOpen])
  
    useEffect(() => {
      if (learnLanguage === natLanguage) {
        setLearnLanguage(' 🏳️ Select a language ')
        setNatLanguage(' 🏳️ Select a language')
        setLearnFlag('')
        setNatFlag('')
        errorNotificationDispatch({ type: "SET", payload: 'Cannot learn same languages' })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    }, [learnLanguage, natLanguage])
  
    const handleLearnSearch = (event) => {
      setLearnSearch(event.target.value)
    }
  
    const clearLearnSearch = () => {
      setLearnSearch('')
    }
  
    const handleNatSearch = (event) => {
      setNatSearch(event.target.value)
    }
  
    const clearNatSearch = () => {
      setNatSearch('')
    }

    const handleVoicesOpen = () => {
      setVoicesMenu(true)
    }
  
    const handleVoicesClose = () => {
      setVoicesMenu(false)
    }
  
    const handleVoiceChange = (voice) => {
      setChosenVoice(voice)
    }

  return (
    <div className={`min-h-screen flex flex-col items-center w-full ${theme === 'Black' ? 'dark-scrollbar' : ''}`}>
      
      <div className={`w-full flex-none flex flex-row items-center justify-center border-b-1 h-[55px]
        ${theme === 'Black' ? 'bg-[#0d0d0d] border-gray-600' : 'bg-white border-[#e1edf5]'}`}>
        <div className="w-[40px]"></div>
        <h1 className={`w-[260px] sm:w-[410px] text-center ${theme === 'Black' ? 'text-white' : 'text-black'}`}>Create new deck</h1>
        <div className="w-[40px]"></div>
      </div>

      <div className={`flex-1 flex py-[45px] flex-col items-center justify-start w-full
        ${theme === 'Black' ? 'bg-[#0f1418]' : 'bg-[#f3fff2]'}`}>
        
        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px] px-4 sm:px-0">
          <h1 className={`font-semibold text-[17px] ${theme === 'Black' ? 'text-white' : 'text-black'}`}>Language you want to learn</h1>
          <div className="w-full flex flex-row items-center justify-start gap-1.5 sm:gap-3">
            <button onClick={searchLearnClickHandler} className={`mt-3 w-[290px] sm:w-full rounded-full border-1 border-green-700 py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default
              ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>

              <p className={`flex flex-row items-center justify-start gap-2 
                ${learnLanguage === ' 🏳️ Select a language ' && theme === 'Black' ? 'text-[#acacac]' : learnLanguage === ' 🏳️ Select a language ' && theme !== 'Black' ? 'text-gray-500' : learnLanguage !== ' 🏳️ Select a language ' && theme === 'Black' ? 'text-white' : learnLanguage !== ' 🏳️ Select a language ' && theme !== 'Black' ? 'text-black' : 'text-black'}`}>
                {learnFlag !== '' ? (
                  <img className="w-[20px]" src={`https://flagcdn.com/80x60/${learnFlag}.webp` || null} alt="Learn flag" />
                ) : (
                  ''
                )}
                {learnLanguage}
              </p>

              <svg className={`w-[24px] ${theme === 'Black' ? 'text-white' : 'text-black'}`} fill='currentColor' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>

              </button>

              <div onClick={handleVoicesOpen} className={`group relative p-3 mt-3 rounded-full bg-green-700 transition-all duration-300
                ${theme === 'Black' ? 'hover:bg-green-600' : 'hover:bg-green-100 border-1 border-green-700'}`}>
                <svg className={`w-[25px] transition-all duration-300
                  ${theme === 'Black' ? 'text-black' : 'text-white group-hover:text-green-700'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RecordVoiceOverIcon"><circle cx="9" cy="9" r="4"></circle><path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4m7.76-9.64-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27M20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14"></path></svg>
                
                <div className={`w-auto px-2 py-2 h-[180px] flex flex-col rounded-lg overflow-y-scroll overflow-x-hidden shadow-[0px_-4px_4px_rgba(0,0,0,0.02),0px_4px_4px_rgba(0,0,0,0.02),-4px_0px_4px_rgba(0,0,0,0.02),4px_0px_4px_rgba(0,0,0,0.02)] top-0 right-0 transition-all duration-200 ${ voicesMenu ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}
                  ${theme === 'Black' ? 'bg-[#0d0d0d] dark-scrollbar text-white shadow-[0px_-4px_4px_rgba(0,0,0,0.02),0px_4px_4px_rgba(0,0,0,0.02),-4px_0px_4px_rgba(0,0,0,0.02),4px_0px_4px_rgba(0,0,0,0.02)] shadow-[#272725]' : 'bg-white'}`} onMouseEnter={() => handleVoicesOpen} onMouseLeave={handleVoicesClose}>
                      {currentVoices.length !== 0 ?
                      currentVoices
                        .map((voice, index) => {
                          const voiceName = voice.name.split(" ")[1] || voice.name
                          return (
                            <label key={index} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="voice"
                                value={voiceName}
                                checked={chosenVoice === voice}
                                onChange={() => handleVoiceChange(voice)}
                                className="hidden"
                              />
                              <div
                                className={`w-4 h-4 border-2 rounded-full ${
                                  chosenVoice === voice ? "bg-green-500 border-green-500" : "border-gray-500"
                                }`}
                              ></div>
                              <button onClick={() => trySpeak(voice)} className={`p-1 rounded-full cursor-pointer
                                ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}>
                                <svg className="w-[15px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                              </button>
                              <span className='select-none'>{voiceName}</span>
                            </label>
                          )
                        }) : (
                        <p className="text-gray-500 whitespace-nowrap">No voices available</p>
                        )}
                  </div>
              </div>
          </div>
          
        </div>

        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px] mt-10">
          <h1 className={`font-semibold text-[17px] ${theme === 'Black' ? 'text-white' : 'text-black'}`}>Your native Language</h1>
          <button onClick={searchNatClickHandler} className={`mt-3 w-[290px] sm:w-full rounded-full border-1 border-green-700 py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default
            ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>

            <p className={`flex flex-row items-center justify-start gap-2
              ${natLanguage === ' 🏳️ Select a language' && theme === 'Black' ? 'text-[#acacac]' : natLanguage === ' 🏳️ Select a language' && theme !== 'Black' ? 'text-gray-500' : natLanguage !== ' 🏳️ Select a language' && theme === 'Black' ? 'text-white' : natLanguage !== ' 🏳️ Select a language' && theme !== 'Black' ? 'text-black' : 'text-black'}
              `}>
              {natFlag !== '' ? (
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${natFlag}.webp` || null} alt="Native flag" />
              ) : (
                ''
              )}
              {natLanguage}
            </p>

            <svg className={`w-[24px] ${theme === 'Black' ? 'text-white' : 'text-black'}`} fill='currentColor' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>

          </button>
        </div>

        <button onClick={createDeckHandler} className={`mt-9 rounded-full font-semibold py-2 px-5 w-[290px] sm:w-[450px] sm:py-3 shadow-md hover:shadow-lg bg-green-700 transition-all duration-300
          ${theme === 'Black' ? 'hover:bg-green-600 text-black ' : 'text-white border-1 border-green-700 hover:bg-green-100 hover:text-green-700'}`}>SAVE</button>
        
      </div>

      {/* Dim overlay */}

      <div 
        onClick={dimOverlayHandler}
        className={`fixed h-[100vh] inset-0 bg-black opacity-0 z-[15] transition-opacity ease-in-out duration-1000 ${isLearnSearchOpen || isNatSearchOpen ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

      {/* Learn modal menu */}

      <div className={`z-[20] absolute flex flex-col justify-start items-start w-[290px] sm:w-[600px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 ${isLearnSearchOpen ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}
      ${theme === 'Black' ? 'bg-[#0d0d0d] shadow-[0px_-3px_3px_rgba(0,0,0,0.02),0px_3px_3px_rgba(0,0,0,0.02),-3px_0px_3px_rgba(0,0,0,0.02),3px_0px_3px_rgba(0,0,0,0.02)] shadow-[#272725]' : 'bg-white'}`}>

        <div className={`flex flex-row row-span-4 px-1 items-center justify-between h-[40px] w-full border-b-1
          ${theme === 'Black' ? 'border-[#313131]' : 'border-[#e2edf5]'}`}>
          <svg className={`text-[#757575] w-[45px] p-2 rounded-full
            ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
          <input 
            className={`bg-transparent focus:outline-none w-full placeholder-[#707073ff] text-[17px] ml-[5px] cursor-text pb-0.5
              ${theme === 'Black' ? 'text-gray-300' : 'text-gray-900'}`}
            type="text" 
            placeholder="Search"
            value={learnSearch}
            onChange={handleLearnSearch}
            ref={learnInputRef}
          />
          <button
            type="button"
            onClick={clearLearnSearch}
            aria-label="Clear Search"
            className={`p-1.5 text-black rounded-full
              ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}             
          >
            <svg className="text-[#acacac] w-[24px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="BackspaceOutlinedIcon"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H7.07L2.4 12l4.66-7H22zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>
          </button>

          <button
            type="button"
            onClick={dimOverlayHandler}
            aria-label="Clear Search"
            className={`p-2 text-black rounded-full
              ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}
          >
            <svg className="text-[#acacac]" aria-hidden="true" viewBox="0 0 24 24" role="img" width="23px" height="23px" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto w-full p-3">

          <div className={`flex flex-col border-b-1 pb-4
            ${theme === 'Black' ? 'border-[#313131]' : 'border-[#e2edf5]'}`}>
            {MAIN_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(learnSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickLearnHandler(item.language, item.flag)} key={index} className={`flex flex-row justify-start items-center p-[6px] pl-4 gap-2 cursor-pointer
              ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}>
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p className={`${theme === 'Black' ? 'text-white' : 'text-black'}`}>{item.language}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col pt-4">
            {OTHER_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(learnSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickLearnHandler(item.language, item.flag)} key={index} className={`flex flex-row justify-start items-center p-[6px] pl-4 gap-2 cursor-pointer
              ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}>
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p className={`${theme === 'Black' ? 'text-white' : 'text-black'}`}>{item.language}</p>
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Native modal menu */}

      <div className={`z-[20] absolute flex flex-col justify-start items-start w-[290px] sm:w-[600px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 ${isNatSearchOpen ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}
      ${theme === 'Black' ? 'bg-[#0d0d0d] shadow-[0px_-3px_3px_rgba(0,0,0,0.02),0px_3px_3px_rgba(0,0,0,0.02),-3px_0px_3px_rgba(0,0,0,0.02),3px_0px_3px_rgba(0,0,0,0.02)] shadow-[#272725]' : 'bg-white'}`}>

        <div className={`flex flex-row row-span-4 px-1 items-center justify-between h-[40px] w-full border-b-1
          ${theme === 'Black' ? 'border-[#313131]' : 'border-[#e2edf5]'}`}>
          <svg className={`text-[#757575] w-[45px] p-2 rounded-full
            ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
          <input 
            className={`bg-transparent focus:outline-none w-full placeholder-[#707073ff] text-[17px] ml-[5px] cursor-text pb-0.5
              ${theme === 'Black' ? 'text-gray-300' : 'text-gray-900'}`}
            type="text" 
            placeholder="Search"
            value={natSearch}
            onChange={handleNatSearch}
            ref={natInputRef}
          />
          <button
            type="button"
            onClick={clearNatSearch}
            aria-label="Clear Search"
            className={`p-1.5 text-black rounded-full
              ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}             
          >
            <svg className="text-[#acacac] w-[24px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="BackspaceOutlinedIcon"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H7.07L2.4 12l4.66-7H22zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>
          </button>

          <button
            type="button"
            onClick={dimOverlayHandler}
            aria-label="Clear Search"
            className={`p-2 text-black rounded-full
              ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}             
          >
            <svg className="text-[#acacac]" aria-hidden="true" viewBox="0 0 24 24" role="img" width="23px" height="23px" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto w-full p-3">

          <div className={`flex flex-col border-b-1 pb-4
            ${theme === 'Black' ? 'border-[#313131]' : 'border-[#e2edf5]'}`}>
            {MAIN_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(natSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickNatHandler(item.language, item.flag)} key={index} className={`flex flex-row justify-start items-center p-[6px] pl-4 gap-2 cursor-pointer
                ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}>
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p className={`${theme === 'Black' ? 'text-white' : 'text-black'}`}>{item.language}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col pt-4">
            {OTHER_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(natSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickNatHandler(item.language, item.flag)} key={index} className={`flex flex-row justify-start items-center p-[6px] pl-4 gap-2 cursor-pointer
                ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}>
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p className={`${theme === 'Black' ? 'text-white' : 'text-black'}`}>{item.language}</p>
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateFirstDeck
