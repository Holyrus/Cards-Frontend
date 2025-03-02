import React from 'react'
import Panda from '../assets/panda.jpg'
import { Link } from 'react-router-dom'

const StartPage = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-between'>
      {/* Make here dropdown list with languages */}
      <div className='h-[40px] w-full'></div>
      <h1 className='text-[40px] font-bold bg-gradient-to-r from-green-700 to-yellow-300 text-transparent bg-clip-text'>UmCards</h1>
      <img src={Panda} alt="Panda" className='w-[200px]' />
      <div className='flex flex-col gap-5 mb-10 w-[300px] sm:w-auto'>
        <Link to="/login" className='text-green-700 font-semibold py-[12px] px-[35px] sm:px-[70px] border-1 border-green-700 rounded-full shadow-md hover:bg-green-100 transition-all duration-400'>I ALREADY HAVE AN ACCOUNT</Link>
        <Link to="/signup" className='text-white bg-green-700 font-semibold py-[12px] px-[118px] sm:px-[140px] rounded-full shadow-md hover:shadow-lg hover:bg-green-100 hover:text-green-700 border-1 border-green-700 transition-all duration-400'>SIGN UP</Link>
      </div>
    </div>
  )
}

export default StartPage
