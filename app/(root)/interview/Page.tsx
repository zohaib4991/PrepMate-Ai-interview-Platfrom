import Agent from '@/app/components/Agent'
import React from 'react'

const Page = () => {
  return (
    <>
    <h3>Intervew Generation</h3>
    <Agent userName='You' useId='user1' type='generate' />
    </>
  )
}

export default Page