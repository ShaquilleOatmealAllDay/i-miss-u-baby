import React, { useState, useEffect, useRef } from 'react';

const APOLOGY_LETTER_TEXT = `My dearest Jaana,

I am so incredibly sorry for not giving u aftercare like what the fuck I mistreated u so much and I expected u to put up with my bull shit and that is just so wrong honey. I just want u to know baby YOU MEAN THE WORLD TO ME AND SEEIN U HURT BREAKS MY HEART INTO PIECES. i really promise to do better and ab toh i’ll give u extra aftercare and then ANOTHER ROUND YAY 😘! 

Please forgive me sweetie I really mish u and I wanna talk to u rn can we do that pweaseee???
I will dance for u as well jaana.

I will get u more plushies flowers and gifts as well honeyyy.

Your monkey,
Yours always, 
Adi <3.`;

// Components
const HeartIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SparkleIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
  </svg>
);

const EnvelopeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const Background = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const newElements = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      type: Math.random() > 0.6 ? 'heart' : 'sparkle',
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * -20, // Negative delay to start immediately scattered
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-rose-900 to-black opacity-90"></div>
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute opacity-30"
          style={{
            left: `${el.left}%`,
            top: `${el.top}%`,
            animation: `float ${el.duration}s infinite alternate ease-in-out ${el.delay}s`,
            transform: `scale(${el.direction})`
          }}
        >
          {el.type === 'heart' ? (
            <HeartIcon className="text-pink-400/50" style={{ width: el.size, height: el.size }} />
          ) : (
            <SparkleIcon className="text-white/40" style={{ width: el.size, height: el.size }} />
          )}
        </div>
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-50px) translateX(20px) rotate(180deg); }
          100% { transform: translateY(-100px) translateX(-20px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(1);
  const [heartsCaught, setHeartsCaught] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [mendCount, setMendCount] = useState(0);
  const [letterOpen, setLetterOpen] = useState(false);
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playAudio = () => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log(e));
      setIsPlaying(true);
    }
  };

  // Initialize Game 1
  useEffect(() => {
    if (step === 1) {
      const hearts = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        left: Math.random() * 80 + 10,
        top: Math.random() * 80 + 10,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        caught: false,
      }));
      setFloatingHearts(hearts);
    }
  }, [step]);

  // Game 1 loop
  useEffect(() => {
    if (step === 1) {
      let animationFrameId;
      const updatePositions = () => {
        setFloatingHearts(prev => prev.map(heart => {
          if (heart.caught) return heart;
          let newLeft = heart.left + heart.vx;
          let newTop = heart.top + heart.vy;
          let newVx = heart.vx;
          let newVy = heart.vy;

          if (newLeft < 5 || newLeft > 95) newVx *= -1;
          if (newTop < 15 || newTop > 90) newVy *= -1;

          return { ...heart, left: newLeft, top: newTop, vx: newVx, vy: newVy };
        }));
        animationFrameId = requestAnimationFrame(updatePositions);
      };
      animationFrameId = requestAnimationFrame(updatePositions);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [step]);

  const catchHeart = (id) => {
    playAudio();
    setFloatingHearts(prev => prev.map(h => h.id === id ? { ...h, caught: true } : h));
    const newCaught = heartsCaught + 1;
    setHeartsCaught(newCaught);
    if (newCaught >= 5) {
      setTimeout(() => setStep(2), 1000);
    }
  };

  const mendHeart = () => {
    if (mendCount < 3) {
      const newMendCount = mendCount + 1;
      setMendCount(newMendCount);
      if (newMendCount >= 3) {
        setTimeout(() => setStep(3), 1500);
      }
    }
  };

  // Step 3 automatically transitions to Step 4 after apology reads
  useEffect(() => {
    if (step === 3) {
      setTimeout(() => setStep(4), 5000);
    }
  }, [step]);

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden text-white bg-black">
      <audio ref={audioRef} src="/music.webm" loop />
      <Background />
      
      <div className="relative z-10 w-full h-full min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Step 1: Catch the Hearts */}
        {step === 1 && (
          <div className="w-full h-full flex flex-col items-center animate-in fade-in duration-1000">
            <div className="absolute top-16 w-full text-center pointer-events-none">
              <h2 className="text-3xl font-light mb-4 text-white drop-shadow-lg tracking-wide">Catch the Hearts</h2>
              <div className="inline-block px-8 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                <span className="font-semibold tracking-wider text-pink-100">CAUGHT: {heartsCaught}/5</span>
              </div>
            </div>
            
            {floatingHearts.map((heart) => (
              !heart.caught && (
                <div
                  key={heart.id}
                  onClick={() => catchHeart(heart.id)}
                  className="absolute cursor-pointer p-6 tap-highlight-transparent"
                  style={{
                    left: `${heart.left}%`,
                    top: `${heart.top}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'transform 0.1s'
                  }}
                >
                  <HeartIcon className="w-16 h-16 text-pink-500 hover:scale-125 active:scale-90 transition-transform drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
                </div>
              )
            ))}
          </div>
        )}

        {/* Step 2: Mend the Heart */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-1000">
            <div className="text-center">
              <h2 className="text-4xl font-light mb-3 tracking-wide drop-shadow-lg">Mend the Heart</h2>
              <p className="text-pink-200/80 text-lg tracking-widest font-light">Tap to heal the pieces</p>
            </div>
            
            <div 
              className={`relative cursor-pointer tap-highlight-transparent transition-all duration-1000 ease-out ${mendCount >= 3 ? 'scale-125 drop-shadow-[0_0_80px_rgba(244,63,94,0.8)]' : 'hover:scale-105 active:scale-95'}`}
              onClick={mendHeart}
            >
              <svg viewBox="0 0 100 100" className={`w-56 h-56 transition-colors duration-1000 ${mendCount >= 3 ? 'text-rose-500' : 'text-rose-600/60'}`}>
                {mendCount < 3 ? (
                  <>
                    <path d="M50 90 L45 80 L52 70 L48 60 L50 50 L46 40 L50 30" stroke="rgba(0,0,0,0.8)" strokeWidth={4 - mendCount} fill="none" className="absolute z-10 transition-all duration-500" />
                    <path d="M50 90C50 90 10 60 10 30C10 15 25 10 35 15C42 18 46 25 50 30C54 25 58 18 65 15C75 10 90 15 90 30C90 60 50 90 50 90Z" fill="currentColor" />
                    <path d="M50 90 L45 80 L52 70 L48 60 L50 50 L46 40 L50 30" stroke="rgba(0,0,0,0.5)" strokeWidth={4 - mendCount} fill="none" className="transition-all duration-500" />
                  </>
                ) : (
                  <path d="M50 90C50 90 10 60 10 30C10 15 25 10 35 15C42 18 46 25 50 30C54 25 58 18 65 15C75 10 90 15 90 30C90 60 50 90 50 90Z" fill="currentColor" />
                )}
              </svg>

              {mendCount > 0 && mendCount < 3 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="text-white text-sm font-semibold tracking-[0.2em] uppercase animate-pulse drop-shadow-md">Healing...</div>
                </div>
              )}
            </div>
            <div className="h-12 flex items-center justify-center">
              {mendCount >= 3 && <div className="text-pink-200 font-light tracking-widest animate-pulse text-2xl">Perfect again.</div>}
            </div>
          </div>
        )}

        {/* Step 3: The Animation */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center h-full w-full">
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl text-glowy text-center tracking-widest text-white motion-safe:animate-[float-slow_4s_ease-in-out_infinite]"
              style={{ animation: 'fadeIn 3s ease-in forwards' }}
            >
              I'm so sorry baby...
            </h1>
            <style>{`
              @keyframes fadeIn {
                0% { opacity: 0; filter: blur(10px); transform: scale(0.9); }
                100% { opacity: 1; filter: blur(0px); transform: scale(1); }
              }
            `}</style>
          </div>
        )}

        {/* Step 4: The Final Letter */}
        {step === 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center" style={{ animation: 'fadeIn 2s ease-in forwards' }}>
            {!letterOpen ? (
              <div 
                className="flex flex-col items-center cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-500 group tap-highlight-transparent"
                onClick={() => setLetterOpen(true)}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-pink-500/40 blur-3xl rounded-full group-hover:bg-pink-400/60 transition-colors duration-500"></div>
                  <EnvelopeIcon className="w-32 h-32 text-white/90 drop-shadow-[0_0_40px_rgba(255,255,255,0.5)] relative z-10" />
                </div>
                <p className="mt-8 text-pink-100/90 text-sm font-light tracking-[0.3em] uppercase animate-pulse">Open Letter</p>
              </div>
            ) : (
              <div 
                className="w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] rounded-[2rem] p-8 md:p-14 relative overflow-hidden"
                style={{ animation: 'scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
              >
                <button 
                  onClick={() => setLetterOpen(false)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-20 tap-highlight-transparent"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute -top-12 -left-12 text-pink-500/10 rotate-12 pointer-events-none">
                  <HeartIcon className="w-48 h-48" />
                </div>
                <div className="absolute -bottom-16 -right-16 text-pink-400/10 -rotate-12 pointer-events-none">
                  <HeartIcon className="w-64 h-64" />
                </div>
                
                <div className="relative z-10 space-y-6 text-white/95 font-light">
                  {APOLOGY_LETTER_TEXT.split('\n').map((paragraph, index) => (
                    <p key={index} className="leading-relaxed text-lg tracking-wide">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-14 flex justify-end relative z-10">
                  <HeartIcon className="w-10 h-10 text-rose-500/90 animate-pulse drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
                </div>
              </div>
            )}
            <style>{`
              @keyframes scaleUp {
                0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
          </div>
        )}

      </div>
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .tap-highlight-transparent {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
