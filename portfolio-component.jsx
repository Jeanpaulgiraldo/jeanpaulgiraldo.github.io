import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

// ==========================================================================
// 1. CAPA DE DATOS (Aislada de la lógica de renderizado)
// ==========================================================================
const PROJECT_REGISTRY = [
  {
    id: 'p1',
    category: 'data',
    title: 'Alumni DB System',
    subtitle: 'BD_Gestiondeengresados',
    description: 'Architected a comprehensive relational SQL Server database structure mapping institutional graduate nodes with strict validation rules.',
    icon: 'fa-database'
  },
  {
    id: 'p2',
    category: 'ux',
    title: 'Automotive Marketing Integration',
    subtitle: 'Digital Performance Analytics',
    description: 'Engineered a multi-channel deployment framework resulting in 70k impressions, 640 metrics interactions, and 25 conversion leads.',
    icon: 'fa-chart-line'
  },
  {
    id: 'p3',
    category: 'ux',
    title: 'Zero Waste App Profile',
    subtitle: 'UI/UX & Design Sprint Protocols',
    description: 'Engineered full interface flows, system maps, constraint frameworks, and systemic functional test matrices.',
    icon: 'fa-leaf'
  },
  {
    id: 'p4',
    category: 'software',
    title: 'C# CRUD System',
    subtitle: 'Software Engineering',
    description: 'Developed an asynchronous desktop environment integrating standard UI controls with normalized data layers.',
    icon: 'fa-window-maximize'
  }
];

const SKILL_MATRIX = {
  languages: ['C#', 'Python', 'JavaScript', 'React', 'Java', 'Android', 'C++', 'Kotlin'],
  infrastructure: ['Advanced SQL', 'ETL / ELT Pipelines', 'Cloud Computing', 'Kubernetes', 'Arduino'],
  methodology: ['UI/UX Layouts', 'Generative AI', 'E-commerce Ops', 'Cybersecurity']
};

// ==========================================================================
// 2. MAIN PORTFOLIO ROOT COMPONENT
// ==========================================================================
function PortfolioRoot() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // TRACKING: Inicialización segura de Google Analytics 4
  useEffect(() => {
    const trackingId = "G-XXXXXXXXXX"; // <-- REEMPLAZA CON TU ID REAL
    
    const scriptGoogle = document.createElement('script');
    scriptGoogle.async = true;
    scriptGoogle.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(scriptGoogle);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    
    gtag('js', new Date());
    gtag('config', trackingId);

    return () => {
      if (document.head.contains(scriptGoogle)) document.head.removeChild(scriptGoogle);
    };
  }, []);

  // EVENTOS: Configuración estructural de interfaz
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    setIsDesktop(mq.matches);
    const listener = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', listener);
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timer = setTimeout(() => setIsLoading(false), 600);
    
    return () => {
      mq.removeEventListener('change', listener);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return PROJECT_REGISTRY;
    return PROJECT_REGISTRY.filter(project => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans antialiased selection:bg-[#251964]/30 selection:text-[#251964]">
      
      <AnimatePresence>
        {isLoading && <SkeletonLoader />}
      </AnimatePresence>

      {isDesktop && <CustomCursorEngine />}
      
      <GlobalNavigationBar isScrolled={isScrolled} />
      
      <main id="main-content">
        <HeroSection />
        <MarqueeBanner />
        <AboutSection isDesktop={isDesktop} />
        <TechnicalCore />
        <ProjectCenter 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          projects={filteredProjects} 
        />
        <SystemsDeployment />
        <ExperienceTrack />
      </main>
      
      <FloatingActionBar />
      <FooterSection />
    </div>
  );
}

// ==========================================================================
// 3. SUB-COMPONENTES DE INTERFAZ
// ==========================================================================

function SkeletonLoader() {
  return (
    <motion.div 
      id="skeleton-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 bg-[#fbfbfd] z-[99999] flex flex-col overflow-hidden"
      aria-hidden="true"
    >
      <div className="w-full h-[70px] bg-gradient-to-r from-[#eff1f3] via-[#e2e5e7] to-[#eff1f3] bg-[length:200%_100%] animate-shimmer mb-10" />
      <div className="container mx-auto px-6 text-center mt-20">
        <div className="w-1/3 h-12 mx-auto rounded-xl bg-gradient-to-r from-[#eff1f3] via-[#e2e5e7] to-[#eff1f3] bg-[length:200%_100%] animate-shimmer mb-6" />
        <div className="w-1/2 h-6 mx-auto rounded-lg bg-gradient-to-r from-[#eff1f3] via-[#e2e5e7] to-[#eff1f3] bg-[length:200%_100%] animate-shimmer" />
      </div>
    </motion.div>
  );
}

function CustomCursorEngine() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const followerX = useSpring(cursorX, springConfig);
  const followerY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div 
        className="fixed w-2 h-2 bg-[#251964] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.div 
        className="fixed w-10 h-10 border border-[#251964]/30 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ x: followerX, y: followerY }}
      />
    </>
  );
}

