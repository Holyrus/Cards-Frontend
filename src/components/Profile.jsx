import { Link } from "react-router-dom"
import Panda from '../assets/panda2.png'
import { useTheme } from "./ThemeProvider"

const Profile = ({handleLogout, user, handleAccountDeleting}) => {
  
  const { theme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col items-center">

      {/* <button className="font-medium border-2 rounded-full bg-red-500 px-3 py-1 hover:bg-red-800 hover:text-white hover:border-black" onClick={handleLogout}>Logout</button> */}

      <div className={`flex-1 flex flex-col items-center w-full bg-[#f3fff2]`}>

        <div className="h-[43px] w-full bg-transparent">

        </div>

        <div className="flex flex-col items-center justify-center h-[150px] w-[300px] sm:w-[540px] bg-white">
          <img src={Panda} alt="Panda" className="w-[60px]" />
          <h1 className="font-bold">{user.name}</h1>
          <h2 className="">{user.username}</h2>
        </div>

        <div className="flex flex-col items-start justify-start w-[300px] sm:w-[540px] bg-white mt-8">
          <button className="text-[17px] pl-4 gap-2 border-b-1 border-gray-200 h-[65px] w-full cursor-pointer flex flex-row justify-start items-center" onClick={handleLogout}>
            <svg className="w-[25px]" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MeetingRoomIcon"><path d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6zm-4 5v2h2v-2z"></path></svg>
            Logout
          </button>
        </div>

        <div className="flex flex-col items-start justify-start w-[300px] sm:w-[540px] bg-white mt-8">
          <button className="text-[#AAAAAA] text-[17px] pl-4 gap-2 border-b-1 border-gray-200 h-[65px] w-full cursor-pointer flex flex-row justify-start items-center" onClick={handleAccountDeleting}>
            <svg className="w-[25px] text-[#AAAAAA]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteForeverOutlinedIcon"><path d="M14.12 10.47 12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8z"></path></svg>
            Delete account
          </button>
        </div>

      </div>

      <div className="fixed bottom-0 w-full flex-none flex flex-row items-center justify-center border-t-1 border-[#e1edf5] bg-white h-[55px]">
        <Link to="/main" className="flex flex-col items-center justify-start px-[60px] hover:cursor-pointer active:bg-gray-300 transition-all duration-75" draggable="false">
          <svg width="35" height="35" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(10, 115, 130)">
              <rect className="text-gray-500" x="80" y="80" width="90" height="140" rx="10" ry="10" fill="white" stroke="currentColor" strokeWidth="10"/>
            </g>
            <g transform="rotate(-10, 85, 100)">
              <rect className="text-gray-500" x="30" y="30" width="90" height="140" rx="10" ry="10" fill="white" stroke="currentColor" strokeWidth="10"/>
            </g>
          </svg>
          <p className="text-[10px] font-semibold select-none">LEARNING</p>
        </Link>

        <Link to="/profile" className="flex flex-col items-center justify-start px-[60px] hover:cursor-pointer active:bg-gray-300 transition-all duration-75" draggable="false">
          <svg width="35" height="35" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-vneck" className="svg-inline--fa fa-user-vneck" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 -100 448 650">
            <circle className="text-black" cx="120" cy="35" r="40" fill="white" stroke="currentColor" strokeWidth="40"/>
            <circle className="text-black" cx="328" cy="35" r="40" fill="white" stroke="currentColor" strokeWidth="40"/>
      
            <path className="text-green-600" fill="currentColor" d="M224 208a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm128-80A128 128 0 1 1 96 128a128 128 0 1 1 256 0zM48.3 464H399.7c-3.1-47.3-33.7-87.3-76-103.8L274 422.4c-25.6 32-74.3 32-100 0l-49.7-62.2C82 376.7 51.4 416.7 48.3 464zm85-156.4c5.6-1.2 11.3 1.1 14.9 5.6l63.4 79.2c6.4 8 18.6 8 25 0l63.4-79.2c3.6-4.5 9.3-6.7 14.9-5.6C390.9 323.6 448 391.1 448 472v8c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32v-8c0-80.9 57.1-148.4 133.3-164.4z"></path>
          </svg>
          <p className="text-[10px] font-semibold select-none">ACCOUNT</p>
        </Link>
      </div>

    </div>
  )
}

export default Profile
