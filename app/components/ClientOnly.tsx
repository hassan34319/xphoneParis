'use client'
import React, { ReactNode } from 'react'
import { StateContext } from '../context/stateContext'
import Layout from './Layout'

type Props = {
    children: ReactNode;
}

function ClientOnly({children}: Props) {
  return (
        <Layout>{children}</Layout>
  )
}

export default ClientOnly