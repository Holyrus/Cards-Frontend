import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from 'react'
import { useErrorNotificationDispatch } from './ErrorNotificationContext'
import { useNotificationDispatch } from "./NoificationContext"
import { useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import cardsService from '../services/cards'
import { useTheme } from "./ThemeProvider.jsx";
import '../scrollbar.css';

const CardSettings = ({ selectedCard, currentDeck }) => {

  const [learnWord, setLearnWord] = useState(selectedCard.word)
  const [natWord, setNatWord] = useState(selectedCard.translation)
  const [usage, setUsage] = useState(selectedCard.usage)

  const [searchModal, setSearhModal] = useState(false)
  const [searchTerm, setSearhTerm] = useState(learnWord)

  const [images, setImages] = useState([])
  const [mainImage, setMainImage] = useState(selectedCard.img)

  const errorNotificationDispatch = useErrorNotificationDispatch()
  const notificationDispatch = useNotificationDispatch()

  const { theme } = useTheme()

  const navigate = useNavigate()

  useEffect(() => {
    if (!selectedCard) {
      navigate('/main')
    }
  }, [selectedCard, navigate])

  const queryClient = useQueryClient()

  const openImagesModal = () => {
    if (learnWord) {
      setSearhModal(true)
      setSearhTerm(learnWord)
    } else {
      errorNotificationDispatch({ type: "SET", payload: `${'Fill the form first'}` })
      setTimeout(() => {
        errorNotificationDispatch({ type: "CLEAR" })
      }, 6000)
    }
  }

  const handleImageSearch = (event) => {
    setSearhTerm(event.target.value)
  }

  const clearImageSearch = () => {
    setSearhTerm('')
  }

  useEffect(() => {
    fetch('http://localhost:3003/api/images')
      .then((res) => res.json())
      .then((data) => setImages(data))
  }, [])

  const filteredImages = searchTerm ?
    images.filter(image => image.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  const imageChoiceHandler = (icon) => {
    setMainImage(icon)
    setSearhModal(false)
  }

  const changeCardHandler = (event) => {
    event.preventDefault()
    const updatedCard = {
      word: learnWord,
      translation: natWord,
      usage: usage,
      img: mainImage
    }
    updateCard(selectedCard.id, updatedCard)
  }

  const updateCard = (id, newObject) => {
    updateCardMutation.mutate({...newObject, id: id}, {
      onError: (error) => {
        errorNotificationDispatch({ type: "SET", payload: `${error.response.data.error}` })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      },
      onSuccess: () => {
        navigate('/main')
        notificationDispatch({ type: "SET", payload: 'Card was edited!' })
        setTimeout(() => {
          notificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    })
  }

  // Cards mutations

  const updateCardMutation = useMutation({
    mutationFn: (updatedCard) => cardsService.update(updatedCard.id, updatedCard),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cards'] })
      queryClient.invalidateQueries({queryKey: ['decks'] })
    }
  })

  return (
    <div className={`min-h-screen flex flex-col items-center w-full ${theme === 'Black' ? 'dark-scrollbar' : ''}`}>
      
    <div className={`w-full flex-none flex flex-row items-center justify-center h-[55px]
      ${theme === 'Black' ? 'bg-[#0f1418]' : 'bg-[#f3fff2]'}`}>
      <h1 className="w-[260px] sm:w-[410px] text-center"></h1>
      <div className="relative w-[40px] h-[30px]"></div>
      <Link to="/main">
        <svg className={`w-[40px] rounded-full p-2 text-[#6f7275]
          ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-[#edeeee]'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
      </Link>
    </div>

    <form onSubmit={changeCardHandler} className={`flex-1 flex py-[45px] flex-col items-center justify-start w-full
      ${theme === 'Black' ? 'bg-[#0f1418]' : 'bg-[#f3fff2]'}`}>
      
      <img onClick={openImagesModal} className={`w-[80px] mb-4 cursor-pointer ${!learnWord ? 'grayscale' : ''}`} src={`http://localhost:3003/api/images/files/${mainImage}`} alt="Add image" />

      <div className={`relative flex mt-4 w-[280px] sm:w-[500px] rounded-t-sm
        ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
        <input spellCheck={false} value={learnWord} onChange={({target}) => setLearnWord(target.value)} id="learnLang" type="text" placeholder='' autoComplete="off" className={`z-10 peer w-full border-0 border-b-1 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4
          ${theme === 'Black' ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-900'}`} />
        
        <div className={`absolute z-10 right-1.5 top-1.5 p-1.5 bg-transparent rounded-full
         ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-[#f7f7f7]'}`}>
          <svg className={`w-[25px] ${theme === 'Black' ? 'text-green-600' : 'text-[#d8e3eb]'}`} fill="currentColor" aria-hidden="true" focusable="false" data-prefix="fak" data-icon="translate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M191.2 51.2c11.3 0 20.5 9.2 20.5 20.5l0 19.3 53.8 0c.2 0 .5 0 .7 0l44.4 0c11.3 0 20.5 9.2 20.5 20.5s-9.2 20.5-20.5 20.5l-27.9 0c-11.5 53.2-34.1 102.2-65.3 144.5c3 3.4 6.1 6.7 9.3 10c7.9 8.1 7.6 21.1-.5 29s-21.1 7.6-29-.5c-2.1-2.1-4.1-4.3-6.1-6.5c-31.3 33.9-68.6 62.1-110.4 82.9c-10.1 5-22.4 .9-27.5-9.2s-.9-22.4 9.2-27.5c38.9-19.4 73.6-46 102.2-78.1c-17.6-23.8-32.4-49.7-44.1-77.3c-4.4-10.4 .5-22.4 10.9-26.8s22.4 .5 26.8 10.9c8.9 21.1 19.9 41 32.7 59.7c22.8-33.2 39.8-70.6 49.6-110.9L71.7 132c-11.3 0-20.5-9.2-20.5-20.5s9.2-20.5 20.5-20.5l99 0 0-19.3c0-11.3 9.2-20.5 20.5-20.5zM330.5 210.5c7.8 0 14.8 4.4 18.3 11.3l69.5 139c.1 .3 .3 .5 .4 .8l29.7 59.3c5.1 10.1 1 22.4-9.2 27.5s-22.4 1-27.5-9.2l-24.2-48.4-114.1 0-24.2 48.4c-5.1 10.1-17.4 14.2-27.5 9.2s-14.2-17.4-9.2-27.5l29.7-59.3c.1-.3 .3-.5 .4-.8l69.5-139c3.5-6.9 10.6-11.3 18.3-11.3zM294 349.9l73.1 0-36.6-73.1L294 349.9z"></path></svg>
        </div>

        <label htmlFor="learnLang" className='z-5 absolute left-2 text-[12px] text-gray-500 peer-placeholder-shown:bottom-3 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>{currentDeck.learnLang}</label>
      </div>

      <div className={`relative flex mt-4 w-[280px] sm:w-[500px] rounded-t-sm
        ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
        <input spellCheck={false} value={natWord} onChange={({target}) => setNatWord(target.value)} id="natLang" type="text" placeholder='' autoComplete="off" className={`z-10 peer w-full border-0 border-b-1 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4
          ${theme === 'Black' ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-900'}`} />
        
        <div className={`absolute z-10 right-1.5 top-1.5 p-1.5 bg-transparent rounded-full
          ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-[#f7f7f7]'}`}>
          <svg className={`w-[25px] ${theme === 'Black' ? 'text-green-600' : 'text-[#d8e3eb]'}`} fill="currentColor" aria-hidden="true" focusable="false" data-prefix="fak" data-icon="translate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M191.2 51.2c11.3 0 20.5 9.2 20.5 20.5l0 19.3 53.8 0c.2 0 .5 0 .7 0l44.4 0c11.3 0 20.5 9.2 20.5 20.5s-9.2 20.5-20.5 20.5l-27.9 0c-11.5 53.2-34.1 102.2-65.3 144.5c3 3.4 6.1 6.7 9.3 10c7.9 8.1 7.6 21.1-.5 29s-21.1 7.6-29-.5c-2.1-2.1-4.1-4.3-6.1-6.5c-31.3 33.9-68.6 62.1-110.4 82.9c-10.1 5-22.4 .9-27.5-9.2s-.9-22.4 9.2-27.5c38.9-19.4 73.6-46 102.2-78.1c-17.6-23.8-32.4-49.7-44.1-77.3c-4.4-10.4 .5-22.4 10.9-26.8s22.4 .5 26.8 10.9c8.9 21.1 19.9 41 32.7 59.7c22.8-33.2 39.8-70.6 49.6-110.9L71.7 132c-11.3 0-20.5-9.2-20.5-20.5s9.2-20.5 20.5-20.5l99 0 0-19.3c0-11.3 9.2-20.5 20.5-20.5zM330.5 210.5c7.8 0 14.8 4.4 18.3 11.3l69.5 139c.1 .3 .3 .5 .4 .8l29.7 59.3c5.1 10.1 1 22.4-9.2 27.5s-22.4 1-27.5-9.2l-24.2-48.4-114.1 0-24.2 48.4c-5.1 10.1-17.4 14.2-27.5 9.2s-14.2-17.4-9.2-27.5l29.7-59.3c.1-.3 .3-.5 .4-.8l69.5-139c3.5-6.9 10.6-11.3 18.3-11.3zM294 349.9l73.1 0-36.6-73.1L294 349.9z"></path></svg>
        </div>

        <label htmlFor="natLang" className='z-5 absolute left-2 text-[12px] text-gray-500 peer-placeholder-shown:bottom-3 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>{currentDeck.natLang}</label>
      </div>

      <div className={`relative flex mt-4 w-[280px] sm:w-[500px] rounded-t-sm
        ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
        <input spellCheck={false} value={usage} onChange={({target}) => setUsage(target.value)} id="usage" type="text" placeholder='' autoComplete="off" className={`z-10 peer w-full border-0 border-b-1 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4
          ${theme === 'Black' ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-900'}`} />

        <label htmlFor="usage" className='z-5 absolute left-2 text-[12px] text-gray-500 peer-placeholder-shown:bottom-3 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>Example of usage ({currentDeck.learnLang})</label>
      </div>

      <button type="submit" className={`mt-9 rounded-full border-1 border-green-700 font-semibold py-2 px-5 w-[290px] sm:w-[450px] sm:py-3 shadow-md hover:shadow-lg bg-green-700 transition-all duration-300
        ${theme === 'Black' ? 'text-black hover:bg-green-600' : 'text-white hover:bg-green-100 hover:text-green-700'}`}>SAVE</button>
      
    </form>

    {searchModal && 
        <section className={`fixed inset-0 items-center justify-start flex flex-col z-50
        ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
          <div className="flex flex-row mt-3 gap-1">
            <div className={`flex flex-row row-span-4 mt-0.5 px-1 items-center justify-between h-[40px] w-[250px] sm:w-[400px] border-b-1
            ${theme === 'Black' ? 'border-gray-600' : 'border-[#e2edf5]'}`}>
              <svg className={`text-[#757575] w-[45px] p-2 rounded-full
                ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
              <input 
                className={`bg-transparent focus:outline-none w-full placeholder-[#707073ff] text-[17px] ml-[5px] cursor-text pb-0.5
                  ${theme === 'Black' ? 'text-gray-300' : 'text-gray-900'}`}
                type="text" 
                placeholder="Search"
                value={searchTerm}
                onChange={handleImageSearch}
              />
              <button
                type="button"
                onClick={clearImageSearch}
                aria-label="Clear Search"
                className={`p-1.5 text-black rounded-full
                  ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`}             
              >
                <svg className="text-[#acacac] w-[24px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="BackspaceOutlinedIcon"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H7.07L2.4 12l4.66-7H22zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>
              </button>
            </div>


            <button className={`p-2 rounded-full
              ${theme === 'Black' ? 'hover:bg-[#141f25]' : 'hover:bg-gray-100'}`} onClick={() => setSearhModal(false)}>
              <svg className="w-[25px] text-[#757575]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
            </button>
          </div>

          <div className="grid grid-cols-3 px-8 sm:grid-cols-6 gap-6 sm:pl-0 overflow-auto mt-8 mb-6">
            {filteredImages.length > 0 ? (
              filteredImages
                .slice(0, 30)
                .map((icon, index) => (
                <img
                  key={index}
                  src={`http://localhost:3003/api/images/files/${icon}`}
                  alt={icon}
                  className="w-16 h-16 cursor-pointer"
                  onClick={() => imageChoiceHandler(icon)}
                />
              ))
            ) : (
              <div className="flex items-center justify-center col-span-6 h-30">
                 <p className="text-[30px]">🤷</p>
              </div>
            )}
          </div>
        </section>
      }

  </div>
  )
}

export default CardSettings
