# Underwriting Consultant (LOBuddy)

A mortgage underwriting assistant chat module powered by Claude via OpenRouter.

## Features

- **Full-screen chat interface** - ChatGPT/Claude-style UI with message bubbles
- **Document upload** - Supports PDFs (text extraction), images (vision), and markdown files
- **Streaming responses** - Tokens appear as they arrive for a responsive feel
- **Knowledge base integration** - Toggle guideline files to include in context
- **Markdown rendering** - Tables, lists, code blocks, and formatting in assistant responses
- **Mobile responsive** - Works on all screen sizes

## Setup

### Environment Variables

The following environment variable must be set:

**Local development** (`.env.local`):
```bash
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY_HERE
```

**Production** (Vercel):
⚠️ **IMPORTANT**: Add `OPENROUTER_API_KEY` to your Vercel project environment variables:
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `OPENROUTER_API_KEY` with the value from `.env.local`
4. Redeploy

### Dependencies

The following packages are required:
- `pdfjs-dist` - PDF text extraction
- `react-markdown` - Markdown rendering (already installed)
- `remark-gfm` - GitHub Flavored Markdown support (already installed)

Install with:
```bash
npm install pdfjs-dist
```

## Knowledge Base

Knowledge base files are stored in `/public/knowledge-base/` and loaded into the system prompt:

- `INSTRUCTIONS.md` - Base system prompt (always included)
- `FANNIE_MAE_QUICK_REFERENCE.md` - Fannie Mae guidelines
- `FHA_QUICK_REFERENCE.md` - FHA guidelines
- `INCOME_CALCULATION_CHEATSHEET.md` - Income calculation methods
- `DTI_AND_RESERVES_MATRIX.md` - DTI and reserve requirements
- `UWM_PINK_HELOC_COMPLETE_GUIDELINES.md` - UWM HELOC guidelines

Users can toggle these files on/off via the Knowledge Base panel in the UI.

## API

### POST `/api/chat/underwriting`

Proxies requests to OpenRouter API with streaming support.

**Request body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Can this deal work?" 
    }
  ],
  "model": "anthropic/claude-sonnet-4-5",
  "enabledKnowledgeBase": ["INSTRUCTIONS.md", "FANNIE_MAE_QUICK_REFERENCE.md"]
}
```

**Response:**
Server-sent events (SSE) stream with OpenRouter format.

## Design System

Follows Kanons design system:
- **Colors**: midnight (#0a0a0a), cream (#f8f7f4), ocean (#0066FF), terracotta (#FFB366)
- **Fonts**: Space Grotesk (headings), Inter (body)
- **Icons**: Lucide React (no emoji UI elements)
- **No gradients, no framer-motion**

## Usage

1. Navigate to `/workshop/work/underwriting`
2. Upload borrower documents (PDFs, images, .md files)
3. Ask questions about income, DTI, reserves, or guidelines
4. Toggle knowledge base files to customize context
5. Click "New Chat" to start over

## Future Enhancements

- [ ] Dynamic knowledge base file management via Supabase
- [ ] Chat history persistence
- [ ] Export chat to PDF/markdown
- [ ] Multiple conversation threads
- [ ] Custom model selection in UI
- [ ] Voice input support
