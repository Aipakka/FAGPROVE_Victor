"use client"
import { useEffect, useState } from 'react';
export default function ClientIndex({GetQuizez}) {
  const [quizlist, setQuizlist] = useState([])
  useEffect(()=> {wrapper()})

  async function wrapper() {
    setQuizlist(await GetQuizez())
  }


  return (
    <>
    </>
  );
}
