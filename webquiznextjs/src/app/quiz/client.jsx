"use client"
import { useEffect, useRef, useState } from 'react'

export default function DynamicQuizClient({ SetTeamName }) {
    const [teamName, setTeamName] = useState('')
    function CycleQuestion(){
        
    }

    const savedTeamName = useRef(undefined);
    async function  SaveTeamname(params) {
        if (teamName != ''){
            await SetTeamName(teamName)
            savedTeamName.current = teamName;
        }
        
    }
    useEffect(() => { }, [])
    return (
        savedTeamName.current ?
            <>
            </>
            :
            <>
                <div className='flex justify-center items-center  w-1/5 bg-green-700 rounded-lg opacity-100 text-white flex-col'>
                    <h1 className='m-10 text-2xl'>Innlogging</h1>
                    <div className='w-4/5 lg:w-3/5  xl:w-2/5'> Lagnavn<br />
                        <input type={'text'} value={teamName} onChange={(e) => setTeamName(e.target.value)} className='p-1 text-gray-600 rounded-lg bg-amber-50 outline-gray-800 outline w-full ' placeholder={'Lagnavn'} />
                    </div>
                    <div className='w-1/2 bottom-0 m-10 flex justify-center'>
                        <button className=' rounded-lg  text-nowrap p-2.5  bg-green-900 hover:bg-green-600 text-white' onClick={() => SaveTeamname()}>Bruk lagnavn</button>
                    </div>
                </div>
            </>)
}