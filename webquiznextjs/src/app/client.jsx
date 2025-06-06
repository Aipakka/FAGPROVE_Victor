"use client"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function ClientIndex({ GetQuizez, StartQuiz }) {
  /**
       * useState verdier laster siden delvis på nytt når verdien deres oppdateres
       * Er derofr brukt på verdier som bestemmer om f.eks modaler skal vises
       * useRef er brukt for verdier som ikke trenger at det brukeren ser oppdateres
       */
  const router = useRouter();
  const allQuizez = useRef([])
  const [shownQuizez, setshownQuizez] = useState([])

  /**
   * starter quiz for bruker
   * @param {*} quizid integer, id til quiz bruker starter 
   */
  async function RouteToQUiz(quizid) {
    //server funksjon
    let res = await StartQuiz(quizid);
    if (res === 'success')
      router.push('quiz');

  }
  /**
   *  henter quizer fra serverSide og DB, og looper over dem og returner html elementer med navn, description og knapp for å starte 
   */
  async function GetServerQuizez() {
    //henter quiz data fra serverside
    const res = await GetQuizez();
    allQuizez.current = res;
    //looper over quizer fra serverside og lager HTML
    setshownQuizez(allQuizez.current.map(quiz =>
      <div key={`${quiz.idQuiz}-topDiv`} className='bg-green-700 rounded-lg  flex flex-col w-[90vw] lg:w-[50vw] h-[20vh] p-2.5' >
        <div key={`${quiz.idQuiz}-upperContent`} className='flex flex-col h-1/2 p-2.5 gap-2.5'>
          <h1 key={`${quiz.idQuiz}-name`} className='text-3xl text-white'>{quiz.quizName} </h1>

          <h2 key={`${quiz.idQuiz}-description`} className='text-lg text-gray-300'>{quiz.description}</h2>
        </div>
        <div key={`${quiz.idQuiz}-lowerContent`} className='flex h-1/2 flex-col justify-end p-2.5'>
          <div className='flex flex-row gap-2.5'>
            <button onClick={() => { RouteToQUiz(quiz.idQuiz) }} key={`${quiz.idQuiz}-startButton`} className='bg-green-900 hover:bg-green-600 border-white border-2 rounded-b-lg h-8 w-32 items-center justify-center'>
              <p key={`${quiz.idQuiz}-btnText`} className='flex flex-col justify-center text-white'>Start</p>
            </button>
            {/* <div className='w-4/5 lg:w-3/5  xl:w-2/5'>
              <input type={'text'}  onChange={(e) => setTeamName(e.target.value)} className='p-1 text-black rounded-b-lg bg-amber-50 outline-gray-800 outline w-full ' placeholder={'Lagnavn'} />
            </div> */}
          </div>
        </div>
      </div>))
  }
  /**
   * kjører en gang når siden lastes for å hente quizer fra serverside
   */
  useEffect(() => {
    GetServerQuizez();

  }, [])

  return (
    <div className='flex flex-col gap-8'>
      {shownQuizez}
    </div>
  )
}