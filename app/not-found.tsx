import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './not-found.module.css'

// robots must stay declared: without it the root layout's `index, follow` is inherited
// and contradicts the `noindex` Next.js injects into not-found pages automatically.
export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you are looking for is no longer available. Explore our architecture and interior design work, services, and studio instead.',
  robots: {
    index: false,
    follow: true,
  },
}

const destinations = [
  { href: '/projects', label: 'Projects', hint: 'Residential, commercial and hospitality work' },
  { href: '/services', label: 'Services', hint: 'Architecture, interiors, permits and more' },
  { href: '/about', label: 'About', hint: 'The studio, our approach and our regions' },
  { href: '/news', label: 'Blog & Press', hint: 'Design insights and studio news' },
]

export default function NotFound() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>This page could not be found</h1>
        <p className={styles.message}>
          The page may have been moved or removed. Here are the parts of the site people
          usually look for.
        </p>

        <ul className={styles.links}>
          {destinations.map(({ href, label, hint }) => (
            <li key={href}>
              <Link href={href} className={styles.link}>
                <span className={styles.linkLabel}>{label}</span>
                <span className={styles.linkHint}>{hint}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className={styles.homeLink}>
          Back to homepage
        </Link>
      </div>
    </section>
  )
}
