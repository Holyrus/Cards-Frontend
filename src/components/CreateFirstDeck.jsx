import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from 'react'
import { MAIN_LANGUAGES, OTHER_LANGUAGES } from "../constants/languages"
import { useErrorNotificationDispatch } from './ErrorNotificationContext'

const CreateFirstDeck = ({ createDeck }) => {

    const [isLearnSearchOpen, setIsLearnSearchOpen] = useState(false)
    const [isNatSearchOpen, setIsNatSearchOpen] = useState(false)
  
    const [learnLanguage, setLearnLanguage] = useState(' 🏳️ Select a language ')
    const [natLanguage, setNatLanguage] = useState(' 🏳️ Select a language')
    const [learnFlag, setLearnFlag] = useState('')
    const [natFlag, setNatFlag] = useState('')
  
    const [learnSearch, setLearnSearch] = useState('')
    const [natSearch, setNatSearch] = useState('')
  
    const errorNotificationDispatch = useErrorNotificationDispatch()
  
    const createDeckHandler = (event) => {
      event.preventDefault()
      if (learnLanguage !== ' 🏳️ Select a language ' && natLanguage !== ' 🏳️ Select a language') {
        createDeck({
          learnLang: learnLanguage,
          natLang: natLanguage,
          firstFlag: learnFlag,
          secondFlag: natFlag,
          mainDeck: true,
        })
        dimOverlayHandler()
        setLearnLanguage(' 🏳️ Select a language ')
        setNatLanguage(' 🏳️ Select a language')
        setLearnFlag('')
        setNatFlag('')
      } else {
        errorNotificationDispatch({ type: "SET", payload: 'Select two languages' })
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

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      
      <div className="w-full flex-none flex flex-row items-center justify-center border-b-1 border-[#e1edf5] h-[55px]">
        <div className="w-[40px]"></div>
        <h1 className="w-[260px] sm:w-[410px] text-center">Create new deck</h1>
        <div className="w-[40px]"></div>
      </div>

      <div className="flex-1 flex py-[45px] flex-col items-center justify-start w-full bg-[#f3fff2]">
        
        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px]">
          <h1 className="font-semibold text-[17px]">Language you want to learn</h1>
          <button onClick={searchLearnClickHandler} className="mt-3 w-[290px] sm:w-full rounded-full border-1 border-green-700 bg-white py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default">

            <p className={`flex flex-row items-center justify-start gap-2 ${learnLanguage === ' 🏳️ Select a language ' ? 'text-gray-500' : 'text-black'}`}>
              {learnFlag !== '' ? (
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${learnFlag}.webp` || null} alt="Learn flag" />
              ) : (
                ''
              )}
              {learnLanguage}
            </p>

            <svg className="w-[24px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>

          </button>
        </div>

        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px] mt-10">
          <h1 className="font-semibold text-[17px]">Your native Language</h1>
          <button onClick={searchNatClickHandler} className="mt-3 w-[290px] sm:w-full rounded-full border-1 border-green-700 bg-white py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default">

            <p className={`flex flex-row items-center justify-start gap-2 ${natLanguage === ' 🏳️ Select a language' ? 'text-gray-500' : 'text-black'}`}>
              {natFlag !== '' ? (
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${natFlag}.webp` || null} alt="Native flag" />
              ) : (
                ''
              )}
              {natLanguage}
            </p>

            <svg className="w-[24px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>

          </button>
        </div>

        <button onClick={createDeckHandler} className='mt-9 rounded-full text-white border-1 border-green-700 font-semibold py-2 px-5 w-[290px] sm:w-[450px] sm:py-3 shadow-md hover:shadow-lg bg-green-700 hover:bg-green-100 hover:text-green-700 transition-all duration-300'>SAVE</button>
        
      </div>

      {/* Dim overlay */}

      <div 
        onClick={dimOverlayHandler}
        className={`fixed h-[100vh] inset-0 bg-black opacity-0 z-[15] transition-opacity ease-in-out duration-1000 ${isLearnSearchOpen || isNatSearchOpen ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

      {/* Learn modal menu */}

      <div className={`z-[20] absolute flex flex-col justify-start items-start bg-white w-[290px] sm:w-[600px] h-[500px] my-4 opacity-0 ${isLearnSearchOpen ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}`}>

        <div className="flex flex-row row-span-4 px-1 items-center justify-between h-[40px] w-full border-b-1 border-[#e2edf5]">
          <svg className="text-[#757575] w-[45px] p-2 rounded-full hover:bg-gray-100" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
          <input 
            className="bg-transparent focus:outline-none text-black w-full placeholder-[#707073ff] text-[17px] ml-[5px] cursor-text pb-0.5" 
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
            className="p-2 text-black hover:bg-gray-100 rounded-full"             
          >
            <svg className="text-[#acacac] w-[24px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="BackspaceOutlinedIcon"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H7.07L2.4 12l4.66-7H22zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>
          </button>

          <button
            type="button"
            onClick={dimOverlayHandler}
            aria-label="Clear Search"
            className="p-2 text-black hover:bg-gray-100 rounded-full"             
          >
            <svg className="text-[#acacac]" aria-hidden="true" viewBox="0 0 24 24" role="img" width="23px" height="23px" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto w-full p-3">

          <div className="flex flex-col border-b-1 border-[#e2edf5] pb-4">
            {MAIN_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(learnSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickLearnHandler(item.language, item.flag)} key={index} className="flex flex-row justify-start items-center hover:bg-gray-100 p-[6px] pl-4 gap-2 cursor-pointer">
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p>{item.language}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col pt-4">
            {OTHER_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(learnSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickLearnHandler(item.language, item.flag)} key={index} className="flex flex-row justify-start items-center hover:bg-gray-100 p-[6px] pl-4 gap-2 cursor-pointer">
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p>{item.language}</p>
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Native modal menu */}

      <div className={`z-[20] absolute flex flex-col justify-start items-start bg-white w-[290px] sm:w-[600px] h-[500px] my-4 opacity-0 ${isNatSearchOpen ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}`}>

        <div className="flex flex-row row-span-4 px-1 items-center justify-between h-[40px] w-full border-b-1 border-[#e2edf5]">
          <svg className="text-[#757575] w-[45px] p-2 rounded-full hover:bg-gray-100" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
          <input 
            className="bg-transparent focus:outline-none text-black w-full placeholder-[#707073ff] text-[17px] ml-[5px] cursor-text pb-0.5" 
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
            className="p-2 text-black hover:bg-gray-100 rounded-full"             
          >
            <svg className="text-[#acacac] w-[24px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="BackspaceOutlinedIcon"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H7.07L2.4 12l4.66-7H22zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>
          </button>

          <button
            type="button"
            onClick={dimOverlayHandler}
            aria-label="Clear Search"
            className="p-2 text-black hover:bg-gray-100 rounded-full"             
          >
            <svg className="text-[#acacac]" aria-hidden="true" viewBox="0 0 24 24" role="img" width="23px" height="23px" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto w-full p-3">

          <div className="flex flex-col border-b-1 border-[#e2edf5] pb-4">
            {MAIN_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(natSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickNatHandler(item.language, item.flag)} key={index} className="flex flex-row justify-start items-center hover:bg-gray-100 p-[6px] pl-4 gap-2 cursor-pointer">
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p>{item.language}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-col pt-4">
            {OTHER_LANGUAGES
              .filter(item => item.language.toLowerCase().includes(natSearch.toLowerCase()))
              .map((item, index) => (
              <button onClick={() => clickNatHandler(item.language, item.flag)} key={index} className="flex flex-row justify-start items-center hover:bg-gray-100 p-[6px] pl-4 gap-2 cursor-pointer">
                <img className="w-[20px]" src={`https://flagcdn.com/80x60/${item.flag}.webp`} alt={`${item.language} flag`} />
                <p>{item.language}</p>
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateFirstDeck
