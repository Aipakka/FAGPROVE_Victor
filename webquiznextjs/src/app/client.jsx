"use client"
import { useState } from 'react';
export default function ClientIndex({tempCreateAdmin}) {
  const [show, setShow] = useState('før kjlring')
  async function wrapper() {
    setShow(await tempCreateAdmin())
  }


  return (
    <>
      <button onClick={() => wrapper()}>{show}</button >
    </>
  );
}
