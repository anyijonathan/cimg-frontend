import React from 'react'

import { ForbiddenIcon } from '../icons'

function Page404() {
  return (
    <div className="flex flex-col items-center font-circular-std">
      <ForbiddenIcon className="w-12 h-12 mt-8 text-secondary-color" aria-hidden="true" />
      <h1 className="text-6xl font-semibold text-gray-700 dark:text-gray-200">404</h1>
      <p className="text-gray-700 dark:text-gray-300">
        Page not found. Check the address or{' '}
        <a className="text-secondary-color hover:underline dark:text-purple-300" href="/app/dashboard">
          go back
        </a>
        .
      </p>
    </div>
  )
}

export default Page404
