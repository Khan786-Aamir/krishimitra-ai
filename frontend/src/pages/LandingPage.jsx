import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  CloudSun,
  ShieldCheck,
  UserCheck,
  LineChart,
  ChevronRight,
  ArrowRight,
  Star,
  Download,
  Calendar,
  CloudRain,
  Droplets,
  Thermometer,
  Award,
  Zap,
  Volume2,
  Lock,
  ArrowUpRight,
  CheckCircle,
  HelpCircle,
  Activity,
  Smile,
  Shield
} from 'lucide-react';
import {
  Button,
  Card,
  FeatureCard,
  ProfileCard,
  StatisticCard,
  Accordion,
  Avatar,
  Badge
} from '../components/ui';

// Count reveal animation when scrolled into view
const AnimatedCounter = ({ value, suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const end = parseInt(value, 10);
          if (isNaN(end)) return;
          const totalSteps = 60;
          const stepTime = duration / totalSteps;
          let step = 0;
          
          const timer = setInterval(() => {
            step++;
            const progress = step / totalSteps;
            const easeProgress = progress * (2 - progress); // easeOutQuad
            const currentVal = Math.floor(easeProgress * end);
            setCount(currentVal);
            
            if (step >= totalSteps) {
              setCount(end);
              clearInterval(timer);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={elementRef} className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-text to-text/70">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const LandingPage = () => {
  // SEO optimization: update page header parameters on mount
  useEffect(() => {
    document.title = "KrishiMitra AI - Empowering Farmers with Artificial Intelligence";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = "Industry-leading digital MERN platform for modern agriculture. Powered by Gemini AI crop diagnostics, direct peer-to-peer crop listing marketplaces, equipment leasing, and advisory panel.";

    return () => {
      document.title = "KrishiMitra AI";
    };
  }, []);

  // AI disease simulator states
  const [aiState, setAiState] = useState('idle'); // 'idle' | 'uploading' | 'analyzing' | 'done'
  const [selectedLeaf, setSelectedLeaf] = useState(null);

  const mockLeaves = [
    { id: 'rice', name: 'Rice Leaf', img: '🌾', disease: 'Rice Blast', confidence: '98%', treatment: 'Apply copper-based fungicides and verify water drainage levels.' },
    { id: 'wheat', name: 'Wheat Leaf', img: '🌱', disease: 'Leaf Rust', confidence: '95%', treatment: 'Spray Propiconazole and select rust-resistant seed variants.' },
    { id: 'cotton', name: 'Cotton Leaf', img: '🌿', disease: 'Bacterial Blight', confidence: '94%', treatment: 'Use certified clean seeds and practice crop rotations.' }
  ];

  const handleLeafScan = (leaf) => {
    setSelectedLeaf(leaf);
    setAiState('uploading');
    setTimeout(() => {
      setAiState('analyzing');
      setTimeout(() => {
        setAiState('done');
      }, 1500);
    }, 1000);
  };

  const handleResetScan = () => {
    setAiState('idle');
    setSelectedLeaf(null);
  };

  return (
    <div className="bg-background text-text min-h-screen relative overflow-hidden font-sans">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Tag Line Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>Next-Generation Agriculture</span>
          </motion.div>

          {/* Large Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6.5xl font-extrabold tracking-tight font-display leading-[1.1] max-w-4.5xl mx-auto"
          >
            Empowering Farmers with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse">
              Artificial Intelligence
            </span>
          </motion.h1>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-text-muted text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Gemini-powered crop diagnostics, direct peer-to-peer marketplace transactions, equipment leasing, and localized community expert advisory boards.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              as={Link}
              to="/register"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-glow-primary shadow-lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started Free
            </Button>
            <Button
              as="a"
              href="#features"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto hover:bg-surface/50 border-border"
            >
              Explore Platform
            </Button>
          </motion.div>

          {/* Floating UI Demonstration Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 relative rounded-custom border border-border bg-card/25 backdrop-blur-md p-2.5 max-w-5xl mx-auto shadow-glass-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 rounded-custom pointer-events-none" />
            <div className="rounded-[12px] overflow-hidden bg-background/80 border border-border/50 aspect-[16/9] flex flex-col relative">
              
              {/* Inner Dashboard Wireframe Header */}
              <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-surface/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-primary/50" />
                </div>
                <div className="w-1/3 h-5 bg-background rounded-lg border border-border flex items-center justify-center text-[10px] text-text-muted">
                  app.krishimitra.ai/dashboard
                </div>
                <div className="w-5 h-5 rounded-full bg-surface" />
              </div>

              {/* Inner Dashboard Body Preview */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 p-4 gap-4 text-left">
                
                {/* Column Left: Side Info */}
                <div className="space-y-4">
                  <div className="p-4 bg-card border border-border rounded-custom">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Active Diagnostic</p>
                    <p className="text-sm font-bold mt-1 text-primary">Rice Leaf Blast Scanner</p>
                    <div className="w-full bg-surface h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-primary h-full w-[98%]" />
                    </div>
                  </div>
                  <div className="p-4 bg-card border border-border rounded-custom">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Direct Market Bid</p>
                    <p className="text-sm font-bold mt-1">Wheat (50 Quintals)</p>
                    <p className="text-xs text-text-muted mt-1">Status: <span className="text-accent font-semibold">2 Active Bids</span></p>
                  </div>
                </div>

                {/* Column Center-Right: Big Graph representation */}
                <div className="col-span-3 bg-surface/20 border border-border rounded-custom p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center pb-2 border-b border-border">
                    <div>
                      <p className="text-xs text-text-muted">Yield Forecast Analytics</p>
                      <h4 className="text-lg font-bold text-text">Phase 1 Crop Quality Index</h4>
                    </div>
                    <Badge variant="success">98.4% Optimal</Badge>
                  </div>
                  
                  {/* Decorative chart graphics using CSS lines */}
                  <div className="flex-1 flex items-end gap-2.5 pt-8 pb-4 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-b border-text/20 w-full" />
                      <div className="border-b border-text/20 w-full" />
                      <div className="border-b border-text/20 w-full" />
                    </div>
                    {/* Bars */}
                    <div className="w-full bg-primary/20 hover:bg-primary/45 border-t-2 border-primary h-[40%] rounded-t transition-all" />
                    <div className="w-full bg-primary/20 hover:bg-primary/45 border-t-2 border-primary h-[65%] rounded-t transition-all animate-pulse" />
                    <div className="w-full bg-accent/20 hover:bg-accent/45 border-t-2 border-accent h-[50%] rounded-t transition-all" />
                    <div className="w-full bg-primary/30 hover:bg-primary/55 border-t-2 border-primary h-[85%] rounded-t transition-all" />
                    <div className="w-full bg-primary/20 hover:bg-primary/45 border-t-2 border-primary h-[60%] rounded-t transition-all" />
                    <div className="w-full bg-accent/30 hover:bg-accent/55 border-t-2 border-accent h-[92%] rounded-t transition-all" />
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-text-muted font-bold">
                    <span>MAY</span>
                    <span>JUN</span>
                    <span>JUL</span>
                    <span>AUG</span>
                    <span>SEP</span>
                    <span>OCT</span>
                  </div>
                </div>
              </div>

              {/* Float Cards overlays for Hero Section */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 right-10 bg-card border border-primary/25 rounded-2xl p-3.5 shadow-glow-primary max-w-xs text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">AI Diagnosis Active</span>
                </div>
                <p className="text-xs text-text/80 mt-1 font-semibold">Gemini API validated: Paddy blight risk low.</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-16 left-6 bg-card border border-accent/20 rounded-2xl p-3.5 shadow-premium max-w-xs text-left"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span className="text-xs font-bold text-accent tracking-wider uppercase">Market Listing Verified</span>
                </div>
                <p className="text-xs text-text/80 mt-1 font-semibold">Direct buyer transaction security cleared.</p>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Trusted Numbers Section */}
      <section className="py-16 border-y border-border bg-surface/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black font-display tracking-tight text-text">
                <AnimatedCounter value={50000} suffix="+" />
              </p>
              <p className="text-xs uppercase font-extrabold tracking-wider text-text-muted">Registered Farmers</p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black font-display tracking-tight text-text">
                <AnimatedCounter value={120000} suffix="+" />
              </p>
              <p className="text-xs uppercase font-extrabold tracking-wider text-text-muted">Crop Listings</p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black font-display tracking-tight text-text">
                <AnimatedCounter value={1200} suffix="+" />
              </p>
              <p className="text-xs uppercase font-extrabold tracking-wider text-text-muted">Expert Advisors</p>
            </div>

            <div className="space-y-1">
              <p className="text-4xl md:text-5xl font-black font-display tracking-tight text-text">
                <AnimatedCounter value={800} suffix="+" />
              </p>
              <p className="text-xs uppercase font-extrabold tracking-wider text-text-muted">Villages Connected</p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="accent" size="sm" className="mb-4">Ecosystem Features</Badge>
            <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text">
              All-in-One Digital Agriculture Ecosystem
            </h2>
            <p className="text-text-muted mt-4 leading-relaxed">
              Equipping farmers with modern software tools and intelligence networks to boost yield, bypass middlemen, and build sustainability.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <FeatureCard
              icon={<Scan className="w-6 h-6" />}
              title="AI Crop Disease Detection"
              description="Upload real-time crop leaf images. Instantly run AI diagnosis to detect pathogens, leaf blights, and leaf rusts with high-efficiency treatment suggestions."
            />

            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="AI Farming Assistant"
              description="Interact with a crop consultant powered by Google Gemini API. Ask questions in regional languages or via voice messages for crop schedules."
            />

            <FeatureCard
              icon={<ShoppingBag className="w-6 h-6" />}
              title="Direct Marketplace"
              description="Create crop listings and sell harvests directly to verified buyers. Bypass intermediaries to retain full market values and secure higher crop margins."
            />

            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Equipment Rental Portal"
              description="Browse and list farming tractors, drip irrigation kits, and combined harvesters in your local area for flexible daily peer-to-peer rentals."
            />

            <FeatureCard
              icon={<CloudSun className="w-6 h-6" />}
              title="Weather Alert Systems"
              description="Hyperlocal weather indices forecasting rainfall chances, wind speeds, and moisture index cycles, with crop-saving alerts."
            />

            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="Government Schemes Engine"
              description="Input demographic and property markers to search government subsidies, micro-farming loans, and regional crop insurance protection schemes."
            />

            <FeatureCard
              icon={<UserCheck className="w-6 h-6" />}
              title="Expert Advisory panel"
              description="Connect with qualified agronomists, soil testing labs, and plant pathologists for direct digital video or chat-based consultations."
            />

            <FeatureCard
              icon={<Smile className="w-6 h-6" />}
              title="Community Forum"
              description="Discuss soil issues, pest spreads, crop pricing indices, and farm management practices in localized public discussion boards."
            />

            <FeatureCard
              icon={<LineChart className="w-6 h-6" />}
              title="Smart Yield Analytics"
              description="Visualize soil properties, weather metrics, and historic data to forecast harvest timings, market rates, and fertilizer quantities."
            />

          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t border-border bg-surface/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="primary" size="sm" className="mb-4">Process Timeline</Badge>
            <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text">
              How KrishiMitra AI Works
            </h2>
            <p className="text-text-muted mt-4 leading-relaxed">
              Step-by-step pipeline mapping the journey of our digital members.
            </p>
          </div>

          {/* Timeline Process */}
          <div className="relative border-l border-border md:border-l-0 md:flex md:justify-between md:gap-4 md:before:absolute md:before:top-[28px] md:before:left-0 md:before:right-0 md:before:h-[2px] md:before:bg-border/60 pl-6 md:pl-0">
            
            {[
              { num: '1', title: 'Register Account', desc: 'Sign up securely as a Farmer, Buyer, or Advisor.' },
              { num: '2', title: 'Complete Profile', desc: 'Define your regional crop history or buying parameters.' },
              { num: '3', title: 'Analyze with AI', desc: 'Scan leaf health or ask advice from our Gemini advisor.' },
              { num: '4', title: 'List crop harvests', desc: 'Post crop yields with pricing directly to the marketplace.' },
              { num: '5', title: 'Lease Equipment', desc: 'Rent harvesters or lease tools to surrounding farms.' },
              { num: '6', title: 'Consult Advisors', desc: 'Connect with agronomists for direct guidance.' },
              { num: '7', title: 'View Analytics', desc: 'Optimize harvests using yield forecasts and price indexes.' }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative mb-12 md:mb-0 md:flex-1 text-left md:text-center flex flex-col items-start md:items-center"
              >
                {/* Number Badge */}
                <div className="w-[56px] h-[56px] rounded-full bg-card border-2 border-primary flex items-center justify-center text-primary font-black text-xl shadow-glow-primary relative z-10 shrink-0">
                  {step.num}
                </div>
                
                <h3 className="text-base font-bold font-display text-text mt-4 mb-2">{step.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed max-w-[160px] md:mx-auto">{step.desc}</p>
              </motion.div>
            ))}

          </div>

        </div>
      </section>

      {/* AI Showcase Section */}
      <section id="ai-showcase" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Description */}
            <div className="space-y-6">
              <Badge variant="primary" size="sm">AI Engine</Badge>
              <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text leading-tight">
                Gemini-Powered Crop Health Diagnostics
              </h2>
              <p className="text-text-muted leading-relaxed text-base">
                Our plant pathology engine allows instant detection of diseases using your smartphone camera. Combining advanced computer vision and Google Gemini API, we provide direct treatment formulations and pest management plans immediately.
              </p>

              {/* AI Details List */}
              <ul className="space-y-4 pt-4 text-sm font-semibold text-text/80">
                <li className="flex items-center gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <span>Instant leaf diagnostic upload with 98% accuracy</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <span>Treatment formulations & recommended chemical compositions</span>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <span>Multilingual voice chat support for local dialects</span>
                </li>
              </ul>
            </div>

            {/* Right Column: Interactive Scan Simulator */}
            <div className="bg-card border border-border rounded-custom p-6 shadow-glass-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
              
              <div className="flex justify-between items-center pb-4 border-b border-border mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-text/60 uppercase tracking-wider">AI Diagnostic Lab</span>
                </div>
                {aiState !== 'idle' && (
                  <button
                    onClick={handleResetScan}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Reset Simulator
                  </button>
                )}
              </div>

              {/* Simulator Screens */}
              <AnimatePresence mode="wait">
                {aiState === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto text-3xl">
                      📸
                    </div>
                    <div>
                      <h4 className="font-bold text-text mb-1">Select a Leaf Sample to Scan</h4>
                      <p className="text-xs text-text-muted">Simulate how the Gemini Vision scanner diagnoses leaf diseases</p>
                    </div>

                    <div className="flex justify-center gap-3">
                      {mockLeaves.map((leaf) => (
                        <button
                          key={leaf.id}
                          onClick={() => handleLeafScan(leaf)}
                          className="px-4 py-3 bg-surface hover:bg-border border border-border hover:border-primary rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold w-24 active:scale-95 cursor-pointer"
                        >
                          <span className="text-2xl">{leaf.img}</span>
                          <span>{leaf.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {aiState === 'uploading' && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-16 space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                    <p className="text-sm font-semibold text-text">Uploading image payload...</p>
                    <p className="text-xs text-text-muted">Sending leaf metrics to Gemini Vision Engine</p>
                  </motion.div>
                )}

                {aiState === 'analyzing' && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-16 space-y-4"
                  >
                    <Activity className="w-12 h-12 text-accent animate-pulse mx-auto" />
                    <p className="text-sm font-semibold text-accent animate-pulse">Running crop pathology neural nets...</p>
                    <p className="text-xs text-text-muted">Parsing chlorophyll levels & pathogen patterns</p>
                  </motion.div>
                )}

                {aiState === 'done' && selectedLeaf && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/25 rounded-2xl">
                      <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-text">Diagnostic Completed Successfully</h4>
                        <p className="text-[10px] text-text-muted">Analysis match rate: {selectedLeaf.confidence}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-surface rounded-xl border border-border">
                        <span className="block text-[10px] uppercase font-bold text-text-muted">Detected Disease</span>
                        <span className="block text-sm font-bold text-red-400 mt-0.5">{selectedLeaf.disease}</span>
                      </div>
                      <div className="p-3 bg-surface rounded-xl border border-border">
                        <span className="block text-[10px] uppercase font-bold text-text-muted">Confidence Level</span>
                        <span className="block text-sm font-bold text-primary mt-0.5">{selectedLeaf.confidence} Match</span>
                      </div>
                    </div>

                    <div className="p-4 bg-surface rounded-xl border border-border">
                      <span className="block text-[10px] uppercase font-bold text-text-muted mb-1.5">Recommended Formulation</span>
                      <p className="text-xs text-text/80 leading-relaxed font-semibold">{selectedLeaf.treatment}</p>
                    </div>

                    <div className="flex gap-3.5 pt-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleResetScan}
                        className="flex-1"
                      >
                        Scan New Sample
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        as={Link}
                        to="/register"
                        className="flex-1"
                      >
                        Ask Gemini Advisor
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </section>

      {/* Marketplace Preview Section */}
      <section className="py-24 border-t border-border bg-surface/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <Badge variant="accent" size="sm" className="mb-4">Live Bidding Preview</Badge>
              <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text">
                Direct Farm Marketplace Preview
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl leading-relaxed">
                Connect and bid on premium raw farm yields listed directly by regional farmers.
              </p>
            </div>
            <Button
              as={Link}
              to="/marketplace"
              variant="outline"
              size="md"
              className="shrink-0 group hover:border-primary/30"
              rightIcon={<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
            >
              Explore Full Marketplace
            </Button>
          </div>

          {/* Cards Display Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Premium Basmati Rice', price: '₹3,500 / Quintal', quantity: '80 Quintals', farmer: 'Devinder Singh', region: 'Punjab', img: '🌾', category: 'Grain' },
              { title: 'Organic Golden Wheat', price: '₹2,400 / Quintal', quantity: '150 Quintals', farmer: 'Karan Sharma', region: 'Haryana', img: '🌱', category: 'Grain' },
              { title: 'High-Fiber Raw Cotton', price: '₹7,200 / Candy', quantity: '35 Candies', farmer: 'Anil Patil', region: 'Maharashtra', img: '☁️', category: 'Fiber' },
              { title: 'Fresh Desi Sugarcane', price: '₹380 / Ton', quantity: '300 Tons', farmer: 'Piyush Patel', region: 'Gujarat', img: '🎋', category: 'Sugar' }
            ].map((crop, idx) => (
              <Card key={idx} className="flex flex-col justify-between hover:border-primary/20">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-3xl">{crop.img}</span>
                    <Badge variant="gray" size="sm">{crop.category}</Badge>
                  </div>
                  <h3 className="text-base font-bold font-display text-text mb-1.5">{crop.title}</h3>
                  <p className="text-xs text-text-muted font-semibold">Farmer: {crop.farmer}</p>
                  <p className="text-xs text-text-muted font-semibold">Location: {crop.region}</p>
                </div>

                <div className="border-t border-border/50 pt-4 mt-6 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">Bidding Price</span>
                    <span className="block text-sm font-bold text-primary">{crop.price}</span>
                  </div>
                  <Badge variant="primary" size="sm">{crop.quantity}</Badge>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Equipment Rental Preview Section */}
      <section className="py-24 border-t border-border bg-surface/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <Badge variant="primary" size="sm" className="mb-4">Equipment Leasing</Badge>
              <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text">
                Peer-to-Peer Rental Hub
              </h2>
              <p className="text-text-muted mt-2 max-w-2xl leading-relaxed">
                Maximize machinery utility. Lease unused assets or rent heavy vehicles directly from peer farmers.
              </p>
            </div>
            <Button
              as={Link}
              to="/rentals"
              variant="outline"
              size="md"
              className="shrink-0"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse Equipment
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'John Deere Tractor (50 HP)', rate: '₹2,500 / Day', status: 'Available', owner: 'Gurbaksh Singh', location: 'Ludhiana', rating: '4.9 (45 reviews)', specs: 'Dual Clutch, Power Steering' },
              { title: 'Mahindra Combined Harvester', rate: '₹4,000 / Day', status: 'Available', owner: 'Suresh Patil', location: 'Satara', rating: '4.8 (28 reviews)', specs: 'High Capacity Grain Tank' },
              { title: 'Solar Powered Drip System', rate: '₹600 / Day', status: 'Booked', owner: 'Rajendra Prasad', location: 'Guntur', rating: '4.95 (18 reviews)', specs: 'Automated pressure controls' }
            ].map((machine, idx) => (
              <Card key={idx} className="flex flex-col justify-between hover:border-accent/20">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold font-display text-text">{machine.title}</h3>
                    <Badge variant={machine.status === 'Available' ? 'success' : 'danger'} size="sm">
                      {machine.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-xs text-text-muted font-semibold">
                    <p>Owner: {machine.owner}</p>
                    <p>Region: {machine.location}</p>
                    <p>Specs: {machine.specs}</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-current shrink-0" />
                    <span>{machine.rating}</span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4.5 mt-6 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-text-muted">Daily Rate</span>
                    <span className="block text-sm font-bold text-accent">{machine.rate}</span>
                  </div>
                  <Button
                    as={Link}
                    to="/register"
                    variant={machine.status === 'Available' ? 'primary' : 'outline'}
                    size="sm"
                    disabled={machine.status !== 'Available'}
                  >
                    Book Lease
                  </Button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* Expert Consultation Preview Section */}
      <section className="py-24 border-t border-border bg-surface/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="accent" size="sm" className="mb-4">Agronomist Advisory</Badge>
            <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text">
              Consult Verified Agricultural Experts
            </h2>
            <p className="text-text-muted mt-4 leading-relaxed">
              Connect directly with soil testing experts, entomologists, and seed quality analysts.
            </p>
          </div>

          {/* Expert Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProfileCard
              avatar={<Avatar name="Rajesh Kumar" initials="RK" status="online" isVerified size="lg" />}
              name="Dr. Rajesh Kumar"
              role="Senior Soil Scientist"
              bio="Ph.D. in Soil Agronomy from IARI. 15+ years diagnosing nutrient deficiencies, alkaline soil correction, and bio-fertilizer schedules."
              details={[
                { label: 'Consultations', value: '4.8K+' },
                { label: 'Rating', value: '4.95 / 5' }
              ]}
              actions={
                <Button as={Link} to="/register" variant="primary" size="sm" className="w-full">
                  Book Digital consultation
                </Button>
              }
            />

            <ProfileCard
              avatar={<Avatar name="Sarah Johnson" initials="SJ" status="online" isVerified size="lg" />}
              name="Dr. Sarah Johnson"
              role="Pest Control Entomologist"
              bio="Agronomy researcher focused on sustainable pest management, organic bio-pesticides, and crop disease vectors diagnostics."
              details={[
                { label: 'Consultations', value: '3.2K+' },
                { label: 'Rating', value: '4.88 / 5' }
              ]}
              actions={
                <Button as={Link} to="/register" variant="primary" size="sm" className="w-full">
                  Book Digital consultation
                </Button>
              }
            />

            <ProfileCard
              avatar={<Avatar name="Devendra Prasad" initials="DP" status="offline" isVerified size="lg" />}
              name="Prof. Devendra Prasad"
              role="Crop Rotation Analyst"
              bio="Advises smallholder farmers on multi-crop schedules, sustainable crop rotations, and monsoon rainfall mapping yields."
              details={[
                { label: 'Consultations', value: '5.5K+' },
                { label: 'Rating', value: '4.92 / 5' }
              ]}
              actions={
                <Button as={Link} to="/register" variant="primary" size="sm" className="w-full">
                  Book Digital consultation
                </Button>
              }
            />
          </div>

        </div>
      </section>

      {/* Weather + Government Schemes Section */}
      <section className="py-24 border-t border-border bg-surface/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Panel: Hyperlocal Weather Preview */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CloudRain className="w-6 h-6 text-primary shrink-0" />
                <h3 className="text-xl sm:text-2xl font-bold font-display text-text">Hyperlocal Forecast Indicator</h3>
              </div>
              <p className="text-text-muted leading-relaxed">
                Access real-time moisture mappings, humidity updates, and rainfall probabilities to schedule fertilizer dispersion and water flows.
              </p>

              {/* Weather Widget Box */}
              <div className="p-6 bg-card border border-border rounded-custom shadow-glass-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-text">Ludhiana Region</h4>
                    <p className="text-xs text-text-muted mt-0.5">Updated 5 mins ago</p>
                  </div>
                  <Badge variant="success" size="sm">Optimal Spraying Window</Badge>
                </div>

                <div className="flex items-center gap-6 my-6">
                  <span className="text-5xl font-black font-display tracking-tight text-text">32°C</span>
                  <div className="border-l border-border pl-6 flex items-center gap-2">
                    <CloudSun className="w-10 h-10 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-text/80 font-bold">Scattered Showers</p>
                      <p className="text-[10px] text-text-muted">Rain starting in 1.5 hours</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-4.5">
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-text-muted">Humidity</span>
                      <span className="block text-xs font-bold">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Thermometer className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-text-muted">Soil Temp</span>
                      <span className="block text-xs font-bold">24°C</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CloudRain className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-text-muted">Rain Probability</span>
                      <span className="block text-xs font-bold">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Government Schemes Preview */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-accent shrink-0" />
                <h3 className="text-xl sm:text-2xl font-bold font-display text-text">Government Schemes Engine</h3>
              </div>
              <p className="text-text-muted leading-relaxed">
                Instantly check regional matchings for central and state agricultural subsidies, crop protection insurances, and micro-loan programs.
              </p>

              {/* Schemes Listing */}
              <div className="space-y-3.5">
                {[
                  { name: 'PM-KISAN Samman Nidhi', desc: 'Direct financial assistance of ₹6,000 per year to smallholder farm families.', category: 'Income Support', rate: '100% Subsidy' },
                  { name: 'Pradhan Mantri Fasal Bima Yojana', desc: 'Comprehensive yield-risk crop insurance against natural calamities and disease pest outbreaks.', category: 'Insurance', rate: 'Premium Subsidy' },
                  { name: 'Solar Pump Scheme (PM-KUSUM)', desc: 'Up to 60% central state subsidies for solar irrigation installations.', category: 'Machinery Subsidy', rate: '60% Discount' }
                ].map((scheme, idx) => (
                  <div key={idx} className="p-4 bg-card border border-border rounded-custom hover:border-accent/15 transition-all flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-text">{scheme.name}</h4>
                        <Badge variant="gray" size="sm" className="scale-90">{scheme.category}</Badge>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed mt-1.5">{scheme.desc}</p>
                    </div>
                    <Badge variant="accent" size="sm" className="shrink-0">{scheme.rate}</Badge>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 border-t border-border bg-surface/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="primary" size="sm" className="mb-4">Member Reviews</Badge>
            <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text">
              Trusted by Agriculture Communities
            </h2>
            <p className="text-text-muted mt-4 leading-relaxed">
              Discover stories from farmers, wholesale buyers, and certified agronomists using our MERN AI suite.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Selling cotton yields on the marketplace bypasses all middle agents. Retained 100% of my harvest value, netting ₹24,000 extra this season.",
                author: "Ramesh Patil",
                role: "Cotton Farmer, Maharashtra",
                initials: "RP"
              },
              {
                quote: "Purchasing golden wheat and rice directly from certified Haryana farmers simplifies our supply chains. Sourcing organic yields has never been safer.",
                author: "Anita Sharma",
                role: "Director, AgroFoods Inc.",
                initials: "AS"
              },
              {
                quote: "Offering consulting services to remote farmers is extremely easy. The disease scanner gives soil chemical profiles directly so we recommend fertilizers instantly.",
                author: "Dr. Amit Verma",
                role: "Soil Agronomist, Punjab",
                initials: "AV"
              }
            ].map((story, idx) => (
              <Card key={idx} className="flex flex-col justify-between hover:border-primary/15 relative">
                <div className="absolute top-6 right-6 text-text/5 text-6xl font-black select-none pointer-events-none">
                  “
                </div>
                <p className="text-sm text-text/80 leading-relaxed font-semibold italic relative z-10 mb-8">
                  "{story.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar name={story.author} initials={story.initials} size="md" />
                  <div>
                    <h4 className="text-sm font-bold text-text">{story.author}</h4>
                    <p className="text-xs text-text-muted">{story.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 border-t border-border bg-surface/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="accent" size="sm" className="mb-4">Common Questions</Badge>
            <h2 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight font-display text-text">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion
            items={[
              {
                title: "Is KrishiMitra AI free to use for farmers?",
                content: "Yes! KrishiMitra is completely free for farmers to upload leaf diagnostics, list harvests in the marketplace, search government schemes, and connect with public agronomists."
              },
              {
                title: "How does the AI disease detection scanner work?",
                content: "When you upload a crop leaf image, our plant pathology model maps pathogens, leaf blights, or leaf rust structures. The results are parsed by Google Gemini API to return exact chemical treatments in under 5 seconds."
              },
              {
                title: "How are direct crop transaction payments secured?",
                content: "Buyers and farmers connect directly in bidding chatrooms. All buyers are verified via GST/Trade registration documentation to prevent fraudulent listings or payment defaults."
              },
              {
                title: "Who are the verified agronomists on the advisory panel?",
                content: "Agronomists on our board are certified soil specialists, crop pathologists, and PhD researchers holding active registrations with state agriculture universities."
              },
              {
                title: "How does the equipment rental system charge leasing rates?",
                content: "Leasing prices (e.g. ₹2,500/day for tractor) are set directly by machine owners. Transaction values, logistics, and duration schedules are agreed directly between peer farmers."
              }
            ]}
          />

        </div>
      </section>

      {/* Call To Action (CTA) Section */}
      <section className="py-20 md:py-28 border-t border-border bg-gradient-to-b from-background to-surface/20 relative overflow-hidden z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-8">
          <h2 className="text-3.5xl sm:text-5xl font-extrabold tracking-tight font-display text-text leading-tight">
            Join the Next-Gen AgriTech Community Today
          </h2>
          <p className="text-text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Maximize your farming yield potentials, negotiate direct crop sales, and interact with agronomists in real time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              as={Link}
              to="/register"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-glow-primary"
            >
              Register Free Profile
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Sign In Account
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
