import React, { useState, useRef } from 'react';
import { 
  Heart, Mic, Play, Pause, Square, Trash2, Plus, 
  Sparkles, Lock, Mail, ShieldAlert, Download, Smartphone, Layout, Edit3, Image, LogOut, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Custom WIIISH Logo Component ---
const WiiishLogo = ({ className = "h-12" }) => (
  <div className={`flex items-center justify-center select-none ${className}`}>
    <svg viewBox="0 0 320 100" className="w-auto h-full drop-shadow-sm overflow-visible">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#70B8FF" />
          <stop offset="50%" stopColor="#8AC6FF" />
          <stop offset="100%" stopColor="#5CA8FF" />
        </linearGradient>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9ECD" />
          <stop offset="100%" stopColor="#FF70B5" />
        </linearGradient>
      </defs>

      <path d="M 30,20 L 32,25 L 37,27 L 32,29 L 30,34 L 28,29 L 23,27 L 28,25 Z" fill="#FFB7DC" opacity="0.8"/>
      <path d="M 280,15 L 281,18 L 284,19 L 281,20 L 280,23 L 279,20 L 276,19 L 279,18 Z" fill="#70B8FF" opacity="0.9"/>
      <path d="M 295,70 L 297,74 L 301,75 L 297,76 L 295,80 L 293,76 L 289,75 L 293,74 Z" fill="#FFB7DC" opacity="0.8"/>

      <path d="M 25 35 C 20 25, 30 20, 35 25 C 40 32, 42 62, 45 68 C 47 72, 53 72, 56 65 C 60 55, 65 40, 70 38 C 73 37, 76 42, 78 52 C 80 62, 83 68, 87 68 C 91 68, 98 52, 105 38 C 110 28, 105 20, 95 24 C 90 26, 88 32, 92 34" 
            fill="none" stroke="url(#logoGradient)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M 122 42 L 122 68 C 122 73, 126 75, 130 71" fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />
      <polygon points="122,18 124,23 129,23 125,26 126,31 122,28 118,31 119,26 115,23 120,23" fill="url(#starGradient)" />

      <path d="M 148 42 L 148 68 C 148 73, 152 75, 156 71" fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />
      <polygon points="148,18 150,23 155,23 151,26 152,31 148,28 144,31 145,26 141,23 146,23" fill="url(#starGradient)" />

      <path d="M 174 42 L 174 68 C 174 73, 178 75, 182 71" fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />
      <polygon points="174,18 176,23 181,23 177,26 178,31 174,28 170,31 171,26 167,23 172,23" fill="url(#starGradient)" />

      <path d="M 218 42 C 205 38, 198 48, 204 55 C 210 62, 216 64, 210 70 C 204 76, 195 71, 192 66" 
            fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" />

      <path d="M 230 20 L 230 68 C 230 72, 233 74, 237 70 L 237 54 C 237 45, 248 42, 254 48 C 260 54, 258 68, 262 72 C 266 76, 275 73, 278 68 C 282 60, 278 52, 272 56" 
            fill="none" stroke="url(#logoGradient)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [emailInput, setEmailInput] = useState('khushichillal@gmail.com');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  
  const [userProfile, setUserProfile] = useState({
    name: 'Khushi',
    email: 'khushichillal@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    checkInDays: 30,
    lastCheckIn: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState('pulse');
  const [isWidgetAuthorized, setIsWidgetAuthorized] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const [people, setPeople] = useState([
    { id: 1, name: 'Mom', email: 'mom@example.com', relation: 'Mother / Parent', avatar: '💖' },
    { id: 2, name: 'Ananya', email: 'ananya@example.com', relation: 'Bestie', avatar: '✨' },
  ]);

  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [newPersonRelation, setNewPersonRelation] = useState('');

  const [echoes, setEchoes] = useState([
    {
      id: 'e1',
      title: 'A Little Reminder That I Love You',
      recipientName: 'Mom',
      duration: '01:45',
      letterText: 'Hey Mom, I hope you are taking care of yourself today!',
      schedule: 'monthly',
      theme: 'pink'
    }
  ]);

  const [recordingTitle, setRecordingTitle] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [scheduleType, setScheduleType] = useState('monthly');
  const [letterText, setLetterText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('pink');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setUserProfile(prev => ({ ...prev, email: emailInput, name: emailInput.split('@')[0] || 'User' }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserProfile(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handlePulseCheckIn = () => {
    setUserProfile(prev => ({ ...prev, lastCheckIn: new Date().toISOString() }));
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ['#FFB7DC', '#8AC6FF', '#FFF59D', '#A5D6A7'] });
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName || !newPersonEmail) return;
    setPeople([...people, { id: Date.now(), name: newPersonName, email: newPersonEmail, relation: newPersonRelation || 'Special One', avatar: '🌸' }]);
    setNewPersonName('');
    setNewPersonEmail('');
    setNewPersonRelation('');
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    setRecordedAudio('dummy-audio-stream');
  };

  const handleSaveEcho = (e) => {
    e.preventDefault();
    if (!selectedRecipientId || !recordingTitle) return;
    const recipient = people.find(p => p.id === Number(selectedRecipientId));
    setEchoes([{
      id: `e_${Date.now()}`,
      title: recordingTitle,
      recipientName: recipient?.name || 'Loved One',
      duration: `${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`,
      letterText: letterText || 'Sending you all my love.',
      schedule: scheduleType,
      theme: selectedTheme
    }, ...echoes]);
    setRecordingTitle('');
    setSelectedRecipientId('');
    setLetterText('');
    setRecordedAudio(null);
    setRecordingTime(0);
    setActiveTab('vault');
  };

  const calculateDaysLeft = () => {
    const lastDate = new Date(userProfile.lastCheckIn);
    const nextDate = new Date(lastDate.getTime() + userProfile.checkInDays * 24 * 60 * 60 * 1000);
    const diffDays = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
        if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-[#FFB7DC]/30 text-center">
          <WiiishLogo className="h-16 mb-2" />
          <p className="text-gray-500 text-sm mb-6 font-medium">Keep your voice & wishes close to your favorite people forever.</p>
          <div className="flex bg-[#FFF5F8] p-1 rounded-2xl mb-6 border border-[#FFB7DC]/20">
            <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${authMode === 'login' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Sign In</button>
            <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 text-xs font-semibold rounded-xl ${authMode === 'signup' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>Create Account</button>
          </div>
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gmail / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-[#FFF9FB] border border-pink-100 rounded-2xl text-sm" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-[#FFF9FB] border border-pink-100 rounded-2xl text-sm" required />
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-[#8AC6FF] text-white font-medium text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> {authMode === 'login' ? 'Sign In to WIIISH' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9FA] text-gray-800 font-sans pb-20">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => setActiveTab('pulse')}><WiiishLogo className="h-9" /></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#FFF0F5] px-3 py-1.5 rounded-full border border-pink-100">
              <div className="relative group">
                <img src={userProfile.avatar} alt={userProfile.name} className="w-7 h-7 rounded-full object-cover border border-white" />
                <label className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                  <Image className="w-3 h-3 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <span className="text-xs font-semibold text-gray-800">{userProfile.name}</span>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="p-2 text-gray-400 hover:text-red-400 rounded-full"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto flex items-center justify-around mt-3 border-t border-pink-50 pt-2 text-xs font-medium">
          <button onClick={() => setActiveTab('pulse')} className={`py-1.5 px-3 rounded-full ${activeTab === 'pulse' ? 'bg-[#8AC6FF] text-white' : 'text-gray-500'}`}>Pulse</button>
          <button onClick={() => setActiveTab('people')} className={`py-1.5 px-3 rounded-full ${activeTab === 'people' ? 'bg-[#FFB7DC] text-white' : 'text-gray-500'}`}>Favorite People</button>
          <button onClick={() => setActiveTab('studio')} className={`py-1.5 px-3 rounded-full ${activeTab === 'studio' ? 'bg-[#FFF59D] text-gray-800' : 'text-gray-500'}`}>Record Studio</button>
          <button onClick={() => setActiveTab('vault')} className={`py-1.5 px-3 rounded-full ${activeTab === 'vault' ? 'bg-[#A5D6A7] text-gray-800' : 'text-gray-500'}`}>Echo Vault</button>
        </div>
      </header>
            <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'pulse' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#FFF0F5] via-[#E6F3FF] to-[#FFFDE7] p-6 rounded-3xl border border-pink-100 text-center space-y-2">
              <h1 className="text-xl font-bold text-gray-800">Keep your voice close to {userProfile.name}'s favorite people.</h1>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-pink-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#70B8FF]" /><h3 className="text-xs font-bold uppercase">Home Screen Widget</h3></div>
              </div>
              <div className="bg-gradient-to-br from-[#FFF0F5] to-[#E6F3FF] p-4 rounded-2xl border border-pink-200 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-gray-800">{calculateDaysLeft()} <span className="text-xs font-normal">days left</span></div>
                  <p className="text-[11px] text-gray-600">Next check-in required</p>
                </div>
                <button onClick={handlePulseCheckIn} className="bg-white text-pink-500 border border-pink-200 px-4 py-2 rounded-xl text-xs font-bold">I'm Safe ✨</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setIsAppInstalled(true)} className="py-2.5 px-3 rounded-2xl text-xs font-semibold bg-[#FFF0F5] text-pink-600 border border-pink-200 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> {isAppInstalled ? 'Installed ✓' : 'Install App'}
                </button>
                <button onClick={() => setIsWidgetAuthorized(true)} className="py-2.5 px-3 rounded-2xl text-xs font-semibold bg-[#E6F3FF] text-blue-600 border border-blue-200 flex items-center justify-center gap-2">
                  <Layout className="w-4 h-4" /> {isWidgetAuthorized ? 'Authorized ✓' : 'Authorize Widget'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="space-y-6">
            <form onSubmit={handleAddPerson} className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase text-gray-500">Add A Loved One</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name" value={newPersonName} onChange={(e) => setNewPersonName(e.target.value)} className="w-full px-3 py-2 bg-[#FFF9FB] border border-pink-100 rounded-xl text-xs" required />
                <input type="email" placeholder="Email Address" value={newPersonEmail} onChange={(e) => setNewPersonEmail(e.target.value)} className="w-full px-3 py-2 bg-[#FFF9FB] border border-pink-100 rounded-xl text-xs" required />
              </div>
              <div className="relative">
                <Edit3 className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input type="text" placeholder="Relationship (e.g. Bestie, Soulmate...)" value={newPersonRelation} onChange={(e) => setNewPersonRelation(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-[#FFF9FB] border border-pink-100 rounded-xl text-xs" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#FFB7DC] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"><Plus className="w-4 h-4" /> Save Loved One</button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {people.map(person => (
                <div key={person.id} className="bg-white p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{person.name}</h4>
                    <p className="text-[11px] text-gray-500">{person.email}</p>
                    <span className="text-[10px] bg-[#E6F3FF] text-[#5CA8FF] px-2 py-0.2 rounded-md">{person.relation}</span>
                  </div>
                  <button onClick={() => setPeople(people.filter(p => p.id !== person.id))} className="text-gray-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'studio' && (
          <form onSubmit={handleSaveEcho} className="space-y-6 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm">
            <input type="text" placeholder="Message Title" value={recordingTitle} onChange={(e) => setRecordingTitle(e.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFF9FB] border border-pink-100 rounded-2xl text-xs" required />
            <select value={selectedRecipientId} onChange={(e) => setSelectedRecipientId(e.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFF9FB] border border-pink-100 rounded-2xl text-xs" required>
              <option value="">-- Choose recipient --</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.name} ({p.relation})</option>)}
            </select>
            <div className="bg-[#FFF0F5] p-5 rounded-2xl text-center space-y-3">
              <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-[#FFB7DC]'}`}>
                {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <div className="text-xs font-mono text-gray-500">{isRecording ? `Recording... ${recordingTime}s` : 'Click mic to record'}</div>
            </div>
            <textarea rows={4} placeholder="Write your letter here..." value={letterText} onChange={(e) => setLetterText(e.target.value)} className="w-full p-3.5 bg-[#FFF9FB] border border-pink-100 rounded-2xl text-xs" />
            <button type="submit" className="w-full py-3 bg-[#8AC6FF] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" /> Save to Echo Vault</button>
          </form>
        )}

        {activeTab === 'vault' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {echoes.map(echo => (
              <div key={echo.id} className="p-5 rounded-3xl border bg-[#FFF0F5] border-pink-200 space-y-3">
                <h3 className="text-sm font-bold">{echo.title}</h3>
                <p className="text-xs italic">"{echo.letterText}"</p>
                <div className="flex items-center justify-between pt-2 border-t border-black/5">
                  <span className="text-xs font-bold">{echo.duration}</span>
                  <button onClick={() => setEchoes(echoes.filter(e => e.id !== echo.id))} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
