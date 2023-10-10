import React, {useState} from 'react'
import FormInput from '../../components/FormInput'
import { FcmbLogo, SuccessIcon } from '../../icons'
import Button from '../../components/Button'
import Notification from '../../components/Notification'
import { useHistory } from 'react-router-dom'

const ResetPassword = () => {

  const history = useHistory();

const [success, setSuccess] = useState("hidden")
const [emailValue, setEmailValue ] = useState("")
const [isLoading, setIsLoading] = useState(false);
const [buttonText, setButtonText] = useState("Continue")
const [disabled, setDisabled] = useState(false);
const [notificationText, setNotificationText] = useState("")
const [status, setStatus] = useState("");


const handleChangeEmail = (e) => {
  const { value } = e.target;
  setEmailValue(value);
};

const handleEmailSend = () => {
  setIsLoading(true);
  setDisabled(true)
  setButtonText("Sending password reset email...")

  setTimeout(() => {
     
    if (!emailValue){
      setStatus("failure");
      setNotificationText("please try again!")
      setIsLoading(false);
      setDisabled(false)
      setButtonText("Continue")

      setTimeout(() => {
        setStatus("");
        setNotificationText("")
      },5000)
    }

    else {
      setStatus("success")
      setNotificationText("Password reset email sent successfully")
      setTimeout(() => {
        history.push("/password-reset")
      }, 2000)
   
    }
  }, 3000)
}


  return (
    <div>
      <div className='grid h-screen place-items-center bg-main-background pb-14 font-circular-std'>
        <Notification notificationText={notificationText} status = {status} />
          <div>
            <div className='md:mb-20 md:w-[36.5rem] justify-center flex items-center'>
              <FcmbLogo />
              <h3 className='font-medium text-black-primary pl-6'>Vendor Switch</h3>
            </div>
        
            <div className='bg-other-background shadow-sm rounded-lg md:w-144  mt-3'>
              <div className='py-10 px-[4.375rem]'>
                <h2 className='text-2xl font-medium leading-[1.875rem] text-black-primary pb-10'>Reset your password</h2>
                <p className='font-base md:w-[27.6875rem] pb-10 text-black-70 opacity-70'>Enter the email address associated with your account. A password reset link will be sent to the email address.</p>
                <FormInput className='mb-10' placeholder= "Email address" type= "email" label= "Email" onChange={handleChangeEmail} />
                <div className={`md:mt-6 mb-4 md:mb-10 ${success}`}>
                  <SuccessIcon className='mt-[3px]' />
                  <p className='pl-3 text-sm text-green-primary font-medium'>Password reset email sent successfully</p>
                </div>
                <Button onClick={handleEmailSend} isLoading = {isLoading} disabled = {disabled}>{buttonText}</Button>
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

export default ResetPassword