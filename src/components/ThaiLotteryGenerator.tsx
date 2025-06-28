import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

interface NumberGroup {
  title: string;
  numbers: string[];
  subtitle?: string;
  color: string;
  icon: string;
}

const ThaiLotteryGenerator: React.FC = () => {
  const [numberGroups, setNumberGroups] = useState<NumberGroup[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Premium background images
  const backgroundImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop&q=80'
  ];

  // Generate random two-digit number (00-99)
  const generateTwoDigit = (): string => {
    return Math.floor(Math.random() * 100).toString().padStart(2, '0');
  };

  // Generate random single-digit number (0-9)
  const generateSingleDigit = (): string => {
    return Math.floor(Math.random() * 10).toString();
  };

  // Generate random three-digit number (000-999)
  const generateThreeDigit = (): string => {
    return Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  };

  // Download as JPG function
  const downloadAsJPG = async (): Promise<void> => {
    if (!containerRef.current) return;
    setIsDownloading(true);

    try {
      // import แล้ว ก็เรียกใช้ง่าย ๆ
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: containerRef.current.scrollWidth,
        height: containerRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const link = document.createElement('a');
      link.download = `lottery-numbers-${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('ไม่สามารถดาวน์โหลดได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsDownloading(false);
    }
  };

  // Generate all lottery numbers
  const generateNumbers = (): void => {
    setIsAnimating(true);

    // Select random background
    const randomBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBackgroundImage(randomBg);

    setTimeout(() => {
      const newGroups: NumberGroup[] = [
        {
          title: 'เลขเบิ้ล',
          subtitle: 'หมายเลขนำโชค 6 ตัว',
          numbers: Array.from({ length: 6 }, () => generateTwoDigit()),
          color: 'emerald',
          icon: '🍀'
        },
        {
          title: 'ระวัง',
          subtitle: 'เลขคู่พิเศษ 2 คู่',
          numbers: Array.from({ length: 4 }, () => generateSingleDigit()),
          color: 'amber',
          icon: '⚡'
        },
        {
          title: 'เลขมงคล',
          subtitle: 'หมายเลขมงคล 10 ตัว',
          numbers: Array.from({ length: 10 }, () => generateTwoDigit()),
          color: 'violet',
          icon: '🌟'
        },
        {
          title: 'เลขพิเศษ',
          subtitle: 'หมายเลขพิเศษ 4 ตัว',
          numbers: Array.from({ length: 4 }, () => generateThreeDigit()),
          color: 'rose',
          icon: '💎'
        }
      ];

      setNumberGroups(newGroups);
      setIsAnimating(false);
    }, 400);
  };

  // Generate initial numbers on component mount
  useEffect(() => {
    generateNumbers();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: 'from-emerald-400 via-emerald-500 to-emerald-600',
        border: 'border-emerald-300/50',
        glow: 'shadow-emerald-500/25',
        accent: 'bg-emerald-100 text-emerald-800'
      },
      amber: {
        bg: 'from-amber-400 via-yellow-500 to-orange-500',
        border: 'border-amber-300/50',
        glow: 'shadow-amber-500/25',
        accent: 'bg-amber-100 text-amber-800'
      },
      violet: {
        bg: 'from-violet-500 via-purple-500 to-indigo-600',
        border: 'border-violet-300/50',
        glow: 'shadow-violet-500/25',
        accent: 'bg-violet-100 text-violet-800'
      },
      rose: {
        bg: 'from-rose-400 via-pink-500 to-rose-600',
        border: 'border-rose-300/50',
        glow: 'shadow-rose-500/25',
        accent: 'bg-rose-100 text-rose-800'
      }
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const renderNumbers = (group: NumberGroup, index: number) => {
    const colorClasses = getColorClasses(group.color);

    if (group.title === 'ระวัง') {
      // Special layout for "ระวัง" pairs
      return (
        <div key={index} className="h-full">
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] h-full flex flex-col">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="text-4xl">{group.icon}</span>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">{group.title}</h3>
              </div>
              <p className="text-white/80 text-base font-medium">{group.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 flex-1 items-center">
              {[0, 2].map((startIndex, pairIndex) => (
                <div key={pairIndex} className="relative group/pair">
                  <div className={`bg-gradient-to-br ${colorClasses.bg} rounded-2xl p-6 text-center shadow-2xl ${colorClasses.glow} transform hover:scale-105 transition-all duration-300 border ${colorClasses.border}`}>
                    <div className="text-4xl font-black text-white drop-shadow-lg tracking-wider">
                      {group.numbers[startIndex]}{group.numbers[startIndex + 1]}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{pairIndex + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (group.title === 'เลขมงคล') {
      // 5x2 grid for "เลขมงคล"
      return (
        <div key={index} className="h-full">
          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] h-full flex flex-col">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="text-4xl">{group.icon}</span>
                <h3 className="text-3xl font-bold text-white drop-shadow-lg">{group.title}</h3>
              </div>
              <p className="text-white/80 text-base font-medium">{group.subtitle}</p>
            </div>
            <div className="grid grid-cols-5 gap-4 flex-1 content-center">
              {group.numbers.map((number, numIndex) => (
                <div key={numIndex} className="relative group/number">
                  <div className={`bg-gradient-to-br ${colorClasses.bg} rounded-xl p-4 text-center shadow-xl ${colorClasses.glow} transform hover:scale-110 hover:rotate-3 transition-all duration-300 border ${colorClasses.border}`}>
                    <div className="text-2xl font-black text-white drop-shadow-lg">{number}</div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{numIndex + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default layout for other groups
    return (
      <div key={index} className="h-full">
        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] h-full flex flex-col">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="text-4xl">{group.icon}</span>
              <h3 className="text-3xl font-bold text-white drop-shadow-lg">{group.title}</h3>
            </div>
            <p className="text-white/80 text-base font-medium">{group.subtitle}</p>
          </div>
          <div className={`grid ${group.title === 'เลขพิเศษ' ? 'grid-cols-2' : 'grid-cols-3'} gap-4 flex-1 content-center`}>
            {group.numbers.map((number, numIndex) => (
              <div key={numIndex} className="relative group/number">
                <div className={`bg-gradient-to-br ${colorClasses.bg} rounded-2xl p-6 text-center shadow-2xl ${colorClasses.glow} transform hover:scale-110 hover:rotate-1 transition-all duration-300 border ${colorClasses.border}`}>
                  <div className="text-3xl font-black text-white drop-shadow-lg tracking-wider">{number}</div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{numIndex + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-pink-900/60 animate-pulse"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400/30 to-pink-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="text-8xl animate-bounce">🎰</span>
            <div>
              <h1 className="text-6xl lg:text-7xl font-black text-white mb-2 drop-shadow-2xl bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                เครื่องสุ่มเลขมงคล
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full mx-auto"></div>
            </div>
          </div>
          <p className="text-white/90 text-xl lg:text-2xl drop-shadow-lg font-medium">
            ✨ สุ่มหมายเลขนำโชค เพื่อความมั่งคั่งและความสุข ✨
          </p>
        </div>

        {/* Premium Numbers Container */}
        <div className={`w-full max-w-7xl transition-all duration-700 ${isAnimating ? 'opacity-0 scale-90 rotate-1' : 'opacity-100 scale-100 rotate-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {numberGroups.map((group, index) => renderNumbers(group, index))}
          </div>
        </div>

        {/* Premium Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
          {/* Generate Button */}
          <button
            onClick={generateNumbers}
            disabled={isAnimating}
            className={`
              group relative px-12 py-6 text-2xl font-black text-white rounded-3xl shadow-2xl
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
              hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500
              transform hover:scale-110 active:scale-95 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              border-4 border-white/30 hover:border-white/50
              shadow-purple-500/50 hover:shadow-purple-500/75
              ${isAnimating ? 'animate-pulse' : ''}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative flex items-center gap-3">
              {isAnimating ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>🎲 กำลังสุ่มเลขมงคล...</span>
                </>
              ) : (
                <>
                  <span className="text-3xl animate-spin group-hover:animate-pulse">🎲</span>
                  <span>สุ่มใหม่อีกครั้ง</span>
                  <span className="text-3xl">✨</span>
                </>
              )}
            </div>
          </button>

          {/* Download Button */}
          <button
            onClick={downloadAsJPG}
            disabled={isDownloading}
            className={`
              group relative px-10 py-6 text-xl font-black text-white rounded-3xl shadow-2xl
              bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600
              hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500
              transform hover:scale-110 active:scale-95 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              border-4 border-white/30 hover:border-white/50
              shadow-emerald-500/50 hover:shadow-emerald-500/75
              ${isDownloading ? 'animate-pulse' : ''}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative flex items-center gap-3">
              {isDownloading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>💾 กำลังดาวน์โหลด...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">📸</span>
                  <span>ดาวน์โหลด JPG</span>
                  <span className="text-2xl">💾</span>
                </>
              )}
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/80 text-lg drop-shadow-lg font-medium">
            🙏 ขอให้โชคดี มีความสุข และร่ำรวย! 🍀💰
          </p>
        </div>
      </div>

    </div>
  );
};

export default ThaiLotteryGenerator;