
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  ChevronLeft, 
  Phone, 
  Navigation as NavIcon, 
  Info, 
  Mic, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Activity, 
  Siren, 
  PhoneCall, 
  Stethoscope, 
  ShieldCheck, 
  Droplet, 
  Flame, 
  Heart, 
  Home as HomeIcon, 
  RotateCcw,
  ChevronRight,
  Loader2,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  XCircle,
  Keyboard,
  Ear,
  RefreshCw,
  Navigation2
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { APP_MODULES, INJURIES, MOCK_HOSPITALS, MOCK_BLOOD, MOCK_HELPLINES } from './constants';
import { analyzeInjury, TriageResult, findNearbyHospitals, HospitalSearchResponse } from './services/geminiService';
import { Severity, Hospital, BloodStock, Injury } from './types';

const LOGO_URL = "https://api.screenshotbot.com/render/746401-4470-4946-802c-474c1000672e?width=100&height=100";

// --- Audio Helpers for Live API ---

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Shared Components ---

const Header = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate(-1)} 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button 
          onClick={() => navigate('/')} 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="Home"
        >
          <HomeIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <img src={LOGO_URL} alt="ResQNet Logo" className="w-8 h-8 object-contain flex-shrink-0" />
        <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 bg-gray-50 rounded-full"><Bell className="w-5 h-5 text-gray-600" /></button>
      </div>
    </header>
  );
};

const MedicalDisclaimer = () => (
  <div className="bg-amber-50 border-l-4 border-amber-400 p-3 my-4 rounded">
    <div className="flex items-center gap-2 mb-1">
      <Info className="w-4 h-4 text-amber-600" />
      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Medical Disclaimer</span>
    </div>
    <p className="text-xs text-amber-700 leading-relaxed">
      This guidance is for informational purposes only and not a substitute for professional medical advice. 
      In life-threatening situations, call local emergency services immediately.
    </p>
  </div>
);

// --- Screens ---

