import { Link } from "react-router-dom"

const SignUpForm = () => {
  return (
    <div className="flex flex-col items-center">
      <div className='mt-1 w-[500px] flex flex-row items-start'>
        <div>
          <Link to="/">
            <svg className='w-[40px] p-2 rounded-full hover:bg-gray-100' focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="KeyboardArrowLeftRoundedIcon"><path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.9959.9959 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
