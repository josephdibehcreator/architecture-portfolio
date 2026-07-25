'use client'

import { useEffect, useState } from 'react'
import styles from './AutoCadCursor.module.css'

export default function AutoCadCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Update CSS variables for grid magnifier
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add hover listeners to interactive elements
    const hoverTriggers = document.querySelectorAll('.hover-trigger')
    hoverTriggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', handleMouseEnter)
      trigger.addEventListener('mouseleave', handleMouseLeave)
    })

    document.addEventListener('mousemove', handleMouseMove)
    
    // Check if document.body exists before adding listeners
    if (document.body) {
      document.body.addEventListener('mouseenter', handleMouseEnter)
      document.body.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      
      // Check if document.body exists before removing listeners
      if (document.body) {
        document.body.removeEventListener('mouseenter', handleMouseEnter)
        document.body.removeEventListener('mouseleave', handleMouseLeave)
      }
      
      hoverTriggers.forEach(trigger => {
        trigger.removeEventListener('mouseenter', handleMouseEnter)
        trigger.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <div 
        className={`${styles.cursorLine} ${styles.cursorX} ${isHovering ? styles.active : ''}`}
        style={{ top: `${mousePosition.y}px` }}
      />
      <div 
        className={`${styles.cursorLine} ${styles.cursorY} ${isHovering ? styles.active : ''}`}
        style={{ left: `${mousePosition.x}px` }}
      />
    </>
  )
}

