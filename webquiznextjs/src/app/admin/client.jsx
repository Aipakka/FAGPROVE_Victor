"use client"
import { useEffect, useRef, useState } from 'react'

export default function AdminClient({ getResults, getQuizez }) {
    /**
     * useState verdier laster siden delvis på nytt når verdien deres oppdateres
     * Er derofr brukt på verdier som bestemmer om f.eks modaler skal vises
     * useRef er brukt for verdier som ikke trenger at det brukeren ser oppdateres
     */
    const [expanded, setExpanded] = useState('')
    const allQuizez = useRef([])
    const quizResults = useRef([])

    //wrapper funksjon for å sette alle quizer og får å awaite svaret fra serverside
    //wrapper trengs fordi useEffects kan kalle async funksjoner og kjøre ting fint, men kan ikke awaite ting på lik måte
    async function getServerQuizez() {
        const res = await getQuizez();
        allQuizez.current = res;
    }
    /**
     * henter resultater til quizene fra serverside
     * @param {*} idQuiz integer, id til quiz
     * @param {*} quizName string, quizens navn
     */
    async function getServerResults(idQuiz, quizName) {
        quizResults.current = [];
        const res = await getResults(idQuiz, quizName);
        quizResults.current = res;
        console.log('cl res: ', quizResults.current)
    }
    function CalcPercent(partNumber, wholeNumber){
        let res = (partNumber / wholeNumber) * 100
        return res +'%'
    }
    /**
     * henter quizer på første page load
     */
    useEffect(() => {
        getServerQuizez()
    }, [])

    return (
        <div className='flex flex-col gap-8'>
            {/* looper over all quizer, og lager HTML */}
            {allQuizez.current.map(quiz =>
                <div key={`${quiz.idQuiz}-topDiv`} className='bg-green-700 rounded-lg text-white flex flex-col w-[90vw] lg:w-[50vw] h-fit p-2.5' >
                    <div key={`${quiz.idQuiz}-upperContent`} className='flex flex-col h-1/3 p-2.5 gap-2.5'>
                        <h1 key={`${quiz.idQuiz}-name`} className='text-3xl'>{quiz.quizName} </h1>

                        <h2 key={`${quiz.idQuiz}-description`} className='text-lg text-gray-300'>{quiz.description}</h2>
                    </div>
                    {expanded === quiz.quizName ?
                        <div key={`${quiz.idQuiz}-results `} className='flex flex-col overflow-scroll h-fit p-2.5 gap-4' >
                            {quizResults.current.map(table => (<table key={`${table.groupTitle}-table`} className=' w-full'>
                                <tbody className='border-b-[1px]'>
                                    <tr key={`${table.groupTitle}-headers`} className='border-[1px] bg-slate-400'>
                                        <td className=' p-1 border-x-[1px]'>{table.groupTitle != quiz.quizName ?`Kategori: ${table.groupTitle}`: quiz.quizName}</td>

                                        <td key={`${table.groupTitle}-teamHead`} className='p-1'>Lagnavn</td>
                                        <td key={`${table.groupTitle}-caHead`} className='p-1'>Riktige</td>
                                        <td key={`${table.groupTitle}-waHead`} className='p-1'>Feil</td>
                                        <td key={`${table.groupTitle}-percHead`} className='p-1'>%</td>
                                    </tr>
                                    {table.data.sort((a,b ) => b.correctAnswers - a.correctAnswers).map((tableRow, index) =>
                                        <tr key={`${index}-tr`} className={`${index % 2 ? 'bg-cyan-600' : ' bg-gray-600'} `}>
                                            <td key={`${index}-place`} className='border-x-[1px] w-1/4 p-1'>{index +1 === 1 ? '1 Vinner!!': index+1}</td>
                                            <td key={`${index}-team`} className=' w-1/4 p-1'>{tableRow.team}</td>
                                            <td key={`${index}-ca`} className=' w-1/4 p-1'>{tableRow.correctAnswers}</td>
                                            <td key={`${index}-wa`} className='border-r-[1px] w-1/4 p-1'>{tableRow.wrongAnswers}</td>
                                            <td key={`${index}-perc`} className='border-r-[1px] w-1/4 p-1'>{CalcPercent(tableRow.correctAnswers ,tableRow.wrongAnswers+ tableRow.correctAnswers)}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>))}
                        </div>
                        :
                        <></>
                    }

                    <div onClick={() => { setExpanded(quiz.quizName === expanded ? '' : quiz.quizName); quiz.quizName != expanded && getServerResults(quiz.idQuiz, quiz.quizName) }} key={`${quiz.idQuiz}-lowerContent`} className='flex h-fit bottom-0 relative flex-col justify-end p-2.5'>
                        <button onClick={() => { }} key={`${quiz.idQuiz}-startButton`} className='bg-green-900 hover:bg-green-600 border-white border-2 rounded-b-lg h-8 w-32 items-center justify-center'>
                            <p key={`${quiz.idQuiz}-btnText`} className='flex flex-col justify-center text-white'>{quiz.quizName === expanded ? 'Skjul' : 'Vis'} resultater</p>
                        </button>
                    </div>
                </div>)}
        </div>
    )
}