const { useState, useEffect } = React;

const SUPABASE_URL = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function WiiishApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("Khushi");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [activeTab, setActiveTab] = useState("pulse");

  const [favoritePeople, setFavoritePeople] = useState([
    { id: "1", name: "Amma", email: "amma@example.com" }
  ]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");

  // Timer options (e.g., 1 day, 7 days, 30 days, etc.)
  const [checkInFrequency, setCheckInFrequency] = useState(30);
  const [daysRemaining, setDaysRemaining] = useState(30);

  const [echoTitle, setEchoTitle] = useState("");
  const [echoLetter, setEchoLetter] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [deliverySchedule, setDeliverySchedule] = useState("monthly");

  const [savedEchoes, setSavedEchoes] = useState([]);

  // Exact Logo Component matching your design
  const WiiishLogo = ({ className = "w-36 h-auto" }) => (
    <svg viewBox="0 0 420 120" className={className}>
      <path d="M 25,75 Q 32,30 42,28 Q 52,26 62,68 Q 72,78 82,28 Q 92,28 102,78 Q 112,88 122,72" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 138,35 L 138,78" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
      <path d="M 172,35 L 172,78" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
      <path d="M 206,35 L 206,78" fill="none" stroke="#70B5F9" strokeWidth="18" strokeLinecap="round"/>
      <path d="M 252,72 Q 230,76 235,58 Q 240,44 258,40 Q 268,36 246,28" fill="none" stroke="#70B5F9" strokeWidth="16" strokeLinecap="round"/>
      <path d="M 282,85 L 282,32 Q 282,28 296,32 Q 310,44 296,62 Q 282,54 300,42" fill="none" stroke="#70B5F9" strokeWidth="16" strokeLinecap="round"/>
      <path d="M 330,35 L 333,42 L 340,45 L 333,48 L 330,55 L 327,48 L 320,45 L 327,42 Z" fill="#F48FB1"/>
      <path d="M 60,18 L 61.5,21 L 64.5,22.5 L 61.5,24 L 60,27 L 58.5,24 L 55.5,22.5 L 58.5,21 Z" fill="#F48FB1"/>
      <path d="M 305,95 L 306.5,98 L 309.5,99.5 L 306.5,101 L 305,104 L 303.5,101 L 300.5,99.5 L 303.5,98 Z" fill="#F48FB1"/>
    </svg>
  );
    const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    setUserEmail("khushi@pdace.ac.in");
  };

  const handlePulseCheckIn = () => {
    setDaysRemaining(checkInFrequency);
    alert(`Pulse confirmed! Check-in timer reset to ${checkInFrequency} day(s). ✨`);
  };

  const handleSelectFrequency = (days) => {
    setCheckInFrequency(days);
    setDaysRemaining(days);
    alert(`Check-in interval updated to ${days} day(s).`);
  };

  const handleAddWidgetToHomeScreen = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert("WIIISH is already installed on your home screen!");
    } else {
      alert("To add the WIIISH Pulse Widget to your home screen:\n1. Tap your browser menu (3 dots).\n2. Select 'Add to Home Screen' or 'Install App'.");
    }
  };

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName || !newPersonEmail) return;
    setFavoritePeople([...favoritePeople, { id: Date.now().toString(), name: newPersonName, email: newPersonEmail }]);
    setNewPersonName("");
    setNewPersonEmail("");
  };

  const handleDeletePerson = (id) => {
    setFavoritePeople(favoritePeople.filter((p) => p.id !== id));
  };

  const handleSaveEcho = () => {
    if (!echoTitle || !selectedRecipientId) {
      alert("Please provide a title and select a recipient!");
      return;
    }
    const recipient = favoritePeople.find((p) => p.id === selectedRecipientId);
    setSavedEchoes([{
      id: Date.now().toString(),
      title: echoTitle,
      recipientName: recipient ? recipient.name : "Loved One",
      recipientEmail: recipient ? recipient.email : "",
      letter: echoLetter,
      deliverySchedule
    }, ...savedEchoes]);
    setEchoTitle("");
    setEchoLetter("");
    setActiveTab("vault");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="w-full max-w-md bg-white border border-pink-100 rounded-3xl p-8 shadow-sm text-center space-y-6">
          <div className="flex flex-col items-center justify-center">
            <WiiishLogo className="w-48 h-auto" />
            <p className="text-xs text-pink-400 font-semibold mt-2">Keep your voice close to your favorite people ✨</p>
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
              className="w-full py-3 bg-pink-400 hover:bg-pink-500 text-white font-medium rounded-xl shadow-sm transition"
            >
              Sign In / Create Account
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase">or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-700 text-sm font-semibold rounded-xl transition"
          >
            ✨ Quick Demo Login (Instant Access)
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 font-sans pb-16">
      <header className="bg-white border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <WiiishLogo className="w-32 h-auto" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-50 border-2 border-pink-200 flex items-center justify-center text-pink-500 font-bold overflow-hidden shadow-inner">
              {avatarUrl ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : "K"}
            </div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-500 transition"
              title="Log Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex justify-around border-t border-slate-100 text-xs font-medium text-slate-500 overflow-x-auto">
          {[
            { id: "pulse", label: "Pulse" },
            { id: "people", label: "People" },
            { id: "studio", label: "Studio" },
            { id: "vault", label: "Vault" },
            { id: "profile", label: "Profile" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id ? "border-pink-500 text-pink-600 font-semibold" : "border-transparent hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 mt-8 space-y-6">
        {activeTab === "pulse" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-pink-50 via-sky-50 to-yellow-50 rounded-3xl p-6 border border-pink-100 text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">Your Pulse Status</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Check in periodically to confirm you are safe. If your timer hits zero without a check-in, your voice echoes will deliver automatically.
              </p>

              <div className="py-4 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-4 border-pink-200 bg-white shadow-inner">
                  <div className="text-center">
                    <span className="text-4xl font-extrabold text-pink-500">{daysRemaining}</span>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">Days Remaining</p>
                  </div>
                </div>
              </div>

              {/* Timer Option Buttons (e.g. 1 day, 7 days, 30 days) */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Check-in Interval:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[1, 7, 30, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => handleSelectFrequency(days)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                        checkInFrequency === days 
                          ? "bg-pink-500 text-white shadow-sm" 
                          : "bg-white border border-pink-200 text-slate-600 hover:bg-pink-50"
                      }`}
                    >
                      {days === 1 ? "1 Day" : `${days} Days`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handlePulseCheckIn}
                  className="px-6 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-md transition"
                >
                  I'm Safe & Alive ✨
                </button>
              </div>
            </div>

            {/* Home Screen Widget Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-bold text-slate-800">📱 Add Pulse Widget to Home Screen</h3>
                <p className="text-xs text-slate-500">Keep the 1-tap safety check-in directly on your phone's home screen.</p>
              </div>
              <button
                onClick={handleAddWidgetToHomeScreen}
                className="px-4 py-2.5 bg-sky-400 hover:bg-sky-500 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-sm transition"
              >
                Add Widget
              </button>
            </div>
          </div>
        )}

        {activeTab === "people" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">My Favorite People</h2>
              <p className="text-xs text-slate-400">Add the primary email addresses of the people who should receive your recorded voice messages and letters.</p>
              <form onSubmit={handleAddPerson} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newPersonEmail}
                  onChange={(e) => setNewPersonEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <button
                  type="submit"
                  className="sm:col-span-2 py-2.5 bg-sky-400 hover:bg-sky-500 text-white text-sm font-medium rounded-xl transition"
                >
                  + Add Recipient
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
                  <button onClick={() => handleDeletePerson(person.id)} className="text-red-400 text-xs hover:underline">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "studio" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-5">
            <h2 className="text-xl font-bold text-slate-800">Record Voice Echo</h2>
            <input
              type="text"
              placeholder="Echo Title (e.g. For my birthday)"
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
            <textarea
              rows={3}
              placeholder="Accompanying letter..."
              value={echoLetter}
              onChange={(e) => setEchoLetter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
            <button onClick={handleSaveEcho} className="w-full py-3 bg-pink-400 text-white font-semibold rounded-xl hover:bg-pink-500 transition">
              Save Echo to Vault ✨
            </button>
          </div>
        )}

        {activeTab === "vault" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">My Saved Echoes</h2>
            {savedEchoes.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12">No echoes saved yet.</p>
            ) : (
              savedEchoes.map((echo) => (
                <div key={echo.id} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
                  <h3 className="text-base font-bold text-slate-800">{echo.title}</h3>
                  <p className="text-xs text-slate-500">For: {echo.recipientName} ({echo.recipientEmail})</p>
                  {echo.letter && <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg">"{echo.letter}"</p>}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Default Check-in Frequency (Days)</label>
                <input
                  type="number"
                  value={checkInFrequency}
                  onChange={(e) => setCheckInFrequency(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <button onClick={() => alert("Profile updated successfully!")} className="w-full py-2.5 bg-pink-400 text-white font-medium rounded-xl hover:bg-pink-500 transition">
                Save Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.render(<WiiishApp />, document.getElementById("root"));


