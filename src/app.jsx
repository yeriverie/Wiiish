import React, { useState, useRef } from 'react';
import { 
  Heart, Mic, Play, Pause, Square, Trash2, Plus, Clock, 
  Sparkles, Lock, Mail, ShieldAlert, Download, Smartphone, Layout, Edit3, Image, LogOut, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import WiiishLogo from './components/WiiishLogo';

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
    { id: 3, name: 'Rohan', email: 'rohan@example.com', relation: 'Brother', avatar: '🌿' },
  ]);

  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [newPersonRelation, setNewPersonRelation] = useState('');

  const [echoes, setEchoes] = useState([
    {
      id: 'e1',
      title: 'A Little Reminder That I Love You',
      recipientId: 1,
      recipientName: 'Mom',
      audioUrl: null,
      duration: '01:45',
      letterText: 'Hey Mom, if you are hearing this, it just means my monthly ping went off. I hope you are drinking your chai and taking care of yourself today!',
      schedule: 'monthly',
      theme: 'pink',
      createdAt: '2026-11-01'
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

  const [playingEchoId, setPlayingEchoId] = useState(null);
  const [previewEcho, setPreviewEcho] = useState(null);
  const timerRef = useRef(null);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setUserProfile(prev => ({
      ...prev,
      email: emailInput,
      name: emailInput.split('@')[0] || 'User'
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserProfile(prev => ({ ...prev, avatar: url }));
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
    const newEcho = {
      id: `e_${Date.now()}`,
      title: recordingTitle,
      recipientId: recipient?.id || 1,
      recipientName: recipient?.name || 'Loved One',
      audioUrl: recordedAudio,
      duration: `${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`,
      letterText: letterText || 'Sending you all my love.',
      schedule: scheduleType,
      theme: selectedTheme,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setEchoes([newEcho, ...echoes]);
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
              <input type="text" placeholder="Relationship (e.g. Bestie, Soulmate...)" value={newPersonRelation} onChange={(e) => setNewPersonRelation(e.target.value)} className="w-full px-3 py-2 bg-[#FFF9FB] border border-pink-100 rounded-xl text-xs" />
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
      