function GlobalNavigationBar({ isScrolled }) {
  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-[1000] transition-all duration-300 ${
        isScrolled ? 'py-3.5 bg-[#160e40]/98 md:bg-[#160e40]/85 md:backdrop-blur-xl shadow-lg border-b border-white/5' : 'py-6 bg-transparent'
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-xl font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-[#8ab4f8] to-white animate-text-shine">
          Jean Paul Giraldo
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {[
            { label: 'About', href: '#about' },
            { label: 'Skills', href: '#skills' },
            { label: 'Projects', href: '#projects' },
            { label: 'Architectures', href: '#cases' },
            { label: 'Experience', href: '#experience' }
          ].map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" className="px-5 py-2 rounded-full bg-white text-[#251964] text-sm font-semibold hover:bg-[#f0f0f0] transition-all transform hover:-translate-y-0.5 hover-efecto-verde">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

// OPTIMIZADO: Eliminado el setTimout que saturaba la memoria
function HeroSection() {
  const loopWords = ["Cloud Architecture.", "AWS Data Security.", "Business Intelligence.", "Smart Industry AI."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % loopWords.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [loopWords.length]);

  return (
    // Agregamos bg-[#160e40] para que los móviles vean tu color azul oscuro de fondo
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#160e40] text-white">
      
      <video 
        autoPlay loop muted playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 bg-[#160e40]"
      >
        {/* El media query bloquea celulares, y el H.264 optimizado vuela en computadoras */}
        <source src="Diseño sin título(2).mp4" type="video/mp4" media="(min-width: 768px)" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#160e40]/95 via-[#251964]/90 to-[#3e2ca6]/85 md:mix-blend-multiply z-10" />
      
      <div className="container mx-auto px-6 text-center relative z-20 max-w-4xl">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Jean Paul Giraldo
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10 h-[70px]"
        >
          Data & Product Engineer. <br />
          <span className="font-light opacity-75">Specializing in </span>
          
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWordIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-white inline-block"
            >
              {loopWords[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <a href="#projects" className="px-8 py-3.5 rounded-full bg-white text-[#251964] font-semibold text-base shadow-xl hover:bg-neutral-100 transition-all transform hover:-translate-y-0.5">
            View Portfolio
          </a>
          <a href="#contact" className="px-8 py-3.5 rounded-full border border-white/40 text-white font-medium text-base backdrop-blur-sm hover:bg-white/10 transition-all">
            Contact Me
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function MarqueeBanner() {
  return (
    <div className="w-full bg-[#251964] text-white/90 py-4 overflow-hidden relative z-30 select-none -mt-10 -rotate-2 scale-[1.02] shadow-2xl">
      <div className="animate-marquee-infinite gap-12 text-sm font-bold tracking-widest uppercase">
        {Array(4).fill([
          "Data Science", "Growth Systems", "AWS", "SQL", "UI/UX", "Generative AI"
        ]).flat().map((text, idx) => (
          <span key={idx} className="flex items-center gap-4">
            <span>{text}</span>
            <span className="text-white/30">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function AboutSection({ isDesktop }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });
  
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const animatedY = useSpring(imgY, { stiffness: 100, damping: 30 });

  return (
    <section ref={targetRef} id="about" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 flex justify-center relative">
            <motion.div 
              style={{ y: isDesktop ? animatedY : 0 }} 
              className="w-[280px] h-[280px] relative rounded-full border-[5px] border-white shadow-2xl overflow-hidden"
            >
              <img 
                src="Jeanpaulgiraldo.png" 
                alt="Jean Paul Giraldo - Cloud Infrastructure Track" 
                width="280"
                height="280"
                decoding="async"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#160e40]">
              Bridging the gap between software topologies and enterprise data logic.
            </h2>
            <p className="text-lg text-[#86868b] leading-relaxed">
              I develop resilient software infrastructures by synchronizing modern cloud architectures, low-overhead UI/UX integration layers, and automated programmatic optimization vectors.
            </p>
            <div className="p-6 rounded-2xl border border-neutral-100 bg-[#fbfbfd] border-left-4 border-l-[#251964]">
              <h3 className="font-bold text-[#251964] mb-4 flex items-center gap-2">
                <i className="fas fa-crosshairs text-sm" /> Structural Core Track
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium text-neutral-700">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#251964]" /> Cloud Security Matrices</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#251964]" /> Large Language Pipelines</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#251964]" /> Business Intelligence Systems</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#251964]" /> Pipeline Integrity Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnicalCore() {
  return (
    <section id="skills" className="py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight text-[#160e40] mb-16">Technical Core.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm group hover:shadow-md transition-all duration-300">
            <i className="fas fa-code text-3xl text-[#251964] mb-6 block" />
            <h5 className="font-bold text-lg text-[#251964] mb-4">Languages</h5>
            <div className="flex flex-wrap gap-2">
              {SKILL_MATRIX.languages.map((skill) => (
                <span key={skill} className="bg-[#f5f5f7] text-[#251964] text-xs font-semibold px-3 py-1.5 rounded-full hover-efecto-verde transition-all">{skill}</span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm group hover:shadow-md transition-all duration-300">
            <i className="fas fa-server text-3xl text-[#251964] mb-6 block" />
            <h5 className="font-bold text-lg text-[#251964] mb-4">Infrastructure</h5>
            <div className="flex flex-wrap gap-2">
              {SKILL_MATRIX.infrastructure.map((skill) => (
                <span key={skill} className="bg-[#f5f5f7] text-[#251964] text-xs font-semibold px-3 py-1.5 rounded-full hover-efecto-verde transition-all">{skill}</span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm group hover:shadow-md transition-all duration-300">
            <i className="fas fa-lightbulb text-3xl text-[#251964] mb-6 block" />
            <h5 className="font-bold text-lg text-[#251964] mb-4">Methodology</h5>
            <div className="flex flex-wrap gap-2">
              {SKILL_MATRIX.methodology.map((skill) => (
                <span key={skill} className="bg-[#f5f5f7] text-[#251964] text-xs font-semibold px-3 py-1.5 rounded-full hover-efecto-verde transition-all">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-3xl p-8 md:p-12 shadow-sm mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-2 text-center lg:text-left">
              <h4 className="font-bold text-xl text-[#160e40]"><i className="fas fa-chart-line text-[#251964] mr-2" />Performance Metrics</h4>
              <p className="text-sm text-[#86868b]">Continuous monitoring of Core Web Vitals, parsing velocities, and automated organic crawl paths.</p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="border-b sm:border-b-0 sm:border-r border-neutral-100 pb-4 sm:pb-0">
                <div className="text-xs text-[#86868b] font-medium mb-1">Lighthouse Performance</div>
                <div className="text-3xl font-black text-[#34c759]">100/100</div>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-neutral-100 pb-4 sm:pb-0">
                <div className="text-xs text-[#86868b] font-medium mb-1">Data Quality Compliance</div>
                <div className="text-3xl font-black text-[#160e40]">99.9%</div>
              </div>
              <div>
                <div className="text-xs text-[#86868b] font-medium mb-1">Crawl Target Mapping</div>
                <div className="text-3xl font-black text-[#0071e3]">Optimized</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCenter({ activeFilter, setActiveFilter, projects }) {
  // FUNCIÓN: Manejador de coordenadas para el efecto resplandor 3D
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <motion.section 
      id="projects" 
      className="py-32 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#160e40]">Production Environments.</h2>
          <div className="flex flex-wrap justify-center gap-2.5 pt-4">
            {['all', 'data', 'software', 'ux'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-6 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                  activeFilter === type
                    ? 'bg-[#251964] text-white shadow-lg'
                    : 'bg-[#fbfbfd] text-[#86868b] border border-neutral-200/60 hover:bg-neutral-50 hover-efecto-verde'
                }`}
              >
                {type === 'all' ? 'All Specs' : type === 'data' ? 'Data & DB' : type === 'software' ? 'Software Eng' : 'Strategy & UX'}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }} 
                key={project.id}
                onMouseMove={handleMouseMove} // <-- El enlace al CSS que genera el Glow
                className="apple-card bg-white rounded-3xl border border-neutral-100 p-8 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#251964]/5 flex items-center justify-center text-[#251964] text-xl mb-6">
                    <i className={`fas ${project.icon}`} />
                  </div>
                  <h4 className="text-lg font-bold text-[#160e40] mb-1">{project.title}</h4>
                  <p className="text-xs font-semibold text-[#251964] opacity-70 mb-4">{project.subtitle}</p>
                  <p className="text-sm text-[#86868b] leading-relaxed">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}             

function SystemsDeployment() {
  return (
    <section id="cases" className="py-32 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#160e40] text-center mb-16">Systems Deployment.</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="apple-card bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <i className="fas fa-shopping-cart text-3xl text-[#251964]" />
              <h4 className="font-bold text-xl text-[#160e40]">E-commerce Automation & BI Engine</h4>
            </div>
            <p className="text-xs font-semibold text-[#251964]">Applied Architecture: Low-latency execution models for structural scalability</p>
            <p className="text-sm text-[#86868b] leading-relaxed">Design and systemic deployment of high-throughput structures optimizing system states while eliminating functional transactional drift. Integrates normalized data backends to eliminate stock concurrency errors alongside automated transaction pipelines powered by n8n nodes.</p>
            <hr className="border-neutral-100" />
            <div className="flex justify-between text-xs text-[#86868b] font-medium">
              <span><i className="fas fa-bolt mr-1" /> Sub-millisecond TTFB Caching</span>
              <span><i className="fas fa-search mr-1" /> Algorithmic Crawl Optimization</span>
            </div>
          </div>

          <div className="apple-card bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <i className="fas fa-user-shield text-3xl text-[#251964]" />
              <h4 className="font-bold text-xl text-[#160e40]">AquaCity Cyber Audit Infrastructure</h4>
            </div>
            <p className="text-xs font-semibold text-[#251964]">System Framework Compliance: ISO 27001 & ISO 27032 Compliance Matrices</p>
            <p className="text-sm text-[#86868b] leading-relaxed">Development of an enterprise risk mitigation control matrix and access logical control architectures for automated operational technology topologies. Engineered to secure sensitive nodes, remediate vulnerability vectors, and sanitize data paths at endpoints.</p>
            <hr className="border-neutral-100" />
            <div className="flex justify-between text-xs text-[#86868b] font-medium">
              <span><i className="fas fa-lock mr-1" /> Zero-Trust Cloud Guardrails</span>
              <span><i className="fas fa-check-circle mr-1" /> Data Clean Room Ingestion</span>
            </div>
          </div>
        </div>

        <h4 className="font-bold text-2xl text-center text-[#160e40] mt-24 mb-12">Peer System Evaluations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#f5f5f7] rounded-3xl p-8 space-y-6">
            <p className="text-base text-[#1d1d1f] italic leading-relaxed">"The technical infrastructure implemented by Jean Paul resolved continuous state synchronization lags across our data pipelines. System throughput and programmatic edge handling significantly increased retention thresholds."</p>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#251964] text-white flex items-center justify-center font-bold text-sm">EM</div>
              <div>
                <h6 className="font-bold text-sm text-[#1d1d1f] mb-0">Engineering Review Matrix</h6>
                <small className="text-xs text-[#86868b]">Tech Lead & Solutions Auditor</small>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f5f7] rounded-3xl p-8 space-y-6">
            <p className="text-base text-[#1d1d1f] italic leading-relaxed">"High-caliber execution that perfectly marries low-overhead graphic interfaces with resilient runtime optimization. His deep understanding of programmatic SEO layers sets a high industrial standard."</p>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#251964] text-white flex items-center justify-center font-bold text-sm">CTO</div>
              <div>
                <h6 className="font-bold text-sm text-[#1d1d1f] mb-0">Product Engineer Evaluation</h6>
                <small className="text-xs text-[#86868b]">E-commerce Solutions Specialist</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceTrack() {
  return (
    <section id="experience" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-6 space-y-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#160e40]">Professional Track.</h2>
            <div className="space-y-8">
              <div className="pl-6 border-l-4 border-[#251964] space-y-2">
                <h5 className="font-bold text-lg text-[#1d1d1f] mb-0">Operations Manager & Visual Designer</h5>
                <p className="text-sm font-bold text-[#251964] mb-0">Drews Male</p>
                <p className="text-sm text-[#86868b] leading-relaxed">Orchestrated system logistics, standardized transactional operational assets, and optimized structural visual environments to scale transaction paths.</p>
              </div>
              <div className="pl-6 border-l-4 border-[#251964] space-y-2">
                <h5 className="font-bold text-lg text-[#1d1d1f] mb-0">E-commerce Specialist & Brand Strategist</h5>
                <p className="text-sm font-bold text-[#251964] mb-0">Luxejoyería18k (Freelance)</p>
                <p className="text-sm text-[#86868b] leading-relaxed">Architected high-conversion transactional architectures, modulated search visibility, and customized catalog structures to capture intent vectors.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#160e40]">Certifications.</h2>
            <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-neutral-700">
                <ul className="space-y-3.5">
                  <li className="font-bold text-[#251964] flex items-center gap-2"><i className="fas fa-shield-alt text-xs" /> AWS Cloud Security</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> AWS Cloud Fundamentals</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> AWS Advanced Gen AI</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> Google Cloud Computing</li>
                </ul>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> IBM Intro to AI & LLMs</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> IBM NLP & Computer Vision</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> MKT-BI (Pascual Bravo)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neutral-300" /> Digital Marketing (SENA)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingActionBar() {
  return (
    <div className="mobbin-fab fixed bottom-[30px] left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-2 bg-white/90 shadow-xl border border-neutral-200/50 rounded-full z-[1000] transition-all duration-300">
      <a href="#about" className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 transition-colors" aria-label="Scroll to top">
        <i className="fas fa-arrow-up text-xs" />
      </a>
      <div className="w-[1px] h-5 bg-neutral-200" />
      <a href="#projects" className="px-4 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900">Work</a>
      <div className="w-[1px] h-5 bg-neutral-200" />
      <a href="mailto:analisisjeanpaul@gmail.com" className="px-5 py-2.5 bg-[#251964] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md hover:bg-[#160e40] transition-colors">
        Hire Engineer
      </a>
    </div>
  );
}

function FooterSection() {
  return (
    <footer id="contact" className="bg-[#160e40] text-white/60 py-24 text-center border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-white">Initialize Technical Integration.</h2>
        <p className="max-w-lg mx-auto text-sm text-white/70 leading-relaxed">
          Open to strategic roles in Software Engineering topologies, Data Infrastructure tracks, and high-throughput UI/UX environments.
        </p>
        <div className="flex justify-center gap-4">
          <a href="https://www.linkedin.com/in/jean-paul-giraldo-6b59a5275/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-base hover:bg-white hover:text-[#160e40] transition-all duration-200" aria-label="LinkedIn Profile">
            <i className="fab fa-linkedin-in" />
          </a>
          <a href="https://github.com/Jeanpaulgiraldo" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-base hover:bg-white hover:text-[#160e40] transition-all duration-200" aria-label="GitHub Profile">
            <i className="fab fa-github" />
          </a>
          <a href="mailto:analisisjeanpaul@gmail.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-base hover:bg-white hover:text-[#160e40] transition-all duration-200" aria-label="Email Contact">
            <i className="fas fa-envelope" />
          </a>
        </div>
        <p className="text-xs opacity-40">&copy; {new Date().getFullYear()} Jean Paul Giraldo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default PortfolioRoot;
