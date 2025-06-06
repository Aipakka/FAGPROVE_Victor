import AdminClient from './client';
import SQL from '@/lib/sql';

/**
 * 
 * @returns alle quizer admin kan se resultater til fra DB
 */
async function GetQuizez() {
    "use server"
    const res = SQL.GetQuizes()
    return res
}


/**
 * 
 * @param {*} idQuiz intger, quiz som resultater hentes til 
 * @param {*} quizName string, navn til quiz som vises resultater til
 * @returns array med data til tabeller for client
 */
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
    return quizResultsTableData

}

/**
 * lager svarResultater for hver bruker, med litt filtrering 
 * brukes til å filtrere ut svar til
 * hele quizen
 * hver enkelt kategori
 * @param {*} users array, liste med lagnavn
 * @param {*} answers array, liste med all svardata til quiz
 * @param {*} dataTitle string, tittel til tabellen
 * @param {*} Filter string, elementet som skal hentes ut og sjekkes for på svaret, f.eks spesifikk kategori
 * @param {*} FilterValue intger, id som skal filtreres for
 * @returns tabell data som ble konstruert
 */
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
/**
 * render av siden, dette er funksjonen som blir kalt
 * bruker client.jsx på samme nivå som komponent for å rendere allt bruker ser å bruker
 * @returns render av client content
 */
export default function AdminServer() {
    return (<AdminClient getResults={GetResults} getQuizez={GetQuizez} />)
}