import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from 'react'
import { useErrorNotificationDispatch } from './ErrorNotificationContext'
import { useNotificationDispatch } from "./NoificationContext"
import { useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import Panda from '../assets/panda2.png'
import cardsService from '../services/cards'
import decksService from '../services/decks'
import { DateTime } from 'luxon'

const Learn = () => {

  const [sound, setSound] = useState(true)

  const location = useLocation()
  const currentDeck = location.state?.currentDeck

  // console.log(currentDeck.cards)

  const [toLearnCards, setToLearnCards] = useState([])

  const queryClient = useQueryClient()

  useEffect(() => {
    setToLearnCards(currentDeck?.cards?.filter(card => card.toLearn === true))
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [suggestion, setSuggestion] = useState(false)
  const [suggestionClicked, setSuggestionClicked] = useState(false)

  const [gotItSuggestion, setGotItSuggestion] = useState(false)
  const [studyAgainSuggestion, setStudyAgainSuggestion] = useState(false)

  const [isWordRevealed, setIsWordRevealed] = useState(false)

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true)
    if (isFlipped === false && sound === true) {
      speak(currentCard.word)
    }
  }

  const handleBackClick = () => {
    if (!suggestionClicked) {
      setSuggestion(true)
    setSuggestionClicked(true)
    }
  }

  const [showNextCard, setShowNextCard] = useState(false)

  const currentCard = toLearnCards[currentIndex]
  const nextCard = toLearnCards[currentIndex + 1]

  useEffect(() => {
    if (currentCard) {
      const timer = setTimeout(() => {
        setShowNextCard(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setShowNextCard(false)
    }
  }, [currentCard])

  // console.log(toLearnCards)
  // console.log(currentCard)

  // Rotation of card on drag

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])

  const handleStudyAgainSwipe = () => {
    setIsFlipped(false)
    setSuggestionClicked(false)
    setToLearnCards(prevCards => {
      const newCards = [...prevCards]
      const [currentCard] = newCards.splice(currentIndex, 1)
      return [...newCards, currentCard]
    })
    setCurrentIndex((prev) => prev)
  }

  // Change the cards state
  
  const updateCardMutation = useMutation({
    mutationFn: (updatedCard) => cardsService.update(updatedCard.id, updatedCard),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['cards'] })
      queryClient.invalidateQueries({queryKey: ['decks'] })
      setIsFlipped(false)
      setSuggestionClicked(false)
      setCurrentIndex(prev => prev + 1)
    },
    onError: (error) => {
      console.error('Failed to update card:', error)
    }
  })

  const handleGotItSwipe = () => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const now = DateTime.now().setZone(userTimezone)
    let nextReview = null

    switch(currentCard.gotIt) {
      case 0:
        nextReview = now.plus({ minutes: 15 })
        break
      case 1:
        nextReview = now.plus({ minutes: 30 })
        break
      case 2:
        nextReview = now.plus({ days: 1 })
        break
      case 3:
        nextReview = now.plus({ minutes: 30 })
        break
      case 4:
        nextReview = now.plus({ days: 1 })
        break
      case 5:
        nextReview = now.plus({ weeks: 1 })
        break
      case 6:
        nextReview = now.plus({ weeks: 1 })
        break
      default:
          if (currentCard.gotIt >= 7) {
            nextReview = now.plus({ months: 1 })
          }
    }

    if (currentCard.gotIt >= 0 && currentCard.gotIt <= 6) {
      const updatedCard = {
        ...currentCard,
        toLearn: false,
        known: true,
        learned: false,
        gotIt: (currentCard.gotIt || 0) + 1,
        flipped: !currentCard.flipped,
        nextReviewDate: nextReview.toISO(),
      }
      updateCardMutation.mutate({...updatedCard, id: currentCard.id})
    } else if (currentCard.gotIt >= 7) {
      const updatedCard = {
        ...currentCard,
        toLearn: false,
        known: false,
        learned: true,
        gotIt: (currentCard.gotIt || 0) + 1,
        flipped: !currentCard.flipped,
        nextReviewDate: nextReview.toISO(),
      }
      updateCardMutation.mutate({...updatedCard, id: currentCard.id})
    }
  }

  // Speaking handlers

  const [voices, setVoices] = useState([])
  
  const [currentVoices, setCurrentVoices] = useState([])
  
  const [chosenVoice, setChosenVoice] = useState('')

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
    
      const filteredChosenVoice = filteredVoices.find((v) => v.name.includes(currentDeck.voice))
      setChosenVoice(filteredChosenVoice)
    }, [voices, currentDeck.learnLang, currentDeck.voice])

  const speak = (word) => {

    if (!voices.length) return

    speechSynthesis.cancel()

    const selectedVoice = chosenVoice;

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.voice = selectedVoice
    utterance.volume = 0.3  // Set volume
    utterance.rate = 1    // Optional: control speech rate (0.1 to 10)
    utterance.pitch = 1   // Optional: control pitch (0 to 2)

    speechSynthesis.speak(utterance)
  }

  // Voices change handlers

  const [voicesWindowOpen, setVoicesWindowOpen] = useState(false)

  const handleVoicesEnter = () => {
    setVoicesWindowOpen(true)
  }

  const handleVoicesLeave = () => {
    setVoicesWindowOpen(false)
  }

  const handleVoiceChange = (voice) => {
    const newObject = {
      ...currentDeck,
      voice: voice.name
    }
    updateDeckMutation.mutate({...newObject, id: currentDeck.id})
    setChosenVoice(voice)
  }

  const updateDeckMutation = useMutation({
      mutationFn: (updatedDeck) => decksService.update(updatedDeck.id, updatedDeck),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['decks'] })
      }
    })

  const trySpeak = (voice) => {
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(currentDeck.learnLang)
    utterance.voice = voice
    utterance.volume = 0.3
    utterance.rate = 1
    utterance.pitch = 1

    speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <div className="fixed w-full flex-none flex flex-row items-center pr-4 justify-center h-[55px] z-20">
        <Link to="/main">
          <svg className="w-[47px] rounded-full hover:bg-[#edeeee] text-white p-2 drop-shadow filter shadow-black" stroke="#929599" strokeWidth='0.5px' fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowLeftRoundedIcon"><path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path></svg>
        </Link>
        <h1 className="w-[260px] sm:w-[410px] text-center"></h1>
        <div className="relative w-[40px] h-[30px]">
          <img className="absolute bottom-1 left-2 ml-2 w-[20px]" src={`https://flagcdn.com/80x60/${currentDeck.secondFlag}.webp` || null} alt="Second flag" draggable="false" />
          <img className="absolute bottom-3 right-4 ml-2 w-[20px]" src={`https://flagcdn.com/80x60/${currentDeck.firstFlag}.webp` || null} alt="First flag" draggable="false" />
        </div>
      </div>

      <div className="relative overflow-hidden flex-1 flex py-[55px] flex-col items-center justify-center w-full bg-[#f3fff2]">
          {nextCard && currentCard && (
              <div className="absolute rotate-5 w-[280px] sm:w-[480px] h-[360px] rounded-xl border border-[#e8e8e8] shadow bg-white z-10">
              </div>
          )}
          {nextCard && currentCard && (
              <div className="absolute rotate-355 w-[280px] sm:w-[480px] h-[360px] rounded-xl border border-[#e8e8e8] shadow bg-white z-10">
              </div>
          )}
        <AnimatePresence>
          {showNextCard && nextCard && (
            <motion.div
              key={nextCard.id}
              className="w-[280px] sm:w-[480px] h-[360px] rounded-xl border border-[#e8e8e8] shadow bg-white z-15"
              initial={{ opacity: 100, scale: 0.9 }}
              animate={{ opacity: 100, scale: 0.95 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {nextCard.flipped === true ? (
                <>
                  <div className={`absolute w-full h-full rounded-xl backface-hidden flex flex-col gap-3.5 items-center justify-center transition-transform duration-500`}>
                    <div className="flex flex-row items-center justify-center gap-1 border-b-1 border-[#e2edf5] pb-3">
                      <button
                        className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                      >
                        <svg className="w-[20px] h-[20px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                      </button>
                      <div className={`relative w-full h-[33px] transition-all duration-300 ${isWordRevealed ? 'bg-transparent' : 'bg-gradient-to-br from-white to-gray-300 rounded-lg cursor-pointer'}`} >
                        <svg className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[33px] h-[33px] ${isWordRevealed ? 'opacity-0' : 'opacity-100'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#aeaeae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#aeaeae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className={`text-[22px] select-none ${isWordRevealed ? 'text-black' : 'text-transparent'}`}>{nextCard.word}</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#858585] text-center w-[200px] select-none">{nextCard.usage}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className={`absolute w-full h-full rounded-xl flex flex-col items-center justify-center transition-transform duration-500`}>
                    <img className="w-[120px] select-none pointer-events-none user-select-none" src={`http://localhost:3003/api/images/files/${nextCard.img}`} alt={nextCard.word} draggable="false" />
                    <p className="text-[22px] mt-[12px] select-none">{nextCard.translation}</p>
                  </div>
                </>
              )}
            </motion.div>
          )}
          {currentCard && (
            <motion.div
              key={currentCard.id}
              className="absolute flex flex-col items-center justify-center w-[280px] sm:w-[480px] h-[360px] rounded-xl shadow-lg border border-[#e8e8e8] bg-white z-20"
              onClick={handleFlip}
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              drag={isFlipped ? true : false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              whileDrag={{ scale: 1.05 }}
              onDragStart={(event, info) => {
                setSuggestion(false)
              }}
              onDrag={(event, info) => {
                const offsetX = info.offset.x
              
                if (offsetX > 50) {
                  setGotItSuggestion(true)
                  setStudyAgainSuggestion(false)
                } else if (offsetX < -50) {
                  setGotItSuggestion(false)
                  setStudyAgainSuggestion(true)
                } else {
                  setGotItSuggestion(false)
                  setStudyAgainSuggestion(false)
                }
              }}
              onDragEnd={(event, info) => {
                if (info.offset.x > 100) {
                  setGotItSuggestion(false)
                  setStudyAgainSuggestion(false)
                  handleGotItSwipe()
                  setSuggestion(false)
                  setIsWordRevealed(false)
                } else if (info.offset.x < -100) {
                  setGotItSuggestion(false)
                  setStudyAgainSuggestion(false)
                  handleStudyAgainSwipe()
                  setSuggestion(false)
                  setIsWordRevealed(false)
                } else {
                  setGotItSuggestion(false)
                  setStudyAgainSuggestion(false)
                  setIsWordRevealed(false)
                }
              }}
            whileTap={{ scale: 0.98 }}
            animate={{ opacity: 1, y: 0, x:0, rotate: 0 }}
            transition={{ duration: 0.3 }}
            // style={{ x, rotate}}
            >
              {currentCard.flipped === true ? (
                <>
                  <div className={`absolute w-full h-full rounded-xl backface-hidden flex flex-col gap-3.5 items-center justify-center transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
                    <div className="flex flex-row items-center justify-center gap-1 border-b-1 border-[#e2edf5] pb-3">
                      <button
                        onClick={(e) => {
                        e.stopPropagation(),
                        speak(currentCard.word)
                        }}
                        className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                        >
                        <svg className="w-[20px] h-[20px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                      </button>
                      <div className={`relative w-full h-[33px] transition-all duration-300 ${isWordRevealed ? 'bg-transparent' : 'bg-gradient-to-br from-white to-gray-300 rounded-lg cursor-pointer'}`} 
                        onClick={(e) => {
                        e.stopPropagation(), 
                        setIsWordRevealed(true)}}>
                        <svg className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[33px] h-[33px] ${isWordRevealed ? 'opacity-0' : 'opacity-100'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#aeaeae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#aeaeae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className={`text-[22px] select-none ${isWordRevealed ? 'text-black' : 'text-transparent'}`}>{currentCard.word}</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#858585] text-center w-[200px] select-none">{currentCard.usage}</p>
                  </div>

                  <div onClick={handleBackClick} className={`absolute w-full h-full bg-white rounded-xl flex flex-col items-center justify-center text-xl font-semibold transition-transform duration-500 transform ${isFlipped ? '' : 'rotate-y-180'} backface-hidden`}>
                  <div className={`absolute top-5 left-3 border-3 rotate-340 border-[#009900] rounded-xl px-[10px] py-[5px] transition-all duration-300 ${gotItSuggestion ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-[18px] text-[#009900] font-bold">Got it</p>
                  </div>

                  <div className={`absolute top-7 right-3 border-3 rotate-20 border-[#DD4444] rounded-xl px-[10px] py-[5px] transition-all duration-300 ${studyAgainSuggestion ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-[18px] text-[#DD4444] font-bold">Study again</p>
                  </div>

                  {suggestion && (
                    <div className="absolute top-3 flex flex-row gap-0 sm:gap-40 justify-center items-center">
                      <div className="flex flex-col items-center justify-center gap-1 w-[120px]">
                        <svg className="w-[25px] h-[25px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" transform="rotate(270)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#e77c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className="text-[#e77c7c] text-[14px] text-center">If you didn't know <b>swipe left</b></p>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 w-[120px]">
                        <svg className="w-[25px] h-[25px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#4cb74c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className="text-[#4cb74c] text-[14px] text-center">If you were right <b>swipe right</b></p>
                      </div>
                    </div>
                  )}
                  <img className="w-[120px] select-none pointer-events-none user-select-none" src={`http://localhost:3003/api/images/files/${currentCard.img}`} alt={currentCard.word} draggable="false" />
                  <div className="flex flex-row items-center justify-center gap-1 mt-4">
                      <button 
                        onClick={(e) => {
                        e.stopPropagation(),
                        speak(currentCard.word)
                        }}
                        className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                        >
                        <svg className="w-[20px] h-[20px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                      </button>
                    <p className="text-[16px] text-[#707070] select-none">{currentCard.word}</p>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-1 mt-3 border-b-1 border-[#e2edf5] pb-4">
                    <p className="text-[20px] select-none">{currentCard.translation}</p>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-1 mt-4">
                      <button 
                        onClick={(e) => {
                        e.stopPropagation(),
                        speak(currentCard.usage)
                        }}
                        className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                        >
                        <svg className="w-[20px] h-[20px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                      </button>
                    <p className="text-[13px] text-[#858585] text-start max-w-[200px] select-none">{currentCard.usage}</p>
                  </div>
                  <Link to={`/card/${currentCard.id}`}
                      onClick={(e) => {
                      e.stopPropagation()
                      }}
                      className="hover:bg-gray-100 p-1.5 mt-4 rounded-full cursor-pointer"
                      >
                    <svg className="w-[18px] h-[18px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>
                  </Link>
                  </div>
                </>
              ) : (
              <>
              <div className={`absolute w-full h-full rounded-xl backface-hidden flex flex-col items-center justify-center transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
                  <img className="w-[120px] select-none pointer-events-none user-select-none" src={`http://localhost:3003/api/images/files/${currentCard.img}`} alt={currentCard.word} draggable="false" />
                  <p className="text-[22px] mt-[12px] select-none">{currentCard.translation}</p>
              </div>
              <div onClick={handleBackClick} className={`absolute w-full h-full bg-white rounded-xl flex flex-col items-center justify-center text-xl font-semibold transition-transform duration-500 transform ${isFlipped ? '' : 'rotate-y-180'} backface-hidden`}>
                    <div className={`absolute top-5 left-3 border-3 rotate-340 border-[#009900] rounded-xl px-[10px] py-[5px] transition-all duration-300 ${gotItSuggestion ? 'opacity-100' : 'opacity-0'}`}>
                      <p className="text-[18px] text-[#009900] font-bold">Got it</p>
                    </div>

                    <div className={`absolute top-7 right-3 border-3 rotate-20 border-[#DD4444] rounded-xl px-[10px] py-[5px] transition-all duration-300 ${studyAgainSuggestion ? 'opacity-100' : 'opacity-0'}`}>
                      <p className="text-[18px] text-[#DD4444] font-bold">Study again</p>
                    </div>

                  {suggestion && (
                    <div className="absolute top-3 flex flex-row gap-0 sm:gap-40 justify-center items-center">
                      <div className="flex flex-col items-center justify-center gap-1 w-[120px]">
                        <svg className="w-[25px] h-[25px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" transform="rotate(270)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#e77c7c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className="text-[#e77c7c] text-[14px] text-center">If you didn't know <b>swipe left</b></p>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1 w-[120px]">
                        <svg className="w-[25px] h-[25px]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="#4cb74c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className="text-[#4cb74c] text-[14px] text-center">If you were right <b>swipe right</b></p>
                      </div>
                    </div>
                  )}
                  <img className="w-[120px] select-none pointer-events-none user-select-none" src={`http://localhost:3003/api/images/files/${currentCard.img}`} alt={currentCard.word} draggable="false" />
                  <p className="text-[16px] mt-[12px] text-[#707070] select-none">{currentCard.translation}</p>
                  <div className="flex flex-row items-center justify-center gap-1 mt-3 border-b-1 border-[#e2edf5] pb-4">
                    <button 
                      onClick={(e) => {
                      e.stopPropagation(),
                      speak(currentCard.word)
                      }}
                      className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                      >
                      <svg className="w-[20px] h-[20px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                    </button>
                    <p className="text-[20px] pb-1 select-none">{currentCard.word}</p>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-1 mt-4">
                      <button 
                        onClick={(e) => {
                        e.stopPropagation(),
                        speak(currentCard.usage)
                        }}
                        className="hover:bg-gray-100 p-1 rounded-full cursor-pointer"
                        >
                        <svg className="w-[20px] h-[20px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                      </button>
                    <p className="text-[13px] text-[#858585] text-start max-w-[200px] select-none">{currentCard.usage}</p>
                  </div>
                  <Link to={`/card/${currentCard.id}`}
                      onClick={(e) => {
                      e.stopPropagation()
                      }}
                      className="hover:bg-gray-100 p-1.5 mt-4 rounded-full cursor-pointer"
                      >
                    <svg className="w-[18px] h-[18px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="pen-to-square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"></path></svg>
                  </Link>
              </div>
              </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {!currentCard && (
          <div className="flex flex-col items-center justify-center gap-10 w-full h-full">
            <div className="flex flex-col items-center justify-center">
              <div className="pointer-events-none rounded-2xl w-[200px] h-[40px] bg-[#ffffffa4] border-1 border-[#dedede] flex items-center justify-center">
                <p className="px-1 py-0.5 text-[13px] text-center text-[#2f2f2f]">Time to discover new words</p>
              </div>
              <img className="w-[60px] mt-2" src={Panda} alt="Panda image" draggable="false" />
            </div>
            <Link className="flex flex-row justify-center items-center rounded-full hover:bg-[#edeeee] p-2 drop-shadow filter shadow-black" to="/main">
              <svg className="w-[25px] text-black" stroke="#929599" strokeWidth='0.5px' fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowLeftRoundedIcon"><path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path></svg>
              <p className="text-[14px] font-bold pb-0.5">GO TO MAIN MENU</p>
            </Link>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 z-20 w-full flex-none flex flex-row items-center justify-center gap-45 sm:gap-100 h-[55px]">

        <div className="relative flex flex-row items-center justify-center gap-2">
          <div onClick={() => handleVoicesEnter()} className="p-1.5 bg-white rounded-full border-1 border-[#e9e9e8] hover:bg-gray-100">
            <svg className="text-black w-[21px] h-[20px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RecordVoiceOverIcon"><circle cx="9" cy="9" r="4"></circle><path d="M9 15c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4m7.76-9.64-1.68 1.69c.84 1.18.84 2.71 0 3.89l1.68 1.69c2.02-2.02 2.02-5.07 0-7.27M20.07 2l-1.63 1.63c2.77 3.02 2.77 7.56 0 10.74L20.07 16c3.9-3.89 3.91-9.95 0-14"></path></svg>
            
            <div className={`bg-white w-auto px-2 py-2 h-[180px] overflow-y-scroll overflow-x-hidden flex flex-col rounded-lg shadow-[0px_-4px_4px_rgba(0,0,0,0.02),0px_4px_4px_rgba(0,0,0,0.02),-4px_0px_4px_rgba(0,0,0,0.02),4px_0px_4px_rgba(0,0,0,0.02)] bottom-0 right-[-145px] transition-all duration-200 ${ voicesWindowOpen ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}`} onMouseEnter={() => handleVoicesEnter} onMouseLeave={handleVoicesLeave}>
                {currentVoices
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
                        
                        <button onClick={() => trySpeak(voice)} className="hover:bg-gray-100 p-1 rounded-full cursor-pointer">
                          <svg className="w-[15px] text-green-600" aria-hidden="true" focusable="false" data-prefix="far" data-icon="volume" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M191.9 201.9L304 102.3V409.7L191.9 310.1c-4.4-3.9-10.1-6.1-15.9-6.1H88c-4.4 0-8-3.6-8-8V216c0-4.4 3.6-8 8-8h88c5.9 0 11.6-2.2 15.9-6.1zM322.2 32c-7.3 0-14.3 2.7-19.8 7.5L166.9 160H88c-30.9 0-56 25.1-56 56v80c0 30.9 25.1 56 56 56h78.9L302.4 472.5c5.5 4.8 12.5 7.5 19.8 7.5c16.5 0 29.8-13.3 29.8-29.8V61.8C352 45.3 338.7 32 322.2 32zm182.9 75c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C507.3 170.7 528 210.9 528 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C425.1 227.6 432 241 432 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C466.1 312.9 480 286.1 480 256s-13.9-56.9-35.4-74.5z"></path></svg>
                        </button>
                        <span className="select-none">{voiceName}</span>
                      </label>
                    )
                  })}
            </div>
          </div>

          <button onClick={() => setSound(!sound)} className="p-1.5 bg-white rounded-full border-1 border-[#e9e9e8] hover:bg-gray-100">
            {sound ? (
              <svg className="text-black w-[21px] h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g> <path fillRule="evenodd" clipRule="evenodd" d="M10.4 1.8C11.5532 0.262376 14 1.07799 14 3.00001V21.1214C14 23.0539 11.5313 23.8627 10.3878 22.3049L6.49356 17H4C2.34315 17 1 15.6569 1 14V10C1 8.34315 2.34315 7 4 7H6.5L10.4 1.8ZM12 3L8.1 8.2C7.72229 8.70361 7.12951 9 6.5 9H4C3.44772 9 3 9.44772 3 10V14C3 14.5523 3.44772 15 4 15H6.49356C7.13031 15 7.72901 15.3032 8.10581 15.8165L12 21.1214V3Z" fill="#0F0F0F"></path> <path d="M16.2137 4.17445C16.1094 3.56451 16.5773 3 17.1961 3C17.6635 3 18.0648 3.328 18.1464 3.78824C18.4242 5.35347 19 8.96465 19 12C19 15.0353 18.4242 18.6465 18.1464 20.2118C18.0648 20.672 17.6635 21 17.1961 21C16.5773 21 16.1094 20.4355 16.2137 19.8256C16.5074 18.1073 17 14.8074 17 12C17 9.19264 16.5074 5.8927 16.2137 4.17445Z" fill="#0F0F0F"></path> <path d="M21.41 5C20.7346 5 20.2402 5.69397 20.3966 6.35098C20.6758 7.52413 21 9.4379 21 12C21 14.5621 20.6758 16.4759 20.3966 17.649C20.2402 18.306 20.7346 19 21.41 19C21.7716 19 22.0974 18.7944 22.2101 18.4509C22.5034 17.5569 23 15.5233 23 12C23 8.47672 22.5034 6.44306 22.2101 5.54913C22.0974 5.20556 21.7716 5 21.41 5Z" fill="#0F0F0F"></path> </g></svg>
            ) : (
              <svg className="text-black w-[21px] h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M14 3.00001C14 1.07799 11.5532 0.262376 10.4 1.8L6.5 7H4C2.34315 7 1 8.34315 1 10V14C1 15.6569 2.34315 17 4 17H6.49356L10.3878 22.3049C11.5313 23.8627 14 23.0539 14 21.1214V3.00001ZM8.1 8.2L12 3V21.1214L8.10581 15.8165C7.72901 15.3032 7.13031 15 6.49356 15H4C3.44772 15 3 14.5523 3 14V10C3 9.44772 3.44772 9 4 9H6.5C7.12951 9 7.72229 8.70361 8.1 8.2Z" fill="#0F0F0F"></path> <path d="M21.2929 8.57094C21.6834 8.18041 22.3166 8.18042 22.7071 8.57094C23.0976 8.96146 23.0976 9.59463 22.7071 9.98515L20.7603 11.9319L22.7071 13.8787C23.0976 14.2692 23.0976 14.9024 22.7071 15.2929C22.3166 15.6834 21.6834 15.6834 21.2929 15.2929L19.3461 13.3461L17.3994 15.2929C17.0088 15.6834 16.3757 15.6834 15.9852 15.2929C15.5946 14.9023 15.5946 14.2692 15.9852 13.8787L17.9319 11.9319L15.9852 9.98517C15.5946 9.59464 15.5946 8.96148 15.9852 8.57096C16.3757 8.18043 17.0088 8.18043 17.3994 8.57096L19.3461 10.5177L21.2929 8.57094Z" fill="#0F0F0F"></path> </g></svg>
            )}

          </button>
        </div>

        <Link to="/main/newcard"
              state={{ currentDeck }}>
          <button className="p-1.5 bg-white rounded-full border-1 border-[#e9e9e8] hover:bg-gray-100">
            <svg className="w-[21px] h-[20px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </button>
        </Link>

      </div>
    </div>
  )
}

export default Learn
