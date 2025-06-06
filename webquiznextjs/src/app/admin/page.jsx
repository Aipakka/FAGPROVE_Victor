import AdminClient from './client';
import SQL from '@/lib/sql';
async function GetQuizez() {
    "use server"
    const res = SQL.GetQuizes()
    return res
}

async function GetResults(idQuiz, quizName) {
    "use server"
    const quizResultsTableData = [];
    const answers = await SQL.GetAnswers(idQuiz);
    const users = await SQL.GetUsersCompleted(idQuiz);
    const categories = await SQL.GetCategories(idQuiz)
    console.log('ansrs: ', answers)
    console.log('usrs: ', users)
    quizResultsTableData.push(...FilterUserAnswers(users, answers, quizName, 'quizID', idQuiz))
    for (const category of categories) {
        quizResultsTableData.push(...FilterUserAnswers(users, answers, category.categoryName, 'categoryID', category.idCategories))
    }
    console.log('qrtd: ', quizResultsTableData)
    return quizResultsTableData

}
function FilterUserAnswers(users, answers, dataTitle, Filter, FilterValue) {
    const filterDataResults = [];
    for (const user of users) {
        let correctAnswers = 0;
        let wrongAnswers = 0;
        answers.forEach(answer => {
            console.log('loop usr: ', user)
            console.log('loop answer: ', answer)
            if (answer.correctAnswer === true && answer.teamID === user.idTeam && answer[Filter] === FilterValue)
                correctAnswers += 1
            else if (answer.correctAnswer === false && answer.teamID === user.idTeam && answer[Filter] === FilterValue)
                wrongAnswers += 1
            console.log('loop correct: ', correctAnswers)
            console.log('loop wrong: ', wrongAnswers)
        })
           filterDataResults.push({ team: user.name, correctAnswers: correctAnswers, wrongAnswers: wrongAnswers })

    }
    return [{groupTitle: dataTitle, data: filterDataResults}]
}
export default function AdminServer() {
    return (<AdminClient getResults={GetResults} getQuizez={GetQuizez} />)
}