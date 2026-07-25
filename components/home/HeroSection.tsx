'use client'

import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const { t } = useLanguage()
  return (
    <header className={styles.hero}>
      <div className={styles.heroGrid}>
        <div className={styles.heroText}>
          <span className={styles.badge}>{t('hero_badge')}</span>

          <h1 className={styles.title}>
            {t('hero_title_part1')}
            <span className={styles.titleAccent}> {t('hero_title_part2')} </span>
            {t('hero_title_part3')}
          </h1>

          <p className={styles.description}>
            {t('hero_description')}
          </p>

          <div className={styles.cta}>
            <a href="#projects" className={`${styles.ctaLink} hover-trigger`}>
              {t('hero_cta')}
              <ArrowRight size={16} strokeWidth={2} />
            </a>
            <span className={styles.scrollHint}>{t('hero_scroll')}</span>
          </div>
        </div>
      </div>

      {/* 3D Abstract Element */}
      <div className={styles.abstractElement} aria-hidden="true">
        <div className={styles.abstractContainer}>
          <div className={styles.abstractColumn}>
            <div className={styles.perspectiveContainer}>
              <div className={styles.abstract3D}>
                <div className={styles.abstractRotating}>
                  {/* Axis & Grid Elements */}
                  <div className={styles.axisLine}></div>
                  <div className={styles.baseGrid}>
                    <div className={styles.baseGridPattern}></div>
                    <div className={styles.baseLabel}>Lvl.00 — Base</div>
                    <div className={styles.baseCornerTopLeft}></div>
                    <div className={styles.baseCornerBottomRight}></div>
                  </div>
                  {/* Vertical Elements */}
                  <div className={styles.verticalElement1}></div>
                  <div className={styles.verticalElement2}></div>
                  {/* Main Slab */}
                  <div className={styles.mainSlab}>
                    <div className={styles.slabCorner}></div>
                    <div className={styles.refPoint}></div>
                    <div className={styles.refPointLabel}>Ref.Point</div>
                  </div>
                  {/* Upper Volume */}
                  <div className={styles.upperVolume}>
                    <div className={styles.volumePattern}></div>
                    <div className={styles.volumeLabel}>Lvl.02 — Void</div>
                  </div>
                  {/* Dashed Circle */}
                  <div className={styles.dashedCircle}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
