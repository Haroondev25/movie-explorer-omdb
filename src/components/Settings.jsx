import React, { useState } from 'react'

export default function Settings({ apiKey, setApiKey }) {
  const [open, setOpen] = useState(false)
  const [temp, setTemp] = useState(apiKey || '')

  function save() {
    setApiKey(temp)
    setOpen(false)
  }

  return (
    <div style={{display:'inline'}}>
      <button className="btn small" onClick={()=>setOpen(true)}>Settings</button>
      {open && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.6)'}}>
          <div style={{background:'#161b22', padding:16, borderRadius:8, maxWidth:400, margin:'10% auto'}}>
            <h3>Settings</h3>
            <input className="input" placeholder="OMDB API Key" value="878b31b8" onChange={e=>setTemp(e.target.value)} style={{width:'100%'}} />
            <div style={{marginTop:12, display:'flex', justifyContent:'flex-end', gap:8}}>
              <button className="btn small" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn small" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
