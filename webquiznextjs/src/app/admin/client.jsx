"use client"
import { useEffect, useRef } from 'react'

export default function AdminClient({ getQuizez }) {

    const allQuizez = useRef([])
    const shownQuizez = useRef([])
    async function getServerQuizez() {
        const res = await getQuizez();

        console.log('serv quiz: ', res)
        allQuizez.current = res;
        shownQuizez.current = allQuizez.current.map(quiz =>
            <div key={`${quiz.idQuiz}-topDiv`} className='bg-green-300 flex flex-col w-[50dvw] h-[30dvh]' >
                <div key={`${quiz.idQuiz}-upperContent`} className='h-1/2'>
                    <p key={`${quiz.idQuiz}-name`}>{quiz.quizName} </p>
                    <p key={`${quiz.idQuiz}-description`}>{quiz.description}</p>
                </div>
                <div key={`${quiz.idQuiz}-lowerContent`} className='h-1/2 '>
                    <button key={`${quiz.idQuiz}-startButton`} className='bg-green-900 hover:bg-green-600 h-8 w-32 items-center justify-center'>
                        <p key={`${quiz.idQuiz}-btnText`} className='flex flex-col justify-center text-white'>Start</p>
                    </button>
                </div>
            </div>)
        return res
    }

    useEffect(() => {
        const res = getServerQuizez()

    }, [])

    return (
        <>
            {shownQuizez.current}
        </>
    )
}