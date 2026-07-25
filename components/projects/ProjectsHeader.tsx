import styles from './ProjectsHeader.module.css'

export default function ProjectsHeader() {
  return (
    <section className={styles.header}>
      <div className="container-fluid">
        <div className={styles.content}>
          <span className={styles.label}>Portfolio</span>
          <h1 className={styles.title}>Selected Works</h1>
        </div>
      </div>
    </section>
  )
}

