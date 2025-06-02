export default function Header(){
    return(
        <header className='flex flex-row bg-green-900 h-16'>
            <div className='justify-start h-full'>
                <button className='hover:bg-green-600 h-full w-32 items-center justify-center'>
                    <p className='flex flex-col justify-center text-white'>Testing left</p>
                </button>
            </div>
            <div className='justify-end'>

            </div>
        </header>
    )
}