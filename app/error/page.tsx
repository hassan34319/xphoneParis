import React from 'react'

type Props = {}

function ErrorPage({}: Props) {
  return (
    <div className="flex items-center justify-center h-screen">
    <div className="bg-white p-8 shadow-lg rounded-lg text-center">
      <p className="text-2xl font-bold mb-4">An Error Occured</p>
      <p>Please log in to continue.</p>
    </div>
  </div>
  )
}

export default ErrorPage