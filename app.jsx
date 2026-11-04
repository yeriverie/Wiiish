const { useState, useEffect } = React;

const SUPABASE_URL = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function WiiishApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
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

  const [checkInFrequency, setCheckInFrequency] = useState(30);
  const [daysRemaining, setDaysRemaining] = useState(30);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [echoTitle, setEchoTitle] = useState("");
  const [echoLetter, setEchoLetter] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [deliverySchedule, setDeliverySchedule] = useState("monthly");

  const [savedEchoes, setSavedEchoes] = useState([]);

  useEffect(() => {
    if (!supabaseClient) return;
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setUserEmail(session.user.email);
        setIsAuthenticated(true);
        loadUserData(session.user.id);
      }
    });
  }, []);

  const loadUserData = async (userId) => {
    if (!supabaseClient) return;
    const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
    if (profile) {
      setDisplayName(profile.display_name || "Khushi");
      setCheckInFrequency(profile.check_in_frequency_days || 30);
    }
  };
    const handleLogin = async (e) => {
    e.preventDefault();
    if (!userEmail || !password) return;

    if (!supabaseClient || SUPABASE_URL.includes("YOUR_")) {
      // Fallback Demo Login if Supabase isn't configured yet
      setIsAuthenticated(true);
      return;
    }

    let { error } = await supabaseClient.auth.signInWithPassword({ email: userEmail, password: password });
    if (error) {
      let { error: signUpError } = await supabaseClient.auth.signUp({ email: userEmail, password: password });
      if (signUpError) {
        alert("Auth Note: " + signUpError.message + "\n(Tip: You can also use the Demo Login button below!)");
        return;
      }
    }
    setIsAuthenticated(true);
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    setDisplayName("Khushi");
    setUserEmail("khushi@pdace.ac.in");
  };

  const handlePulseCheckIn = () => {
    setDaysRemaining(checkInFrequency);
    alert(`Pulse confirmed! Check-in timer reset to ${checkInFrequency} day(s). ✨`);
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
          {/* Fixed Logo */}
          <div className="flex flex-col items-center justify-center">
            <svg viewBox="0 0 300 80" className="w-48 h-auto">
              <text x="10" y="62" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="56" fill="#70B5F9">WIIISH</text>
            </svg>
            <p className="text-xs text-pink-400 font-semibold mt-1">Keep your voice close to your favorite people ✨</p>
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

          <div className="relative flex py-2 items-center">
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
          <svg viewBox="0 0 300 80" className="w-24 h-auto">
            <text x="5" y="58" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="50" fill="#70B5F9">WIIISH</text>
          </svg>

          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            Log Out
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex justify-around border-t border-slate-100 text-xs font-medium text-slate-500">
          {[
            { id: "pulse", label: "Pulse Ring" },
            { id: "people", label: "My People" },
            { id: "studio", label: "Record Voice" },
            { id: "vault", label: "Echo Vault" }
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
        {activeTab === "pulse" && (
          <div className="bg-gradient-to-br from-pink-50 via-sky-50 to-yellow-50 rounded-3xl p-6 border border-pink-100 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Your Pulse Status</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Check in periodically to confirm you are safe. If you miss your check-in, your voice echoes will deliver.
            </p>

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
              className="px-6 py-3 bg-pink-400 hover:bg-pink-500 text-white font-semibold rounded-full shadow-md transition"
            >
              I'm Safe & Alive ✨
            </button>
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
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
                <input
                  type="email"
                  placeholder="Their Email Address"
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
      </main>
    </div>
  );
}

ReactDOM.render(<WiiishApp />, document.getElementById("root"));
