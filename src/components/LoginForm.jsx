import { Link } from 'react-router-dom'
import Panda from '../assets/panda2.png'

const LoginForm = () => {
  return (
    <div className='flex flex-col items-center'>
      <div className='mt-1 w-[500px] flex flex-row items-start'>
        <div>
          <Link to="/">
            <svg className='w-[40px] p-2 rounded-full hover:bg-gray-100' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowLeftRoundedIcon"><path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path></svg>
          </Link>
        </div>
      </div>
      <img src={Panda} alt="Panda" className='w-[300px]' />
      <h1 className='text-[40px] font-bold bg-gradient-to-r from-green-700 to-yellow-300 text-transparent bg-clip-text'>UmCards</h1>
      <p className='text-[14px] text-[#ababab]'>Add words with Umka, learn everyday and never forget them</p>
      <div className='relative flex mt-4'>
        <input id="loginUsername" type="text" placeholder='' className='z-10 peer w-full border-0 border-b-2 border-gray-400 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4 text-gray-900' />
        <label for="loginUsername" className= 'z-5 absolute left-2 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>Username</label>
      </div>
      <div className='relative flex mt-4'>
        <input id="loginPassword" type="password" placeholder='' className='z-10 peer w-full border-0 border-b-2 border-gray-400 focus:border-green-500 focus:outline-none focus:ring-0 bg-transparent p-2 pt-4 text-gray-900' />
        <label for="loginPassword" className= 'z-5 absolute left-2 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-[16px] peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-green-500 peer-focus:text-[12px] transition-all'>Password</label>
      </div>
      <div className='flex flex-row w-[300px] my-4'>
        <Link className='rounded-full text-green-700 font-semibold py-2 px-5 hover:bg-green-100 transition-all duration-300' to="/">PREVIOUS</Link>
        <button className='rounded-full text-white border-1 border-green-700 font-semibold py-2 px-5 bg-green-700 hover:bg-green-100 hover:text-green-700 transition-all duration-300'>NEXT</button>
      </div>
    </div>
  )
}

export default LoginForm
