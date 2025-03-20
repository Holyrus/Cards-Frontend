import { useErrorNotificationValue } from "./ErrorNotificationContext";
import { useNotificationValue } from "./NoificationContext";
import { useEffect, useState } from "react";

const ErrorNotification = () => {
  const errorNotification = useErrorNotificationValue()
  const notification = useNotificationValue()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (errorNotification) {
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }
    if (notification) {
      setIsVisible(false)
    }
  }, [errorNotification, notification])

  return (
    <div className="flex justify-center w-full pointer-events-none">
      <div className={`fixed z-60 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-4' : '-translate-y-full'}`}>
        <div className="mx-auto max-w-[90%] sm:max-w-[200px] text-[14px] bg-[#fceded] text-[#5e2120] px-3 py-4 rounded-md border-1 border-[#ebe9e8] text-center flex flex-row gap-2 justify-center">
          <svg className="w-[20px] text-[#5e2120]" fill="currentColor" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ErrorOutlineIcon"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
          {errorNotification}
        </div>
      </div>
    </div>
  )
}

export default ErrorNotification