const { useState, useEffect } = React;

// ----------------------------------------------------
// REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
// ----------------------------------------------------
const SUPABASE_URL = "https://YOUR_SUPABASE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function WiiishApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const [activeTab, setActiveTab] = useState("pulse");

  const [favoritePeople, setFavoritePeople] = useState([]);
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

  // Check Supabase Auth Session on Load
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

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setUserEmail(session.user.email);
        setIsAuthenticated(true);
        loadUserData(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  // Fetch persistent user data from Supabase DB
  const loadUserData = async (userId) => {
    if (!supabaseClient) return;

    const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', userId).single();
    if (profile) {
      setDisplayName(profile.display_name || "");
      setAvatarUrl(profile.avatar_url || "");
      setCheckInFrequency(profile.check_in_frequency_days || 30);
      
      if (profile.last_check_in) {
        const lastCheck = new Date(profile.last_check_in);
        const nextCheck = new Date(lastCheck.getTime() + (profile.check_in_frequency_days * 24 * 60 * 60 * 1000));
        const diffDays = Math.ceil((nextCheck - new Date()) / (1000 * 60 * 60 * 24));
        setDaysRemaining(diffDays > 0 ? diffDays : 0);
      }
    }

    const { data: recipients } = await supabaseClient.from('recipients').select('*').eq('user_id', userId);
    if (recipients) setFavoritePeople(recipients);

    const { data: echoes } = await supabaseClient.from('echoes').select('*').eq('user_id', userId);
    if (echoes) setSavedEchoes(echoes);
  };
    // Auth Submit (Login / SignUp)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userEmail || !password || !supabaseClient) return;

    let { error } = await supabaseClient.auth.signInWithPassword({
      email: userEmail,
      password: password
    });

    if (error && error.message.includes("Invalid login credentials")) {
      const { error: signUpError } = await supabaseClient.auth.signUp({
        email: userEmail,
        password: password
      });
      if (signUpError) {
        alert("Authentication Error: " + signUpError.message);
        return;
      }
      alert("Account created successfully! Welcome to WIIISH ✨");
    } else if (error) {
      alert("Login Error: " + error.message);
    }
  };

  // Pulse Check-In (Updates Supabase DBMS)
  const handlePulseCheckIn = async () => {
    setDaysRemaining(checkInFrequency);
    if (supabaseClient && user) {
      await supabaseClient.from('profiles').upsert({
        id: user.id,
        email: user.email,
        display_name: displayName,
        check_in_frequency_days: checkInFrequency,
        last_check_in: new Date().toISOString()
      });
    }
    alert(`Pulse confirmed! Check-in timer reset to ${checkInFrequency} day(s). ✨`);
  };

  // Save Recipient to DBMS
  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPersonName || !newPersonEmail) return;

    const newPerson = {
      id: Date.now().toString(),
      name: newPersonName,
      email: newPersonEmail
    };

    if (supabaseClient && user) {
      const { data } = await supabaseClient.from('recipients').insert([{
        user_id: user.id,
        name: newPersonName,
        email: newPersonEmail
      }]).select().single();

      if (data) newPerson.id = data.id;
    }

    setFavoritePeople([...favoritePeople, newPerson]);
    setNewPersonName("");
    setNewPersonEmail("");
  };

  // Delete Recipient from DBMS
  const handleDeletePerson = async (id) => {
    if (supabaseClient && user) {
      await supabaseClient.from('recipients').delete().eq('id', id);
    }
    setFavoritePeople(favoritePeople.filter((p) => p.id !== id));
  };

  // Save Echo to DBMS
  const handleSaveEcho = async () => {
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

    if (supabaseClient && user) {
      await supabaseClient.from('echoes').insert([{
        user_id: user.id,
        recipient_id: selectedRecipientId,
        title: echoTitle,
        letter: echoLetter,
        delivery_schedule: deliverySchedule
      }]);
    }

    setSavedEchoes([newEcho, ...savedEchoes]);
    setEchoTitle("");
    setEchoLetter("");
    setRecordingTime(0);
    setActiveTab("vault");
  };

  const handleLogout = async () => {
    if (supabaseClient) await supabaseClient.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
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

          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 flex justify-around border-t border-slate-100 text-xs font-medium text-slate-500">
          {[
            { id: "pulse", label: "Pulse Ring" },
            { id: "people", label: "My People" },
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
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-pink-50 via-sky-50 to-yellow-50 rounded-3xl p-6 border border-pink-100 text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">Your Pulse Status</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Check in periodically to confirm you are safe.
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

        {activeTab === "vault" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">My Saved Echoes</h2>
            {savedEchoes.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12">No echoes saved yet.</p>
            ) : (
              savedEchoes.map((echo) => (
                <div key={echo.id} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-2">
                  <h3 className="text-base font-bold text-slate-800">{echo.title}</h3>
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


