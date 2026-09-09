import { useEffect, useState } from 'react'
import { WarehouseVisual } from './WarehouseVisual'
import { ArrowRight, Box, Check, ChevronRight, Factory, Menu, MessageCircle, Ruler, ShieldCheck, Warehouse, X } from 'lucide-react'

type Attribution = { landingPage: string; referrer: string; utmSource: string; utmMedium: string; utmCampaign: string }

const solutions = [
  { icon: Warehouse, title: 'Pallet racking', text: 'Selective, double-deep and high-density layouts designed around your pallets, equipment and throughput.' },
  { icon: Box, title: 'Industrial shelving', text: 'Organised, accessible storage for components, spares and fast-moving inventory.' },
  { icon: Ruler, title: 'Mezzanine systems', text: 'Create productive floor area within your existing building envelope.' },
  { icon: Factory, title: 'Automated warehouses', text: 'Storage structures engineered to work with conveyors, shuttles and material-handling systems.' },
]

const process = ['Discovery', 'Site & data study', 'Engineering', 'Manufacturing', 'Installation', 'Handover']

function getAttribution(): Attribution {
  const p = new URLSearchParams(location.search)
  return { landingPage: location.href, referrer: document.referrer, utmSource: p.get('utm_source') || '', utmMedium: p.get('utm_medium') || '', utmCampaign: p.get('utm_campaign') || '' }
}

const faqs = [
  ['Which storage system is right for my warehouse?', 'The right system depends on your load dimensions, SKU mix, available height, handling equipment and picking frequency. Share those details in your project brief so the team can assess the options.'],
  ['Can you work within an existing warehouse?', 'Yes. A site and workflow study helps identify clearances, access routes and installation constraints. Expansion and reconfiguration can be considered alongside a new layout.'],
  ['What should I include in an enquiry?', 'Include your site location, building dimensions, storage type, approximate capacity, load weights and target timeline. An early brief is enough to start a conversation.'],
  ['Do you support automation projects?', 'Storage structures can be planned around conveyors, shuttles and other handling equipment. Equipment interfaces and tolerances are reviewed during engineering.'],
  ['Can I share an RFQ or warehouse drawing?', 'Select RFQ / RFP review in the enquiry form and describe the documents and response deadline. The project team can arrange the document exchange when they follow up.'],
]

