import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import { mkdir, appendFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, basename, extname } from 'node:path'
import { randomUUID } from 'node:crypto'

const port = Number(process.env.PORT || 8787)
const dataDir = join(process.cwd(), 'data')
const uploadDir = join(dataDir, 'uploads')
await mkdir(uploadDir, { recursive: true })

type Json = Record<string, unknown>
const json = (res: ServerResponse, status: number, body: Json) => { res.writeHead(status, { 'content-type': 'application/json', 'access-control-allow-origin': 'http://localhost:5173' }); res.end(JSON.stringify(body)) }
const readBody = (req: IncomingMessage, max = 1_000_000) => new Promise<Buffer>((resolve, reject) => { const chunks: Buffer[] = []; let size = 0; req.on('data', c => { size += c.length; if (size > max) { reject(new Error('too_large')); req.destroy() } else chunks.push(c) }); req.on('end', () => resolve(Buffer.concat(chunks))); req.on('error', reject) })
async function readJson(req: IncomingMessage): Promise<Json> { return JSON.parse((await readBody(req)).toString('utf8') || '{}') }
async function record(type: string, payload: Json) { await appendFile(join(dataDir, `${type}.ndjson`), JSON.stringify({ id: randomUUID(), receivedAt: new Date().toISOString(), ...payload }) + '\n') }

async function notifySales(event: Json) {
  const url = process.env.SALES_WEBHOOK_URL
  if (!url) return { delivered: false, reason: 'webhook_not_configured' }
  const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: `New ProRack website enquiry\n${JSON.stringify(event, null, 2)}` }) })
  return { delivered: response.ok, status: response.status }
}

function replyFor(message: string, transcript: unknown) {
  const text = message.toLowerCase()
  if (/rfp|rfq|tender|upload/.test(text)) return 'You can attach the RFQ or RFP using the upload button below. Please also tell me your name, company, work email, project location and response deadline.'
  if (/new warehouse|expand|expansion/.test(text)) return 'Good place to start. What is your name, company, project location, available floor area and the main material or pallet type you need to store?'
  if (/@/.test(text)) return 'Thank you. Please share your company name, phone number, project location and target timeline. Our project team will receive the full conversation when you have consented.'
  if (/pallet|load|kg|ton|height|area|sq|sqm/.test(text)) return 'That helps the engineering brief. What quantity or number of pallet positions are you planning, and when should the system be operational?'
  if (Array.isArray(transcript) && transcript.length > 7) return 'I have enough for an initial brief. Please confirm your name, company, email and phone number so the right project specialist can follow up.'
  return 'Please add the project location, storage type, approximate capacity or load, timeline, and your contact details. You can also attach an RFQ or RFP below.'
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    if (req.method === 'OPTIONS') { res.writeHead(204, { 'access-control-allow-origin': 'http://localhost:5173', 'access-control-allow-headers': 'content-type,x-session-id,x-file-name,x-file-size' }); return res.end() }
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true, aiMode: process.env.OPENAI_API_KEY ? 'cloud-ready' : 'intake-only', salesWebhook: Boolean(process.env.SALES_WEBHOOK_URL) })
    if (req.method === 'POST' && url.pathname === '/api/track') { const body = await readJson(req); await record('events', body); return json(res, 202, { accepted: true }) }
    if (req.method === 'POST' && url.pathname === '/api/lead') {
      const body = await readJson(req)
      if (body.consent !== true || !body.name || !body.email || !body.message) return json(res, 400, { error: 'Name, email, requirement and consent are required.' })
      const lead = { source: 'website-form', ...body }; await record('leads', lead); const notification = await notifySales(lead)
      return json(res, 201, { accepted: true, notification })
    }
    if (req.method === 'POST' && url.pathname === '/api/chat') {
      const body = await readJson(req); const message = String(body.message || '').slice(0, 4000)
      if (!message) return json(res, 400, { error: 'Message required.' })
      const event = { source: 'website-chat', ...body, message }
      if (body.consent === true) await record('conversations', event)
      let notification: unknown = undefined
      if (body.consent === true && /@|phone|call|quote|rfq|rfp|tender|warehouse|project/i.test(message)) notification = await notifySales(event)
      return json(res, 200, { reply: replyFor(message, body.transcript), notification, mode: 'intake-rules' })
    }
    if (req.method === 'POST' && url.pathname === '/api/rfp-upload') {
      const sessionId = String(req.headers['x-session-id'] || '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 80)
      const original = decodeURIComponent(String(req.headers['x-file-name'] || 'request.bin'))
      const ext = extname(original).toLowerCase(); const allowed = new Set(['.pdf','.doc','.docx','.xls','.xlsx','.txt'])
      if (!sessionId || req.headers['x-consent'] !== 'true' || !allowed.has(ext)) return json(res, 400, { error: 'Consent, a supported file and a session are required.' })
      const bytes = await readBody(req, 10_000_000); const storedName = `${Date.now()}-${randomUUID()}${ext}`
      await writeFile(join(uploadDir, storedName), bytes)
      await record('uploads', { sessionId, originalName: basename(original), storedName, size: bytes.length, contentType: req.headers['content-type'] || '' })
      const notification = await notifySales({ source: 'website-upload', sessionId, originalName: basename(original), storedName, size: bytes.length })
      return json(res, 201, { reply: `Received ${basename(original)}. The document is stored for review. Please share your name, company, email and the submission deadline so our team can assess it.`, notification, assessmentMode: 'pending-ai-connection' })
    }
    json(res, 404, { error: 'Not found' })
  } catch (error) { json(res, error instanceof Error && error.message === 'too_large' ? 413 : 500, { error: 'Request could not be processed.' }) }
})

server.listen(port, '127.0.0.1', () => console.log(`ProRack website API listening on http://127.0.0.1:${port}`))
