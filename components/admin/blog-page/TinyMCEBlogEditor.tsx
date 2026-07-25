'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef } from 'react'
import styles from './TinyMCEBlogEditor.module.css'

type TinyMCEEditorRef = {
  getContent: () => string
  setContent: (content: string) => void
}

// TinyMCE's React wrapper typings can conflict with Next's `dynamic()` typing.
// We intentionally cast to keep SSR disabled and builds stable.
const Editor = dynamic<any>(
  async () => {
    const mod = await import('@tinymce/tinymce-react')
    return mod.Editor as any
  },
  {
    ssr: false,
    loading: () => <div className={styles.loading}>Loading editor…</div>,
  }
)

export interface TinyMCEBlogEditorProps {
  value: string
  onChange: (nextHtml: string) => void
  disabled?: boolean
  hasError?: boolean
}

const APPROVED_TEXT_COLORS: Array<{ hex: string; name: string }> = [
  { hex: '#111827', name: 'Gray 900' },
  { hex: '#1f2937', name: 'Gray 800' },
  { hex: '#374151', name: 'Gray 700' },
  { hex: '#4b5563', name: 'Gray 600' },
  { hex: '#6b7280', name: 'Gray 500' },
  { hex: '#9ca3af', name: 'Gray 400' },
  { hex: '#B09D89', name: 'Brand' },
  { hex: '#D4CEC7', name: 'Brand light' },
  { hex: '#FF3333', name: 'CAD red' },
  { hex: '#EF4444', name: 'Accent red' },
]

export default function TinyMCEBlogEditor({
  value,
  onChange,
  disabled = false,
  hasError = false,
}: TinyMCEBlogEditorProps) {
  const editorRef = useRef<TinyMCEEditorRef | null>(null)
  const isApplyingExternalValueRef = useRef(false)

  const fontsizeFormats = useMemo(() => {
    return Array.from({ length: 72 }, (_, i) => `${i + 1}px`).join(' ')
  }, [])

  const colorMap = useMemo(() => {
    // TinyMCE expects ["RRGGBB","Name", ...] with NO leading '#'
    return APPROVED_TEXT_COLORS.flatMap((c) => [c.hex.replace('#', ''), c.name])
  }, [])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const current = editor.getContent()
    if (current !== (value || '')) {
      isApplyingExternalValueRef.current = true
      editor.setContent(value || '')
      // allow next tick before unfreezing change handler
      queueMicrotask(() => {
        isApplyingExternalValueRef.current = false
      })
    }
  }, [value])

  return (
    <div className={`${styles.wrapper} ${hasError ? styles.error : ''} ${disabled ? styles.disabled : ''}`}>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(_evt: unknown, editor: any) => {
          editorRef.current = editor as unknown as TinyMCEEditorRef
        }}
        value={value}
        onEditorChange={(next: string) => {
          if (isApplyingExternalValueRef.current) return
          onChange(next)
        }}
        disabled={disabled}
        init={{
          height: 420,
          menubar: false,
          branding: false,
          statusbar: true,
          resize: false,
          plugins: ['lists', 'advlist', 'autoresize', 'paste', 'table', 'link'],
          toolbar:
            'undo redo | blocks | fontsize | bold italic | forecolor | link | alignleft aligncenter alignright alignjustify | bullist numlist | table | removeformat',
          table_toolbar:
            'tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tabledelete',
          link_default_target: '_blank',
          link_assume_external_targets: true,
          link_title: false,
          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
          font_size_formats: fontsizeFormats,
          custom_colors: false,
          color_map: colorMap,
          color_cols: 5,
          // Preserve pasted structure; avoid merging formats so tables/structure survive; backend sanitizes on save
          paste_merge_formats: false,
          paste_data_images: true,
          content_style: `
            body {
              font-family: var(--font-montserrat), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              font-size: 16px;
              line-height: 1.85;
              color: #1f2937;
              margin: 12px;
            }
            p { margin: 0 0 1rem; }
            h1, h2, h3, h4, h5, h6 { margin: 1.5rem 0 0.75rem; }
            ul, ol { margin: 0.75rem 0 1rem; padding-left: 1.75rem; }
            table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
            th, td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
            th { background: #f3f4f6; font-weight: 600; }
          `,
        }}
      />
    </div>
  )
}

