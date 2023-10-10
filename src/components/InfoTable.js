import React from 'react'
import { Card, CardBody } from '@windmill/react-ui'

function InfoTable({ title, value, children: icon }) {
  return (
    <Card className='ring-white border border-white'>
      <CardBody className="flex items-center">
        {icon}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-700">{value}</p>
        </div>
      </CardBody>
    </Card>
  )
}

export default InfoTable