export function App() {
  const [menu, setMenu] = useState(false)
  const [consent, setConsent] = useState(false)
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState(0)
  const [trackingChoice, setTrackingChoice] = useState(() => localStorage.getItem('prorack_analytics_consent'))

  useEffect(() => {
    if (localStorage.getItem('prorack_analytics_consent') === 'yes') {
      fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ event: 'page_view', sessionId: localStorage.getItem('prorack_session') || crypto.randomUUID(), attribution: getAttribution() }) }).catch(() => {})
    }
  }, [])

  function chooseTracking(accepted: boolean) {
    const choice = accepted ? 'yes' : 'no'
    localStorage.setItem('prorack_analytics_consent', choice); setTrackingChoice(choice)
    if (accepted) fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ event: 'analytics_consent_and_page_view', sessionId: localStorage.getItem('prorack_session') || crypto.randomUUID(), attribution: getAttribution() }) }).catch(() => {})
  }

  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') setMenu(false) }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [])

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (submitting) return
    const element = e.currentTarget
    const form = new FormData(element)
    setSubmitting(true); setNotice('')
    try {
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(form), consent, ...(trackingChoice === 'yes' ? { attribution: getAttribution() } : {}) }), signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error('Submission failed')
      setNotice('Thank you. Your brief has been received for review.'); element.reset(); setConsent(false)
    } catch { setNotice('Your brief could not be sent. Your details are still here. Please try again or email info@prorackstoragesolutions.com.') }
    finally { setSubmitting(false) }
  }

  return <div>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="logo" href="#top" aria-label="ProRack home"><span>PRO</span>RACK<small>STORAGE SOLUTIONS</small></a>
      <nav id="navigation" aria-label="Main navigation" onClick={() => setMenu(false)} className={menu ? 'open' : ''}><a href="#solutions">Solutions</a><a href="#process">How we work</a><a href="#industries">Industries</a><a href="#about">Company</a><a href="#founder">Founder's Message</a><a className="nav-cta" href="#contact">Start a project <ArrowRight size={16}/></a></nav>
      <button className="menu" onClick={() => setMenu(v => !v)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="navigation">{menu ? <X/> : <Menu/>}</button>
    </header>

    <main id="main"><span id="top"/>
      <section className="hero">
        <div className="hero-grid"/><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
        <div className="hero-copy"><div className="eyebrow"><span/> ENGINEERED STORAGE · BUILT IN INDIA</div><h1>Better storage.<br/>Stronger <em>operations.</em></h1><p>From the first layout to final handover, ProRack designs, manufactures and installs industrial storage systems that make every square metre work harder.</p><div className="hero-actions"><a className="primary" href="#contact">Discuss your project <ArrowRight size={18}/></a><a className="secondary" href="#solutions">Explore our solutions <ArrowRight size={18}/></a></div></div>
        <div className="hero-visual"><div className="visual-label"><span>PRORACK / SYSTEMS THINKING</span><span>01 — 04</span></div><WarehouseVisual/><div className="visual-caption"><span>SPACE. STRUCTURE. POSSIBILITY.</span><small>Conceptual storage layout</small></div></div>
        <div className="hero-proof"><div><strong>End-to-end</strong><span>Design to installation</span></div><div><strong>Built to fit</strong><span>Every load and workflow</span></div><div><strong>One team</strong><span>Engineering + delivery</span></div></div>
      </section>

      <section className="intro" id="about"><div><span className="section-kicker">MORE THAN RACKING</span><h2>Infrastructure for the way your warehouse actually moves.</h2></div><p>Storage affects picking time, safety, expansion and the economics of your building. We bring layout, structural engineering, manufacturing and installation into one accountable process.</p></section>

      <section className="founder-message" id="founder"><div className="section-heading"><span className="section-kicker">FOUNDER’S MESSAGE</span><h2>Engineered for durability, designed for growth.</h2></div><div className="founder-grid"><blockquote className="founder-quote"><p>“When we founded ProRack, our vision was simple yet uncompromising: to transform industrial storage into a competitive advantage. Every rack we design and manufacture is engineered to maximize safety, space, and operational throughput for modern logistics.”</p><cite><strong>Roshan Sudhir</strong><span>Founder & Managing Director, ProRack Storage Solutions</span></cite></blockquote></div></section>

      <section className="solutions" id="solutions"><div className="section-heading"><span className="section-kicker">SOLUTIONS</span><h2>Built for real operating conditions.</h2></div><div className="solution-grid">{solutions.map(({icon: Icon,title,text}, i) => <article key={title}><div className="solution-num">0{i+1}</div><Icon/><h3>{title}</h3><p>{text}</p><a href="#contact">Discuss this solution <ChevronRight size={16}/></a></article>)}</div>
        <div className="solution-explorer"><div><span className="section-kicker">FIND YOUR FIT</span><h3>A different system.<br/>For every kind of load.</h3><p>Explore the starting points for your storage brief.</p><div className="solution-options" role="group" aria-label="Explore storage systems">{solutions.map((item,i)=><button key={item.title} aria-pressed={selectedSolution===i} onClick={()=>setSelectedSolution(i)}>{item.title}<ArrowRight size={16}/></button>)}</div></div><div className="solution-detail" aria-live="polite"><span className="detail-number">0{selectedSolution+1}</span><h3>{solutions[selectedSolution].title}</h3><p>{solutions[selectedSolution].text}</p><h4>What we review with you</h4><ul>{[['Pallet dimensions and load weights','Handling equipment and aisle access','SKU mix and required pallet positions'],['Component dimensions and picking frequency','Shelf access and replenishment flow','Space for a changing inventory'],['Available clear height and floor constraints','Intended use and access requirements','Loads, services and future expansion'],['Equipment interfaces and tolerances','Throughput and movement patterns','Maintenance access and operating clearances']][selectedSolution].map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul><a href="#contact">Plan this system <ArrowRight size={17}/></a></div></div>
      </section>

      <section className="proof-band"><div className="proof-art"><WarehouseVisual/><div className="engineering-note"><span>THE DETAILS MAKE THE DIFFERENCE</span><strong>Every beam has a purpose.</strong><p>Load. Access. Flow. Room to grow.</p></div></div><div className="proof-copy"><span className="section-kicker light">ENGINEERING FIRST</span><h2>A system you can build, operate and expand.</h2><p>Every recommendation begins with the load, equipment, movement and constraints on your floor. That keeps the design grounded long after installation.</p><ul><li><Check/> Layouts shaped around material flow</li><li><Check/> Structural design for the actual application</li><li><Check/> Manufacturing and installation under one delivery plan</li></ul></div></section>

      <section className="process" id="process"><div className="section-heading"><span className="section-kicker">ONE CONNECTED PROCESS</span><h2>Clarity from first question to handover.</h2><p>Your project moves through a visible engineering and delivery sequence.</p></div><ol>{process.map((p,i)=><li key={p}><span>{String(i+1).padStart(2,'0')}</span><strong>{p}</strong><p>{["Understand the operation and define the requirement.","Review the site, inventory and material movement.","Develop the layout and structural design.","Translate the approved design into components.","Coordinate delivery and on-site assembly.","Review the completed system and project documentation."][i]}</p></li>)}</ol></section>

      <section className="industries" id="industries"><div className="section-heading"><span className="section-kicker">WHERE WE WORK</span><h2>Storage for demanding operations.</h2></div><div className="industry-list"><article><small>01</small><h3>Manufacturing & distribution</h3><p>Heavy-duty storage, work-in-progress flow and resilient layouts for changing demand.</p></article><article><small>02</small><h3>Automated warehousing</h3><p>Structures aligned with shuttles, conveyors, controls and equipment tolerances.</p></article><article><small>03</small><h3>Quick commerce & fulfilment</h3><p>Fast access, high SKU density and scalable picking environments.</p></article></div></section>

      <section className="faq" id="faq"><div><span className="section-kicker">BEFORE WE GET STARTED</span><h2>Good questions.<br/>Clear answers.</h2><p>From an early idea to a detailed brief, we help you take the next step.</p><a href="#contact">Talk through your requirement <ArrowRight size={17}/></a></div><div>{faqs.map(([question,answer])=><details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="contact" id="contact"><div className="contact-copy"><span className="section-kicker light">START WITH THE REQUIREMENT</span><h2>What does your warehouse need to do better?</h2><p>Share the operating challenge, an RFQ or an early idea. Our team will help define the right next step.</p><div className="trust"><ShieldCheck/><span>Your project information is reviewed by the ProRack team and used only for this enquiry.</span></div></div><form onSubmit={submitLead}><h3>Let’s build your project brief.</h3><p className="form-intro">Required fields are marked with an asterisk.</p><div className="fields"><label>Name *<input name="name" autoComplete="name" required placeholder="Your name"/></label><label>Work email *<input name="email" autoComplete="email" type="email" required placeholder="name@company.com"/></label><label>Company *<input name="company" autoComplete="organization" required placeholder="Company name"/></label><label>Phone<input name="phone" autoComplete="tel" type="tel" placeholder="Contact number"/></label></div><label>What are you planning?<select name="intent"><option>New warehouse</option><option>Warehouse expansion</option><option>Racking replacement</option><option>Automation project</option><option>RFQ / RFP review</option></select></label><label>Project brief *<textarea name="message" required placeholder="Location, storage requirement, timeline and anything already decided…"/></label><label className="form-consent"><input type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/> I agree to be contacted about this request.</label><button className="primary" type="submit" disabled={submitting}>{submitting ? "Sending your brief…" : "Send project brief"} <ArrowRight size={18}/></button><p className="notice" role="status">{notice}</p></form></section>
    </main>
    <footer className="site-footer"><a className="logo inverse" href="#top"><span>PRO</span>RACK<small>STORAGE SOLUTIONS</small></a><p>Industrial storage systems, engineered and delivered in India.</p><div><a href="#solutions">Solutions</a><a href="#founder">Founder's Message</a><a href="#faq">FAQs</a><a href="#contact">Contact</a><a href="mailto:info@prorackstoragesolutions.com">Email</a></div><small>© 2026 ProRack Storage Solutions India Pvt. Ltd.</small></footer>
    <a className="chat-launch" href="#contact" aria-label="Contact the project team"><MessageCircle/><span>Let’s talk storage</span></a>
    {!trackingChoice && <aside className="cookie-card" aria-label="Analytics preferences"><div><strong>Help us understand what brings people here</strong><p>With your permission, we record the referring page and campaign tags. We do not use this to discover your identity.</p></div><button onClick={() => chooseTracking(false)}>Necessary only</button><button className="primary" onClick={() => chooseTracking(true)}>Allow analytics</button></aside>}
  </div>
}
