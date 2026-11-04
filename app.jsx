const { useState, useEffect } = React;

function WiiishApp() {
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

  // Configurable Check-in Frequency (Defaulted to 1 Day for testing)
  const [checkInFrequency, setCheckInFrequency] = useState(1);
  const [daysRemaining, setDaysRemaining] = useState(1);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [echoTitle, setEchoTitle] = useState("");
  const [echoLetter, setEchoLetter] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [deliverySchedule, setDeliverySchedule] = useState("monthly");

  const [savedEchoes, setSavedEchoes] = useState([]);

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

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleFrequencyChange = (e) => {
    const newFreq = parseInt(e.target.value, 10);
    setCheckInFrequency(newFreq);
    setDaysRemaining(newFreq);
  };

  const handlePulseCheckIn = () => {
    setDaysRemaining(checkInFrequency);
    alert(`Pulse check-in confirmed! Your check-in timer is reset to ${checkInFrequency} day(s). ✨`);
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName || !newPersonEmail) return;
    const person = {
      id: Date.now().toString(),
      name: newPersonName,
      email: newPersonEmail
    };
    setFavoritePeople([...favoritePeople, person]);
    setNewPersonName("");
    setNewPersonEmail("");
  };

  const handleDeletePerson = (id) => {
    setFavoritePeople(favoritePeople.filter((p) => p.id !== id));
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setRecordedAudio(null);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordedAudio("mock-audio-stream");
  };

  const handleSaveEcho = () => {
    if (!echoTitle || !selectedRecipientId) {
      alert("Please provide a title and select a recipient!");
      return;
    }
    const recipient = favoritePeople.find((p) => p.id === selectedRecipientId);
    const newEcho = {
      id: Date.now().toString(),
      title: echoTitle,
      recipientName: recipient ? recipient.name : "Loved One",
      recipientEmail: recipient ? recipient.email : "",
      letter: echoLetter,
      deliverySchedule,
      duration: recordingTime > 0 ? `${recordingTime}s` : "0s",
      createdAt: new Date().toLocaleDateString()
    };
    setSavedEchoes([newEcho, ...savedEchoes]);
    setEchoTitle("");
    setEchoLetter("");
    setRecordedAudio(null);
    setRecordingTime(0);
    setActiveTab("vault");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="w-full max-w-md bg-white border border-pink-100 rounded-3xl p-8 shadow-sm text-center">
          <div className="flex flex-col items-center justify-center mb-6">
            <svg viewBox="0 0 400 120" className="w-56 h-auto">
              <path d="M 30,35 Q 35,80 45,85 Q 55,90 65,45 Q 75,35 85,85 Q 95,85 105,35 Q 115,25 125,40" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 140,40 L 140,85" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
              <path d="M 175,40 L 175,85" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
              <path d="M 210,40 L 210,85" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
              <path d="M 260,40 Q 235,35 240,55 Q 245,70 265,75 Q 275,80 250,88" fill="none" stroke="#70B5F9" strokeWidth="16" strokeLinecap="round"/>
              <path d="M 285,25 L 285,85 Q 285,90 300,85 Q 315,70 300,50 Q 285,60 305,75" fill="none" stroke="#70B5F9" strokeWidth="16" strokeLinecap="round"/>
              <polygon points="140,15 144,23 153,24 146,30 148,39 140,34 132,39 134,30 127,24 136,23" fill="#F48FB1"/>
              <polygon points="175,15 179,23 188,24 181,30 183,39 175,34 167,39 169,30 162,24 171,23" fill="#F48FB1"/>
              <polygon points="210,15 214,23 223,24 216,30 218,39 210,34 202,39 204,30 197,24 206,23" fill="#F48FB1"/>
              <polygon points="275,15 281,28 295,30 284,39 287,53 275,45 263,53 266,39 255,30 269,28" fill="#F48FB1"/>
              <polygon points="325,45 328,51 334,52 329,56 331,62 325,58 319,62 321,56 316,52 322,51" fill="#90CAF9"/>
            </svg>
            <p className="text-sm text-pink-400 font-medium mt-1">Keep your voice close to your favorite people ✨</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              Sign In / Create Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 font-sans pb-16">
      <header className="bg-white border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <svg viewBox="0 0 400 120" className="w-28 h-auto">
            <path d="M 30,35 Q 35,80 45,85 Q 55,90 65,45 Q 75,35 85,85 Q 95,85 105,35 Q 115,25 125,40" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 140,40 L 140,85" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
            <path d="M 175,40 L 175,85" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
            <path d="M 210,40 L 210,85" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
            <path d="M 260,40 Q 235,35 240,55 Q 245,70 265,75 Q 275,80 250,88" fill="none" stroke="#70B5F9" strokeWidth="16" strokeLinecap="round"/>
            <path d="M 285,25 L 285,85 Q 285,90 300,85 Q 315,70 300,50 Q 285,60 305,75" fill="none" stroke="#70B5F9" strokeWidth="16" strokeLinecap="round"/>
          </svg>

          <button 
            onClick={() => setShowProfileSetup(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 transition"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-pink-300 text-white flex items-center justify-center text-xs font-bold">
                {displayName ? displayName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <span className="text-xs font-medium text-pink-700">{displayName || userEmail}</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex justify-around border-t border-slate-100 text-xs font-medium text-slate-500">
          {[
            { id: "pulse", label: "Pulse Ring" },
            { id: "people", label: "My People" },
            { id: "studio", label: "Record Voice" },
            { id: "vault", label: "Echo Vault" },
            { id: "preview", label: "Loved One View" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 transition ${
                activeTab === tab.id ? "border-pink-400 text-pink-600 font-semibold" : "border-transparent hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8">
        {showProfileSetup && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-lg space-y-4 text-center">
              <h3 className="text-lg font-bold text-slate-800">Customize Your Profile</h3>
              
              <div className="relative w-20 h-20 mx-auto">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-pink-300" />
                ) : (
                  <div className="w-full h-full rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-2xl font-bold text-pink-500">
                    {displayName ? displayName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-1.5 bg-pink-400 text-white rounded-full cursor-pointer hover:bg-pink-500">
                  📷
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1 text-left">Your Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Khushi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <button
                onClick={() => setShowProfileSetup(false)}
                className="w-full py-2.5 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-xl text-sm transition"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}

        {activeTab === "pulse" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-pink-50 via-sky-50 to-yellow-50 rounded-3xl p-6 border border-pink-100 text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">Your Pulse Status</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Check in periodically to confirm you are safe. If you miss your check-in, your saved voice echoes will gently deliver.
              </p>

              {/* Check-In Frequency Dropdown Selector */}
              <div className="max-w-xs mx-auto text-left bg-white/70 p-3 rounded-2xl border border-pink-100">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Check-in Interval</label>
                <select
                  value={checkInFrequency}
                  onChange={handleFrequencyChange}
                  className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value={1}>1 Day (Testing Mode ⚡)</option>
                  <option value={7}>7 Days (Weekly)</option>
                  <option value={14}>14 Days (Bi-weekly)</option>
                  <option value={30}>30 Days (Monthly)</option>
                  <option value={90}>90 Days (Quarterly)</option>
                </select>
              </div>

              <div className="py-4 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-4 border-pink-200 bg-white shadow-inner">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-pink-500">{daysRemaining}</span>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Days Remaining</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePulseCheckIn}
                className="px-6 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-md transition mx-auto"
              >
                I'm Safe & Alive ✨
              </button>
            </div>
          </div>
        )}

        {activeTab === "people" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">My Favorite People</h2>
              <form onSubmit={handleAddPerson} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Person's Name"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <input
                  type="email"
                  placeholder="Their Email Address"
                  value={newPersonEmail}
                  onChange={(e) => setNewPersonEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 py-2.5 bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-xl transition"
                >
                  + Add Person
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {favoritePeople.map((person) => (
                <div key={person.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{person.name}</h4>
                    <p className="text-xs text-slate-400">{person.email}</p>
                  </div>
                  <button onClick={() => handleDeletePerson(person.id)} className="text-red-400 text-xs">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "studio" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-5">
            <h2 className="text-xl font-bold text-slate-800">Record Voice Echo</h2>

            <div className="bg-pink-50/50 rounded-2xl p-6 text-center space-y-4 border border-pink-100">
              <div className="text-3xl font-mono font-semibold text-slate-700">
                00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
              </div>

              {!isRecording ? (
                <button onClick={startRecording} className="w-14 h-14 bg-pink-400 text-white rounded-full mx-auto flex items-center justify-center">🎤</button>
              ) : (
                <button onClick={stopRecording} className="w-14 h-14 bg-red-400 text-white rounded-full mx-auto flex items-center justify-center animate-pulse">⏹</button>
              )}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Echo Title"
                value={echoTitle}
                onChange={(e) => setEchoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />

              <select
                value={selectedRecipientId}
                onChange={(e) => setSelectedRecipientId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="">-- Choose recipient --</option>
                {favoritePeople.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                ))}
              </select>

              <select
                value={deliverySchedule}
                onChange={(e) => setDeliverySchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="monthly">Every Month (Same day/time)</option>
                <option value="yearly">Every Year (Same day/time)</option>
                <option value="post_passing">One-Time After Passing</option>
              </select>

              <textarea
                rows={3}
                placeholder="Accompanying letter..."
                value={echoLetter}
                onChange={(e) => setEchoLetter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />

              <button onClick={handleSaveEcho} className="w-full py-3 bg-pink-400 text-white font-semibold rounded-xl">
                Save Echo to Vault ✨
              </button>
            </div>
          </div>
        )}

        {activeTab === "vault" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">My Saved Echoes</h2>
            {savedEchoes.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12">No echoes recorded yet.</p>
            ) : (
              savedEchoes.map((echo) => (
                <div key={echo.id} className="bg-white p-5 rounded-2xl border borde
