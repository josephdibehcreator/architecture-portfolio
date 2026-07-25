'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Plus } from 'lucide-react'
import { type Inquiry } from '@/services/admin/inquiries'
import styles from './NotesEditor.module.css'

interface NotesEditorProps {
  inquiry: Inquiry
  onStatusChange: (id: string, status: string, adminNote?: string) => Promise<void>
  isLoading?: boolean
}

export default function NotesEditor({
  inquiry,
  onStatusChange,
  isLoading = false
}: NotesEditorProps) {
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setSaving(true)
    try {
      await onStatusChange(inquiry._id, inquiry.status || 'draft', newNote.trim())
      setNewNote('')
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const notes = inquiry.adminNotes || []

  return (
    <div className={styles.notesEditor}>
      <div className={styles.addNoteSection}>
        <label className={styles.label}>
          <MessageSquare size={16} />
          Add Admin Note
        </label>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add an internal note about this inquiry..."
          className={styles.textarea}
          rows={3}
          disabled={saving || isLoading}
        />
        <button
          type="button"
          onClick={handleAddNote}
          className={styles.addButton}
          disabled={!newNote.trim() || saving || isLoading}
        >
          <Plus size={16} />
          Add Note
        </button>
      </div>

      <div className={styles.notesList}>
        <h3 className={styles.notesTitle}>
          Notes ({notes.length})
        </h3>
        {notes.length === 0 ? (
          <div className={styles.empty}>
            <p>No notes yet</p>
          </div>
        ) : (
          <div className={styles.notes}>
            {notes.map((note, index) => (
              <div key={index} className={styles.noteItem}>
                <div className={styles.noteHeader}>
                  <span className={styles.noteAuthor}>{note.author?.email || 'Admin'}</span>
                  <span className={styles.noteDate}>{formatDate(note.createdAt)}</span>
                </div>
                <div className={styles.noteText}>{note.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
