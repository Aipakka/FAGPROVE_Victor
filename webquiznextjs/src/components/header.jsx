"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 
 * @param {*} param0 
 * @returns HTML for header
 */
export default function Header({ readFileToDB, inQuiz, adminName, admin = false, VerifyLoginn, destroySession }) {
    /**
     * useState verdier laster siden delvis på nytt når verdien deres oppdateres
     * Er derofr brukt på verdier som bestemmer om f.eks modaler skal vises
     * useRef er brukt for verdier som ikke trenger at det brukeren ser oppdateres
     */
    const [modal, setModal] = useState('')
    const [passord, setPassord] = useState('')
    const [username, setUsername] = useState('')
    const [pwdShow, setpwdShow] = useState('password')
    const [file, setFile] = useState(undefined)
    const fileRead = useRef([])
    /**
     * gjør filereader om til at den akan kjøres asynkront slik at svaret kan avventes og koden gir riktig resultat
     * Dette gjøre siden FileReader til vanlig ikke har denne funskjonaliteten
     * @param {*} file file, fil fra filelist som kommer fra file input på clientside
     * @returns 
     */
    function asyncFileReader(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader;
            reader.onload = (evt) => {
                resolve(fileRead.current = JSON.parse(evt.target.result));
            };
            reader.readAsText(file)
        });

    }
    async function ReadFile(file) {
        await asyncFileReader(file);
    }
    /**
     * kjøres når bruker laster opp fil i file input i filmodalen
     * laster inn data til fil til clientside før bruker trykker Les inn og starter innlesning til databasen
     */
    useEffect(() => {
        if (file != undefined) {
            ReadFile(file);
        }
    }, [file])
    const router = useRouter();

    /**
     * åpner modal basert på kallenavn
     * @param {*} modalName string, kallenavnet til modalen som skal åpnes for client 
     */
    function modifyModal(modalName) {
        switch (modalName) {
            case 'login':
                setModal('login')
                break;
            case 'filModal':
                setModal('filModal')
                break;
            default:
                setModal('')
                break;
        }

    }
    /**
     * logger admin ut, ødelegger session, og går til startside
     */
    async function destroy() {
        await destroySession();
        router.replace('/');
    }

    /**
     * sender kall til serverSide funksjon med input data fra client
     * @returns success status
     */
    async function Loginn() {
        const res = await VerifyLoginn(username, passord)
        if (res == 'loginnSuccess') {
            setModal(false)
            router.push('/admin');
        } else {
            alert(res);
            return;
        }

    }
    /**
     * funksjon client kaller opp når de har valg fil som skal leses inn i databasen
     */
    async function uploadFile() {
        const res = await readFileToDB(fileRead.current);
        console.log('clie res: ', res)
        if (res?.error) {
            alert(res.error)
        }
        if (res === 'fileReadToDBsuccess') {
            fileRead.current = [];
            setFile(undefined);
            setModal(false);
        }
    }

    return (
        <>

        {/* henter frem modalt content om useState har blitt oppdatert med riktig kallenavn */}
            {modal === 'login' ? loginModal() : <></>}
            {modal === 'filModal' ? filModal() : <></>}
            <header className='fixed top-0 flex flex-row bg-green-900 h-16 justify-between px-1 w-full border-b-8 border-b-slate-400'>
                <div className='justify-start h-full'>
                    <button className='h-full w-fit lg:w-32 items-center justify-center'>
                        <p className='flex flex-col justify-center text-white'>{adminName}</p>
                    </button>
                    <p id='breadtoekn' className='absolute flex flex-col justify-center text-white'></p>

                </div>
                <div className='justify-end'>
                    {/* bytter mellom hilke knapper som skal være i header basert på hvor du er og hva som er i session */}
                    {admin ?
                        <>
                            <button onClick={() => modifyModal('filModal')} className='hover:bg-green-600 px-1 h-full w-fit lg:w-32 items-center justify-center'>
                                <p className='flex flex-col justify-center text-white'>Les in fil</p>
                            </button>
                            <button onClick={() => destroy()} className='hover:bg-green-600 h-full w-fit px-1 lg:w-32 items-center justify-center'>
                                <p className='flex flex-col justify-center text-white'>Logg ut</p>
                            </button>
                        </>
                        : inQuiz ?
                            <button onClick={() => destroy()} className='hover:bg-green-600 h-full w-fit px-1 lg:w-32 items-center justify-center'>
                                <p className='flex flex-col justify-center text-white'>Stopp quiz</p>
                            </button>
                            :

                            <button onClick={() => modifyModal('login')} className='hover:bg-green-600 h-full px-1 w-fit lg:w-32 items-center justify-center'>
                                <p className='flex flex-col justify-center text-white'>Innlogging</p>
                            </button>
                    }


                </div>
            </header>
        </>

    )
    /**
     * 
     * @returns HTML for modalt vindu til innlogging
     */
    function loginModal() {
        return (
            <>
                <div className='absolute top-0 flex items-center justify-center w-full h-full '>
                    <div className='flex justify-center items-center z-20 absolute w-full lg:w-1/3 bg-white rounded-lg opacity-100 flex-col'>
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
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => modifyModal('close')}>Lukk</button>
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => Loginn()}>Logg inn</button>
                        </div>
                    </div>
                </div>
                <span className='z-10 top-0 items-center absolute w-full h-full bg-gray-600 opacity-50'>
                </span>
            </>)
    }
     /**
     * 
     * @returns HTML for modalt vindu til innlesning av fil
     */
    function filModal() {
        return (
            <>
                <div className='absolute top-0 flex items-center justify-center w-full h-full'>
                    <div className='flex justify-center items-center z-20 absolute w-[90vw] lg:w-1/3 bg-white rounded-lg opacity-100 flex-col'>
                        <h1 className='m-10 text-2xl'>Les inn fil</h1>
                        <input onChange={(e) => setFile(e.target.files[0])} accept='.json' type='file' className='p-2 lg:text-nowrap rounded-lg bg-green-900 hover:bg-green-600 text-white' />
                        <div className='w-1/2  bottom-0 m-10 flex justify-between'>
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => modifyModal('close')}>Lukk</button>
                            <button className='rounded-lg w-24 h-12 bg-green-900 hover:bg-green-600 text-white' onClick={() => uploadFile()}>Les inn</button>
                        </div>
                    </div>
                </div>
                <span className='z-10 top-0 items-center absolute w-full h-full bg-gray-600 opacity-50'>
                </span>
            </>)

    }
}
