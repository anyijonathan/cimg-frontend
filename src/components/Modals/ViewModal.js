import { Modal} from 'flowbite-react'
import React, { Children } from 'react'
import Button from '../Button'
import FormSelect from '../FormSelect'
import Textarea from '../Textarea'

const ViewModal = ({onClose, show, modalHeader, approveAction, declineAction, selectLabel, placeholderLabel, placeholderDescription, active, options, Children}) => {
  return (
    <div className='font-circular-std'>
      <Modal
        show={show}
        onClose={onClose}
        popup = {true}
        size = "lg"
        position="center"
      >
        <Modal.Header >
          <div className='p-6'>
            <h3 className='w-[90%] text-lg font-bold text-black-secondary'>{modalHeader}</h3>
          </div>
          <div className='md:w-[27.75rem] pb-10'>
            <hr />
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-6">
            <FormSelect className= "w-full md:w-[27.25rem] h-12" />
            <Textarea label= {placeholderLabel} placeholder= {placeholderDescription} />
          </div>
        </Modal.Body>
        {active && <Modal.Footer>
          <div className="flex justify-center gap-4 place-content-center">
            <Button
              className='bg-transparent w-1/2 text-red-primary font-medium border-red-primary'
              onClick={declineAction}
            >
              Decline
            </Button>
            <Button
              className ='w-1/2'
              onClick={approveAction}
            >
              Approve
            </Button>
          </div>
        </Modal.Footer> }
      </Modal>
    </div>
  )
}

export default ViewModal