const HomeScreen = () => {
  const navigate = useNavigate();
  const [isSOSActive, setIsSOSActive] = useState(false);

  const handleSOS = () => {
    setIsSOSActive(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-28">
      <Header title="ResQNet" />
      
      <main className="px-5 pt-6 flex-1 flex flex-col items-center">
        {/* User context card - Pankaj */}
        <div className="w-full bg-blue-600 rounded-3xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Stay Safe, Pankaj</h2>
            <p className="text-blue-100 text-sm">Emergency services are active in your area.</p>
            <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-medium">
              <MapPin className="w-3 h-3" />
              Ranchi, Jharkhand
            </div>
          </div>
          <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
        </div>

        {/* SOS Button Section with Logo integrated */}
        <div className="flex flex-col items-center justify-center py-12">
          <button 
            onClick={handleSOS}
            className={`relative w-64 h-64 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 shadow-2xl ${
              isSOSActive ? 'bg-red-600 scale-105 animate-pulse' : 'bg-red-500'
            }`}
          >
            <div className="absolute inset-0 rounded-full border-8 border-white/20 animate-ping" style={{ animationDuration: '2s' }}></div>
            <div className="bg-white p-4 rounded-full mb-3 shadow-inner">
               <img src={LOGO_URL} alt="Logo" className="w-20 h-20 object-contain" />
            </div>
            <span className="text-white font-black text-3xl uppercase tracking-tighter">Emergency</span>
            <span className="text-white/80 font-bold text-xl">SOS</span>
          </button>
          <p className="mt-8 text-gray-500 text-base font-medium">One-tap for immediate help</p>
        </div>

        <div className="w-full bg-white rounded-3xl p-6 mt-4 shadow-sm border border-gray-100 text-center">
          <h3 className="text-gray-800 font-bold mb-2">Need non-emergency help?</h3>
          <p className="text-gray-500 text-sm">Use the navigation bar below to access first aid, hospital listings, and more.</p>
        </div>
      </main>

      {/* SOS Overlay */}
      {isSOSActive && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-red-600">SOS ACTIVE</h3>
              <button onClick={() => setIsSOSActive(false)} className="text-gray-400 font-bold">CANCEL</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-red-50 p-4 rounded-2xl border border-red-100">
                <div className="bg-red-600 p-3 rounded-full text-white">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800">Local Ambulance</p>
                  <p className="text-xl font-black text-red-900">Call 102</p>
                </div>
                <a href="tel:102" className="ml-auto bg-red-600 text-white px-6 py-2 rounded-xl font-bold">CALL</a>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-sm font-bold text-gray-600 mb-3">Nearest Emergency Hospital</p>
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-lg text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">City Trauma Center</p>
                    <p className="text-xs text-gray-500">1.2 km • 5 mins away</p>
                  </div>
                  <button onClick={() => navigate('/hospital')} className="bg-blue-600 text-white p-2 rounded-lg">
                    <NavIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-6 italic">Sharing live location with emergency responders...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const InjuryGuidanceScreen = () => {
  const [selectedInjury, setSelectedInjury] = useState<Injury | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  // Refs for audio processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputTranscriptionRef = useRef('');

  const stopListening = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    try {
      setIsListening(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputAudioContext;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              inputTranscriptionRef.current += text;
              setAiInput(prev => prev + text);
            }
          },
          onerror: (e) => {
            console.error('Live API error:', e);
            stopListening();
          },
          onclose: () => {
            stopListening();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          systemInstruction: "You are a transcription assistant. Transcribe the user's speech exactly as heard.",
        },
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error('Failed to start voice input:', error);
      stopListening();
    }
  };

  const handleAiAnalysis = async (input: string = aiInput) => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeInjury(input);
    setTriageResult(result);
    setIsAnalyzing(false);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  // Guidance logic based on typing
  const getTypingGuidance = () => {
    if (aiInput.length < 5) return "How can I help? Tell me about the injury...";
    if (aiInput.length < 20) return "Provide more detail: Location, bleeding, or pain level?";
    return "Great detail. Click 'Analyze Injury' when ready.";
  };

  if (triageResult) {
    return (
      <div className="min-h-screen bg-white pb-28">
        <Header title="AI Triage Result" />
        <div className="p-5">
          {/* Severity Banner */}
          <div className={`p-4 rounded-2xl border mb-6 flex items-center gap-4 ${getSeverityStyles(triageResult.severity)}`}>
            <div className={`p-3 rounded-full ${triageResult.severity === 'High' ? 'bg-red-600' : triageResult.severity === 'Medium' ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">Severity Level</p>
              <h3 className="text-xl font-black">{triageResult.severity}</h3>
            </div>
          </div>

          <MedicalDisclaimer />

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Analysis Summary</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{triageResult.summary}</p>
            </div>

            {triageResult.isHospitalVisitRequired && (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                <Siren className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <p className="font-bold text-red-800">Hospital Visit Recommended</p>
                  <p className="text-xs text-red-700">Recommended specialist: <span className="font-bold">{triageResult.recommendedSpecialist}</span></p>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Emergency Steps</h4>
              <div className="space-y-3">
                {triageResult.instructions.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                    <p className="text-sm text-gray-700 font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-green-700">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="font-bold text-xs">DO'S</span>
                </div>
                <ul className="space-y-1">
                  {triageResult.dos.map((item, i) => (
                    <li key={i} className="text-[11px] text-green-800 font-medium">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2 text-red-700">
                  <ThumbsDown className="w-4 h-4" />
                  <span className="font-bold text-xs">DON'TS</span>
                </div>
                <ul className="space-y-1">
                  {triageResult.donts.map((item, i) => (
                    <li key={i} className="text-[11px] text-red-800 font-medium">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={() => navigate('/hospital')} 
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg"
              >
                LOCATE NEAREST HOSPITAL <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setTriageResult(null)} 
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm"
              >
                START NEW ASSESSMENT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedInjury) {
    return (
      <div className="min-h-screen bg-white pb-28">
        <Header title={selectedInjury.title} />
        <div className="p-5">
          <MedicalDisclaimer />
          <h3 className="font-black text-gray-900 mb-4 text-lg">First Aid Steps</h3>
          <div className="space-y-4 mb-8">
            {selectedInjury.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
                <p className="text-gray-700 leading-relaxed font-medium">{step}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/hospital')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg">FIND NEAREST HOSPITAL <ArrowRight className="w-5 h-5" /></button>
          <button onClick={() => setSelectedInjury(null)} className="w-full mt-4 text-gray-400 font-bold">Back to Guide</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="Injury Guidance" />
      <div className="p-5">
        {/* Gemini AI Triage Box */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Sparkles className="w-20 h-20 text-indigo-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 uppercase tracking-wider text-xs">AI Medical Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : aiInput.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-[10px] font-bold text-gray-500 uppercase">
                  {isListening ? 'Listening...' : aiInput.length > 0 ? 'Ready to analyze' : 'Waiting for input'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative mb-2">
            <textarea 
              value={aiInput} 
              onChange={(e) => setAiInput(e.target.value)} 
              placeholder="How can I help you today?" 
              className="w-full bg-gray-50 rounded-2xl p-6 text-lg font-medium text-gray-900 placeholder:text-gray-300 outline-none border-2 border-transparent focus:border-indigo-100 transition-all min-h-[160px] resize-none shadow-inner"
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button 
                onClick={toggleVoiceInput}
                disabled={isAnalyzing}
                title={isListening ? "Stop listening" : "Start voice input"}
                className={`p-4 rounded-full shadow-lg transition-all transform active:scale-95 ${isListening ? 'bg-red-600 scale-110' : 'bg-white hover:bg-gray-50 border border-gray-100 text-indigo-600'}`}
              >
                {isListening ? <Ear className="w-6 h-6 text-white animate-bounce" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Real-time Guidance Hint */}
          <div className={`px-4 py-3 rounded-2xl border transition-all flex items-center gap-3 mb-4 ${aiInput.length > 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
             {aiInput.length > 0 ? <Keyboard className="w-4 h-4 flex-shrink-0" /> : <Info className="w-4 h-4 flex-shrink-0" />}
             <p className="text-xs font-bold leading-tight">{getTypingGuidance()}</p>
          </div>

          <button 
            onClick={() => handleAiAnalysis()} 
            disabled={isAnalyzing || !aiInput.trim()} 
            className="w-full bg-indigo-600 disabled:bg-gray-200 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 active:scale-95 transition-transform"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> ANALYZING...</>
            ) : (
              <>ANALYZE INJURY <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
          <div className="flex items-center justify-center gap-2 mt-4">
             <div className="h-[1px] bg-gray-100 flex-1" />
             <p className="text-[9px] text-gray-400 uppercase font-black tracking-[0.2em]">Powered by Gemini 3 Pro</p>
             <div className="h-[1px] bg-gray-100 flex-1" />
          </div>
        </div>

        {/* Static Injury List */}
        <h3 className="font-black text-gray-500 text-[10px] uppercase tracking-widest px-1 mb-4">Quick Guidance Library</h3>
        <div className="space-y-3">
          {INJURIES.map((injury) => (
            <button key={injury.id} onClick={() => setSelectedInjury(injury)} className="w-full bg-white p-5 rounded-3xl flex items-center gap-4 border border-transparent hover:border-blue-100 transition-all shadow-sm active:bg-gray-50">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                {injury.id === 'bleeding' ? <Droplet className="w-6 h-6" /> : injury.id === 'burns' ? <Flame className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-gray-900 text-sm">{injury.title}</h4>
                <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{injury.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HospitalListingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [hospitalData, setHospitalData] = useState<HospitalSearchResponse | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHospitals = async () => {
    setRefreshing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await findNearbyHospitals(latitude, longitude);
          setHospitalData(data);
          setLoading(false);
          setRefreshing(false);
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError("Could not access location. Showing default hospitals.");
          setLoading(false);
          setRefreshing(false);
        },
        { timeout: 10000 }
      );
    } else {
      setLocationError("Geolocation not supported. Showing default hospitals.");
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleNavigate = (address: string) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="Nearby Hospitals" />
      
      {/* Map Preview Area (Simulated) */}
      <div className="w-full h-48 bg-gray-200 relative overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-40 bg-[url('https://api.screenshotbot.com/render/746401-4470-4946-802c-474c1000672e?width=600&height=400')] bg-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-blue-100">
             <MapPin className="w-4 h-4 text-red-500" />
             <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Tap markers to view details</span>
           </div>
        </div>
        {/* Mock Markers */}
        <button onClick={() => alert('Marker: City Trauma Center')} className="absolute top-1/4 left-1/3 bg-blue-600 p-2 rounded-full text-white shadow-xl animate-bounce">
          <MapPin className="w-4 h-4" />
        </button>
        <button onClick={() => alert('Marker: General Wellness')} className="absolute top-1/2 right-1/4 bg-blue-600 p-2 rounded-full text-white shadow-xl">
          <MapPin className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 flex items-center justify-between mb-2">
        <h3 className="font-black text-gray-500 text-[10px] uppercase tracking-[0.2em]">Live Results</h3>
        <button 
          onClick={fetchHospitals} 
          disabled={refreshing}
          className="flex items-center gap-1.5 text-blue-600 text-xs font-black uppercase tracking-wider disabled:opacity-50"
        >
          {refreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Refresh Location
        </button>
      </div>

      <div className="p-5 pt-0 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium">Scanning for nearest hospitals...</p>
          </div>
        ) : (
          <>
            {locationError && (
              <div className="bg-amber-50 text-amber-800 p-4 rounded-3xl text-sm font-medium border border-amber-100 mb-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                <span>{locationError}</span>
              </div>
            )}

            {hospitalData && (
              <div className="bg-indigo-50 rounded-3xl p-5 border border-indigo-100 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-3 text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-black text-xs uppercase tracking-widest">AI Assistance</h3>
                </div>
                <div className="text-gray-700 leading-relaxed text-sm italic font-medium">
                  "{hospitalData.text}"
                </div>
              </div>
            )}

            {hospitalData && hospitalData.links.length > 0 ? (
              hospitalData.links.map((link, idx) => (
                <div key={idx} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-lg mb-4 hover:border-blue-100 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-gray-900 text-xl leading-tight flex-1">{link.title}</h4>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Emergency Ready
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location identified via Google Maps
                  </p>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-black text-sm uppercase tracking-wider active:bg-gray-200 transition-colors">
                      Call
                    </button>
                    <button 
                      onClick={() => window.open(link.uri, '_blank')}
                      className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-100 active:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Navigation2 className="w-4 h-4 fill-current" /> Navigate
                    </button>
                  </div>
                </div>
              ))
            ) : (
              MOCK_HOSPITALS.map((hosp) => (
                <div key={hosp.id} className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-xl shadow-gray-200/50 mb-4">
                  <h4 className="font-black text-gray-900 text-xl mb-1">{hosp.name}</h4>
                  <p className="text-sm text-gray-400 font-medium mb-4">{hosp.address}</p>
                  
                  <div className="flex gap-6 mb-6">
                    <div className="flex items-center gap-2">
                       <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                         <MapPin className="w-4 h-4" />
                       </div>
                       <span className="text-xs font-black text-gray-800">{hosp.distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                         <Clock className="w-4 h-4" />
                       </div>
                       <span className="text-xs font-black text-gray-800">{hosp.eta}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`tel:${hosp.contact}`} className="bg-gray-50 text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center active:bg-gray-100 transition-colors">
                      Call
                    </a>
                    <button 
                      onClick={() => handleNavigate(hosp.address)}
                      className="bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Navigation2 className="w-4 h-4 fill-current" /> Navigate
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

const BloodAvailabilityScreen = () => {
  const [activeGroup, setActiveGroup] = useState('O+');
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const filteredStock = MOCK_BLOOD.filter(stock => stock.group === activeGroup);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Header title="Blood Stock" />
      <div className="bg-white px-5 py-4 border-b flex overflow-x-auto gap-3 no-scrollbar">
        {bloodGroups.map(g => (
          <button key={g} onClick={() => setActiveGroup(g)} className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black ${activeGroup === g ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>{g}</button>
        ))}
      </div>
      <div className="p-5 space-y-4">
        {filteredStock.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex-1"><p className="font-bold text-gray-900">{s.hospitalName}</p><p className="text-xs text-gray-500">{s.distance}</p></div>
            <div className="text-right"><p className="text-xl font-black text-red-600">{s.units} Units</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HelplineScreen = () => (
  <div className="min-h-screen bg-gray-50 pb-28">
    <Header title="Helplines" />
    <div className="p-5 space-y-4">
      {MOCK_HELPLINES.map((line) => (
        <div key={line.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex-1"><h4 className="font-black text-gray-900">{line.name}</h4><p className="text-xl font-black text-blue-600">{line.number}</p></div>
          <a href={`tel:${line.number}`} className="bg-blue-600 text-white p-4 rounded-full shadow-lg"><PhoneCall className="w-6 h-6" /></a>
        </div>
      ))}
    </div>
  </div>
);

const TrustedCareScreen = () => (
  <div className="min-h-screen bg-gray-50 pb-28">
    <Header title="Verified Care" />
    <div className="p-5 space-y-4">
      {MOCK_HOSPITALS.filter(h => h.isVerified).map((h) => (
        <div key={h.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-xl text-[8px] font-black uppercase">Verified</div>
          <h4 className="font-black text-gray-900 text-lg">{h.name}</h4>
          <div className="flex flex-wrap gap-1 my-3">
            {h.specialization.map((s, i) => <span key={i} className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-100">{s}</span>)}
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs mt-2">View Profile</button>
        </div>
      ))}
    </div>
  </div>
);

// --- Main App Logic ---

const MainContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { path: '/injury', label: 'Injury', icon: <Activity className="w-5 h-5" /> },
    { path: '/hospital', label: 'Hospitals', icon: <MapPin className="w-5 h-5" /> },
    { path: '/blood', label: 'Blood', icon: <Droplet className="w-5 h-5" /> },
    { path: '/helpline', label: 'Helpline', icon: <Phone className="w-5 h-5" /> },
    { path: '/trusted', label: 'Trusted', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-x-hidden relative border-x border-gray-100">
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/injury" element={<InjuryGuidanceScreen />} />
        <Route path="/hospital" element={<HospitalListingScreen />} />
        <Route path="/blood" element={<BloodAvailabilityScreen />} />
        <Route path="/helpline" element={<HelplineScreen />} />
        <Route path="/trusted" element={<TrustedCareScreen />} />
      </Routes>

      {/* Bottom Nav: tabs to the right of Home */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-20 flex items-center z-40 max-w-md mx-auto overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center min-w-full px-4 gap-2 h-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex flex-col items-center justify-center min-w-[72px] h-full transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
              >
                <div className={`p-2 rounded-2xl transition-colors ${isActive ? 'bg-blue-50 shadow-inner' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase mt-1 tracking-tighter text-center leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <MainContent />
    </HashRouter>
  );
};

export default App;
