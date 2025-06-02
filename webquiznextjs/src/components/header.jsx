"use client"

import { useState } from 'react'

export default function Header({ admin = false }) {
    const [modal, setModal] = useState(undefined)
    const [passord, setPassord] = useState(undefined)
    const [username, setUsername] = useState(undefined)
    function openLogin() {

        setModal(loginModal())
    }
    return (
        <>
            {modal ? modal : <></>}
            <header className=' absolute top-0 flex flex-row bg-green-900 h-16 justify-between  w-full border-b-8 border-b-slate-400'>
                <div className='justify-start h-full'>
                    <button className='hover:bg-green-600 h-full w-32 items-center justify-center'>
                        <p className='flex flex-col justify-center text-white'>Testing left</p>
                    </button>
                </div>
                <div className='justify-end'>
                    {admin ?
                        <button className='hover:bg-green-600 h-full w-32 items-center justify-center'>
                            <input accept='.json' type='file' className='flex flex-col justify-center text-white'>Les inn fil</input>
                        </button>
                        :
                        <></>
                    }
                    <button onClick={() => openLogin()} className='hover:bg-green-600 h-full w-32 items-center justify-center'>
                        <p className='flex flex-col justify-center text-white'>Innlogging</p>
                    </button>
                </div>
            </header>
        </>

    )
    function loginModal() {
        return (
            <>
                <div className='absolute flex items-center justify-center w-full h-full'>
                    <div className='flex justify-center items-center z-20 absolute w-3xl h-2/5 bg-white rounded-lg opacity-100 flex-col'>
                        <p className='w-4/5 lg:w-3/5  xl:w-2/5'> Brukernavn<br />
                            <input type={'text'} value={username} onChange={(e) => setUsername(e.target.value)} className='p-1 rounded-lg bg-amber-50 outline-gray-800 outline w-full '  placeholder={'brukernavn'} />
                        </p>
                        <p className='w-4/5 lg:w-3/5  xl:w-2/5'> Passord<br />
                            <input type={'text'} value={passord} onChange={(e) => setPassord(e.target.value)} className='p-1 rounded-lg bg-amber-50 outline-gray-800 outline w-full '  placeholder={'passord'} />
                        </p>
                        <div className='w-1/2 bottom-0 absolute m-3 flex justify-between'>
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => setModal(undefined)}>Lukk</button>
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => setModal(undefined)}>Logg inn</button>
                        </div>
                    </div>
                </div>
                <span className='z-10 items-center absolute w-full h-full bg-gray-600 opacity-50'>
                </span>
            </>)
    }
}
