import React from 'react'
import { FcmbLogo, ForbiddenIcon } from '../icons'

const ErrorPage = () => {
  return (
    <div className="bg-other-background flex flex-col items-center font-circular-std">
      		<div className="mt-7 md:w-[36.5rem] md:mb-10 justify-center flex items-center">
				<FcmbLogo />
					<h3 className="font-medium text-black-primary pl-6">
						Vendor Switch
					</h3>
				</div>
      <ForbiddenIcon className="w-12 h-12 mt-8 text-purple-primary" aria-hidden="true" />
      <h1 className="text-6xl font-semibold text-purple-primary">Oops!</h1>
      <p className="text-black secondary">
        An error occured within the application, please contact support.
        <a className="block text-center text-purple-primary hover:underline text-purple-secondary" href="/app/dashboard">
          go back to Login
        </a>
        
      </p>
    </div>
  )
}

export default ErrorPage