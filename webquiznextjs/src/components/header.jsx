"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'


export default function Header({ admin = false, VerifyLoginn }) {
    const [modal, setModal] = useState('')
    const [passord, setPassord] = useState('')
    const [username, setUsername] = useState('')
    const [pwdShow, setpwdShow] = useState('password')
    const router = useRouter();
    function openLogin() {

        setModal('login')
    }
    async function Loginn() {
        console.log('client:', username)
        const res = await VerifyLoginn(username, passord)
        console.log('servres:', res)
        if (res == 'loginnSuccess') {
            console.log('inside if')
            setModal(false)
            router.push('/admin');
        } else {
            alert(res);
            return;
        }

    }

    return (
        <>
            {modal === 'login' ? loginModal() : <></>}
            {modal === 'login' ? filModal() : <></>}
            <header className=' absolute top-0 flex flex-row bg-green-900 h-16 justify-between  w-full border-b-8 border-b-slate-400'>
                <div className='justify-start h-full'>
                    <button className='hover:bg-green-600 h-full w-32 items-center justify-center'>
                        <p className='flex flex-col justify-center text-white'>Testing left</p>
                        <p className='flex flex-col justify-center text-white'>{username}</p>
                        <p className='flex flex-col justify-center text-white'>{passord}</p>
                    </button>
                </div>
                <div className='justify-end'>
                    {admin ?
                        <button className='hover:bg-green-600 h-full w-32 items-center justify-center'>
                            <p className='flex flex-col justify-center text-white'>Les in fil</p>

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
                    <div className='flex justify-center items-center z-20 absolute w-1/3 bg-white rounded-lg opacity-100 flex-col'>
                        <h1 className='m-10 text-2xl'>Innlogging</h1>
                        <div className='w-4/5 lg:w-3/5  xl:w-2/5'> Brukernavn<br />
                            <input type={'text'} value={username} onChange={(e) => setUsername(e.target.value)} className='p-1 rounded-lg bg-amber-50 outline-gray-800 outline w-full ' placeholder={'brukernavn'} />
                        </div>
                        <div className=' w-4/5 lg:w-3/5  xl:w-2/5'> Passord<br />
                            <div className='flex flex-row overflow-visible'>
                                <input type={pwdShow} value={passord} onChange={(e) => setPassord(e.target.value)} className='p-1 w- rounded-lg bg-amber-50 outline-gray-800 outline w-full ' placeholder={'passord'} />
                                <button className='rounded-lg w-16 h-8 bg-green-900 hover:bg-green-600 text-white' onClick={() => { pwdShow === 'text' ? setpwdShow('password') : setpwdShow('text') }}>{pwdShow === 'password' ? 'Vis' : 'Skjul'}</button>
                            </div>
                        </div>
                        <div className='w-1/2 bottom-0 m-10 flex justify-between'>
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => setModal(undefined)}>Lukk</button>
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => Loginn()}>Logg inn</button>
                        </div>
                    </div>
                </div>
                <span className='z-10 items-center absolute w-full h-full bg-gray-600 opacity-50'>
                </span>
            </>)
    }
    function filModal() {
          return (
            <>
                <div className='absolute flex items-center justify-center w-full h-full'>
                    <div className='flex justify-center items-center z-20 absolute w-1/3 bg-white rounded-lg opacity-100 flex-col'>
                        <h1 className='m-10 text-2xl'>Les inn fil</h1>
                        <input accept='.json' type='file' className='flex flex-col justify-center text-white' />
                    </div>
                </div>
                <span className='z-10 items-center absolute w-full h-full bg-gray-600 opacity-50'>
                </span>
            </>)
       
    }
}
