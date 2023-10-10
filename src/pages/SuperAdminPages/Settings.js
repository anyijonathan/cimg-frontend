import React, {useState} from 'react'
import Notification from '../../components/Notification';
import { ArrowRight, UserIcon } from '../../icons';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button'
import { userSelector } from '../../Redux/Slices/authSlice';
import { useSelector } from 'react-redux';

const Settings = () => {

  const {emailAddress, userName} = useSelector(userSelector)

  const [notificationText, setNotificationText] = useState("")
  const [status, setStatus] = useState("");
  const [openTab, setOpenTab] = useState(1);

 const setTabOne =()=>{
  setOpenTab(1); 
 }



  return (
    <div className='font-circular-std'>
    <Notification  notificationText={notificationText} status = {status} />
   <h2 className='text-xl font-bold text-black-secondary pb-9'>Settings</h2>
   <div className='h-[48.75rem] bg-white grid grid-cols-5'>
   <div className='col-span-1 border-r border-opacity-10 border-black-secondary'>
<ul className='pt-14 pl-10'>
<li>
<button 
href=''
onClick={setTabOne}
className={`${openTab === 1 ? "text-purple-primary" : "text-black-secondary opacity-70"}  inline-flex items-center pl-6 w-full h-12 text-sm font-normal transition-colors duration-150`}>
Basic information
<ArrowRight className= {`${openTab === 1 ? "flex":"hidden"} ml-4`} />
</button>
</li>
</ul>
   </div>
  
   <div className='col-span-4'>
   <div className={openTab === 1 ? "block" : "hidden"}>
                         
   <div className='mt-16 pl-16'>
    <UserIcon className='h-24 w-24 mb-24' />
    <FormInput className='mb-9' label="Display name" placeholder={userName} readOnly="readOnly" />
    <FormInput className='mb-14' label="Email" placeholder = {emailAddress} readOnly= "readOnly"/>
    <Button disabled className="newfee-button">Update</Button>
    </div>                        
                         
                        </div>


</div>
     

   </div>
   </div>

  )
}

export default Settings