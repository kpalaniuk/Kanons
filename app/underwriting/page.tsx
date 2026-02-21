'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Plus, FileText, Image as ImageIcon, X, ChevronRight, ChevronDown, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
  attachments?: Attachment[]
}

interface Attachment {
  type: 'image' | 'pdf' | 'text'
  name: string
  data: string // base64 or text content
  preview?: string
}

const KNOWLEDGE_BASE_FILES = [
  'INSTRUCTIONS.md',
  'FANNIE_MAE_QUICK_REFERENCE.md',
  'FHA_QUICK_REFERENCE.md',
  'INCOME_CALCULATION_CHEATSHEET.md',
  'DTI_AND_RESERVES_MATRIX.md',
  'UWM_PINK_HELOC_COMPLETE_GUIDELINES.md',
]

export default function UnderwritingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false)
  const [enabledKB, setEnabledKB] = useState<string[]>(KNOWLEDGE_BASE_FILES)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        // Handle image
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          setAttachments(prev => [
            ...prev,
            {
              type: 'image',
              name: file.name,
              data: dataUrl,
              preview: dataUrl,
            },
          ])
        }
        reader.readAsDataURL(file)
      } else if (file.type === 'application/pdf') {
        // Handle PDF
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
          
          setAttachments(prev => [
            ...prev,
            {
              type: 'pdf',
              name: file.name,
              data: fullText,
            },
          ])
        } catch (error) {
          console.error('Failed to extract PDF text:', error)
          alert('Failed to read PDF file')
        }
      } else if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        // Handle markdown
        const reader = new FileReader()
        reader.onload = (e) => {
          const text = e.target?.result as string
          setAttachments(prev => [
            ...prev,
            {
              type: 'text',
              name: file.name,
              data: text,
            },
          ])
        }
        reader.readAsText(file)
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return
    if (isLoading) return

    // Build message content
    let messageContent: any = input

    if (attachments.length > 0) {
      // For images, use vision format
      const hasImages = attachments.some(a => a.type === 'image')
      
      if (hasImages) {
        const contentParts = []
        
        if (input.trim()) {
          contentParts.push({ type: 'text', text: input })
        }
        
        for (const attachment of attachments) {
          if (attachment.type === 'image') {
            contentParts.push({
              type: 'image_url',
              image_url: { url: attachment.data },
            })
          } else {
            // For PDF/text, append to text content
            const textPart = contentParts.find(p => p.type === 'text')
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
        // No images, just append text
        let fullText = input
        for (const attachment of attachments) {
          fullText += `\n\n[Attached file: ${attachment.name}]\n${attachment.data}`
        }
        messageContent = fullText
      }
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setAttachments([])
    setIsLoading(true)

    // Prepare API messages
    const apiMessages = [
      ...messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: 'user' as const,
        content: messageContent,
      },
    ]

    try {
      const response = await fetch('/api/chat/underwriting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          enabledKnowledgeBase: enabledKB,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      // Add empty assistant message that we'll update
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '' },
      ])

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
                  // Update the last message
                  setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                    }
                    return newMessages
                  })
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
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
  }

  const toggleKB = (file: string) => {
    setEnabledKB(prev =>
      prev.includes(file)
        ? prev.filter(f => f !== file)
        : [...prev, file]
    )
  }

  return (
    <div className="flex h-screen bg-midnight">
      {/* Knowledge Base Panel */}
      {showKnowledgeBase && (
        <div className="w-80 bg-cream border-r border-midnight/10 flex flex-col">
          <div className="p-4 border-b border-midnight/10">
            <h2 className="font-semibold text-midnight">Knowledge Base</h2>
            <p className="text-xs text-midnight/60 mt-1">
              Toggle files to include in context
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {KNOWLEDGE_BASE_FILES.map(file => (
              <label
                key={file}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-sand cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={enabledKB.includes(file)}
                  onChange={() => toggleKB(file)}
                  className="rounded border-midnight/20"
                />
                <FileText size={14} className="text-ocean flex-shrink-0" />
                <span className="text-sm text-midnight flex-1 break-all">
                  {file}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-cream border-b border-midnight/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-midnight">
              Underwriting Consultant
            </h1>
            <p className="text-sm text-midnight/60">
              LOBuddy - Senior Underwriting Assistant
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
              className="flex items-center gap-2 px-4 py-2 bg-ocean text-cream rounded-lg hover:bg-ocean/90 transition-colors text-sm font-medium"
            >
              {showKnowledgeBase ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Knowledge Base
            </button>
            <button
              onClick={newChat}
              className="flex items-center gap-2 px-4 py-2 bg-terracotta text-cream rounded-lg hover:bg-terracotta/90 transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-2xl">
                <h2 className="text-2xl font-bold text-cream mb-4">
                  Welcome to LOBuddy
                </h2>
                <p className="text-cream/60 mb-6">
                  Upload borrower documents (paystubs, W-2s, tax returns, bank statements) 
                  and I'll help you analyze income, calculate DTI, check reserves, and flag 
                  any documentation gaps or conditions.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-cream/5 p-4 rounded-lg border border-cream/10">
                    <h3 className="font-semibold text-cream mb-2">Quick Analysis</h3>
                    <p className="text-sm text-cream/60">
                      Upload docs and ask "Can this deal work?" for a fast scenario check
                    </p>
                  </div>
                  <div className="bg-cream/5 p-4 rounded-lg border border-cream/10">
                    <h3 className="font-semibold text-cream mb-2">Guidelines</h3>
                    <p className="text-sm text-cream/60">
                      Ask about Fannie Mae, FHA, VA, or DSCR requirements with specific citations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-ocean text-cream'
                    : 'bg-cream text-midnight'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-headings:text-midnight prose-p:text-midnight prose-strong:text-midnight prose-li:text-midnight prose-table:text-midnight">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.attachments.map((att, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-cream/10 rounded-lg px-3 py-1 text-sm"
                          >
                            {att.type === 'image' ? (
                              <ImageIcon size={14} />
                            ) : (
                              <FileText size={14} />
                            )}
                            <span className="text-xs">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-cream text-midnight rounded-2xl px-6 py-4">
                <Loader2 size={20} className="animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-cream border-t border-midnight/10 p-6">
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-sand rounded-lg px-3 py-2"
                >
                  {attachment.type === 'image' ? (
                    <>
                      {attachment.preview && (
                        <img
                          src={attachment.preview}
                          alt={attachment.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span className="text-sm text-midnight">{attachment.name}</span>
                    </>
                  ) : (
                    <>
                      <FileText size={16} className="text-ocean" />
                      <span className="text-sm text-midnight">{attachment.name}</span>
                    </>
                  )}
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-midnight/40 hover:text-midnight"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3">
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
              className="flex-shrink-0 p-3 bg-sand text-midnight rounded-xl hover:bg-sand/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Paperclip size={20} />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the scenario or upload documents..."
              disabled={isLoading}
              className="flex-1 resize-none bg-sand text-midnight rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ocean min-h-[3rem] max-h-48 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && attachments.length === 0)}
              className="flex-shrink-0 p-3 bg-ocean text-cream rounded-xl hover:bg-ocean/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>

          <p className="text-xs text-midnight/40 mt-2">
            Upload PDFs, images, or markdown files. Press Enter to send, Shift+Enter for new line.
          </p>
        </div>
      </div>
    </div>
  )
}
