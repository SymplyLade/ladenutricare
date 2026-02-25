// export const ConfirmActions = ({ action, onConfirm, onDeny }) => (
//     <div style={{
//         border: '1px solid #ccc', padding: '1rem', borderRadius: '8px',
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//     }}>
//         <div>
//             <p><strong>{action.type}</strong> by {action.userName}</p>
//             <p>{action.details}</p>
//         </div>
//         <div style={{ display: 'flex', gap: '0.5rem' }}>
//             <button onClick={onConfirm} style={{ backgroundColor: 'green', color: 'white', padding: '0.5rem' }}>Approve</button>
//             <button onClick={onDeny} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem' }}>Deny</button>
//         </div>
//     </div>
// );



export const ConfirmActions = ({ action, onConfirm, onDeny }) => (
  <div style={{
    border:'1px solid #E2E8F0', padding:'16px 20px', borderRadius:12,
    display:'flex', justifyContent:'space-between', alignItems:'center',
    background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
  }}>
    <div>
      <p style={{ margin:'0 0 4px', fontWeight:700, color:'#0F172A' }}>{action.type}</p>
      <p style={{ margin:0, fontSize:13, color:'#64748B' }}>by {action.userName} · {action.details}</p>
    </div>
    <div style={{ display:'flex', gap:10 }}>
      <button onClick={onConfirm} style={{
        background:'#059669', color:'#fff', border:'none', borderRadius:8,
        padding:'8px 18px', fontWeight:700, cursor:'pointer', fontSize:13
      }}>Approve</button>
      <button onClick={onDeny} style={{
        background:'#DC2626', color:'#fff', border:'none', borderRadius:8,
        padding:'8px 18px', fontWeight:700, cursor:'pointer', fontSize:13
      }}>Deny</button>
    </div>
  </div>
);