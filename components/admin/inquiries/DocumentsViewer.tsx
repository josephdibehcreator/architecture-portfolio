'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, ExternalLink, FileText, X } from 'lucide-react'
import styles from './DocumentsViewer.module.css'

interface DocumentsViewerProps {
  documents: string[]
}

export default function DocumentsViewer({ documents }: DocumentsViewerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const isPdf = (url: string) => {
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('pdf')
  }

  const isImage = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    return imageExtensions.some(ext => url.toLowerCase().includes(ext))
  }

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = url.split('/').pop() || 'document'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download error:', error)
      // Fallback: open in new tab
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (!documents || documents.length === 0) {
    return (
      <div className={styles.empty}>
        <FileText size={48} />
        <p>No documents uploaded</p>
      </div>
    )
  }

  return (
    <div className={styles.viewer}>
      <div className={styles.grid}>
        {documents.map((url, index) => (
          <div key={index} className={styles.documentCard}>
            {isPdf(url) ? (
              <div className={styles.pdfPreview}>
                <FileText size={48} />
                <p>PDF Document</p>
                <iframe
                  src={url}
                  className={styles.pdfFrame}
                  title={`PDF Preview ${index + 1}`}
                />
              </div>
            ) : isImage(url) ? (
              <div className={styles.imagePreview}>
                <Image
                  src={url}
                  alt={`Document ${index + 1}`}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            ) : (
              <div className={styles.filePreview}>
                <FileText size={48} />
                <p>Document {index + 1}</p>
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => handleDownload(url)}
                className={styles.downloadButton}
              >
                <Download size={16} />
                Download
              </button>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                <ExternalLink size={16} />
                Open
              </a>
            </div>
          </div>
        ))}
      </div>

      {previewUrl && (
        <div className={styles.previewModal} onClick={() => setPreviewUrl(null)}>
          <div className={styles.previewContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className={styles.closePreview}
            >
              <X size={24} />
            </button>
            {isPdf(previewUrl) ? (
              <iframe src={previewUrl} className={styles.fullPreview} />
            ) : (
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className={styles.fullImage}
                sizes="90vw"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
