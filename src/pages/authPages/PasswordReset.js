import React, {useState} from 'react'
import FormInput from '../../components/FormInput'
import { FcmbLogo, SuccessIcon } from '../../icons'
import Button from '../../components/Button'

const PasswordReset = () => {

    const [error, setError] = useState("");
    const [errorStyle, setErrorStyle] = useState ("");
    const [password, setPassword ] = useState("")
    const [confirmPassword, setConfirmPassword ] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState("Continue")
    const [disabled, setDisabled] = useState(false);

    const handleChangePassword = (e) => {
      setError("")
      setErrorStyle("")
      const { value } = e.target;
      setPassword(value);
    };

    const handleChangeConfirmPassword = (e) => {
      setError("")
      setErrorStyle("")
      const { value } = e.target;
      setConfirmPassword(value);
    };

    const handlePasswordReset = () => {
      setIsLoading(true);
      setDisabled(true)
     
      if (password !== confirmPassword){
        setError("Passwords do not match")
        setErrorStyle("border-red-primary")
        setIsLoading(false);
        setDisabled(false)
        setButtonText("continue")
      }
      else{
        setButtonText("Sending password reset email...")
      }
    }



  return (
    <div>
          <div className='grid h-screen place-items-center bg-main-background pb-14 font-circular-std'>
    
    <div>
      <div className='md:mb-20 md:w-[36.5rem] justify-center flex items-center'>
      <FcmbLogo />
 <h3 className='font-medium text-black-primary pl-6'>Vendor Switch</h3>
      </div>
  
    <div className='bg-other-background shadow-sm rounded-lg md:w-144  mt-3'>
    <div className='py-10 px-[4.375rem]'>
        <h2 className='text-2xl font-medium leading-[1.875rem] text-black-primary pb-10'>Enter a new password</h2>
        <p className='font-base md:w-[27.6875rem] pb-10 text-black-70 opacity-70'>Create a new password to allow you login to your account</p>
        <FormInput className='mb-6' placeholder= "Enter password" type= "password" autoComplete= "off" label= "Enter new password" onChange={handleChangePassword}/>
        <FormInput className= {`mb-4 ${errorStyle}`} placeholder= "Enter password" type= "password" autoComplete= "off" label= "Verify new password" onChange={handleChangeConfirmPassword}/>
        <div className='md:mt-2 mb-2 md:mb-6 flex'>
          <p className='text-sm text-red-primary font-medium'>{error}</p>
        </div>
        <Button onClick={handlePasswordReset} isLoading = {isLoading} disabled = {disabled}>{buttonText}</Button>
<div className='text-center mt-4 w-full'>
<a href='/' className='text-purple-primary font-medium text-sm opacity-70'>Take me back to sign in</a>
</div>
      </div>

    </div>
    </div>
    </div>
    </div>
  )
}

export default PasswordReset