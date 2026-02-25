// import React from 'react';
// import { Activity, ChevronRight } from 'lucide-react';
// import { logActivity } from '../utils/logActivity';
// // inside handleAnalyze after saving:
// logActivity('symptoms', `Logged symptoms: ${symptoms}`);

// const SymptomChecker = () => {
//     return (
//         <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
//                 <Activity size={24} />
//                 <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Symptom Checker</h2>
//             </div>

//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         What are your main symptoms?
//                     </label>
//                     <textarea
//                         placeholder="e.g. Headache, fever, fatigue..."
//                         rows={4}
//                         style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'none' }}
//                     />
//                 </div>

//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Duration</label>
//                     <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}>
//                         <option>Less than 24 hours</option>
//                         <option>1-3 Days</option>
//                         <option>More than a week</option>
//                     </select>
//                 </div>

//                 <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
//                     <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                         Analyze Symptoms <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SymptomChecker;




// import React, { useState } from 'react';
// import { Activity, ChevronRight } from 'lucide-react';
// import { logActivity } from '../utils/logActivity';

// const SymptomChecker = () => {
//     const [symptoms, setSymptoms] = useState('');
//     const [duration, setDuration] = useState('Less than 24 hours');
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState('');

//     const handleAnalyze = () => {
//         if (!symptoms.trim()) {
//             setError('Please describe your symptoms.');
//             return;
//         }

//         const entry = {
//             id: Date.now(),
//             symptoms,
//             duration,
//             date: new Date().toLocaleString(),
//         };

//         const existing = JSON.parse(localStorage.getItem('symptoms') || '[]');
//         localStorage.setItem('symptoms', JSON.stringify([...existing, entry]));
//         logActivity('symptoms', `Logged symptoms: ${symptoms.slice(0, 50)}`);

//         setSuccess(true);
//         setError('');
//         setSymptoms('');
//         setTimeout(() => setSuccess(false), 3000);
//     };

//     return (
//         <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
//                 <Activity size={24} />
//                 <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Symptom Checker</h2>
//             </div>

//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                         What are your main symptoms?
//                     </label>
//                     <textarea
//                         placeholder="e.g. Headache, fever, fatigue..."
//                         rows={4}
//                         value={symptoms}
//                         onChange={e => setSymptoms(e.target.value)}
//                         style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'none' }}
//                     />
//                 </div>

//                 <div>
//                     <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Duration</label>
//                     <select
//                         value={duration}
//                         onChange={e => setDuration(e.target.value)}
//                         style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
//                     >
//                         <option>Less than 24 hours</option>
//                         <option>1-3 Days</option>
//                         <option>More than a week</option>
//                     </select>
//                 </div>

//                 {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}
//                 {success && <p style={{ color: 'green', fontSize: '0.85rem' }}>Symptoms logged successfully!</p>}

//                 <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
//                     <button onClick={handleAnalyze} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                         Analyze Symptoms <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SymptomChecker;



// import React, { useState } from 'react';
// import { Activity, ChevronRight, AlertCircle, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { logActivity } from '../utils/logActivity';

// const symptomDatabase = {
//     Cardiology: {
//         keywords: ['chest pain', 'heart', 'palpitation', 'shortness of breath', 'breathless', 'chest tightness', 'irregular heartbeat'],
//         description: 'Your symptoms may be related to your heart or cardiovascular system.',
//         advice: 'Please consult a Cardiologist as soon as possible.',
//         urgency: 'high',
//     },
//     Neurology: {
//         keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'numbness', 'memory loss', 'confusion', 'fainting', 'blurred vision'],
//         description: 'Your symptoms may be related to your nervous system.',
//         advice: 'A Neurologist can help evaluate these symptoms.',
//         urgency: 'medium',
//     },
//     Pediatrics: {
//         keywords: ['child', 'baby', 'infant', 'toddler', 'kid', 'rash', 'crying', 'growth'],
//         description: 'These symptoms may require specialized care for children.',
//         advice: 'A Pediatrician would be the right specialist to consult.',
//         urgency: 'medium',
//     },
//     'General Medicine': {
//         keywords: ['fever', 'cold', 'cough', 'flu', 'fatigue', 'tired', 'weak', 'nausea', 'vomiting', 'diarrhea', 'stomach', 'back pain', 'body ache', 'sore throat', 'runny nose'],
//         description: 'Your symptoms are common and can be evaluated by a general practitioner.',
//         advice: 'Visit a General Medicine doctor for a proper diagnosis.',
//         urgency: 'low',
//     },
// };

