'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send,
  Paperclip,
  Plus,
  FileText,
  Image as ImageIcon,
  X,
  Settings2,
  Loader2,
  ArrowDown,
  BookOpen,
  Upload,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
  attachments?: Attachment[]
}

interface Attachment {
  type: 'image' | 'pdf' | 'text'
  name: string
  data: string
  preview?: string
}

interface KBFile {
  filename: string
  size: number
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Review this borrower's paystubs and calculate qualifying income",
  'What are the FHA requirements for a self-employed borrower?',
  'Help me calculate DTI for a scenario with multiple income sources',
  'What documentation do I need for rental income on a Fannie Mae loan?',
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function UnderwritingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [kbFiles, setKbFiles] = useState<KBFile[]>([])
  const [enabledKB, setEnabledKB] = useState<string[]>([])
  const [showKBModal, setShowKBModal] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingKB, setUploadingKB] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [kbDragOver, setKbDragOver] = useState(false)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const kbFileInputRef = useRef<HTMLInputElement>(null)

  // ── Auto-scroll ──────────────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Auto-resize textarea ────────────────────────────────────────────────

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [input])

  // ── Focus textarea on mount ─────────────────────────────────────────────

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // ── Load knowledge base files ───────────────────────────────────────────

  const fetchKBFiles = useCallback(async () => {
    try {
      const response = await fetch('/api/knowledge-base/list')
      if (response.ok) {
        const files: KBFile[] = await response.json()
        setKbFiles(files)
        // Enable all files by default on first load
        if (enabledKB.length === 0) {
          setEnabledKB(files.map((f) => f.filename))
        }
      }
    } catch (error) {
      console.error('Failed to fetch KB files:', error)
    }
  }, [enabledKB.length])

  useEffect(() => {
    fetchKBFiles()
  }, [])

  // ── Knowledge base file upload ──────────────────────────────────────────

  const handleKBFileUpload = async (files: File[]) => {
    for (const file of files) {
      if (!file.name.endsWith('.md')) {
        continue
      }

      setUploadingKB(true)
      setUploadSuccess(null)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/knowledge-base/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setKbFiles(data.files)
          setUploadSuccess(data.filename)
          setTimeout(() => setUploadSuccess(null), 3000)
        } else {
          const error = await response.json()
          console.error('Upload failed:', error)
        }
      } catch (error) {
        console.error('Upload error:', error)
      } finally {
        setUploadingKB(false)
      }
    }
  }

  const handleKBFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || [])
    await handleKBFileUpload(files)
    if (kbFileInputRef.current) kbFileInputRef.current.value = ''
  }

  const handleKBDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setKbDragOver(true)
  }, [])

  const handleKBDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setKbDragOver(false)
  }, [])

  const handleKBDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setKbDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      await handleKBFileUpload(files)
    },
    []
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // ── File handling ───────────────────────────────────────────────────────

  const processFiles = useCallback(async (files: File[]) => {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setAttachments((prev) => [
            ...prev,
            { type: 'image', name: file.name, data: dataUrl, preview: dataUrl },
          ])
        }
        reader.readAsDataURL(file)
      } else if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const pdfjsLib = await import('pdfjs-dist')
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
          let fullText = ''

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ')
            fullText += pageText + '\n\n'
          }

          setAttachments((prev) => [
            ...prev,
            { type: 'pdf', name: file.name, data: fullText },
          ])
        } catch (error) {
          console.error('Failed to extract PDF text:', error)
        }
      } else if (
        file.type === 'text/markdown' ||
        file.name.endsWith('.md')
      ) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          setAttachments((prev) => [
            ...prev,
            { type: 'text', name: file.name, data: text },
          ])
        }
        reader.readAsText(file)
      }
    }
  }, [])

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || [])
    await processFiles(files)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Drag and drop ──────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      await processFiles(files)
    },
    [processFiles]
  )

  // ── Send message ───────────────────────────────────────────────────────

  const handleSend = async (overrideInput?: string) => {
    const text = overrideInput ?? input
    if (!text.trim() && attachments.length === 0) return
    if (isLoading) return

    // Build API message content
    let messageContent: any = text

    if (attachments.length > 0) {
      const hasImages = attachments.some((a) => a.type === 'image')

      if (hasImages) {
        const contentParts: any[] = []
        if (text.trim()) {
          contentParts.push({ type: 'text', text })
        }
        for (const attachment of attachments) {
          if (attachment.type === 'image') {
            contentParts.push({
              type: 'image_url',
              image_url: { url: attachment.data },
            })
          } else {
            const textPart = contentParts.find((p) => p.type === 'text')
            if (textPart) {
              textPart.text += `\n\n[Attached file: ${attachment.name}]\n${attachment.data}`
            } else {
              contentParts.push({
                type: 'text',
                text: `[Attached file: ${attachment.name}]\n${attachment.data}`,
              })
            }
          }
        }
        messageContent = contentParts
      } else {
        let fullText = text
        for (const attachment of attachments) {
          fullText += `\n\n[Attached file: ${attachment.name}]\n${attachment.data}`
        }
        messageContent = fullText
      }
    }

    const userMessage: Message = {
      role: 'user',
      content: text,
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setAttachments([])
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    const apiMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: messageContent },
    ]

    try {
      const response = await fetch('/api/chat/underwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          enabledKnowledgeBase: enabledKB,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  assistantMessage += content
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                    }
                    return updated
                  })
                }
              } catch {
                // skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const newChat = () => {
    setMessages([])
    setInput('')
    setAttachments([])
    textareaRef.current?.focus()
  }

  const toggleKB = (file: string) => {
    setEnabledKB((prev) =>
      prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
    )
  }

  const hasMessages = messages.length > 0

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 flex flex-col bg-ink overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ── Drag overlay ─────────────────────────────────────────────── */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm border-2 border-dashed border-royal/50 rounded-lg pointer-events-none">
          <div className="text-center">
            <Paperclip size={48} className="text-royal mx-auto mb-3" />
            <p className="text-paper text-lg font-display">
              Drop files here
            </p>
            <p className="text-paper/50 text-sm mt-1">
              PDFs, images, or markdown
            </p>
          </div>
        </div>
      )}

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-paper/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-royal/15 flex items-center justify-center">
            <BookOpen size={14} className="text-royal" />
          </div>
          <span className="font-display text-sm font-medium text-paper/90 tracking-tight">
            LOBuddy
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowKBModal(true)}
            className="relative p-2 rounded-lg text-paper/40 hover:text-paper/80 hover:bg-paper/[0.05] transition-colors"
            title="Knowledge base settings"
          >
            <Settings2 size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-royal" />
          </button>
          <button
            onClick={newChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-paper/40 hover:text-paper/80 hover:bg-paper/[0.05] transition-colors text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* ── Chat area ────────────────────────────────────────────────── */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* ── Welcome state ──────────────────────────────────────── */}
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12">
              <div className="w-12 h-12 rounded-2xl bg-royal/15 flex items-center justify-center mb-6">
                <BookOpen size={24} className="text-royal" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-paper mb-2 tracking-tight">
                LOBuddy
              </h1>
              <p className="text-paper/40 text-sm sm:text-base text-center max-w-md mb-10">
                Upload borrower docs and get instant underwriting analysis,
                guideline lookups, and income calculations.
              </p>

              <div className="w-full max-w-lg space-y-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-paper/[0.08] text-paper/60 text-sm hover:border-paper/20 hover:text-paper/80 hover:bg-paper/[0.03] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Messages ───────────────────────────────────────────── */}
          {hasMessages && (
            <div className="py-6 space-y-6">
              {messages.map((message, index) => (
                <div key={index}>
                  {message.role === 'user' ? (
                    /* ── User message ──────────────────────────────── */
                    <div className="flex justify-end">
                      <div className="max-w-[85%] sm:max-w-[75%]">
                        <div className="bg-paper/[0.08] rounded-2xl rounded-br-md px-4 py-3">
                          <p className="text-paper/90 text-sm whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {message.attachments.map((att, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 bg-paper/[0.08] rounded-lg px-2.5 py-1 text-xs text-paper/50"
                                  >
                                    {att.type === 'image' ? (
                                      <ImageIcon size={12} />
                                    ) : (
                                      <FileText size={12} />
                                    )}
                                    {att.name}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── Assistant message ─────────────────────────── */
                    <div className="flex justify-start">
                      <div className="max-w-[95%] sm:max-w-[85%]">
                        {message.content ? (
                          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-display prose-headings:text-paper prose-headings:font-semibold prose-p:text-paper/80 prose-p:leading-relaxed prose-strong:text-paper prose-li:text-paper/80 prose-li:leading-relaxed prose-a:text-royal prose-a:no-underline hover:prose-a:underline prose-code:text-peach prose-code:text-xs prose-code:bg-paper/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-paper/[0.04] prose-pre:border prose-pre:border-paper/[0.08] prose-th:text-paper/60 prose-td:text-paper/70 prose-hr:border-paper/10 prose-blockquote:border-royal/30 prose-blockquote:text-paper/60">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 py-1">
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-paper/30 animate-pulse" />
                              <span className="w-1.5 h-1.5 rounded-full bg-paper/30 animate-pulse [animation-delay:150ms]" />
                              <span className="w-1.5 h-1.5 rounded-full bg-paper/30 animate-pulse [animation-delay:300ms]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading &&
                messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 py-1">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-paper/30 animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-paper/30 animate-pulse [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-paper/30 animate-pulse [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── Scroll-to-bottom button ──────────────────────────────────── */}
      {showScrollBtn && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={scrollToBottom}
            className="p-2 rounded-full bg-paper/10 backdrop-blur-sm text-paper/60 hover:bg-paper/20 hover:text-paper transition-colors shadow-lg"
          >
            <ArrowDown size={16} />
          </button>
        </div>
      )}

      {/* ── Input area ───────────────────────────────────────────────── */}
      <div className="flex-shrink-0 pb-4 pt-2 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Attachment pills */}
          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-paper/[0.08] border border-paper/[0.08] rounded-lg px-3 py-1.5 group"
                >
                  {attachment.type === 'image' && attachment.preview ? (
                    <img
                      src={attachment.preview}
                      alt={attachment.name}
                      className="w-5 h-5 object-cover rounded"
                    />
                  ) : attachment.type === 'pdf' ? (
                    <FileText size={14} className="text-peach" />
                  ) : (
                    <FileText size={14} className="text-royal" />
                  )}
                  <span className="text-xs text-paper/60 max-w-[140px] truncate">
                    {attachment.name}
                  </span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-paper/30 hover:text-paper/70 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="relative flex items-end gap-2 bg-paper/[0.06] border border-paper/[0.1] rounded-2xl px-3 py-2 focus-within:border-paper/20 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-shrink-0 p-1.5 rounded-lg text-paper/30 hover:text-paper/60 hover:bg-paper/[0.06] transition-colors disabled:opacity-30"
              title="Attach files"
            >
              <Paperclip size={18} />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about guidelines, upload docs, or describe a scenario..."
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent text-paper/90 text-sm placeholder:text-paper/25 focus:outline-none min-h-[24px] max-h-[200px] py-1.5 leading-relaxed disabled:opacity-50"
              rows={1}
            />

            <button
              onClick={() => handleSend()}
              disabled={
                isLoading || (!input.trim() && attachments.length === 0)
              }
              className="flex-shrink-0 p-1.5 rounded-lg text-paper/30 hover:text-royal transition-colors disabled:opacity-20 disabled:hover:text-paper/30"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>

          <p className="text-center text-[11px] text-paper/20 mt-2">
            Enter to send · Shift+Enter for new line · Drop files anywhere
          </p>
        </div>
      </div>

      {/* ── Knowledge Base Modal ──────────────────────────────────────── */}
      {showKBModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowKBModal(false)
          }}
        >
          <div className="w-full max-w-md bg-ink border border-paper/[0.1] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-paper/[0.08]">
              <div>
                <h2 className="font-display text-base font-medium text-paper">
                  Knowledge Base
                </h2>
                <p className="text-xs text-paper/40 mt-0.5">
                  Select which references to include in context
                </p>
              </div>
              <button
                onClick={() => setShowKBModal(false)}
                className="p-1.5 rounded-lg text-paper/30 hover:text-paper/60 hover:bg-paper/[0.06] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Upload Section ────────────────────────────────────── */}
            <div className="p-3 border-b border-paper/[0.08]">
              <input
                ref={kbFileInputRef}
                type="file"
                accept=".md"
                multiple
                onChange={handleKBFileChange}
                className="hidden"
              />
              <div
                onDragOver={handleKBDragOver}
                onDragLeave={handleKBDragLeave}
                onDrop={handleKBDrop}
                onClick={() => kbFileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all ${
                  kbDragOver
                    ? 'border-royal/50 bg-royal/[0.08]'
                    : 'border-paper/[0.15] hover:border-paper/30 hover:bg-paper/[0.03]'
                }`}
              >
                <Upload
                  size={24}
                  className={`mx-auto mb-2 ${
                    kbDragOver ? 'text-royal' : 'text-paper/40'
                  }`}
                />
                <p className="text-sm font-medium text-paper/70 mb-1">
                  {uploadingKB
                    ? 'Uploading...'
                    : 'Upload Guidelines'}
                </p>
                <p className="text-xs text-paper/40">
                  Click or drop .md files here (max 5MB)
                </p>
                {uploadSuccess && (
                  <p className="text-xs text-royal mt-2">
                    Uploaded {uploadSuccess} successfully
                  </p>
                )}
              </div>
            </div>

            {/* ── File List ─────────────────────────────────────────── */}
            <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto">
              {kbFiles.map((kbFile) => {
                const isEnabled = enabledKB.includes(kbFile.filename)
                return (
                  <button
                    key={kbFile.filename}
                    onClick={() => toggleKB(kbFile.filename)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      isEnabled
                        ? 'bg-royal/10 text-paper/90'
                        : 'text-paper/40 hover:bg-paper/[0.04] hover:text-paper/60'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors ${
                        isEnabled
                          ? 'bg-royal border-royal'
                          : 'border-paper/20'
                      }`}
                    >
                      {isEnabled && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          className="text-paper"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <FileText
                      size={14}
                      className={isEnabled ? 'text-royal' : 'text-paper/30'}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {kbFile.filename}
                      </p>
                      <p className="text-[11px] text-paper/30">
                        {formatFileSize(kbFile.size)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-paper/[0.08]">
              <span className="text-xs text-paper/30">
                {enabledKB.length} of {kbFiles.length} active
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setEnabledKB(
                      enabledKB.length === kbFiles.length
                        ? []
                        : kbFiles.map((k) => k.filename)
                    )
                  }
                  className="px-3 py-1.5 text-xs text-paper/50 hover:text-paper/80 rounded-lg hover:bg-paper/[0.06] transition-colors"
                >
                  {enabledKB.length === kbFiles.length
                    ? 'Disable All'
                    : 'Enable All'}
                </button>
                <button
                  onClick={() => setShowKBModal(false)}
                  className="px-3 py-1.5 text-xs bg-royal text-paper rounded-lg hover:bg-royal/90 transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
