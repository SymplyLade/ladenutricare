// import React from 'react';
// import { MessageSquare, Send } from 'lucide-react';
// import { logActivity } from '../utils/logActivity';
// // after sending a message:
// logActivity('chatbot', 'Chatted with MediBot');
// const ChatbotWidget = () => {
//     return (
//         <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
//             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
//                 <div style={{ padding: '0.5rem', backgroundColor: '#dcfce7', borderRadius: '50%', color: 'var(--color-primary)' }}>
//                     <MessageSquare size={20} />
//                 </div>
//                 <div style={{ marginLeft: '0.75rem' }}>
//                     <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>MediBot Assistant</h2>
//                     <p style={{ fontSize: '0.8rem', color: '#16a34a' }}>● Online</p>
//                 </div>
//             </div>

//             <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
//                 <div style={{ alignSelf: 'flex-start', maxWidth: '80%', padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '1rem 1rem 1rem 0', fontSize: '0.9rem' }}>
//                     Hello! How can I assist you with your health today?
//                 </div>
//                 <div style={{ alignSelf: 'flex-end', maxWidth: '80%', padding: '0.75rem', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '1rem 1rem 0 1rem', fontSize: '0.9rem' }}>
//                     I need to find a cardiologist.
//                 </div>
//                 <div style={{ alignSelf: 'flex-start', maxWidth: '80%', padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '1rem 1rem 1rem 0', fontSize: '0.9rem' }}>
//                     I can help with that. Are you looking for one near your current location?
//                 </div>
//             </div>

//             <div style={{ display: 'flex', gap: '0.5rem' }}>
//                 <input
//                     type="text"
//                     placeholder="Type a message..."
//                     style={{ flex: 1 }}
//                 />
//                 <button style={{ padding: '0.6em 0.8em', borderRadius: '0.5rem' }}>
//                     <Send size={18} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ChatbotWidget;




import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { logActivity } from '../utils/logActivity';

const botResponses = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    symptoms: ['symptom', 'symptoms', 'sick', 'pain', 'fever', 'headache', 'cough', 'tired', 'fatigue', 'nausea', 'vomiting'],
    appointment: ['appointment', 'book', 'doctor', 'schedule', 'cardiologist', 'neurologist', 'pediatrician', 'specialist'],
    medication: ['medicine', 'medication', 'drug', 'pill', 'dose', 'dosage', 'prescription'],
    expiry: ['expiry', 'expired', 'batch', 'expiration', 'expire'],
    emergency: ['emergency', 'urgent', 'critical', 'serious', 'ambulance', 'hospital'],
    bmi: ['bmi', 'weight', 'height', 'overweight', 'underweight', 'obese'],
    bye: ['bye', 'goodbye', 'see you', 'thanks', 'thank you'],
};

const getResponse = (message) => {
    const msg = message.toLowerCase();

    if (botResponses.greetings.some(w => msg.includes(w)))
        return "Hello! 👋 I'm MediBot, your health assistant. How can I help you today? You can ask me about symptoms, appointments, medications, and more.";

    if (botResponses.emergency.some(w => msg.includes(w)))
        return "🚨 This sounds urgent! Please call emergency services (911) immediately or go to your nearest hospital. Do not delay seeking help.";

    if (botResponses.symptoms.some(w => msg.includes(w)))
        return "I understand you're not feeling well. Please use the **Symptom Checker** page to log your symptoms in detail. Would you like me to guide you there? Also, if symptoms are severe, please see a doctor immediately.";

    if (botResponses.appointment.some(w => msg.includes(w)))
        return "I can help with that! Head over to the **Appointments** page to book a consultation with a specialist. You can select your preferred department, doctor, date, and time slot.";

    if (botResponses.medication.some(w => msg.includes(w)))
        return "For medication management, check the **Medication Reminder** on your dashboard. You can add your medications, set times, and mark them as taken daily.";

    if (botResponses.expiry.some(w => msg.includes(w)))
        return "To check if your medicine is expired, visit the **Expiry Checker** page. Enter the batch number and expiry date and I'll tell you if it's safe to use.";

    if (botResponses.bmi.some(w => msg.includes(w)))
        return "You can calculate your BMI right on the **Dashboard**! Enter your height and weight in the BMI Calculator widget to see your result and health category.";

    if (botResponses.bye.some(w => msg.includes(w)))
        return "You're welcome! Take care of your health. 😊 Feel free to come back anytime you have questions!";

    return "I'm not sure I understand that. Could you rephrase? You can ask me about symptoms, appointments, medications, expiry checks, BMI, or emergencies.";
};

const ChatbotWidget = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: "Hello! 👋 I'm MediBot, your personal health assistant. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: input.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate bot typing delay
        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                text: getResponse(userMessage.text),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            logActivity('chatbot', `Chatted with MediBot: "${userMessage.text.slice(0, 40)}"`);
        }, 1000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const clearChat = () => {
        setMessages([{
            id: Date.now(),
            sender: 'bot',
            text: "Chat cleared! How can I help you?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    const quickReplies = [
        "I have a fever",
        "Book an appointment",
        "Check my medication",
        "What is my BMI?",
    ];

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '500px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: '#dcfce7', borderRadius: '50%', color: 'var(--color-primary)' }}>
                        <MessageSquare size={20} />
                    </div>
                    <div style={{ marginLeft: '0.75rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600' }}>MediBot Assistant</h2>
                        <p style={{ fontSize: '0.8rem', color: '#16a34a' }}>● Online</p>
                    </div>
                </div>
                <Trash2
                    size={18}
                    onClick={clearChat}
                    title="Clear chat"
                    style={{ color: '#94a3b8', cursor: 'pointer' }}
                />
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingRight: '0.25rem' }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                            maxWidth: '80%', padding: '0.75rem',
                            backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : '#f1f5f9',
                            color: msg.sender === 'user' ? 'white' : 'var(--color-text-main)',
                            borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                            fontSize: '0.9rem', lineHeight: '1.5'
                        }}>
                            {msg.text}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem', paddingLeft: '0.25rem', paddingRight: '0.25rem' }}>
                            {msg.time}
                        </span>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '1rem 1rem 1rem 0', fontSize: '0.9rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                backgroundColor: '#94a3b8',
                                animation: 'bounce 1s infinite',
                                animationDelay: `${i * 0.2}s`
                            }} />
                        ))}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {quickReplies.map((reply, index) => (
                    <span
                        key={index}
                        onClick={() => { setInput(reply); inputRef.current?.focus(); }}
                        style={{
                            padding: '0.3rem 0.7rem', borderRadius: '2rem', fontSize: '0.78rem',
                            border: '1px solid var(--color-primary)', color: 'var(--color-primary)',
                            cursor: 'pointer', backgroundColor: '#f0fdf4', whiteSpace: 'nowrap'
                        }}
                    >
                        {reply}
                    </span>
                ))}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1 }}
                />
                <button
                    onClick={sendMessage}
                    style={{ padding: '0.6rem 0.9rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center' }}
                >
                    <Send size={18} />
                </button>
            </div>

            {/* Bounce animation */}
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
            `}</style>
        </div>
    );
};

export default ChatbotWidget;