// const urgencyConfig = {
//     high: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: <AlertCircle size={20} color="#ef4444" />, label: 'High Urgency — See a doctor immediately' },
//     medium: { color: '#ca8a04', bg: '#fefce8', border: '#fef08a', icon: <AlertTriangle size={20} color="#ca8a04" />, label: 'Moderate — Schedule an appointment soon' },
//     low: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle size={20} color="#16a34a" />, label: 'Low — Monitor and consult if it persists' },
// };

// const analyzeSymptoms = (symptomsText) => {
//     const lower = symptomsText.toLowerCase();
//     let matched = null;
//     let highestMatch = 0;

//     for (const [dept, data] of Object.entries(symptomDatabase)) {
//         const matchCount = data.keywords.filter(k => lower.includes(k)).length;
//         if (matchCount > highestMatch) {
//             highestMatch = matchCount;
//             matched = { department: dept, ...data };
//         }
//     }

//     return matched || {
//         department: 'General Medicine',
//         description: 'We could not find a specific match, but a General Practitioner can help evaluate your symptoms.',
//         advice: 'Please consult a General Medicine doctor for further evaluation.',
//         urgency: 'low',
//     };
// };

// const SymptomChecker = () => {
//     const navigate = useNavigate();
//     const [symptoms, setSymptoms] = useState('');
//     const [duration, setDuration] = useState('Less than 24 hours');
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState('');

//     const handleAnalyze = () => {
//         if (!symptoms.trim()) {
//             setError('Please describe your symptoms.');
//             return;
//         }

//         const analysis = analyzeSymptoms(symptoms);

//         const entry = {
//             id: Date.now(),
//             symptoms,
//             duration,
//             department: analysis.department,
//             urgency: analysis.urgency,
//             date: new Date().toLocaleString(),
//         };

//         const existing = JSON.parse(localStorage.getItem('symptoms') || '[]');
//         localStorage.setItem('symptoms', JSON.stringify([...existing, entry]));
//         logActivity('symptoms', `Logged symptoms: ${symptoms.slice(0, 50)}`);

//         setResult(analysis);
//         setError('');
//     };

//     const handleBookAppointment = () => {
//         // Pass recommended department to appointment page
//         localStorage.setItem('recommendedDepartment', result.department);
//         navigate('/appointments');
//     };

//     const handleReset = () => {
//         setResult(null);
//         setSymptoms('');
//         setDuration('Less than 24 hours');
//         setError('');
//     };

//     const urgency = result ? urgencyConfig[result.urgency] : null;

//     return (
//         <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
//                 <Activity size={24} />
//                 <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Symptom Checker</h2>
//             </div>

//             {!result ? (
//                 /* Input Form */
//                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
//                             What are your main symptoms?
//                         </label>
//                         <textarea
//                             placeholder="e.g. Headache, fever, fatigue..."
//                             rows={4}
//                             value={symptoms}
//                             onChange={e => setSymptoms(e.target.value)}
//                             style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', resize: 'none' }}
//                         />
//                     </div>

//                     <div>
//                         <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Duration</label>
//                         <select
//                             value={duration}
//                             onChange={e => setDuration(e.target.value)}
//                             style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}
//                         >
//                             <option>Less than 24 hours</option>
//                             <option>1-3 Days</option>
//                             <option>More than a week</option>
//                         </select>
//                     </div>

