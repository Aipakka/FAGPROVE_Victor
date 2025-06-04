"use client"
import { useEffect, useRef, useState } from 'react'

export default function DynamicQuizClient({ SetTeamName, quizData }) {
    const [teamName, setTeamName] = useState('')
    const [categoryStartIndex, setCategoryStartIndex] = useState(0);
    const [questionStartIndex, setQuestionStartIndex] = useState(0);
    const fullQuiz = quizData;
    function CycleQuestion() {

    }

    const savedTeamName = useRef(undefined);
    async function SaveTeamname(params) {
        if (teamName != '') {
            await SetTeamName(teamName)
            savedTeamName.current = teamName;
        }

    }
    useEffect(() => { }, [])
    return (
        savedTeamName.current ?
            <>
                <div key={`${fullQuiz[categoryStartIndex].id}-topDiv`} className='bg-green-700 rounded-lg  flex flex-col w-[50vw] h-[30vh] p-2.5' >
                    <div key={`${fullQuiz[categoryStartIndex].id}-upperContent`} className='flex flex-col h-1/3 p-2.5 gap-2.5'>
                        <h1 key={`${fullQuiz[categoryStartIndex].id}-name`} className='text-3xl text-white'>{fullQuiz[categoryStartIndex].category} </h1>

                        <h2 key={`${fullQuiz[categoryStartIndex].id}-description`} className='text-lg text-gray-300'>{fullQuiz[categoryStartIndex].questions[questionStartIndex].question}</h2>
                    </div>
                    <div className='flex h-1/3 flex-col justify-end p-2.5'>
                        {ullQuiz[categoryStartIndex].questions[questionStartIndex].options.map(()=>{})}
                    </div>
                    <div key={`${fullQuiz[categoryStartIndex].id}-lowerContent`} className='flex h-1/3 flex-col justify-end p-2.5'>
                        <div className='flex flex-row gap-2.5'>
                            <button onClick={() => {  }} key={`${quiz.idQuiz}-startButton`} className='bg-green-900 hover:bg-green-600 border-white border-2 rounded-b-lg h-8 w-32 items-center justify-center'>
                                <p key={`${fullQuiz[categoryStartIndex].id}-btnText`} className='flex flex-col justify-center text-white'>Start</p>
                            </button>

                        </div>
                    </div>
                </div>
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