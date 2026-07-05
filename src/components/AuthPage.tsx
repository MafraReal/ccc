import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  User, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle,
  Clock,
  Terminal,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onLoginSuccess: (user: { id: string; username: string; role: string; discordId?: string; avatarUrl?: string }) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Discord OAuth Setup states (shown only if client credentials aren't configured yet)
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
  const [discordRedirectUri, setDiscordRedirectUri] = useState<string>('');
  const [copiedRedirectUri, setCopiedRedirectUri] = useState<boolean>(false);

  // Listen for real Discord OAuth popup success messages
  React.useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Validate the message type and payload
      if (event.data?.type === 'OAUTH_DISCORD_SUCCESS' && event.data?.user) {
        setSuccessMessage('Accesso tramite Discord completato con successo!');
        setErrorMessage('');
        setTimeout(() => {
          onLoginSuccess(event.data.user);
        }, 1000);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onLoginSuccess]);

  // Handle Discord login click
  const handleDiscordClick = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch('/api/auth/discord-url');
      const data = await res.json();
      
      if (data.success && data.url) {
        // Real credentials configured, open the official Discord authorize page in a popup
        const width = 580;
        const height = 680;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popup = window.open(
          data.url, 
          'discord_oauth', 
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );
        
        if (!popup) {
          setErrorMessage('Il popup di Discord è stato bloccato dal tuo browser. Per favore, consenti i popup per questo sito.');
        }
      } else {
        // Real credentials not configured, save the redirectUri and show the setup helper
        if (data.redirectUri) {
          setDiscordRedirectUri(data.redirectUri);
        } else {
          setDiscordRedirectUri(`${window.location.origin}/auth/callback`);
        }
        setShowSetupModal(true);
      }
    } catch (err) {
      setDiscordRedirectUri(`${window.location.origin}/auth/callback`);
      setShowSetupModal(true);
    }
  };

  // Handle Standard Login/Registration
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Inserisci sia username che password.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      const data = await response.json();

      if (data.success) {
        setSuccessMessage(isLogin ? 'Accesso riuscito!' : 'Registrazione completata!');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      } else {
        setErrorMessage(data.message || 'Qualcosa è andato storto.');
      }
    } catch (err) {
      setErrorMessage('Errore di connessione con il server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040306] flex items-center justify-center p-4 relative overflow-hidden font-sans text-gray-200">
      
      {/* Immersive Tech Canvas & Cosmic Purple glow background effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-950/15 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0c1b_1px,transparent_1px),linear-gradient(to_bottom,#0f0c1b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      {/* Main Authentication Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-[#0a090e] border border-[#1d1b24] rounded-2xl p-6 md:p-8 shadow-2xl relative z-10"
      >
        {/* Header App Brand */}
        <div className="flex flex-col items-center text-center space-y-2.5 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/35 border border-purple-500/35 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.15)]">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-1.5 justify-center">
              PowerAC <span className="text-purple-400 font-mono text-[10px] bg-purple-950/40 border border-purple-500/20 px-1.5 py-0.5 rounded font-bold uppercase">v2.0</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Sito di Gestione Licenze e Protezione Anticheat FiveM</p>
          </div>
        </div>

        {/* Global Feedback Messages */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-950/20 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2 mb-4"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-xs flex items-center gap-2 mb-4"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Buttons Grid */}
        <div className="space-y-4">
          
          {/* Discord Single-Sign-On */}
          <button
            id="auth-discord-sso-btn"
            onClick={handleDiscordClick}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition shadow-[0_4px_12px_rgba(88,101,242,0.15)] cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.42-5c.87-.64,1.71-1.32,2.51-2a75.48,75.48,0,0,0,72.76,0c.8.71,1.64,1.39,2.51,2a68.43,68.43,0,0,1-10.42,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.39-18.83C129.81,49.07,123.4,26.43,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
            </svg>
            Accedi con Discord
          </button>

          {/* Divider with labels */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-[1px] bg-[#1d1b24] flex-1"></div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">oppure usa un account</span>
            <div className="h-[1px] bg-[#1d1b24] flex-1"></div>
          </div>

          {/* Normal Credential Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-400" /> Username
              </label>
              <input
                id="auth-username-input"
                type="text"
                placeholder="es. David_C"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#111015] border border-[#23202e] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-purple-400" /> Password
              </label>
              <div className="relative">
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#111015] border border-[#23202e] rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition font-mono"
                  required
                />
                <button
                  id="auth-toggle-pwd-btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Toggle Action and Submit Block */}
            <div className="pt-2">
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-900 hover:bg-purple-800 disabled:bg-purple-950/40 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(126,34,206,0.1)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                    Elaborazione...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Accedi al Pannello' : 'Crea Nuovo Account'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Switch Mode Toggle */}
            <div className="text-center pt-2">
              <button
                id="auth-switch-mode-btn"
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs text-purple-400 hover:text-purple-300 transition cursor-pointer"
              >
                {isLogin ? 'Non hai ancora un account? Registrati ora' : 'Hai già un account? Accedi qui'}
              </button>
            </div>

          </form>
        </div>
      </motion.div>

      {/* Discord OAuth Setup Guide Modal */}
      <AnimatePresence>
        {showSetupModal && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-lg bg-[#0e0c14] border border-[#23202e] rounded-2xl overflow-hidden shadow-2xl text-gray-200"
            >
              {/* Header */}
              <div className="bg-[#13111c] px-5 py-4 flex items-center justify-between border-b border-[#23202e]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.42-5c.87-.64,1.71-1.32,2.51-2a75.48,75.48,0,0,0,72.76,0c.8.71,1.64,1.39,2.51,2a78.4,78.4,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.39-18.83C129.81,49.07,123.4,26.43,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">Configurazione OAuth2 Discord</span>
                </div>
                <button
                  id="setup-modal-close-btn"
                  onClick={() => setShowSetupModal(false)}
                  className="text-gray-500 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs flex gap-2.5 leading-relaxed">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <strong className="block mb-1">Credenziali Mancanti</strong>
                    Per utilizzare il login reale con Discord, devi configurare la tua applicazione Discord Developer. Di seguito trovi i passaggi per farlo.
                  </div>
                </div>

                <div className="space-y-4 text-xs text-gray-300">
                  <div className="space-y-1.5">
                    <span className="font-semibold text-white block">1. Copia l'URL di Reindirizzamento (Redirect URI):</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={discordRedirectUri}
                        className="bg-[#111015] border border-[#23202e] rounded-lg px-3 py-2 text-gray-400 font-mono flex-1 select-all focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(discordRedirectUri);
                          setCopiedRedirectUri(true);
                          setTimeout(() => setCopiedRedirectUri(false), 2000);
                        }}
                        className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-medium transition cursor-pointer shrink-0"
                      >
                        {copiedRedirectUri ? 'Copiato!' : 'Copia'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <span className="font-semibold text-white block">2. Configura Discord Developer Portal:</span>
                    <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                      <li>Apri il <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Discord Developer Portal</a>.</li>
                      <li>Seleziona o crea una nuova Applicazione.</li>
                      <li>Vai alla sezione <strong className="text-white">OAuth2</strong> dal menu a sinistra.</li>
                      <li>Clicca su <strong className="text-white">Add Redirect</strong> e incolla l'indirizzo copiato sopra.</li>
                      <li>Assicurati di salvare le modifiche cliccando su <strong className="text-white">Save Changes</strong>.</li>
                    </ol>
                  </div>

                  <div className="space-y-2">
                    <span className="font-semibold text-white block">3. Inserisci le Credenziali in AI Studio:</span>
                    <p className="leading-relaxed pl-1">
                      Copia il <strong className="text-white">Client ID</strong> e il <strong className="text-white">Client Secret</strong> (visibili nella sezione OAuth2 o General Information) e impostali come variabili d'ambiente nella scheda <strong className="text-white">Settings</strong> di AI Studio o nel tuo file <code className="text-purple-300 font-mono">.env</code>:
                    </p>
                    <div className="bg-[#111015] p-3 rounded-lg border border-[#23202e] font-mono text-[11px] text-purple-300 space-y-1">
                      <div>DISCORD_CLIENT_ID="il_tuo_client_id"</div>
                      <div>DISCORD_CLIENT_SECRET="il_tuo_client_secret"</div>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-[#23202e] flex justify-end">
                  <button
                    onClick={() => setShowSetupModal(false)}
                    className="px-5 py-2 bg-[#13111c] hover:bg-[#1f1b2b] text-gray-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Chiudi Guida
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