//                     {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

//                     <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
//                         <button onClick={handleAnalyze} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                             Analyze Symptoms <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 /* Results */
//                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

//                     {/* Urgency Badge */}
//                     <div style={{
//                         padding: '0.75rem 1rem', borderRadius: '0.75rem',
//                         backgroundColor: urgency.bg, border: `1px solid ${urgency.border}`,
//                         display: 'flex', alignItems: 'center', gap: '0.75rem'
//                     }}>
//                         {urgency.icon}
//                         <p style={{ fontSize: '0.85rem', fontWeight: '600', color: urgency.color }}>{urgency.label}</p>
//                     </div>

//                     {/* Recommended Department */}
//                     <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid var(--color-primary)' }}>
//                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Recommended Department</p>
//                         <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)' }}>{result.department}</p>
//                     </div>

//                     {/* Analysis */}
//                     <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
//                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Analysis</p>
//                         <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '0.5rem' }}>{result.description}</p>
//                         <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{result.advice}</p>
//                     </div>

//                     {/* Symptoms Summary */}
//                     <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
//                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Your Symptoms</p>
//                         <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{symptoms}</p>
//                         <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Duration: {duration}</p>
//                     </div>

//                     {/* Disclaimer */}
//                     <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', lineHeight: '1.5' }}>
//                         ⚠️ This is not a medical diagnosis. Always consult a qualified healthcare professional.
//                     </p>

//                     {/* Action Buttons */}
//                     <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
//                         <button
//                             onClick={handleReset}
//                             style={{ flex: 1, backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
//                         >
//                             Check Again
//                         </button>
//                         <button
//                             onClick={handleBookAppointment}
//                             style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
//                         >
//                             <Calendar size={16} /> Book Appointment
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SymptomChecker;


import React, { useState, useRef } from 'react';
import { Activity, ChevronRight, AlertCircle, CheckCircle, AlertTriangle, Calendar, Mic, MicOff, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logActivity } from '../utils/logActivity';

