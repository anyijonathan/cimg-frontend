import React from 'react'

const FormRadio = ({value,label, name, id, extraText, className}) => {
  return (
    <div className= {className}>
      <div className={`flex items-center mb-4`}>
        <input 
          id={id} 
          type="radio"   
          name={name} 
          value={value}
          className= {`w-4 h-4 text-text-color-1 bg-gray-100 border-gray-300 focus:ring-secondary-color` + className} 
        />
        {label && <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium">{label}</label> }   
      </div>
      <div className='pl-6'>
        {extraText && <p className='text-sm text-black-200'> {extraText}</p> }
      </div>
    </div>
  )
}

export default FormRadio