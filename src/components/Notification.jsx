import { useNotificationValue } from './NoificationContext' 
import { useEffect, useState } from "react";

const Notification = () => {
  const notification = useNotificationValue()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }
  }, [notification])

  return (
    <div className={`fixed left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-4' : '-translate-y-full'}`}>
        <div className="mx-auto max-w-[90%] sm:max-w-[200px] text-[14px] bg-[#edf7ed] text-[#1e4520] px-3 py-4 rounded-md shadow-lg text-center flex flex-row gap-2 justify-center">
          <svg className="w-[20px] text-[#418a44]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="SuccessOutlinedIcon"><path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"></path></svg>
          {notification}
        </div>
    </div>
  )
}

export default Notification