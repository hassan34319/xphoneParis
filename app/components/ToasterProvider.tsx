'use client'

import { Toaster } from "react-hot-toast" 

import React from 'react'

type Props = {}

function ToasterProvider({}: Props) {
  return (
    <Toaster/>
  )
}

export default ToasterProvider