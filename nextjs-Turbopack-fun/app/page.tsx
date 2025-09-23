'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Hello World!</h1>
        <p className={styles.counter}>Hellos: {count}</p>
        <button className={styles.button} onClick={handleClick}>
          Say Hello
        </button>
      </div>
    </main>
  )
}