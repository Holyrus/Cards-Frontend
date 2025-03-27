import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import decksService from '../services/decks'
import ThreeDModel from "./Model.jsx"
import cardsService from '../services/cards.js'

const MainPage = ({ decks, onDeckChange }) => {

  const queryClient = useQueryClient()
  const [currentDeck, setCurrentDeck] = useState('')

  const [isCardsOpen, setIsCardsOpen] = useState(false)

  const [activeSettingsId, setActiveSettingsId] = useState(null)

  const [voices, setVoices] = useState([])

  const [currentVoices, setCurrentVoices] = useState([])

  const [chosenVoice, setChosenVoice] = useState('')

  const [voicesWindowOpen, setVoicesWindowOpen] = useState(false)

  const [selectedValue, setSelectedValue] = useState('All')

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()
  }, [])

  useEffect(() => {
    const filteredVoices = voices.filter((v) => v.name.includes(currentDeck.learnLang))

    setCurrentVoices(filteredVoices)

    // ***************
    setChosenVoice(filteredVoices[0])
  }, [voices, currentDeck.learnLang])

  const speak = (word) => {

    if (!voices.length) return

    const selectedVoice = chosenVoice;

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.voice = selectedVoice

    speechSynthesis.speak(utterance)
  }

  const handleVoiceChange = (voice) => {
    // *****************
    setChosenVoice(voice)
  }

  const dropdownOptions = [
    { value: 'All', label: 'All' },
    { value: 'To learn', label: 'To learn' },
    { value: 'Known', label: 'Known' },
    { value: 'Learned', label: 'Learned' },
  ]

  const deleteCardMutation = useMutation({
    mutationFn: (deletedCard) => cardsService.remove(deletedCard.id),
    onSuccess: (deletedCard) => {
      queryClient.invalidateQueries({queryKey: ['cards'] })
      queryClient.invalidateQueries({queryKey: ['decks'] })
    }
  })

  const updateDeckMutation = useMutation({
    mutationFn: (updatedDeck) => decksService.update(updatedDeck.id, updatedDeck),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] })
    }
  })

  useEffect(() => {
    const mainDeck = decks.find(deck => deck.mainDeck === true)
    if (mainDeck) {
      setCurrentDeck(mainDeck)
      onDeckChange(mainDeck)
    } else if (!mainDeck && decks.length > 0) {
      setCurrentDeck('')
      onDeckChange('')
    }
  }, [decks, onDeckChange])

  const mainDeckSetter = async (selectedDeck) => {
    try {
      const updatePromises = decks
      .filter(deck => deck.id !== selectedDeck.id)  
      .map(deck => {
          return updateDeckMutation.mutateAsync({
            ...deck,
            mainDeck: false
          })
      })

      await Promise.all(updatePromises)

      await updateDeckMutation.mutateAsync({
        ...selectedDeck,
        mainDeck: true
      })

      setCurrentDeck(selectedDeck)
      onDeckChange(selectedDeck)
      setIsCardsOpen(false)
    } catch (error) {
      console.error('Error updating main deck:', error)
    }

  }

    // Cards results
  
    // const cardsResult = useQuery({
    //   queryKey: ['cards'],
    //   queryFn: cardsService.getAll(),
    //   refetchOnWindowFocus: false,
    //   retry: false,
    //   enabled: !!user
    // })

  // const cards = cardsResult.data || []



  // console.log(currentDeck.learnLang, currentDeck.mainDeck)
  // console.log(currentDeck)
  // console.log(decks)

  //---------------------------

  const [isOpen, setIsOpen] = useState(false);

  const [paletteOpen, setPaletteOpen] = useState(false)
  const [statOpen, setStatOpen] = useState(false)

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const paletteClickHandler = () => {
    if (paletteOpen) {
      setPaletteOpen(false)
    } else {
      setPaletteOpen(true)
    }
    if (statOpen) {
      setStatOpen(false)
    }
  }

  const paletteCancelHandler = () => {
    setPaletteOpen(false)
  }

  const statClickHandler = () => {
    if (statOpen) {
      setStatOpen(false)
    } else {
      setStatOpen(true)
    }
    if (paletteOpen) {
      setPaletteOpen(false)
    }
  }

  const statCancelHandler = () => {
    setStatOpen(false)
  }

  const dimOverlayHandler = () => {
    paletteCancelHandler()
    statCancelHandler()
  }

  const divClickHandler = () => {
    if (paletteOpen) {
      setPaletteOpen(false)
    } else if (statOpen) {
      setStatOpen(false)
    }
  }

  useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape" && paletteOpen) {
          paletteCancelHandler()
        } else if (event.key === "Escape" && statOpen) {
          statCancelHandler()
        }
      }
  
      window.addEventListener("keydown", handleKeyDown)
  
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [paletteOpen, statOpen])

  // Decks dialog

  const handleMouseEnter = () => {
    displayDialog();
  }

  const handleMouseLeave = () => {
    removeDialog();
  }

  const displayDialog = () => {
    setIsOpen(true);
    dimOverlayHandler()
  }

  const removeDialog = () => {
    setIsOpen(false);
  }

  const cardsButtonHandler = () => {
    setIsCardsOpen(!isCardsOpen)
  }

  const cardsSearchHandler = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleSettingsEnter = (cardId) => {
    setActiveSettingsId(cardId)
  }

  const handleSettingsLeave = () => {
    setActiveSettingsId(null)
  }

  const handleVoicesEnter = () => {
    setVoicesWindowOpen(true)
  }

  const handleVoicesLeave = () => {
    setVoicesWindowOpen(false)
  }

  const cardDeleteHandler = (cardId) => {
    const cardToDelete = currentDeck.cards.find(card => card.id === cardId)
    
    deleteCardMutation.mutate(cardToDelete, {
      onError: (error) => {
        errorNotificationDispatch({ type: "SET", payload: `${error.response.data.error}` })
        setTimeout(() => {
          errorNotificationDispatch({ type: "CLEAR" })
        }, 6000)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      
      <div onClick={divClickHandler} className="z-50 relative w-full flex-none flex flex-row gap-12 sm:gap-40 md:gap-60 lg:gap-72 items-center justify-center border-b-1 border-[#e1edf5] bg-white h-[55px]">

        <button onClick={paletteClickHandler} className="cursor-pointer w-[40px] rounded-full hover:bg-gray-200 p-2">
          <svg className="text-[#aaaaaa]" fill="currentColor" aria-hidden="true" focusable="false" data-prefix="far" data-icon="palette" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 258.2c0 2.7-1 5.2-4.2 8c-3.8 3.1-10.1 5.8-17.8 5.8H344c-53 0-96 43-96 96c0 6.8 .7 13.4 2.1 19.8c3.3 15.7 10.2 31.1 14.4 40.6l0 0c.7 1.6 1.4 3 1.9 4.3c5 11.5 5.6 15.4 5.6 17.1c0 5.3-1.9 9.5-3.8 11.8c-.9 1.1-1.6 1.6-2 1.8c-.3 .2-.8 .3-1.6 .4c-2.9 .1-5.7 .2-8.6 .2C141.1 464 48 370.9 48 256S141.1 48 256 48s208 93.1 208 208c0 .7 0 1.4 0 2.2zm48 .5c0-.9 0-1.8 0-2.7C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512c3.5 0 7.1-.1 10.6-.2c31.8-1.3 53.4-30.1 53.4-62c0-14.5-6.1-28.3-12.1-42c-4.3-9.8-8.7-19.7-10.8-29.9c-.7-3.2-1-6.5-1-9.9c0-26.5 21.5-48 48-48h97.9c36.5 0 69.7-24.8 70.1-61.3zM160 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-64a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm128-64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm64 64a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg>
        </button>

        <div className='hover-trigger hover:text-[#707073ff] flex items-center justify-center w-[135px] cursor-pointer h-full' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {currentDeck ? (
            <div className="relative w-[40px] h-[30px]">
              <img className="absolute bottom-1 left-2 ml-2 w-[18px]" src={`https://flagcdn.com/80x60/${currentDeck.secondFlag}.webp` || null} alt="Second flag" />
              <img className="absolute bottom-3 right-4 ml-2 w-[18px]" src={`https://flagcdn.com/80x60/${currentDeck.firstFlag}.webp` || null} alt="First flag" />
            </div>
          ) : (
            <p>Choose the deck</p>
          )
          }
            
          {currentDeck && <p className="mx-0.5">{currentDeck.learnLang}</p>}
          <svg className="text-[#707073ff]" width="16" height="12" viewBox="0 0 24 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <polygon points="6,8 18,8 12,16" />
          </svg>
        </div>

        <button onClick={statClickHandler} className="cursor-pointer w-[40px] rounded-full hover:bg-gray-200 p-2.5">
        <svg className="text-[#aaaaaa]" aria-hidden="true" focusable="false" data-prefix="far" data-icon="chart-simple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M240 80V432H208V80h32zM208 32c-26.5 0-48 21.5-48 48V432c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H208zM80 272V432H48V272H80zM48 224c-26.5 0-48 21.5-48 48V432c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48H48zm320-80h32V432H368V144zm-48 0V432c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48H368c-26.5 0-48 21.5-48 48z"></path></svg>
        </button>

        <div className={`bg-white text-black py-[8px] z-20 border-1 border-[#e3e2e1] w-[175px] top-0 rounded-lg mt-[54px] opacity-0 ${isOpen ? 'absolute opacity-100 translate-y-0 ' : 'absolute opacity-0 pointer-events-none translate-y-[-10px]'} transform duration-300`} onMouseEnter={displayDialog} onMouseLeave={removeDialog}>

            {decks.length !== 0 &&
              [...decks]
                .map((deck, index) => 
                  <div onClick={() => mainDeckSetter(deck)} key={index} className={`h-[50px] w-full hover:bg-[#e5eaec] flex flex-row justify-center gap-3 items-center cursor-pointer px-1 ${currentDeck.learnLang === deck.learnLang ? 'bg-[#ebf7fc]' : 'bg-white'}`}>
                    
                    <div className="relative w-[40px] h-[30px]">
                      <img className="absolute bottom-1 left-2 ml-2 w-[20px]" src={`https://flagcdn.com/80x60/${deck.secondFlag}.webp` || null} alt="Second flag" />
                      <img className="absolute bottom-3 right-4 ml-2 w-[20px]" src={`https://flagcdn.com/80x60/${deck.firstFlag}.webp` || null} alt="First flag" />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-[15px]">{deck.learnLang}</p>
                      <p className="text-[13px] text-[#009900]">{deck.cards.length} To learn</p>
                    </div>

                    <Link to={`/deck/${deck.id}`}>
                      <svg className="text-[#abb4b8] w-[35px] cursor-pointer p-2 rounded-full hover:bg-[#d5effb]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path></svg>
                    </Link>    
                  </div>
                )
              }
          
            <Link to="/newdeck" className="text-[#009900] flex flex-row items-center justify-center w-full gap-1 h-[36px] hover:bg-[#f5f5f5] cursor-pointer">
              <svg className="text-[#009900] w-[24px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path></svg>
              <p>Create new deck</p>
            </Link>
        </div>
    </div>

      {/* Palette menu */}

      <div className={`absolute z-30 flex flex-col justify-start items-start bg-white w-full h-[150px] transform duration-400 top-[-150px] ${paletteOpen ? 'absolute translate-y-[204px]' : 'absolute pointer-events-none translate-y-[-150px]'}`}>
          <p>Palttetetetetetetetetetetet</p>
      </div>

      {/* Stats menu */}

      <div className={`absolute z-30 flex flex-col justify-start items-start bg-white w-full h-[300px] transform duration-400 top-[-300px] ${statOpen ? 'absolute translate-y-[354px]' : 'absolute pointer-events-none translate-y-[-300px]'}`}>
         <p>Statataatatattaatatataaaat</p>
      </div>

      <div className="flex-1 z-20 mb-[55px] flex flex-col items-center w-full bg-[#f3fff2]">
        <div className="mt-[15px] mb-[5px] w-full h-[80px] flex flex-row justify-center items-center gap-1 sm:gap-6 px-5">
            
            <div className="cursor-pointer rounded-sm w-[235px] h-[60px] border-1 border-[#e3e2e0] bg-white flex flex-col justify-center items-center">
              <p className="text-[22px] font-semibold text-[#009900]">{currentDeck?.cards?.length || 0}</p>
              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-[#009900] pb-[4px]">To learn</p>
                <svg className="text-[#009900] w-[16px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HelpOutlineIcon"><path d="M11 18h2v-2h-2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4"></path></svg>
              </div>
            </div>

            <div className="cursor-pointer rounded-sm w-[235px] h-[60px] border-1 border-[#e3e2e0] bg-white flex flex-col justify-center items-center">
              <p className="text-[22px] font-semibold text-[#0099dd]">{currentDeck?.cards?.length || 0}</p>
              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-[#0099dd] pb-[4px]">Known</p>
                <svg className="text-[#0099dd] w-[16px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HelpOutlineIcon"><path d="M11 18h2v-2h-2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4"></path></svg>
              </div>
            </div>

            <div className="cursor-pointer rounded-sm w-[235px] h-[60px] border-1 border-[#e3e2e0] bg-white flex flex-col justify-center items-center">
              <p className="text-[22px] font-semibold text-[#d3b000]">{currentDeck?.cards?.length || 0}</p>
              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-[#d3b000] pb-[4px]">Learned</p>
                <svg className="text-[#d3b000] w-[16px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="HelpOutlineIcon"><path d="M11 18h2v-2h-2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4"></path></svg>
              </div>
            </div>

        </div>
        <ThreeDModel />
        { currentDeck?.cards?.length !== 0 && currentDeck && <button className='rounded-full text-white border-1 border-green-700 font-semibold py-2 px-5 w-[290px] sm:w-[400px] md:w-[450px] md:py-3 shadow-md hover:shadow-lg bg-green-700 hover:bg-green-100 hover:text-green-700 transition-all duration-300 select-none'>START</button> }
          <div className="mt-5 flex flex-row justify-center items-center gap-3">

        { currentDeck?.cards?.length !== 0 && currentDeck && 
            <div onClick={cardsButtonHandler} className="flex flex-row justify-between items-center pl-3 pr-2 mb-4 h-[56px] w-[220px] sm:w-[350px] md:w-[618px] bg-white border-1 border-[#e3e2e0]">
              
              <div className="flex flex-row gap-1">

              { !isCardsOpen ? (
                <svg className="w-[25px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path></svg>
              ) : (
                <svg className="w-[25px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>
              )}

                <p className="cursor-default select-none">Cards</p>

              </div>
              <div className="flex flex-row gap-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    handleVoicesEnter()
                  }}
                  // onMouseEnter={handleVoicesEnter}
                  // onMouseLeave={handleVoicesLeave}
                  className="p-1.5 pl-2 border-l-1 hover:bg-gray-100 border-l-[#eeeeee] relative">
                  <svg className="w-[25px] text-[#8a8a8a]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RecordVoiceOverIcon"><circle cx="9" cy="9" r="4"></circle><path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4m7.76-9.64-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27M20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14"></path></svg>
                
                  <div className={`bg-white w-[200px] px-2 py-2 h-[165px] flex flex-col rounded-lg shadow-[0px_-4px_4px_rgba(0,0,0,0.02),0px_4px_4px_rgba(0,0,0,0.02),-4px_0px_4px_rgba(0,0,0,0.02),4px_0px_4px_rgba(0,0,0,0.02)] bottom-0 right-0 transition-all duration-200 ${ voicesWindowOpen ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}`} onMouseEnter={() => handleVoicesEnter} onMouseLeave={handleVoicesLeave}>
                      {currentVoices
                        .slice(0, 6)
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
                              <span>{voiceName}</span>
                            </label>
                          )
                        })}
                  </div>
                
                </div>

                <div 
                  onClick={(e) => {
                      e.stopPropagation();
                      cardsSearchHandler();
                  }}
                  className="p-1.5 hover:bg-gray-100 border-l-1 border-l-[#eeeeee]">
                  <svg className="w-[25px] text-[#bababa]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
                </div>
              </div>
            </div>
        }

          { currentDeck &&
            <Link to="/main/newcard"
                  state={{ currentDeck }}
                  className="p-2.5 mb-4 bg-green-700 text-white hover:text-green-700 rounded-full border-1 border-green-700 shadow-md hover:bg-green-100 transition-all duration-300">
              <svg className="w-[34px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path></svg>
            </Link>
          }
          </div>

          { isSearchOpen && 
              <div className="flex flex-row gap-3 mb-5">
                <div className="relative flex w-[130px] sm:w-[200px] md:w-[300px] h-[49px] bg-white rounded-t-sm">
                  <select
                    id="dropdown"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className="z-10 peer w-full border-0 border-b-1 border-gray-400 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4 text-gray-900 appearance-none"
                  >
                    <option value="" disabled hidden></option>
                    {dropdownOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="dropdown" className='z-5 absolute left-2 text-gray-500 text-[12px] peer-placeholder-shown:bottom-3 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>
                    Card state
                  </label>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className='relative flex w-[130px] sm:w-[200px] md:w-[300px] bg-white rounded-t-sm'>
                  <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} type="text" placeholder='' autoComplete="off" className='z-10 peer w-full border-0 border-b-1 border-gray-400 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4 text-gray-900' />
                  <label className='z-5 absolute left-2 text-gray-500 text-[12px] peer-placeholder-shown:bottom-3 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>Search</label>
                </div>
              </div> 
              }

          { currentDeck?.cards?.length !== 0 && currentDeck && isCardsOpen && 
            <div className="bg-white w-[270px] sm:w-[500px] md:w-[700px] lg:[800px] flex flex-col">
              { currentDeck.cards
                .filter(card => 
                  card.word.toLowerCase().includes(searchValue.toLowerCase()) ||
                  card.translation.toLowerCase().includes(searchValue.toLowerCase()) ||
                  card.usage.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((card, index) => (
                  <div className="min-h-[75px] w-full border-b-1 border-[#e2edf5] flex flex-row items-center justify-between px-4" key={card.id}>

                    <div className="flex flex-row items-center">
                      <img className="w-[50px] h-[50px]" src={`http://localhost:3003/api/images/files/${card.img}`} alt="Card Images"/>
                      <div className="flex flex-col ml-0.5 items-start">
                        <div className="flex flex-row gap-1">
                          <button onClick={() => speak(card.word)} className="hover:bg-gray-100 p-1 rounded-full cursor-pointer">
                            <svg className="w-[15px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                          </button>
                          <p className="font-semibold text-[14px]">{card.word}</p>
                        </div>
                        <p className="text-[13.5px] ml-[27px]">{card.translation}</p>
                        <div className="flex flex-row gap-1">
                          <button onClick={() => speak(card.usage)} className="hover:bg-gray-100 p-1 rounded-full cursor-pointer">
                            <svg className="w-[15px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                          </button>
                          <p className="text-[13.5px] text-[#afafaf]">{card.usage}</p>
                        </div>
                      </div>
                    </div>

                    <button onMouseEnter={() => handleSettingsEnter(card.id)} onMouseLeave={handleSettingsLeave} className="py-2 rounded-full relative">
                      <svg className="w-[25px] text-[#757575]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MoreVertIcon"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"></path></svg>

                      <div className={`bg-white w-[118px] py-2 h-[160px] flex flex-col rounded-lg shadow-[0px_-4px_4px_rgba(0,0,0,0.02),0px_4px_4px_rgba(0,0,0,0.02),-4px_0px_4px_rgba(0,0,0,0.02),4px_0px_4px_rgba(0,0,0,0.02)] bottom-0 right-0 lg:left-0 transition-all duration-200 ${activeSettingsId === card.id ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}`} onMouseEnter={() => handleSettingsEnter(card.id)} onMouseLeave={handleSettingsLeave}>
                        <Link to={`/card/${card.id}`} className="flex flex-row items-center justify-start w-full h-[36px] hover:bg-[#f5f5f5] p-2 pl-4 gap-3">
                          <svg className="w-[18px]" aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>
                          <p>Edit</p>
                        </Link>
                        <div className="flex flex-row items-center justify-start w-full h-[36px] hover:bg-[#f5f5f5] p-2 pl-4 gap-3">
                          <svg className="w-[18px]" aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrows-rotate" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M94 187.1C120.8 124.1 183.3 80 256 80c39.7 0 77.8 15.8 105.9 43.9L414.1 176H360c-13.3 0-24 10.7-24 24s10.7 24 24 24H472c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24s-24 10.7-24 24v54.1L395.9 89.9C358.8 52.8 308.5 32 256 32C163.4 32 83.9 88.2 49.8 168.3c-5.2 12.2 .5 26.3 12.7 31.5s26.3-.5 31.5-12.7zm368 157c5.2-12.2-.4-26.3-12.6-31.5s-26.3 .4-31.5 12.6C391 388.1 328.6 432 256 432c-39.7 0-77.8-15.8-105.9-43.9L97.9 336H152c13.3 0 24-10.7 24-24s-10.7-24-24-24H40c-13.3 0-24 10.7-24 24V424c0 13.3 10.7 24 24 24s24-10.7 24-24V369.9l52.1 52.1C153.2 459.2 203.5 480 256 480c92.5 0 171.8-56 206-135.9z"></path></svg>
                          <p>Reset</p>
                        </div>
                        <div onClick={() => cardDeleteHandler(card.id)} className="flex flex-row items-center justify-start w-full h-[36px] hover:bg-[#f5f5f5] p-2 pl-4 gap-3">
                          <svg className="w-[18px] text-[#dd4444]" fill="currentColor" aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-xmark" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80h13.7H416h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H412.4L388.4 452.7c-2.5 33.4-30.3 59.3-63.8 59.3H123.4c-33.5 0-61.3-25.9-63.8-59.3L35.6 128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80.1 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM83.7 128l23.8 321.2c.6 8.4 7.6 14.8 16 14.8H324.6c8.4 0 15.3-6.5 16-14.8L364.3 128H83.7zm62.2 81.9c7.8-7.8 20.5-7.8 28.3 0L224 259.7l49.9-49.9c7.8-7.8 20.5-7.8 28.3 0s7.8 20.5 0 28.3L252.3 288l49.9 49.9c7.8 7.8 7.8 20.5 0 28.3s-20.5 7.8-28.3 0L224 316.3l-49.9 49.9c-7.8 7.8-20.5 7.8-28.3 0s-7.8-20.5 0-28.3L195.7 288l-49.9-49.9c-7.8-7.8-7.8-20.5 0-28.3z"></path></svg>
                          <p className="text-[#dd4444]">Delete</p>
                        </div>
                        <div className="flex flex-row items-center justify-center w-full h-[36px] p-2">
                          <svg className="w-[40px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.9201 15.0499L13.4001 8.52989C12.6301 7.75989 11.3701 7.75989 10.6001 8.52989L4.08008 15.0499" stroke="#292D32" strokeWidth="1" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        </div>
                      </div>

                    </button>
                  </div>
                ))}
            </div>
          }

      </div>

      <div className="fixed bottom-0 z-20 w-full flex-none flex flex-row items-center justify-center border-t-1 border-[#e1edf5] bg-white h-[55px]">
        <Link to="/main" className="flex flex-col items-center justify-start px-[60px] hover:cursor-pointer active:bg-gray-300 transition-all duration-75" draggable="false">
          <svg width="35" height="35" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(10, 115, 130)">
              <rect x="80" y="80" width="90" height="140" rx="10" ry="10" fill="black"/>
            </g>
            <g transform="rotate(-10, 85, 100)">
              <rect x="30" y="30" width="90" height="140" rx="10" ry="10" fill="green"/>
            </g>
          </svg>
          <p className="text-[10px] font-semibold select-none">LEARNING</p>
        </Link>

        <Link to="/profile" className="flex flex-col items-center justify-start px-[60px] hover:cursor-pointer active:bg-gray-300 transition-all duration-75" draggable="false">
          <svg width="35" height="35" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-vneck" className="svg-inline--fa fa-user-vneck" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 -100 448 650">
            <circle className="text-gray-500" cx="120" cy="35" r="40" fill="white" stroke="currentColor" strokeWidth="40"/>
            <circle className="text-gray-500" cx="328" cy="35" r="40" fill="white" stroke="currentColor" strokeWidth="40"/>
      
            <path className="text-gray-500" fill="currentColor" d="M224 208a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm128-80A128 128 0 1 1 96 128a128 128 0 1 1 256 0zM48.3 464H399.7c-3.1-47.3-33.7-87.3-76-103.8L274 422.4c-25.6 32-74.3 32-100 0l-49.7-62.2C82 376.7 51.4 416.7 48.3 464zm85-156.4c5.6-1.2 11.3 1.1 14.9 5.6l63.4 79.2c6.4 8 18.6 8 25 0l63.4-79.2c3.6-4.5 9.3-6.7 14.9-5.6C390.9 323.6 448 391.1 448 472v8c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32v-8c0-80.9 57.1-148.4 133.3-164.4z"></path>
          </svg>
          <p className="text-[10px] font-semibold select-none">ACCOUNT</p>
        </Link>
      </div>

      {/* Dim overlay */}

      <div 
        onClick={dimOverlayHandler}
        className={`fixed mt-[55px] h-[100vh] inset-0 bg-black opacity-0 z-25 transition-opacity ease-in-out duration-1000 ${paletteOpen || statOpen ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

    </div>
  )
}

export default MainPage
