import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from 'react'
import { MAIN_LANGUAGES, OTHER_LANGUAGES } from "../constants/languages"
import { useErrorNotificationDispatch } from './ErrorNotificationContext'
import { useTheme } from "./ThemeProvider.jsx";
import '../scrollbar.css';

const DeckSettings = ({ selectedDeck, updateDeck, deleteDeck }) => {

    const [isNatSearchOpen, setIsNatSearchOpen] = useState(false)
  
    const [learnLanguage, setLearnLanguage] = useState(selectedDeck.learnLang)
    const [natLanguage, setNatLanguage] = useState(selectedDeck.natLang)
    const [learnFlag, setLearnFlag] = useState(selectedDeck.firstFlag)
    const [natFlag, setNatFlag] = useState(selectedDeck.secondFlag)
  
    const [natSearch, setNatSearch] = useState('')
  
    const errorNotificationDispatch = useErrorNotificationDispatch()

    const { theme } = useTheme()

    const navigate = useNavigate()

    useEffect(() => {
      if (!selectedDeck) {
        navigate('/main')
      }
    }, [selectedDeck, navigate])

    const changeDeckHandler = (event) => {
      event.preventDefault()
      if (natLanguage !== selectedDeck.natLang) {
        const updatedDeck = { 
          natLang: natLanguage,
          secondFlag: natFlag
        }
        updateDeck(selectedDeck.id, updatedDeck)
      }
    }

    const deleteDeckHandler = (event) => {
      event.preventDefault()
      deleteDeck(selectedDeck.id)
    }
  
    const searchNatClickHandler = () => {
      setIsNatSearchOpen(true)
    }
  
    const searchNatCancelHandler = () => {
      setIsNatSearchOpen(false)
    }
  
    const dimOverlayHandler = () => {
      searchNatCancelHandler()
    }
  
    const clickNatHandler = (language, flag) => {
      setNatLanguage(language)
      setNatFlag(flag)
      dimOverlayHandler()
    }
  
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
  
    const natInputRef = useRef(null)
  
    useEffect(() => {
      if (isNatSearchOpen && natInputRef.current) {
        natInputRef.current.focus()
      } else if (!isNatSearchOpen && natInputRef.current) {
        natInputRef.current.blur()
      }
    }, [isNatSearchOpen])
  
    useEffect(() => {
      if (learnLanguage === natLanguage) {
        setNatLanguage(selectedDeck.natLang)
        setNatFlag(selectedDeck.secondFlag)
        errorNotificationDispatch({ type: "SET", payload: 'Cannot learn same languages' })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    }, [learnLanguage, natLanguage])
  
    const handleNatSearch = (event) => {
      setNatSearch(event.target.value)
    }
  
    const clearNatSearch = () => {
      setNatSearch('')
    }

  return (
    <div className={`min-h-screen flex flex-col items-center w-full ${theme === 'Black' ? 'dark-scrollbar' : ''}`}>
      
      <div className={`w-full flex-none flex flex-row items-center justify-center border-b-1 h-[55px]
        ${theme === 'Black' ? 'bg-[#0d0d0d] border-gray-600' : 'bg-white border-[#e1edf5]'}`}>
        <Link to="/main"><svg className={`w-[40px] rounded-full p-2
        ${theme === 'Black' ? 'text-white hover:bg-[#141f25]' : 'hover:bg-[#edeeee] text-black'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowLeftRoundedIcon"><path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path></svg></Link>
        <h1 className={`w-[260px] sm:w-[410px] text-center ${theme === 'Black' ? 'text-white' : 'text-black'}`}>Edit deck</h1>
        <div className="w-[40px]"></div>
      </div>

      <div className={`flex-1 flex mb-[55px] py-[25px] flex-col items-center justify-start w-full
        ${theme === 'Black' ? 'bg-[#0f1418]' : 'bg-[#f3fff2]'}`}>
        
        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px]">
          <h1 className={`font-semibold text-[17px] ${theme === 'Black' ? 'text-white' : 'text-black'}`}>Language you want to learn</h1>
          <button className={`mt-3 w-[290px] sm:w-full rounded-full border-1 py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default
            ${theme === 'Black' ? 'border-green-950 bg-[#0e1012]' : 'border-green-600 bg-[#f6f3f3]'}`}>

            <p className={`flex flex-row items-center justify-start gap-2
              ${theme === 'Black' ? 'text-gray-600' : 'text-gray-500'}`}>
              <img className="w-[20px] opacity-60" src={`https://flagcdn.com/80x60/${learnFlag}.webp` || null} alt="Learn flag" />
              {learnLanguage}
            </p>

            <svg className={`w-[24px]
              ${theme === 'Black' ? 'text-gray-600' : 'text-gray-400'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>

          </button>
        </div>

        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px] mt-10">
          <h1 className={`font-semibold text-[17px] ${theme === 'Black' ? 'text-white' : 'text-black'}`}>Your native Language</h1>
          <button onClick={searchNatClickHandler} className={`mt-3 w-[290px] sm:w-full rounded-full border-1 border-green-700 py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default
            ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>

            <p className={`flex flex-row items-center justify-start gap-2
              ${theme === 'Black' ? 'text-white' : 'text-black'}`}>
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

        <button onClick={changeDeckHandler} className={`mt-9 rounded-full font-semibold py-2 px-5 w-[290px] sm:w-[450px] sm:py-3 shadow-md
          ${natLanguage === selectedDeck.natLang && theme !== 'Black' ? 'bg-[#cccccc] text-white' : natLanguage !== selectedDeck.natLang && theme !== 'Black' ? 'bg-green-700 text-white hover:shadow-lg hover:bg-green-100 hover:text-green-700 border-1 border-green-700 transition-all duration-300 cursor-pointer' : natLanguage === selectedDeck.natLang && theme === 'Black' ? 'bg-[#3b3b3b] text-black' : natLanguage !== selectedDeck.natLang && theme === 'Black' ? 'bg-green-700 text-black hover:shadow-lg hover:bg-green-600 transition-all duration-300 cursor-pointer' : ''}`}>SAVE</button>
        
        <button onClick={deleteDeckHandler} className={`mt-4 rounded-full font-semibold py-2 px-5 w-[290px] sm:w-[450px] sm:py-3 bg-transparent transition-all duration-300 cursor-pointer
           ${theme === 'Black' ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-green-100 hover:text-green-700'}`}>DELETE DECK</button>

      </div>

      <div className={`fixed bottom-0 w-full flex-none flex flex-row items-center justify-center h-[55px]
      ${theme === 'Black' ? 'border-t-1 border-[#182026] bg-[#0d0d0d]' : 'border-t-1 border-[#e1edf5] bg-white'}`}>
        <Link to="/main" className={`flex flex-col items-center justify-start px-[60px] hover:cursor-pointer transition-all duration-75
        ${theme === 'Black' ? 'active:bg-[#1e1e1e]' : 'active:bg-gray-300'}`} draggable="false">
          <svg width="35" height="35" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(10, 115, 130)">
              <rect x="80" y="80" width="90" height="140" rx="10" ry="10" fill={`${theme === 'Black' ? '#c4c4c4' : 'black'}`}/>
            </g>
            <g transform="rotate(-10, 85, 100)">
              <rect x="30" y="30" width="90" height="140" rx="10" ry="10" fill="green"/>
            </g>
          </svg>
          <p className={`text-[10px] font-semibold select-none ${theme === 'Black' ? 'text-[#d8d8d8]' : 'text-black'}`}>LEARNING</p>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center justify-start px-[60px] hover:cursor-pointer transition-all duration-75
        ${theme === 'Black' ? 'active:bg-[#1e1e1e]' : 'active:bg-gray-300'}`} draggable="false">
          <svg width="35" height="35" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-vneck" className="svg-inline--fa fa-user-vneck" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 -100 448 650">
            <circle className="text-gray-500" cx="120" cy="35" r="40" fill={`${theme === 'Black' ? 'black' : 'white'}`} stroke="currentColor" strokeWidth="40"/>
            <circle className="text-gray-500" cx="328" cy="35" r="40" fill={`${theme === 'Black' ? 'black' : 'white'}`} stroke="currentColor" strokeWidth="40"/>
      
            <path className="text-gray-500" fill="currentColor" d="M224 208a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm128-80A128 128 0 1 1 96 128a128 128 0 1 1 256 0zM48.3 464H399.7c-3.1-47.3-33.7-87.3-76-103.8L274 422.4c-25.6 32-74.3 32-100 0l-49.7-62.2C82 376.7 51.4 416.7 48.3 464zm85-156.4c5.6-1.2 11.3 1.1 14.9 5.6l63.4 79.2c6.4 8 18.6 8 25 0l63.4-79.2c3.6-4.5 9.3-6.7 14.9-5.6C390.9 323.6 448 391.1 448 472v8c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32v-8c0-80.9 57.1-148.4 133.3-164.4z"></path>
          </svg>
          <p className={`text-[10px] font-semibold select-none ${theme === 'Black' ? 'text-[#d8d8d8]' : 'text-black'}`}>ACCOUNT</p>
        </Link>
      </div>

      {/* Dim overlay */}

      <div 
        onClick={dimOverlayHandler}
        className={`fixed h-[100vh] inset-0 bg-black opacity-0 z-[15] transition-opacity ease-in-out duration-1000 ${isNatSearchOpen ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

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

export default DeckSettings
