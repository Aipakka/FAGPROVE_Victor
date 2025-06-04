"use client"
import { useEffect, useRef, useState } from 'react'

export default function AdminClient({ getQuizez }) {

    const allQuizez = useRef([])
      const [shownQuizez, setshownQuizez] = useState([])
    async function getServerQuizez() {
        const res = await getQuizez();

        console.log('serv quiz: ', res)
        allQuizez.current = res;
        setshownQuizez(allQuizez.current.map(quiz =>
            <div key={`${quiz.idQuiz}-topDiv`} className='bg-green-700 rounded-lg text-white flex flex-col w-[50dvw] h-[30dvh] p-2.5' >
                <div key={`${quiz.idQuiz}-upperContent`} className='flex flex-col h-1/2 p-2.5 gap-2.5'>
                    <h1 key={`${quiz.idQuiz}-name`} className='text-3xl'>{quiz.quizName} </h1>
                    
                    <h2 key={`${quiz.idQuiz}-description`} className='text-lg text-gray-300'>{quiz.description}</h2>
                </div>
                <div key={`${quiz.idQuiz}-lowerContent`} className='flex h-1/2 flex-col justify-end p-2.5'>
                    <button onClick={() =>{}} key={`${quiz.idQuiz}-startButton`} className='bg-green-900 hover:bg-green-600 border-white border-2 rounded-b-lg h-8 w-32 items-center justify-center'>
                        <p key={`${quiz.idQuiz}-btnText`} className='flex flex-col justify-center text-white'>Start</p>
                    </button>
                </div>
            </div>))
    }

    useEffect(() => {
 getServerQuizez()

    }, [])

    return (
        <>
            {shownQuizez}
        </>
    )
}