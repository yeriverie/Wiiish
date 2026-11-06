"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart, Mic, Square, Play, ShieldCheck, Sparkles, Clock, 
  Check, LogIn, Key, Mail, Camera, Volume2, Bell, Smartphone, Shield, AlertTriangle, Trash2
} from "lucide-react";

export default function WiiishApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [activeTab, setActiveTab] = useState("pulse");

  const [favoritePeople, setFavoritePeople] = useState([
    { id: "1", name: "Amma", email: "mom@example.com" },
    { id: "2", name: "Ananya", email: "ananya@example.com" }
  ]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");

  const [daysRemaining, setDaysRemaining] = useState(3);
  const [guardianName, setGuardianName] = useState("Papa");
  const [guardianEmail, setGuardianEmail] = useState("dad@example.com");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showWarningToast, setShowWarningToast] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [echoTitle, setEchoTitle] = useState("");
  const [echoLetter, setEchoLetter] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [deliverySchedule, setDeliverySchedule] = useState("monthly");
  const [savedEchoes, setSavedEchoes] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userEmail || !password) return;
    setIsAuthenticated(true);
    if (!displayName) {
      setDisplayName(userEmail.split("@")[0]);
      setShowProfileSetup(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setRecordedAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const handleSaveEcho = () => {
    if (!echoTitle || !selectedRecipientId) return alert("Provide title & recipient!");
    const recipient = favoritePeople.find(p => p.id === selectedRecipientId);
    setSavedEchoes([{
      id: Date.now().toString(),
      title: echoTitle,
      recipientName: recipient ? recipient.name : "Loved One",
      recipientEmail: recipient ? recipient.email : "",
      letter: echoLetter,
      audioUrl: recordedAudioUrl,
      deliverySchedule,
      duration: `${recordingTime}s`,
      createdAt: new Date().toLocaleDateString()
    }, ...savedEchoes]);
    setEchoTitle("");
    setEchoLetter("");
    setRecordedAudioUrl(null);
    setRecordingTime(0);
    setActiveTab("vault");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="w-full max-w-md bg-white border border-pink-100 rounded-3xl p-8 shadow-sm text-center space-y-4">
          <h1 className="text-2xl font-bold text-pink-500">wiiish ✨</h1>
          <p className="text-sm text-pink-400">Keep your voice close to your favorite people</p>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-500">Email Address</label>
              <input type="email" required placeholder="you@example.com" value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Password</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm" />
            </div>
            <button type="submit" className="w-full py-3 bg-pink-400 text-white font-medium rounded-xl">Sign In / Create Account</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 pb-16">
      {showWarningToast && (
        <div className="bg-amber-500 text-white px-4 py-3 text-xs flex justify-between sticky top-0 z-50">
          <span>⚠️ Warning: Only {daysRemaining} days left! Confirm check-in.</span>
          <button onClick={() => { setDaysRemaining(30); setShowWarningToast(false); }} className="px-2 py-1 bg-white text-amber-600 rounded">I'm Safe</button>
        </div>
      )}

      <header className="bg-white border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-pink-500 cursor-pointer" onClick={() => setActiveTab("pulse")}>wiiish ✨</h1>
          <button onClick={() => setShowProfileSetup(true)} className="px-3 py-1 rounded-full bg-pink-50 text-xs font-medium text-pink-700">
            {displayName || userEmail}
          </button>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex justify-around text-xs font-medium text-slate-500 border-t">
          {[
            { id: "pulse", label: "Pulse", icon: ShieldCheck },
            { id: "people", label: "People", icon: Heart },
            { id: "studio", label: "Studio", icon: Mic },
            { id: "vault", label: "Vault", icon: Sparkles },
            { id: "preview", label: "Profile", icon: Clock }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-3 flex items-center gap-1 border-b-2 ${activeTab === tab.id ? "border-pink-400 text-pink-600 font-semibold" : "border-transparent"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        {showProfileSetup && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 text-center">
              <h3 className="font-bold">Customize Profile</h3>
              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your Name" className="w-full px-3 py-2 border rounded-xl text-sm" />
              <button onClick={() => setShowProfileSetup(false)} className="w-full py-2 bg-pink-400 text-white rounded-xl text-sm">Save</button>
            </div>
          </div>
        )}

        {activeTab === "pulse" && (
          <div className="space-y-6 text-center">
            <div className="bg-pink-50 rounded-3xl p-6 border border-pink-100 space-y-4">
              <h2 className="text-xl font-bold">Pulse Status</h2>
              <div className="w-36 h-36 mx-auto flex items-center justify-center rounded-full border-4 border-pink-200 bg-white">
                <div>
                  <span className="text-3xl font-extrabold text-pink-500">{daysRemaining}</span>
                  <p className="text-[10px] text-slate-400 uppercase">Days Left</p>
                </div>
              </div>
              <button onClick={() => setDaysRemaining(30)} className="px-6 py-2.5 bg-pink-400 text-white rounded-full text-sm font-semibold">I'm Safe & Alive ✨</button>
            </div>

            <div className="bg-white rounded-3xl p-6 border text-left space-y-3">
              <h3 className="font-bold text-sm">Safeguards & Notifications</h3>
              <p className="text-xs text-slate-500">7-Day Grace period buffer active before unlocking echoes.</p>
              <button onClick={() => setShowWarningToast(true)} className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">Test Warning Notification</button>
            </div>
          </div>
        )}

        {activeTab === "people" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border space-y-3">
              <h2 className="font-bold text-base">Add Favorite Person</h2>
              <input type="text" placeholder="Name" value={newPersonName} onChange={e => setNewPersonName(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" />
              <input type="email" placeholder="Email" value={newPersonEmail} onChange={e => setNewPersonEmail(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" />
              <button onClick={() => { if (newPersonName && newPersonEmail) setFavoritePeople([...favoritePeople, { id: Date.now().toString(), name: newPersonName, email: newPersonEmail }]); setNewPersonName(""); setNewPersonEmail(""); }} className="w-full py-2 bg-sky-400 text-white rounded-xl text-sm">Add Person</button>
            </div>
            {favoritePeople.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">{p.name}</h4>
                  <p className="text-xs text-slate-400">{p.email}</p>
                </div>
                <button onClick={() => setFavoritePeople(favoritePeople.filter(x => x.id !== p.id))} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "studio" && (
          <div className="bg-white rounded-3xl p-6 border space-y-4 text-center">
            <h2 className="font-bold text-lg">Record Voice Echo</h2>
            <div className="bg-pink-50 p-4 rounded-2xl space-y-3">
              <div className="font-mono text-xl">00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}</div>
              {!isRecording ? (
                <button onClick={startRecording} className="w-12 h-12 bg-pink-400 text-white rounded-full mx-auto flex items-center justify-center"><Mic className="w-5 h-5" /></button>
              ) : (
                <button onClick={stopRecording} className="w-12 h-12 bg-red-400 text-white rounded-full mx-auto flex items-center justify-center animate-pulse"><Square className="w-5 h-5" /></button>
              )}
              {recordedAudioUrl && <audio src={recordedAudioUrl} controls className="w-full mt-2" />}
            </div>
            <input type="text" placeholder="Echo Title" value={echoTitle} onChange={e => setEchoTitle(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm text-left" />
            <select value={selectedRecipientId} onChange={e => setSelectedRecipientId(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm text-left">
              <option value="">Select Recipient</option>
              {favoritePeople.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <textarea rows={2} placeholder="Optional written note..." value={echoLetter} onChange={e => setEchoLetter(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm" />
            <button onClick={handleSaveEcho} className="w-full py-2.5 bg-pink-400 text-white rounded-xl text-sm font-semibold">Save Echo to Vault</button>
          </div>
        )}

        {activeTab === "vault" && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg">Echo Vault ({savedEchoes.length})</h2>
            {savedEchoes.map(e => (
              <div key={e.id} className="bg-white p-4 rounded-2xl border space-y-2 text-left">
                <h4 className="font-bold text-sm">{e.title}</h4>
                <p className="text-xs text-pink-500">For: {e.recipientName}</p>
                {e.audioUrl && <audio src={e.audioUrl} controls className="w-full h-8" />}
              </div>
            ))}
          </div>
        )}

        {activeTab === "preview" && (
          <div className="bg-white rounded-3xl p-6 border text-center space-y-4">
            <Heart className="w-8 h-8 text-pink-400 mx-auto fill-current" />
            <h2 className="font-bold text-lg">Loved One Preview</h2>
            <p className="text-xs text-slate-500">This is how your contacts experience your echoes.</p>
          </div>
        )}
      </main>
    </div>
  );
    }
                