// ─── Translations ───────────────────────────────────────────────────────────
const translations = {
    en: {
        name: 'English',
        flag: '🇬🇧',
        title: 'Symptom Checker',
        symptomsLabel: 'What are your main symptoms?',
        symptomsPlaceholder: 'e.g. Headache, fever, fatigue...',
        durationLabel: 'Duration',
        durations: ['Less than 24 hours', '1-3 Days', 'More than a week'],
        analyzeBtn: 'Analyze Symptoms',
        errorEmpty: 'Please describe your symptoms.',
        urgencyLabels: {
            high: 'High Urgency — See a doctor immediately',
            medium: 'Moderate — Schedule an appointment soon',
            low: 'Low — Monitor and consult if it persists',
        },
        recommendedDept: 'Recommended Department',
        analysis: 'Analysis',
        yourSymptoms: 'Your Symptoms',
        duration: 'Duration',
        disclaimer: '⚠️ This is not a medical diagnosis. Always consult a qualified healthcare professional.',
        checkAgain: 'Check Again',
        bookAppointment: 'Book Appointment',
        listening: 'Listening...',
        micTip: 'Click mic to speak',
    },
    fr: {
        name: 'Français',
        flag: '🇫🇷',
        title: 'Vérificateur de Symptômes',
        symptomsLabel: 'Quels sont vos principaux symptômes?',
        symptomsPlaceholder: 'ex: Maux de tête, fièvre, fatigue...',
        durationLabel: 'Durée',
        durations: ['Moins de 24 heures', '1-3 jours', 'Plus d\'une semaine'],
        analyzeBtn: 'Analyser les Symptômes',
        errorEmpty: 'Veuillez décrire vos symptômes.',
        urgencyLabels: {
            high: 'Urgence Élevée — Consultez un médecin immédiatement',
            medium: 'Modéré — Prenez rendez-vous bientôt',
            low: 'Faible — Surveillez et consultez si cela persiste',
        },
        recommendedDept: 'Département Recommandé',
        analysis: 'Analyse',
        yourSymptoms: 'Vos Symptômes',
        duration: 'Durée',
        disclaimer: '⚠️ Ceci n\'est pas un diagnostic médical. Consultez toujours un professionnel de santé.',
        checkAgain: 'Vérifier à Nouveau',
        bookAppointment: 'Prendre Rendez-vous',
        listening: 'Écoute en cours...',
        micTip: 'Cliquez sur le micro pour parler',
    },
    es: {
        name: 'Español',
        flag: '🇪🇸',
        title: 'Verificador de Síntomas',
        symptomsLabel: '¿Cuáles son sus principales síntomas?',
        symptomsPlaceholder: 'ej: Dolor de cabeza, fiebre, fatiga...',
        durationLabel: 'Duración',
        durations: ['Menos de 24 horas', '1-3 días', 'Más de una semana'],
        analyzeBtn: 'Analizar Síntomas',
        errorEmpty: 'Por favor describa sus síntomas.',
        urgencyLabels: {
            high: 'Alta Urgencia — Vea a un médico de inmediato',
            medium: 'Moderado — Programe una cita pronto',
            low: 'Bajo — Monitoree y consulte si persiste',
        },
        recommendedDept: 'Departamento Recomendado',
        analysis: 'Análisis',
        yourSymptoms: 'Sus Síntomas',
        duration: 'Duración',
        disclaimer: '⚠️ Esto no es un diagnóstico médico. Siempre consulte a un profesional de salud.',
        checkAgain: 'Verificar de Nuevo',
        bookAppointment: 'Reservar Cita',
        listening: 'Escuchando...',
        micTip: 'Haga clic en el micrófono para hablar',
    },
    yo: {
        name: 'Yorùbá',
        flag: '🇳🇬',
        title: 'Ẹrọ Ayẹwo Àìsàn',
        symptomsLabel: 'Kí ni àwọn àmì àìsàn rẹ?',
        symptomsPlaceholder: 'fún àpẹẹrẹ: Orí fífọ, ibà, rirẹ...',
        durationLabel: 'Iye Àkókò',
        durations: ['Kò tó wákàtí 24', 'Ọjọ 1-3', 'Ju ọsẹ kan lọ'],
        analyzeBtn: 'Ṣayẹwo Àmì Àìsàn',
        errorEmpty: 'Jọwọ ṣapejuwe àwọn àmì àìsàn rẹ.',
        urgencyLabels: {
            high: 'Pàtàkì Gíga — Lọ sí dókítà lẹsẹkẹsẹ',
            medium: 'Àárọ̀ — Ṣe àpèjẹ pẹ̀lú dókítà ní kíákíá',
            low: 'Kékeré — Ṣàkíyèsí kí o sì kan sí dókítà tí ó bá tẹsiwájú',
        },
        recommendedDept: 'Ẹka Tí A Dábàá',
        analysis: 'Ìmọ̀',
        yourSymptoms: 'Àwọn Àmì Àìsàn Rẹ',
        duration: 'Iye Àkókò',
        disclaimer: '⚠️ Èyí kìí ṣe ìwádìí ìṣègùn. Kan sí akẹ́kọ̀ọ́ ìwòsàn tí o peye.',
        checkAgain: 'Ṣayẹwo Lẹ́ẹ̀kan Sí',
        bookAppointment: 'Ṣe Àpèjẹ',
        listening: 'Ń gbọ́...',
        micTip: 'Tẹ maaki lati sọ',
    },
    ha: {
        name: 'Hausa',
        flag: '🇳🇬',
        title: 'Mai Duba Alamomin Cuta',
        symptomsLabel: 'Menene alamomin ciwonka?',
        symptomsPlaceholder: 'misali: Ciwon kai, zazzabi, gajiya...',
        durationLabel: 'Tsawon Lokaci',
        durations: ['Ƙasa da awowi 24', 'Kwanaki 1-3', 'Fiye da mako guda'],
        analyzeBtn: 'Nazarin Alamomi',
        errorEmpty: 'Don Allah bayyana alamominka.',
        urgencyLabels: {
            high: 'Gaggawa — Tafi wurin likita nan take',
            medium: 'Matsakaici — Yi alƙawari da likita soon',
            low: 'Ƙanƙane — Kula kuma duba idan ya ci gaba',
        },
        recommendedDept: 'Sashen da Aka Ba da Shawarar',
        analysis: 'Nazari',
        yourSymptoms: 'Alamominka',
        duration: 'Tsawon Lokaci',
        disclaimer: '⚠️ Wannan ba ganewar asali ba ce. Koyaushe nemi shawarar likita.',
        checkAgain: 'Duba Kuma',
        bookAppointment: 'Yi Alƙawari',
        listening: 'Sauraro...',
        micTip: 'Danna makirofon don magana',
    },
    ig: {
        name: 'Igbo',
        flag: '🇳🇬',
        title: 'Ngwa Nyocha Ọrịa',
        symptomsLabel: 'Gịnị bụ ihe ọrịa gị?',
        symptomsPlaceholder: 'dịka: Isi ọwụwa, ọkụ, ike gwụrụ...',
        durationLabel: 'Ogologo Oge',
        durations: ['Ihe dị ka awa 24', 'Ụbọchị 1-3', 'Karịa izu otu'],
        analyzeBtn: 'Nyochaa Ihe Ọrịa',
        errorEmpty: 'Biko kọwaa ihe ọrịa gị.',
        urgencyLabels: {
            high: 'Mkpa Dị Elu — Gaa dọkịta ozugbo',
            medium: 'Nkezi — Hee onye ọgwọ oge ọ dị mfe',
            low: 'Ala — Lelee ma kọntaktịa dọkịta ọ bụrụ na ọ gaa n\'ihu',
        },
        recommendedDept: 'Ngalaba E Tụpụtara',
        analysis: 'Nyocha',
        yourSymptoms: 'Ihe Ọrịa Gị',
        duration: 'Ogologo Oge',
        disclaimer: '⚠️ Nke a abụghị nchoputa ọgwụ. Gwa ọ dọkịta mgbe niile.',
        checkAgain: 'Nyochaa Ọzọ',
        bookAppointment: 'Depụta Oge',
        listening: 'Na-ege ntị...',
        micTip: 'Pịa maịk iji kwuo',
    },
};

