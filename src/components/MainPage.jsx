import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import ThreeDModel from "./Model.jsx"

const MainPage = ({ decks }) => {

  const [isOpen, setIsOpen] = useState(false);

  const [paletteOpen, setPaletteOpen] = useState(false)
  const [statOpen, setStatOpen] = useState(false)

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

  return (
    <div className="min-h-screen flex flex-col items-center relative">
      
      <div onClick={divClickHandler} className="z-50 relative w-full flex-none flex flex-row gap-12 sm:gap-40 md:gap-60 lg:gap-72 items-center justify-center border-b-1 border-[#e1edf5] bg-white h-[55px]">

        <button onClick={paletteClickHandler} className="cursor-pointer w-[40px] rounded-full hover:bg-gray-200 p-2">
          <svg className="text-[#aaaaaa]" fill="currentColor" aria-hidden="true" focusable="false" data-prefix="far" data-icon="palette" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 258.2c0 2.7-1 5.2-4.2 8c-3.8 3.1-10.1 5.8-17.8 5.8H344c-53 0-96 43-96 96c0 6.8 .7 13.4 2.1 19.8c3.3 15.7 10.2 31.1 14.4 40.6l0 0c.7 1.6 1.4 3 1.9 4.3c5 11.5 5.6 15.4 5.6 17.1c0 5.3-1.9 9.5-3.8 11.8c-.9 1.1-1.6 1.6-2 1.8c-.3 .2-.8 .3-1.6 .4c-2.9 .1-5.7 .2-8.6 .2C141.1 464 48 370.9 48 256S141.1 48 256 48s208 93.1 208 208c0 .7 0 1.4 0 2.2zm48 .5c0-.9 0-1.8 0-2.7C512 114.6 397.4 0 256 0S0 114.6 0 256S114.6 512 256 512c3.5 0 7.1-.1 10.6-.2c31.8-1.3 53.4-30.1 53.4-62c0-14.5-6.1-28.3-12.1-42c-4.3-9.8-8.7-19.7-10.8-29.9c-.7-3.2-1-6.5-1-9.9c0-26.5 21.5-48 48-48h97.9c36.5 0 69.7-24.8 70.1-61.3zM160 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-64a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm128-64a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm64 64a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"></path></svg>
        </button>

        <div className='hover-trigger hover:text-[#707073ff] flex items-center justify-center w-[135px] cursor-pointer h-full' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <p className="mr-0.5">English</p> 
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
                  <div key={index} className="h-[50px] w-full bg-[#ebf7fc] hover:bg-[#e3f4fc] flex flex-row justify-center gap-3 items-center cursor-pointer px-1">
                    
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
        <ThreeDModel />
        <button className='rounded-full text-white border-1 border-green-700 font-semibold py-2 px-5 w-[290px] sm:w-[400px] md:w-[450px] md:py-3 shadow-md hover:shadow-lg bg-green-700 hover:bg-green-100 hover:text-green-700 transition-all duration-300'>START</button>
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
        className={`fixed mt-[55px] h-[100vh] inset-0 bg-black opacity-0 z-25 transition-opacity ease-in-out duration-1000 ${paletteOpen || statOpen ? "opacity-35 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      ></div>

    </div>
  )
}

export default MainPage
