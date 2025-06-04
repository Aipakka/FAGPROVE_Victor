"use client"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function ClientIndex({ GetQuizez, StartQuiz }) {
  const router = useRouter();
  const allQuizez = useRef([])
  const [shownQuizez, setshownQuizez] = useState([])

  //starter
  async function RouteToQUiz() {
    let res = await StartQuiz()
    if (res === 'success')
      router.push('quiz');
  }

  //henter quizer fra serverSide og DB, og looper over dem og returner html elementer med navn, description og knapp for å starte
  async function GetServerQuizez() {
    //henter quiz data fra serverside
    const res = await GetQuizez();
    allQuizez.current = res;
    //looper over quizer fra serverside og lager HTML
    setshownQuizez(allQuizez.current.map(quiz =>
      <div key={`${quiz.idQuiz}-topDiv`} className='bg-green-700 rounded-lg text-white flex flex-col w-[50dvw] h-[30dvh] p-2.5' >
        <div key={`${quiz.idQuiz}-upperContent`} className='flex flex-col h-1/2 p-2.5 gap-2.5'>
          <h1 key={`${quiz.idQuiz}-name`} className='text-3xl'>{quiz.quizName} </h1>

          <h2 key={`${quiz.idQuiz}-description`} className='text-lg text-gray-300'>{quiz.description}</h2>
        </div>
        <div key={`${quiz.idQuiz}-lowerContent`} className='flex h-1/2 flex-col justify-end p-2.5'>
          <button onClick={() => { RouteToQUiz() }} key={`${quiz.idQuiz}-startButton`} className='bg-green-900 hover:bg-green-600 border-white border-2 rounded-b-lg h-8 w-32 items-center justify-center'>
            <p key={`${quiz.idQuiz}-btnText`} className='flex flex-col justify-center text-white'>Start</p>
          </button>
        </div>
      </div>))
  }

  useEffect(() => {
    GetServerQuizez();

  }, [])

  return (
    <>
      {shownQuizez}
    </>
  )
}