// ─── Symptom Database ────────────────────────────────────────────────────────
const symptomDatabase = {
    Cardiology: {
        keywords: ['chest pain', 'heart', 'palpitation', 'shortness of breath', 'breathless', 'chest tightness', 'irregular heartbeat'],
        description: 'Your symptoms may be related to your heart or cardiovascular system.',
        advice: 'Please consult a Cardiologist as soon as possible.',
        urgency: 'high',
    },
    Neurology: {
        keywords: ['headache', 'migraine', 'dizziness', 'seizure', 'numbness', 'memory loss', 'confusion', 'fainting', 'blurred vision'],
        description: 'Your symptoms may be related to your nervous system.',
        advice: 'A Neurologist can help evaluate these symptoms.',
        urgency: 'medium',
    },
    Pediatrics: {
        keywords: ['child', 'baby', 'infant', 'toddler', 'kid', 'rash', 'crying', 'growth'],
        description: 'These symptoms may require specialized care for children.',
        advice: 'A Pediatrician would be the right specialist to consult.',
        urgency: 'medium',
    },
    'General Medicine': {
        keywords: ['fever', 'cold', 'cough', 'flu', 'fatigue', 'tired', 'weak', 'nausea', 'vomiting', 'diarrhea', 'stomach', 'back pain', 'body ache', 'sore throat', 'runny nose'],
        description: 'Your symptoms are common and can be evaluated by a general practitioner.',
        advice: 'Visit a General Medicine doctor for a proper diagnosis.',
        urgency: 'low',
    },
};

