"use client"
import { useEffect, useRef, useState } from 'react'

export default function DynamicQuizClient({ FinishQuiz, quizID, SetTeamName, quizData }) {
    const [teamName, setTeamName] = useState('')
    const [categoryStartIndex, setCategoryStartIndex] = useState(0);
    const [questionStartIndex, setQuestionStartIndex] = useState(0);

    const [userAnswer, setUserAnswer] = useState({ id: undefined, correct: undefined })
    const fullQuiz = quizData;
    const answers = useRef([]);

    //sjekker om brukeren har avgitt svaret sitt
    //Sjekker om det er et neste spørsmål i kategorien eller om den må gå til neste kategori og begynne på spørsmålene der.
    //lagrer svar fra Bruker som blir sendt til funksjonen som parameter i variabel answers
    async function CycleQuestion(answer) {
        console.log('client answer: ', answer)
        if (userAnswer.id === undefined || userAnswer.correct === undefined) {
            alert('Du må velge et svar-alternativ')
            return
        }
        if (fullQuiz[categoryStartIndex].questions[questionStartIndex + 1]) {
            answers.current.push(answer)
            setQuestionStartIndex(questionStartIndex + 1)
            setUserAnswer({ id: undefined, correct: undefined })
        } else if (fullQuiz[categoryStartIndex + 1]) {
            answers.current.push(answer)
            setCategoryStartIndex(categoryStartIndex + 1)
            setQuestionStartIndex(0)
        } else if(!fullQuiz[categoryStartIndex].questions[questionStartIndex + 1] && !fullQuiz[categoryStartIndex + 1]){
            answers.current.push(answer)
            console.log('client answer rb send serv: ', answers.current)
            await FinishQuiz(answers.current)
            alert('done')
        }
         console.log('client answer end func useref: ', answers.current)
    }
    useEffect(() => { console.log('usrans: ', userAnswer) }, [userAnswer])
    const savedTeamName = useRef(undefined);
    async function SaveTeamname() {
        if (teamName != '') {
            await SetTeamName(teamName)
            savedTeamName.current = teamName;
        }

    }
    return (
        savedTeamName.current ?
            <>
                <div key={`${fullQuiz[categoryStartIndex].id}-topDiv`} className='bg-green-700 rounded-lg  flex flex-col w-[40vw] h-fit p-12' >
                    <div key={`${fullQuiz[categoryStartIndex].id}-upperContent`} className='flex flex-col h-1/3 p-2.5 gap-2.5'>
                        <h1 key={`${fullQuiz[categoryStartIndex].id}-name`} className='text-3xl text-white'>Kategori {categoryStartIndex + 1}: {fullQuiz[categoryStartIndex].category} </h1>

                        <h2 key={`${fullQuiz[categoryStartIndex].id}-questionNo`} className='text-lg text-gray-300'>Spørsmål {questionStartIndex + 1}:</h2>
                        <h2 key={`${fullQuiz[categoryStartIndex].id}-description`} className='text-lg text-gray-300'>{fullQuiz[categoryStartIndex].questions[questionStartIndex].question}</h2>
                    </div>
                    <div className='flex flex-col h-fit gap-5 text-white p-5'>
                        {fullQuiz[categoryStartIndex].questions[questionStartIndex].options.map((option) => (

                            <div key={`${option.id}-container`} id={`${option.id}-${fullQuiz[categoryStartIndex].questions[questionStartIndex].id}`}>
                                <input key={`${option.id}-${fullQuiz[categoryStartIndex].questions[questionStartIndex].id}-input`} value={option.correct} onChange={() => { setUserAnswer({ id: option.id, correct: option.correct }) }} type='radio' name={`${fullQuiz[categoryStartIndex].questions[questionStartIndex].idQuestion}`} id={`${option.id}-${fullQuiz[categoryStartIndex].questions[questionStartIndex].id}`} />
                                <label key={`${option.correct}-${option.id}-label`} id={`${option.correct}-${option.id}`} className='p-2' htmlFor={`${option.id}-${fullQuiz[categoryStartIndex].questions[questionStartIndex].id}`}>{option.text}</label>
                            </div>

                        ))}
                    </div>
                    <div key={`${fullQuiz[categoryStartIndex].id}-lowerContent`} className='flex h-1/3 flex-col justify-end p-2.5'>
                        <div className='flex flex-row gap-2.5'>
                            <button onClick={() => { CycleQuestion({ team: savedTeamName.current, idQuiz: quizID, idCategory: fullQuiz[categoryStartIndex].id, idQuestion: fullQuiz[categoryStartIndex].questions[questionStartIndex].id, idQuestionOption: userAnswer.id, optionCorrect: userAnswer.correct }) }} key={`${fullQuiz[categoryStartIndex].id}-startButton`} className='bg-green-900 hover:bg-green-600 border-white px-1.5 border-2 rounded-b-lg h-8 w-fit items-center justify-center'>
                                <p key={`${fullQuiz[categoryStartIndex].id}-btnText`} className='flex flex-col justify-center text-white'>Neste spørsmål</p>
                            </button>
                            <button onClick={() => { alert(JSON.stringify(fullQuiz)) }} key={`${fullQuiz[categoryStartIndex].id}8321-startButton`} className='bg-green-900 hover:bg-green-600 border-white px-1.5 border-2 rounded-b-lg h-8 w-fit items-center justify-center'>
                                <p key={`${fullQuiz[categoryStartIndex].id}-btnText`} className='flex flex-col justify-center text-white'>test</p>
                            </button>
                            <p>categorystartIndex: {categoryStartIndex}</p>
                            <p>questionStartIndex: {questionStartIndex}</p>

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