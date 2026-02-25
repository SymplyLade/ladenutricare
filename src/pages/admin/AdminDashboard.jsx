// import React, { useState, useEffect } from 'react';
// import { logActivity } from '../../utils/logActivity';

// const AdminDashboard = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('appointmentRequests') || '[]');
//     setRequests(stored);
//   }, []);

//   const handleAction = (id, action) => {
//     const updated = requests.map(req => req.id === id ? { ...req, status: action } : req);
//     setRequests(updated);
//     localStorage.setItem('appointmentRequests', JSON.stringify(updated));
//     logActivity('admin', `Appointment ${action} for request ID: ${id}`);
//   };

//   return (
//     <div style={{ padding: '1.5rem' }}>
//       <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Admin Dashboard</h2>
//       {requests.length === 0 ? <p>No appointment requests.</p> : (
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th>User</th>
//               <th>Department</th>
//               <th>Doctor</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map(req => (
//               <tr key={req.id} style={{ borderBottom: '1px solid #ccc' }}>
//                 <td>{req.user}</td>
//                 <td>{req.department}</td>
//                 <td>{req.doctor}</td>
//                 <td>{req.date}</td>
//                 <td>{req.time}</td>
//                 <td>{req.status}</td>
//                 <td>
//                   {req.status === 'pending' && (
//                     <>
//                       <button onClick={() => handleAction(req.id, 'approved')} style={{ marginRight: '0.5rem' }}>Approve</button>
//                       <button onClick={() => handleAction(req.id, 'rejected')}>Reject</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;




import React, { useState, useEffect } from 'react';
import { logActivity } from '../../utils/logActivity';

const DEPARTMENTS = ["All", "Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics", "Gynecology"];
const STATUSES = ["All", "pending", "approved", "rejected"];

const statusStyle = (s) => ({
  pending:  { bg: "#FFF3CD", color: "#856404", border: "#FFEAA7" },
  approved: { bg: "#D1FAE5", color: "#065F46", border: "#6EE7B7" },
  rejected: { bg: "#FEE2E2", color: "#991B1B", border: "#FCA5A5" },
}[s] || { bg: "#F3F4F6", color: "#6B7280", border: "#E5E7EB" });

const priorityStyle = (p) => ({
  high:   { bg: "#FFF0F0", color: "#C0392B" },
  normal: { bg: "#EEF2FF", color: "#3730A3" },
  low:    { bg: "#F0FFF4", color: "#276749" },
}[p] || { bg: "#F3F4F6", color: "#4B5563" });

const initials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

const avatarColor = (name) => {
  const colors = ["#4F86C6","#E8875A","#6DC07C","#C46BB0","#E6C84A","#5BC0BE","#E88080"];
  let hash = 0;
  for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const Modal = ({ req, action, onConfirm, onCancel }) => (
  <div style={{
    position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",backdropFilter:"blur(4px)",
    display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,
  }}>
    <div style={{
      background:"#fff",borderRadius:16,padding:"32px 36px",maxWidth:420,width:"90%",
      boxShadow:"0 24px 64px rgba(0,0,0,0.18)"
    }}>
      <div style={{fontSize:36,marginBottom:12,textAlign:"center"}}>
        {action === "approved" ? "✅" : "❌"}
      </div>
      <h3 style={{margin:"0 0 8px",fontWeight:700,fontSize:20,color:"#0F172A",textAlign:"center"}}>
        {action === "approved" ? "Approve Appointment?" : "Reject Appointment?"}
      </h3>
      <p style={{color:"#64748B",fontSize:13,textAlign:"center",marginBottom:24,lineHeight:1.6}}>
        <strong>{req?.user}</strong> · {req?.department} · {req?.date} at {req?.time}
      </p>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onCancel} style={{
          flex:1,padding:"11px",borderRadius:10,border:"1.5px solid #E2E8F0",
          background:"#fff",color:"#475569",fontWeight:600,cursor:"pointer",fontSize:14,
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex:1,padding:"11px",borderRadius:10,border:"none",cursor:"pointer",fontSize:14,
          background: action === "approved" ? "#0EA5E9" : "#EF4444",
          color:"#fff",fontWeight:700,
          boxShadow: action === "approved" ? "0 4px 14px rgba(14,165,233,0.4)" : "0 4px 14px rgba(239,68,68,0.4)",
        }}>Confirm {action === "approved" ? "Approval" : "Rejection"}</button>
      </div>
    </div>
  </div>
);

