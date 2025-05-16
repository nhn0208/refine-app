import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <header className='w-full h-16 fixed top-0 z-10 bg-white flex items-center px-10'>
        <Image src={'https://geekup.vn/Icons/geekup-logo-general.svg'} alt='' width={120} height={36}/>
    </header>
  )
}

export default Header