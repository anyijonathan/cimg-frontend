import React from 'react'
import { SearchIcon } from '../icons'

const Searchbar = ({placeholder, id, onChange, value}) => {
  
  return (
    <div>
      <div className="flex items-center pl-3">
        {/* <SearchIcon className='absolute ml-2' />  */}
        <SearchIcon className='relative left-6' /> 
        <input value={value} type="text" id={id} onChange = {onChange} className="w-80 h-11 rounded opacity-60 border border-gray-300 text-black-40 text-sm focus:ring-gray-50 focus:border-gray-300 outline-none block w-full p-4 pl-8" placeholder={placeholder} />
      </div>
    </div>

  )
}

export default Searchbar