const ActivityPanel = ({ logs, onClose }) => (
  <div style={{
    position:"fixed",top:0,right:0,height:"100vh",width:340,
    background:"#fff",boxShadow:"-8px 0 40px rgba(0,0,0,0.12)",zIndex:900,
    display:"flex",flexDirection:"column",
  }}>
    <div style={{padding:"24px 24px 16px",borderBottom:"1px solid #F1F5F9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        <div style={{fontWeight:700,fontSize:18,color:"#0F172A"}}>Activity Log</div>
        <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{logs.length} recent actions</div>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"#94A3B8"}}>✕</button>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}>
      {logs.length === 0 ? (
        <div style={{textAlign:"center",color:"#CBD5E1",marginTop:48,fontSize:13}}>No activity yet</div>
      ) : logs.map((log, i) => (
        <div key={i} style={{
          marginBottom:12,padding:"12px 14px",borderRadius:10,
          background: i === 0 ? "#F0F9FF" : "#F8FAFC",
          borderLeft: i === 0 ? "3px solid #0EA5E9" : "3px solid #E2E8F0",
        }}>
          <div style={{fontSize:12,color:"#0F172A",fontWeight:600,marginBottom:3}}>{log.msg}</div>
          <div style={{fontSize:11,color:"#94A3B8"}}>
            {new Date(log.time).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("asc");
  const [confirm, setConfirm] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('appointmentRequests') || '[]');
    setRequests(stored);
    setActivityLogs(JSON.parse(localStorage.getItem('activityLog') || '[]'));
  }, []);

  const refreshLogs = () => setActivityLogs(JSON.parse(localStorage.getItem('activityLog') || '[]'));

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (req, action) => setConfirm({ req, action });

  const confirmAction = () => {
    const { req, action } = confirm;
    const updated = requests.map(r => r.id === req.id ? { ...r, status: action } : r);
    setRequests(updated);
    localStorage.setItem('appointmentRequests', JSON.stringify(updated));
    logActivity('admin', `Appointment ${action} — ${req.user} (${req.department}, ${req.date} ${req.time})`);
    refreshLogs();
    showToast(`Appointment ${action} successfully`, action === "approved" ? "success" : "error");
    setConfirm(null);
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  };

  const handleExport = () => {
    const csv = [
      ["ID","User","Department","Doctor","Date","Time","Status","Priority","Note"],
      ...filtered.map(r => [r.id,r.user,r.department,r.doctor,r.date,r.time,r.status,r.priority||"",r.note||""])
    ].map(row => row.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "appointments.csv";
    a.click();
    showToast("Exported to CSV");
  };

  const total = requests.length;
  const pending = requests.filter(r => r.status === "pending").length;
  const approved = requests.filter(r => r.status === "approved").length;
  const rejected = requests.filter(r => r.status === "rejected").length;
  const highPriority = requests.filter(r => r.priority === "high" && r.status === "pending").length;

  const filtered = requests
    .filter(r => filterStatus === "All" || r.status === filterStatus)
    .filter(r => filterDept === "All" || r.department === filterDept)
    .filter(r => filterPriority === "All" || r.priority === filterPriority)
    .filter(r => {
      const q = search.toLowerCase();
      return !q || r.user.toLowerCase().includes(q) || r.doctor.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const va = a[sortBy] || "", vb = b[sortBy] || "";
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  return (
    <div style={{ minHeight:"100vh", background:"#F8FAFC", fontFamily:"'Helvetica Neue',Arial,sans-serif" }}>

      {toast && (
        <div style={{
          position:"fixed",top:20,right:24,zIndex:2000,
          background: toast.type === "success" ? "#0EA5E9" : "#EF4444",
          color:"#fff",padding:"12px 20px",borderRadius:12,fontWeight:600,fontSize:13,
          boxShadow:"0 8px 24px rgba(0,0,0,0.18)",
        }}>{toast.msg}</div>
      )}

      {confirm && (
        <Modal req={confirm.req} action={confirm.action} onConfirm={confirmAction} onCancel={() => setConfirm(null)} />
      )}

      {showActivity && (
        <ActivityPanel logs={activityLogs} onClose={() => setShowActivity(false)} />
      )}

      <div style={{
        background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"0 32px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        height:64,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 0 #E2E8F0"
      }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:"var(--color-primary, #0F172A)" }}>
          Admin Dashboard
        </h2>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {highPriority > 0 && (
            <div style={{
              background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:20,
              padding:"5px 12px",fontSize:12,color:"#B91C1C",fontWeight:600,
            }}>🔴 {highPriority} urgent pending</div>
          )}
          <button onClick={() => { setShowActivity(true); refreshLogs(); }} style={{
            background:"#F1F5F9",border:"none",borderRadius:10,padding:"8px 14px",
            fontSize:13,color:"#475569",cursor:"pointer",fontWeight:600,
          }}>📋 Activity Log</button>
          <button onClick={handleExport} style={{
            background:"#0EA5E9",border:"none",borderRadius:10,padding:"8px 16px",
            fontSize:13,color:"#fff",cursor:"pointer",fontWeight:700,
            boxShadow:"0 4px 14px rgba(14,165,233,0.35)"
          }}>⬇ Export CSV</button>
        </div>
      </div>

      <div style={{ padding:"28px 32px", maxWidth:1400, margin:"0 auto" }}>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:16, marginBottom:28 }}>
          {[
            { label:"Total",         value:total,         icon:"📋", bg:"#EEF2FF" },
            { label:"Pending",       value:pending,       icon:"⏳", bg:"#FFFBEB" },
            { label:"Approved",      value:approved,      icon:"✅", bg:"#ECFDF5" },
            { label:"Rejected",      value:rejected,      icon:"❌", bg:"#FEF2F2" },
            { label:"High Priority", value:highPriority,  icon:"🔴", bg:"#FFF0F0" },
          ].map((s, i) => (
            <div key={i} style={{
              background:"#fff",border:"1px solid #F1F5F9",borderRadius:16,
              padding:"20px 22px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                width:40,height:40,borderRadius:12,background:s.bg,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:12
              }}>{s.icon}</div>
              <div style={{fontSize:28,fontWeight:800,color:"#0F172A"}}>{s.value}</div>
              <div style={{fontSize:12,color:"#94A3B8",marginTop:3,fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background:"#fff",borderRadius:16,padding:"18px 22px",marginBottom:20,
          border:"1px solid #F1F5F9",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",
          display:"flex",flexWrap:"wrap",gap:12,alignItems:"center"
        }}>
          <div style={{ position:"relative", flex:"1", minWidth:200 }}>
            <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#94A3B8" }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient, doctor, department…"
              style={{
                width:"100%",padding:"9px 14px 9px 36px",borderRadius:10,
                border:"1.5px solid #E2E8F0",fontSize:13,color:"#0F172A",outline:"none",
              }}
            />
          </div>

          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding:"7px 14px",borderRadius:20,border:"1.5px solid",fontSize:12,fontWeight:600,cursor:"pointer",
                borderColor: filterStatus===s ? "#0EA5E9" : "#E2E8F0",
                background: filterStatus===s ? "#EFF9FF" : "#fff",
                color: filterStatus===s ? "#0EA5E9" : "#64748B",
              }}>{s}</button>
            ))}
          </div>

          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{
            padding:"8px 14px",borderRadius:10,border:"1.5px solid #E2E8F0",
            fontSize:13,color:"#475569",background:"#fff",cursor:"pointer",outline:"none"
          }}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>

          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{
            padding:"8px 14px",borderRadius:10,border:"1.5px solid #E2E8F0",
            fontSize:13,color:"#475569",background:"#fff",cursor:"pointer",outline:"none"
          }}>
            {["All","high","normal","low"].map(p => (
              <option key={p} value={p}>{p === "All" ? "All Priorities" : p.charAt(0).toUpperCase()+p.slice(1)}</option>
            ))}
          </select>

          <span style={{ marginLeft:"auto", fontSize:12, color:"#94A3B8" }}>
            {filtered.length} of {total} results
          </span>
        </div>

        <div style={{ background:"#fff",borderRadius:16,border:"1px solid #F1F5F9",boxShadow:"0 1px 4px rgba(0,0,0,0.05)",overflow:"hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"64px 32px", color:"#94A3B8" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
              <div style={{ fontWeight:600, fontSize:15 }}>No appointments found</div>
              <div style={{ fontSize:13, marginTop:6 }}>Try adjusting your filters or search</div>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                    {[
                      { label:"Patient",    col:"user" },
                      { label:"Department", col:"department" },
                      { label:"Doctor",     col:"doctor" },
                      { label:"Date",       col:"date" },
                      { label:"Time",       col:"time" },
                      { label:"Priority",   col:"priority" },
                      { label:"Status",     col:"status" },
                      { label:"Actions",    col:null },
                    ].map(({ label, col }) => (
                      <th key={label}
                        onClick={() => col && handleSort(col)}
                        style={{
                          padding:"13px 18px",textAlign:"left",fontSize:11,fontWeight:700,
                          color:"#64748B",letterSpacing:"0.06em",textTransform:"uppercase",
                          whiteSpace:"nowrap",cursor: col ? "pointer" : "default",userSelect:"none"
                        }}
                      >
                        {label}
                        {col && <span style={{ marginLeft:4, color: sortBy===col ? "#0EA5E9" : "#CBD5E1", fontSize:11 }}>
                          {sortBy===col ? (sortDir==="asc" ? "▲" : "▼") : "⇅"}
                        </span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req, i) => {
                    const ss = statusStyle(req.status);
                    const ps = priorityStyle(req.priority);
                    const isExpanded = expandedRow === req.id;
                    return (
                      <React.Fragment key={req.id}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : req.id)}
                          style={{
                            borderBottom: isExpanded ? "none" : "1px solid #F1F5F9",
                            background: isExpanded ? "#F0F9FF" : i%2===0 ? "#fff" : "#FAFAFA",
                            cursor:"pointer",
                          }}
                        >
                          <td style={{ padding:"14px 18px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                              <div style={{
                                width:34,height:34,borderRadius:"50%",
                                background: avatarColor(req.user),
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontSize:12,fontWeight:700,color:"#fff",flexShrink:0
                              }}>{initials(req.user)}</div>
                              <span style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>{req.user}</span>
                            </div>
                          </td>
                          <td style={{ padding:"14px 18px", fontSize:13, color:"#475569" }}>{req.department}</td>
                          <td style={{ padding:"14px 18px", fontSize:13, color:"#475569" }}>{req.doctor}</td>
                          <td style={{ padding:"14px 18px", fontSize:13, color:"#64748B" }}>{req.date}</td>
                          <td style={{ padding:"14px 18px", fontSize:13, color:"#64748B" }}>{req.time}</td>
                          <td style={{ padding:"14px 18px" }}>
                            {req.priority && (
                              <span style={{
                                fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,
                                background:ps.bg,color:ps.color,textTransform:"capitalize"
                              }}>{req.priority}</span>
                            )}
                          </td>
                          <td style={{ padding:"14px 18px" }}>
                            <span style={{
                              fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:20,
                              background:ss.bg,color:ss.color,border:`1px solid ${ss.border}`,textTransform:"capitalize"
                            }}>{req.status}</span>
                          </td>
                          <td style={{ padding:"14px 18px" }}>
                            {req.status === 'pending' && (
                              <div style={{ display:"flex", gap:8 }} onClick={e => e.stopPropagation()}>
                                <button onClick={() => handleAction(req, 'approved')} style={{
                                  background:"#ECFDF5",color:"#059669",border:"1.5px solid #6EE7B7",
                                  borderRadius:8,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",
                                }}>✓ Approve</button>
                                <button onClick={() => handleAction(req, 'rejected')} style={{
                                  background:"#FEF2F2",color:"#DC2626",border:"1.5px solid #FCA5A5",
                                  borderRadius:8,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",
                                }}>✕ Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr style={{ borderBottom:"1px solid #F1F5F9", background:"#F0F9FF" }}>
                            <td colSpan={8} style={{ padding:"0 18px 14px 62px" }}>
                              <span style={{ fontSize:12, color:"#475569" }}>
                                📝 <strong>Note:</strong> {req.note || "No note provided."}
                              </span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div style={{
            padding:"12px 22px",borderTop:"1px solid #F1F5F9",
            display:"flex",justifyContent:"space-between",
            background:"#FAFAFA",fontSize:12,color:"#94A3B8"
          }}>
            <span>Click any row to expand notes</span>
            <span>{approved} approved · {rejected} rejected · {pending} pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

