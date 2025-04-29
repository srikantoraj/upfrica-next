'use client'

import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'
import { Editor } from '@toast-ui/react-editor'
import { useRef, useEffect, useState } from 'react'

export default function ToastEditor({ initialValue, onChange }) {
  const editorRef = useRef(null)
  const [theme, setTheme] = useState('light')

  // Detect dark mode on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  // Set initial content if provided
  useEffect(() => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance()
      if (initialValue) {
        editorInstance.setHTML(initialValue)
      }
    }
  }, [initialValue])

  const handleChange = () => {
    const instance = editorRef.current.getInstance()
    const html = instance.getHTML()
    onChange(html)
  }

  return (
    <Editor
      ref={editorRef}
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      useCommandShortcut
      onChange={handleChange}
      theme={theme}
    />
  )
}