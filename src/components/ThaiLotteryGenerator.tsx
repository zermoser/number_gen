import React, { useState, useEffect, useRef } from 'react';

type ColorKey = 'emerald' | 'amber' | 'violet' | 'rose';

interface NumberGroup {
  title: string;
  numbers: string[];
  subtitle?: string;
  color: ColorKey;
  icon: string;
}

const colorMap: Record<ColorKey, { bg: string; border: string; glow: string; text: string }> = {
  emerald: {
    bg: 'from-emerald-400 to-emerald-600',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-500/20',
    text: 'text-emerald-700'
  },
  amber: {
    bg: 'from-amber-400 to-orange-500',
    border: 'border-amber-200',
    glow: 'shadow-amber-500/20',
    text: 'text-amber-700'
  },
  violet: {
    bg: 'from-violet-500 to-purple-600',
    border: 'border-violet-200',
    glow: 'shadow-violet-500/20',
    text: 'text-violet-700'
  },
  rose: {
    bg: 'from-rose-400 to-pink-600',
    border: 'border-rose-200',
    glow: 'shadow-rose-500/20',
    text: 'text-rose-700'
  }
};

const ThaiLotteryGenerator: React.FC = () => {
  const [numberGroups, setNumberGroups] = useState<NumberGroup[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  // Number generators
  const generateTwoDigit = (): string => Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const generateSingleDigit = (): string => Math.floor(Math.random() * 10).toString();
  const generateThreeDigit = (): string => Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  // Generate lottery numbers
  const generateNumbers = (): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setNumberGroups([
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
          subtitle: 'เลขพิเศษ 4 ตัว',
          numbers: Array.from({ length: 4 }, () => generateThreeDigit()),
          color: 'rose',
          icon: '💎'
        }
      ]);
      setIsAnimating(false);
    }, 400);
  };

  // Create preview for download
  const downloadAsPreview = async () => {
    if (!downloadRef.current) return;
    setIsDownloading(true);

    try {
      // Dynamically import html2canvas
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(downloadRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: 1000
      });
      setPreviewSrc(canvas.toDataURL('image/jpeg', 0.9));
    } catch (error) {
      console.error('Error creating preview:', error);
      alert('เกิดข้อผิดพลาดในการสร้างภาพตัวอย่าง');
    } finally {
      setIsDownloading(false);
    }
  };

  // Confirm and trigger actual download
  const confirmDownload = () => {
    if (!previewSrc) return;
    const link = document.createElement('a');
    link.download = `lottery-${Date.now()}.jpg`;
    link.href = previewSrc;
    link.click();
    setPreviewSrc(null);
  };

  const cancelPreview = () => setPreviewSrc(null);

  useEffect(() => { generateNumbers(); }, []);

  // Get the typed color classes
  const getColorClasses = (color: ColorKey) => colorMap[color];

  // Render each group
  const renderNumbers = (group: NumberGroup, index: number) => {
    const { bg, glow, text } = getColorClasses(group.color);

    if (group.title === 'ระวัง') {
      // Special layout for "ระวัง" pairs
      return (
        <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{group.icon}</span>
              <h3 className={`text-xl font-bold ${text}`}>{group.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{group.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 2].map((startIndex, pairIndex) => (
              <div key={pairIndex} className="text-center">
                <div className={`bg-gradient-to-r ${bg} rounded-lg p-4 shadow-md ${glow}`}>
                  <div className="text-2xl font-bold text-white">
                    {group.numbers[startIndex]}{group.numbers[startIndex + 1]}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">คู่ที่ {pairIndex + 1}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (group.title === 'เลขมงคล') {
      // 5x2 grid for "เลขมงคล"
      return (
        <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{group.icon}</span>
              <h3 className={`text-xl font-bold ${text}`}>{group.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{group.subtitle}</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {group.numbers.map((number, numIndex) => (
              <div key={numIndex} className="text-center">
                <div className={`bg-gradient-to-r ${bg} rounded-lg p-3 shadow-md ${glow}`}>
                  <div className="text-lg font-bold text-white">{number}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default layout for other groups
    return (
      <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">{group.icon}</span>
            <h3 className={`text-xl font-bold ${text}`}>{group.title}</h3>
          </div>
          <p className="text-gray-600 text-sm">{group.subtitle}</p>
        </div>
        <div className={`grid ${group.title === 'เลขพิเศษ' ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
          {group.numbers.map((number, numIndex) => (
            <div key={numIndex} className="text-center">
              <div className={`bg-gradient-to-r ${bg} rounded-lg p-4 shadow-md ${glow}`}>
                <div className="text-xl font-bold text-white">{number}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Main Interface */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎰</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              เครื่องสุ่มเลขมงคล
            </h1>
          </div>
          <p className="text-gray-600 text-lg">สุ่มหมายเลขนำโชค เพื่อความมั่งคั่งและความสุข</p>
        </div>

        {/* Numbers Container */}
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {numberGroups.map((group, index) => renderNumbers(group, index))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={generateNumbers}
            disabled={isAnimating}
            className={`
              px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-lg
              bg-gradient-to-r from-blue-500 to-purple-600
              hover:from-blue-600 hover:to-purple-700
              transform hover:scale-105 active:scale-95 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              ${isAnimating ? 'animate-pulse' : ''}
            `}
          >
            {isAnimating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>กำลังสุ่ม...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>🎲</span>
                <span>สุ่มใหม่อีกครั้ง</span>
              </div>
            )}
          </button>

          <button
            onClick={downloadAsPreview}
            disabled={isDownloading || numberGroups.length === 0}
            className={`
              px-8 py-3 text-lg font-semibold text-white rounded-lg shadow-lg
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700
              transform hover:scale-105 active:scale-95 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              ${isDownloading ? 'animate-pulse' : ''}
            `}
          >
            {isDownloading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>กำลังเตรียม...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>📸</span>
                <span>ดาวน์โหลด JPG</span>
              </div>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">🙏 ขอให้โชคดี มีความสุข และร่ำรวย! 🍀💰</p>
        </div>
      </div>

      {/* Hidden Download Template */}
      <div
        ref={downloadRef}
        className="fixed -top-[9999px] left-0 w-[800px] bg-white p-8"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎰 เลขมงคลประจำวัน</h1>
          <p className="text-lg text-gray-600">วันที่ {new Date().toLocaleDateString('th-TH')}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded"></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {numberGroups.map((group, index) => {
            const { bg, text } = getColorClasses(group.color);

            if (group.title === 'ระวัง') {
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                  <div className="text-center mb-4">
                    <h3 className={`text-xl font-bold ${text} mb-1`}>
                      {group.icon} {group.title}
                    </h3>
                    <p className="text-sm text-gray-600">{group.subtitle}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[0, 2].map((startIndex, pairIndex) => (
                      <div key={pairIndex} className="text-center">
                        <div className={`bg-gradient-to-r ${bg} rounded-lg p-4`}>
                          <div className="text-2xl font-bold text-white">
                            {group.numbers[startIndex]}{group.numbers[startIndex + 1]}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">คู่ที่ {pairIndex + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (group.title === 'เลขมงคล') {
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 col-span-2">
                  <div className="text-center mb-4">
                    <h3 className={`text-xl font-bold ${text} mb-1`}>
                      {group.icon} {group.title}
                    </h3>
                    <p className="text-sm text-gray-600">{group.subtitle}</p>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {group.numbers.map((number, numIndex) => (
                      <div key={numIndex} className="text-center">
                        <div className={`bg-gradient-to-r ${bg} rounded-lg p-3`}>
                          <div className="text-lg font-bold text-white">{number}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <div className="text-center mb-4">
                  <h3 className={`text-xl font-bold ${text} mb-1`}>
                    {group.icon} {group.title}
                  </h3>
                  <p className="text-sm text-gray-600">{group.subtitle}</p>
                </div>
                <div className={`grid ${group.title === 'เลขพิเศษ' ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
                  {group.numbers.map((number, numIndex) => (
                    <div key={numIndex} className="text-center">
                      <div className={`bg-gradient-to-r ${bg} rounded-lg p-3`}>
                        <div className="text-lg font-bold text-white">{number}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600">🙏 ขอให้โชคดี มีความสุข และร่ำรวย! 🍀💰</p>
        </div>
      </div>

      {/* Preview Modal */}
      {previewSrc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4 text-center">ตัวอย่างภาพที่จะดาวน์โหลด</h3>
            <img src={previewSrc} alt="Preview" className="max-w-full h-auto mb-4 rounded-lg shadow-lg" />
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmDownload}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ✅ ดาวน์โหลด
              </button>
              <button
                onClick={cancelPreview}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ❌ ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThaiLotteryGenerator;