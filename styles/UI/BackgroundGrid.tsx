'use client'

import styles from './BackgroundGrid.module.css'

export default function BackgroundGrid() {
  return (
    <>
      <div className={styles.bgGrid} />
      <div className={styles.gridMagnifier} />
    </>
  )
}