const urgencyConfig = {
    high: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', icon: <AlertCircle size={20} color="#ef4444" />, },
    medium: { color: '#ca8a04', bg: '#fefce8', border: '#fef08a', icon: <AlertTriangle size={20} color="#ca8a04" />, },
    low: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: <CheckCircle size={20} color="#16a34a" />, },
};

const analyzeSymptoms = (symptomsText) => {
    const lower = symptomsText.toLowerCase();
    let matched = null;
    let highestMatch = 0;
    for (const [dept, data] of Object.entries(symptomDatabase)) {
        const matchCount = data.keywords.filter(k => lower.includes(k)).length;
        if (matchCount > highestMatch) {
            highestMatch = matchCount;
            matched = { department: dept, ...data };
        }
    }
    return matched || {
        department: 'General Medicine',
        description: 'We could not find a specific match, but a General Practitioner can help.',
        advice: 'Please consult a General Medicine doctor for further evaluation.',
        urgency: 'low',
    };
};

// ─── Component ───────────────────────────────────────────────────────────────
const SymptomChecker = () => {
    const navigate = useNavigate();
    const [lang, setLang] = useState('en');
    const [symptoms, setSymptoms] = useState('');
    const [duration, setDuration] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const recognitionRef = useRef(null);
    const t = translations[lang];

    // ── Voice to Text ──────────────────────────────────────────────────────
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice recognition is not supported in your browser. Please use Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'en' ? 'en-US'
            : lang === 'fr' ? 'fr-FR'
            : lang === 'es' ? 'es-ES'
            : lang === 'yo' ? 'yo-NG'
            : lang === 'ha' ? 'ha-NG'
            : lang === 'ig' ? 'ig-NG'
            : 'en-US';

        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSymptoms(prev => prev ? `${prev}, ${transcript}` : transcript);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
    };

    // ── Analyze ────────────────────────────────────────────────────────────
    const handleAnalyze = () => {
        if (!symptoms.trim()) {
            setError(t.errorEmpty);
            return;
        }

        const analysis = analyzeSymptoms(symptoms);
        const entry = {
            id: Date.now(),
            symptoms,
            duration: t.durations[duration],
            department: analysis.department,
            urgency: analysis.urgency,
            date: new Date().toLocaleString(),
        };

        const existing = JSON.parse(localStorage.getItem('symptoms') || '[]');
        localStorage.setItem('symptoms', JSON.stringify([...existing, entry]));
        logActivity('symptoms', `Logged symptoms: ${symptoms.slice(0, 50)}`);

        setResult(analysis);
        setError('');
    };

    const handleBookAppointment = () => {
        localStorage.setItem('recommendedDepartment', result.department);
        navigate('/appointments');
    };

    const handleReset = () => {
        setResult(null);
        setSymptoms('');
        setDuration(0);
        setError('');
    };

    const urgency = result ? urgencyConfig[result.urgency] : null;

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}>
                    <Activity size={24} />
                    <h2 style={{ marginLeft: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>{t.title}</h2>
                </div>

                {/* Language Selector */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.4rem 0.75rem', borderRadius: '2rem',
                            border: '1px solid #cbd5e1', backgroundColor: 'white',
                            fontSize: '0.8rem', cursor: 'pointer', color: 'var(--color-text-main)'
                        }}
                    >
                        <Globe size={14} />
                        {translations[lang].flag} {translations[lang].name}
                    </button>

                    {showLangMenu && (
                        <div style={{
                            position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)',
                            backgroundColor: 'white', borderRadius: '0.75rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            border: '1px solid #e2e8f0', zIndex: 100,
                            overflow: 'hidden', minWidth: '160px'
                        }}>
                            {Object.entries(translations).map(([code, val]) => (
                                <div
                                    key={code}
                                    onClick={() => { setLang(code); setShowLangMenu(false); setDuration(0); }}
                                    style={{
                                        padding: '0.65rem 1rem', cursor: 'pointer',
                                        fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        backgroundColor: lang === code ? '#f0fdf4' : 'white',
                                        color: lang === code ? 'var(--color-primary)' : 'var(--color-text-main)',
                                        fontWeight: lang === code ? '600' : '400',
                                        borderBottom: '1px solid #f1f5f9',
                                        transition: 'background-color 0.15s'
                                    }}
                                    onMouseEnter={e => { if (lang !== code) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                    onMouseLeave={e => { if (lang !== code) e.currentTarget.style.backgroundColor = 'white'; }}
                                >
                                    {val.flag} {val.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {!result ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Symptoms Input + Mic */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: '500', fontSize: '0.9rem' }}>{t.symptomsLabel}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    {isListening ? t.listening : t.micTip}
                                </span>
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    style={{
                                        padding: '0.4rem', borderRadius: '50%', border: 'none',
                                        backgroundColor: isListening ? '#ef4444' : 'var(--color-primary)',
                                        color: 'white', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        animation: isListening ? 'pulse 1.5s infinite' : 'none'
                                    }}
                                >
                                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                                </button>
                            </div>
                        </div>
                        <textarea
                            placeholder={t.symptomsPlaceholder}
                            rows={4}
                            value={symptoms}
                            onChange={e => setSymptoms(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: `1px solid ${isListening ? '#ef4444' : '#cbd5e1'}`, resize: 'none', transition: 'border-color 0.3s' }}
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>{t.durationLabel}</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {t.durations.map((d, i) => (
                                <span
                                    key={i}
                                    onClick={() => setDuration(i)}
                                    style={{
                                        padding: '0.4rem 0.8rem', borderRadius: '2rem',
                                        fontSize: '0.85rem', cursor: 'pointer',
                                        border: `1px solid ${duration === i ? 'var(--color-primary)' : '#cbd5e1'}`,
                                        color: duration === i ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        backgroundColor: duration === i ? '#f0fdf4' : 'white',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {d}
                                </span>
                            ))}
                        </div>
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

                    <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <button onClick={handleAnalyze} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {t.analyzeBtn} <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </div>
                </div>
            ) : (
                /* Results */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Urgency */}
                    <div style={{
                        padding: '0.75rem 1rem', borderRadius: '0.75rem',
                        backgroundColor: urgency.bg, border: `1px solid ${urgency.border}`,
                        display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}>
                        {urgency.icon}
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: urgency.color }}>
                            {t.urgencyLabels[result.urgency]}
                        </p>
                    </div>

                    {/* Recommended Dept */}
                    <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', borderLeft: '4px solid var(--color-primary)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{t.recommendedDept}</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)' }}>{result.department}</p>
                    </div>

                    {/* Analysis */}
                    <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>{t.analysis}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: '1.6', marginBottom: '0.5rem' }}>{result.description}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{result.advice}</p>
                    </div>

                    {/* Symptoms Summary */}
                    <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>{t.yourSymptoms}</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{symptoms}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{t.duration}: {t.durations[duration]}</p>
                    </div>

                    {/* Disclaimer */}
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', lineHeight: '1.5' }}>{t.disclaimer}</p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                        <button
                            onClick={handleReset}
                            style={{ flex: 1, backgroundColor: 'white', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}
                        >
                            {t.checkAgain}
                        </button>
                        <button
                            onClick={handleBookAppointment}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <Calendar size={16} /> {t.bookAppointment}
                        </button>
                    </div>
                </div>
            )}

            {/* Pulse animation for mic */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }
            `}</style>
        </div>
    );
};

export default SymptomChecker;