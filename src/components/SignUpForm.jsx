import { Link } from "react-router-dom"
import Panda from '../assets/panda4.png'
import { useState } from "react"
import { useTheme } from "./ThemeProvider.jsx";
import '../scrollbar.css';

const SignUpForm = ({handleSubmit, handleUsernameChange, handleNameChange, handlePasswordChange, username, name, password}) => {
  
  const [passwordWindow, setPasswordWindow] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const { theme } = useTheme()

  const handlePasswordEnter = () => {
    setPasswordWindow(true)
  }

  const handlePasswordLeave = () => {
    setPasswordWindow(false)
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between ${theme === 'Black' ? 'dark-scrollbar bg-[#0f1418]' : 'bg-white'}`}>
          <div className='w-[300px] sm:w-[500px] flex flex-row items-start'>
            <div>
              <Link to="/">
                <svg className={`w-[40px] p-2 rounded-full
                ${theme === 'Black' ? 'text-white hover:bg-[#141f25]' : 'hover:bg-[#edeeee] text-black'}`} fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowLeftRoundedIcon"><path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path></svg>
              </Link>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <img src={Panda} alt="Panda" className='w-[200px]' />
            <h1 className='text-[35px] font-bold bg-gradient-to-r from-green-700 to-yellow-300 text-transparent bg-clip-text'>UmCards</h1>
            <p className='mt-1 text-[11px] sm:text-[14px] text-[#ababab]'>Add words with Umka, learn everyday and never forget them</p>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col items-center sm:items-start mb-10 sm:mb-50'>
            <div className={`relative flex mt-4 rounded-t-sm w-[280px] sm:w-[300px]
            ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
              <input value={username} onChange={handleUsernameChange} id="signUpUsername" type="text" placeholder='' className={`z-10 peer w-full border-0 border-b-2 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4
              ${theme === 'Black' ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-900'}`} />
              <label htmlFor="signUpUsername" className='z-5 absolute left-2 text-gray-500 text-[12px] peer-placeholder-shown:bottom-3.5 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>Username</label>
            </div>

            <div className={`relative flex mt-4 rounded-t-sm w-[280px] sm:w-[300px]
              ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
              <input value={name} onChange={handleNameChange} id="signUpName" type="text" placeholder='' className={`z-10 peer w-full border-0 border-b-2 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4
                ${theme === 'Black' ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-900'}`} />
              <label htmlFor="signUpName" className='z-5 absolute left-2 text-gray-500 text-[12px] peer-placeholder-shown:bottom-3.5 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>Name</label>
            </div>

            <div onMouseEnter={handlePasswordEnter} onMouseLeave={handlePasswordLeave} className={`relative flex mt-4 rounded-t-sm w-[280px] sm:w-[300px] 
              ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
              <input value={password} onChange={handlePasswordChange} id="signUpPassword" type={showPassword ? 'text' : 'password'} placeholder='' className={`z-10 peer w-full border-0 border-b-2 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4
               ${theme === 'Black' ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-900'}`}/>
              <label htmlFor="signUpPassword" className='z-5 absolute left-2 text-gray-500 text-[12px] peer-placeholder-shown:bottom-3.5 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>Password</label>
              <button 
                type='button'
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPassword(!showPassword)}}
                className={`absolute z-10 right-2 top-1 w-10 h-10 flex flex-row justify-center cursor-pointer
                  ${theme === 'Black' ? 'bg-[#0d0d0d]' : 'bg-white'}`}
              >
                {showPassword ? (
                  <svg className='w-8' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke={`${theme === 'Black' ? '#ffffff' : '#000000'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke={`${theme === 'Black' ? '#ffffff' : '#000000'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                ) : (
                  <svg className='w-8' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke={`${theme === 'Black' ? '#ffffff' : '#000000'}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                )}
              </button>
            </div>

            <div className='relative flex flex-row justify-between w-[300px] my-4'>
              <Link className={`rounded-full text-green-700 font-semibold py-2 px-5 transition-all duration-300
              ${theme === 'Black' ? 'hover:bg-[#1b1c25]' : 'hover:bg-green-100'}`} to="/">PREVIOUS</Link>
              <button type="submit" className={`rounded-full border-1 border-green-700 font-semibold py-2 px-5 bg-green-700 transition-all duration-300
              ${theme === 'Black' ? 'text-black hover:bg-green-600' : 'text-white hover:bg-green-100 hover:text-green-700'}`}>NEXT</button>

              <div className={`text-[13px] justify-center items-center z-40 w-[160px] py-2 px-4 h-[120px] flex flex-col rounded-lg shadow-[0px_-4px_4px_rgba(0,0,0,0.02),0px_4px_4px_rgba(0,0,0,0.02),-4px_0px_4px_rgba(0,0,0,0.02),4px_0px_4px_rgba(0,0,0,0.02)] bottom-32 right-0 transition-all duration-200 ${passwordWindow ? 'absolute opacity-100' : 'absolute opacity-0 pointer-events-none'}
              ${theme === 'Black' ? 'bg-[#0d0d0d] text-gray-300 shadow-[0px_-3px_3px_rgba(0,0,0,0.02),0px_3px_3px_rgba(0,0,0,0.02),-3px_0px_3px_rgba(0,0,0,0.02),3px_0px_3px_rgba(0,0,0,0.02)] shadow-[#272725]' : 'bg-white text-green-700'}`} onMouseEnter={handlePasswordEnter} onMouseLeave={handlePasswordLeave}>
                <p>Password must be at least <b className={`${theme === 'Black' ? 'text-green-600' : 'text-green-700'}`}>8 characters</b>, contain <b className={`${theme === 'Black' ? 'text-green-600' : 'text-green-700'}`}>lower</b> and <b className={`${theme === 'Black' ? 'text-green-600' : 'text-green-700'}`}>uppercase letters</b> and <b className={`${theme === 'Black' ? 'text-green-600' : 'text-green-700'}`}>numbers</b>.</p>
              </div>
            </div>
          </form>
        </div>
  )
}

export default SignUpForm
