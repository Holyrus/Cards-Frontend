import { Link } from "react-router-dom"
import { useState } from "react";
import ThreeDModel from "./Model.jsx"

const MainPage = ({decks}) => {

  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    displayDialog();
  }

  const handleMouseLeave = () => {
    removeDialog();
  }

  const displayDialog = () => {
    setIsOpen(true);
  }

  const removeDialog = () => {
    setIsOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      
      <div className="w-full flex-none flex flex-row items-center justify-center border-b-1 border-[#e1edf5] h-[55px]">

        <div className='hover-trigger hover:text-[#707073ff] flex items-center justify-center w-[135px] cursor-pointer h-full' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <p className="mr-0.5">English</p> 
          <svg className="text-[#707073ff]" width="16" height="12" viewBox="0 0 24 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <polygon points="6,8 18,8 12,16" />
          </svg>
        </div>

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

      <div className="flex-1 mb-[55px] flex flex-col items-center w-full bg-[#f3fff2]">
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

    </div>
  )
}

export default MainPage
