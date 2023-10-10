import { Spinner } from 'flowbite-react';
import React from 'react'

const Button = 
  ({ 
    type = 'submit',
    className,
    disabled,
    onClick,
    icon,
    isLoading,
    children,
    loaderText
  }) => {
 
  return (
    <button
      className = {       
        `bg-[linear-gradient(89.92deg,_#60088C_0.07%,_#A11E90_92.22%)] w-full h-12 border border-purple-secondary text-white text-sm rounded font-circular-std outline-none focus:border-purple-secondary focus:ring-purple-200  block pt-4 pb-6 px-16 ease-in-out duration-150 
          ${disabled && 'opacity-60'} ` + className
      }
      type= {type}
      onClick = {onClick}
      disabled = {disabled ? disabled : false}   
    >
      {icon && <div>{icon}</div>}
            {children}
            {isLoading}
 
    </button>
  );
}

export default Button