import React from 'react'

function Main({ children }) {
  return (
    <main className="h-full bg-dashboard-background overflow-y-auto font-circular-std">
      <div className="container grid px-6 mx-auto py-6">{children}</div>
    </main>
  )
}

export default Main
