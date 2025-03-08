import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from 'react'

const CreateNewDeck = () => {

  const [isLearnSearchOpen, setIsLearnSearchOpen] = useState(false)
  const [isNatSearchOpen, setIsNatSearchOpen] = useState(false)

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

  return (
    <div className="min-h-screen flex flex-col items-center">
      
      <div className="w-full flex-none flex flex-row items-center justify-center border-b-1 border-[#e1edf5] h-[55px]">
        <Link to="/main"><svg className="w-[40px] rounded-full hover:bg-[#edeeee] text-black p-2" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowLeftRoundedIcon"><path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path></svg></Link>
        <h1 className="w-[260px] sm:w-[410px] text-center">Create new deck</h1>
        <div className="w-[40px]"></div>
      </div>

      <div className="flex-1 flex mb-[55px] py-[45px] flex-col items-center justify-start w-full bg-[#f3fff2]">
        
        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px]">
          <h1 className="font-semibold text-[17px]">Language you want to learn</h1>
          <button onClick={searchLearnClickHandler} className="mt-3 w-[290px] sm:w-full rounded-full border-1 border-green-700 bg-white py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default">

            <p>Finnish</p>

            <svg className="w-[24px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>

          </button>
        </div>

        <div className="flex flex-col items-center sm:items-start justify-start w-[320px] sm:w-[450px] mt-10">
          <h1 className="font-semibold text-[17px]">Your native Language</h1>
          <button onClick={searchNatClickHandler} className="mt-3 w-[290px] sm:w-full rounded-full border-1 border-green-700 bg-white py-4 pl-7 pr-5 flex flex-row items-center justify-between cursor-default">

            <p>Finnish</p>

            <svg className="w-[24px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>

          </button>
        </div>

        <button className='mt-9 rounded-full text-white border-1 border-green-700 font-semibold py-2 px-5 w-[290px] sm:w-[450px] sm:py-3 shadow-md hover:shadow-lg bg-green-700 hover:bg-green-100 hover:text-green-700 transition-all duration-300'>SAVE</button>
        
      </div>

      <div className="fixed bottom-0 w-full flex-none flex flex-row items-center justify-center border-t-1 border-[#e1edf5] bg-white h-[55px]">
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
        className={`fixed h-[100vh] inset-0 bg-black opacity-0 z-[15] transition-opacity ease-in-out duration-1000 ${isLearnSearchOpen || isNatSearchOpen ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

      {/* Learn modal menu */}

      <div className={`z-[20] absolute flex flex-col justify-start items-start bg-white w-[600px] h-[500px] my-4 opacity-0 ${isLearnSearchOpen ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}`}>

        <div className="flex flex-row row-span-4 px-3 items-center justify-between h-[50px] w-full border-b-1 border-[#e2edf5]">
          <svg className="text-[#757575] w-[24px]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SearchIcon"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"></path></svg>
        </div>

        <div className="flex flex-col">

          <div className="flex flex-col border-b-1 border-[#e2edf5]">
            
          </div>

          <div className="flex flex-col">

          </div>

        </div>

      </div>

    </div>
  )
}

export default CreateNewDeck
