import React from 'react'
import  { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux'
import { loaderSelector } from '../Redux/Slices/loaderSlice';



const LoaderComponent = () => {
    const { isLoading } = useSelector(loaderSelector);
  return (
    <>
    { isLoading && <div className="loader-overlay">
        <TailSpin
        color="purple"
        height={100}
        width={100}
    />
    </div> } 
    </>
    
  )};
export default LoaderComponent
