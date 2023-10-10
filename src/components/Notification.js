import React from 'react'
import { NotificationIcon } from '../icons'

const Notification = ({statusColor, status, notificationText, className }) => {
  return (
    <div className={`mb-4 md:mb-0 md:absolute md:left-[77%] md:top-[10%] ` + className}>

      {(status === "success") && (
        <div className={`w-[60%] h-10 md:h-12 md:w-[21.8125rem] justify-center flex bg-green-primary items-center`}>
          <NotificationIcon />
          <p className='font-medium text-base md:text-xs text-white pl-6'>{notificationText}</p>
        </div>
      )}

    {(status === "failure") && (
      <div className={`w-full px-4 py-2 h-10 md:h-12 md:w-[21.8125rem] justify-center flex bg-red-primary items-center`}>
        <NotificationIcon />
        <p className='font-medium text-base md:text-xs text-white pl-6'>{notificationText}</p>
      </div>
    )}

    </div>
  )
}

export default Notification