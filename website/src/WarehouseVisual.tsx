import { useId } from 'react'
/** Scalable engineering illustration; conceptual layout, not a project photograph. */
export function WarehouseVisual() {
  const uid = useId()

  return <svg viewBox="0 0 640 500" role="img" aria-label="Conceptual warehouse with orange pallet beams, steel uprights and a central access aisle">
    <defs><pattern id={uid + "floor"} width="48" height="32" patternUnits="userSpaceOnUse"><path d="M48 0H0V32" fill="none" stroke="#91a9b8" strokeOpacity=".14"/></pattern><linearGradient id={uid + "box"} x2="1" y2="1"><stop stopColor="#c9b59a"/><stop offset="1" stopColor="#8b7963"/></linearGradient></defs>
    <path d="M20 330 330 185 630 330 325 495Z" fill="#173646"/><path d="M20 330 330 185 630 330 325 495Z" fill={`url(#${uid}floor)`}/>
    {[0,1,2].map(row=><g key={row} transform={`translate(${42+row*126} ${95+row*45})`}>
      <path d="M0 0 85-40 210 15 125 55Z" fill="#274a5b"/>
      {[0,1,2].map(level=><g key={level} transform={`translate(0 ${level*72})`}>
        <path d="M5 12 85-26 207 27 125 65Z" fill="#233e4a"/>
        {[0,1].map(b=><g key={b} transform={`translate(${16+b*56} ${b*24})`}><path d="M0 0 30-14 70 3 40 18Z" fill="#d7c6ac"/><path d="M0 0 40 18V60L0 42Z" fill={`url(#${uid}box)`}/><path d="M40 18 70 3V45L40 60Z" fill="#887b68"/><path d="M18 9 26 12V53L18 50Z" fill="#e4d7c3"/><path d="M5 31 15 36V39L5 34Z" fill="#f7f1e8"/></g>)}
        <path d="M0 62 125 116V126L0 72Z" fill="#ed672d"/><path d="M125 116 210 76V86L125 126Z" fill="#b9471a"/>
      </g>)}
      {[ [0,0],[125,55],[210,15] ].map(([x,y],i)=><g key={i}><path d={`M${x} ${y}v280`} stroke="#89a8b9" strokeWidth="7"/>{[40,80,120,160,200,240].map(t=><path key={t} d={`M${x-1} ${y+t}v8`} stroke="#193642" strokeWidth="2"/>)}</g>)}
      <path d="M130 66 205 263M205 30 130 309" stroke="#688a9d" strokeWidth="2"/>
    </g>)}
    <path d="m48 397 189 80m14-3 65-30" stroke="#f47a42" strokeWidth="2" fill="none" strokeDasharray="5 5"/>
  </svg>
}

