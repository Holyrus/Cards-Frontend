import { Link } from "react-router-dom"

const Profile = ({handleLogout}) => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      
      <div className="w-full flex-none flex flex-row border-b-1 border-[#e1edf5] h-[55px]">
        
      </div>

      <div className="flex-1 w-full bg-[#f3fff2]">
        <button className="font-medium border-2 rounded-full bg-red-500 px-3 py-1 hover:bg-red-800 hover:text-white hover:border-black" onClick={handleLogout}>Logout</button>
      </div>

      <div to className="w-full flex-none flex flex-row items-center justify-center border-t-1 border-[#e1edf5] h-[55px]">
        <Link to="/main" className="flex flex-col items-center justify-start px-[60px] hover:cursor-pointer active:bg-gray-300 transition-all duration-75">
          <svg width="35" height="35" viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(10, 115, 130)">
              <rect className="text-gray-500" x="80" y="80" width="90" height="140" rx="10" ry="10" fill="none" stroke="currentColor" stroke-width="10"/>
            </g>
            <g transform="rotate(-10, 85, 100)">
              <rect className="text-gray-500" x="30" y="30" width="90" height="140" rx="10" ry="10" fill="white" stroke="currentColor" stroke-width="10"/>
            </g>
          </svg>
          <p className="text-[10px] font-semibold select-none">LEARNING</p>
        </Link>

        <Link to="/profile" className="flex flex-col items-center justify-start px-[60px] hover:cursor-pointer active:bg-gray-300 transition-all duration-75">
          <svg width="35" height="35" aria-hidden="true" focusable="false" data-prefix="far" data-icon="user-vneck" class="svg-inline--fa fa-user-vneck" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 -100 448 650">
            <circle className="text-gray-500" cx="120" cy="30" r="80" fill="currentColor"/>
            <circle className="text-gray-500" cx="328" cy="30" r="80" fill="currentColor"/>
      
            <path className="text-gray-500" fill="currentColor" d="M224 208a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm128-80A128 128 0 1 1 96 128a128 128 0 1 1 256 0zM48.3 464H399.7c-3.1-47.3-33.7-87.3-76-103.8L274 422.4c-25.6 32-74.3 32-100 0l-49.7-62.2C82 376.7 51.4 416.7 48.3 464zm85-156.4c5.6-1.2 11.3 1.1 14.9 5.6l63.4 79.2c6.4 8 18.6 8 25 0l63.4-79.2c3.6-4.5 9.3-6.7 14.9-5.6C390.9 323.6 448 391.1 448 472v8c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32v-8c0-80.9 57.1-148.4 133.3-164.4z"></path>
          </svg>
          <p className="text-[10px] font-semibold select-none">ACCOUNT</p>
        </Link>
      </div>

    </div>
  )
}

export default Profile
