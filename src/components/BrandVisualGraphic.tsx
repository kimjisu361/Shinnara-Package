import React from 'react';

interface BrandVisualGraphicProps {
  type: 'hero' | 'photocard' | 'sleeve' | 'benefits' | 'set' | 'workbench';
  className?: string;
  customSrc?: string;
  alt?: string;
}

export const BrandVisualGraphic: React.FC<BrandVisualGraphicProps> = ({
  type,
  className = '',
  customSrc,
  alt = '신나라패키지 포장 샘플'
}) => {
  // If user provided custom image (via asset manager or upload)
  if (customSrc) {
    return (
      <div className={`relative overflow-hidden bg-[#F7F4FF] ${className}`}>
        <img
          src={customSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#514078] border border-[#E8E3F0]">
          CUSTOM IMAGE
        </div>
      </div>
    );
  }

  // High-fidelity editorial SVG & CSS studio visuals
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#F7F4FF] via-white to-[#E9E1FF]/40 border border-[#E8E3F0] ${className}`}>
      {type === 'hero' && (
        <div className="relative w-full h-full p-6 sm:p-10 flex flex-col justify-between select-none">
          {/* Studio lighting backdrop sheen */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#B8A1F7]/25 via-transparent to-transparent pointer-events-none" />

          {/* Top meta tags */}
          <div className="flex items-center justify-between text-xs text-[#777180] tracking-wider font-mono">
            <span>PACKAGING STUDIO · TABLE 01</span>
            <span className="text-[#8B6CF6] font-semibold bg-[#E9E1FF]/70 px-2 py-0.5 rounded text-[10px]">SAMPLE REFERENCE</span>
          </div>

          {/* Center Graphic: Photocard & Lavender Envelope Composition */}
          <div className="relative my-6 flex items-center justify-center">
            {/* Lavender Envelope */}
            <div className="relative w-64 sm:w-80 h-40 sm:h-48 bg-[#B8A1F7]/30 border border-[#B8A1F7]/40 shadow-xl shadow-purple-950/5 flex flex-col justify-end p-4 rounded-sm rotate-[-3deg] transition-transform duration-500 hover:rotate-0">
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#B8A1F7]/40 to-transparent clip-path-polygon" />
              <div className="absolute top-3 right-3 text-[10px] tracking-widest text-[#514078]/70 font-semibold font-mono">
                SINNARA ARCHIVE
              </div>
              {/* Wax / Stamp Seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#8B6CF6] text-white flex items-center justify-center shadow-md font-serif font-bold text-xs">
                SP
              </div>
              <div className="text-[11px] text-[#514078] font-medium tracking-wide">
                LAVENDER GOODS STUDIO
              </div>
            </div>

            {/* Overlapping Crystal Photocard in Hard Toploader */}
            <div className="absolute w-44 sm:w-52 h-64 sm:h-72 bg-white/90 backdrop-blur-md border-2 border-white shadow-2xl rounded-lg p-2.5 rotate-[6deg] translate-x-12 translate-y-2 transition-transform duration-500 hover:rotate-2 hover:scale-105">
              {/* Toploader plastic edge shimmer */}
              <div className="absolute inset-0 border border-[#B8A1F7]/30 rounded-lg pointer-events-none" />
              <div className="w-full h-full bg-gradient-to-b from-[#E9E1FF] to-[#D4C6FC]/60 rounded p-3 flex flex-col justify-between relative overflow-hidden">
                {/* Holographic light reflection bar */}
                <div className="absolute -inset-x-10 top-1/4 h-12 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-[-25deg] pointer-events-none" />

                <div className="flex justify-between items-center text-[10px] font-semibold text-[#514078]">
                  <span>IDOL EDITION</span>
                  <span>55×85mm</span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto text-center">
                  <div className="w-16 h-16 rounded-full bg-white/80 shadow-inner flex items-center justify-center mb-2 text-[#8B6CF6]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-[#292532] tracking-wide">COLLECTIBLE PHOTOCARD</span>
                  <span className="text-[10px] text-[#777180] mt-0.5">Ultra Clear OPP + Hard Toploader</span>
                </div>

                <div className="pt-2 border-t border-[#B8A1F7]/40 flex justify-between items-center text-[9px] text-[#514078]/80 font-mono">
                  <span>SEALED SAFE</span>
                  <span>DUST-FREE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tool Strip */}
          <div className="flex items-center justify-between text-[11px] text-[#777180] pt-4 border-t border-[#E8E3F0]/80">
            <span>PREMIUM SLEEVES · 1:1 INSPECTION</span>
            <span>SEOUL STUDIO</span>
          </div>
        </div>
      )}

      {type === 'photocard' && (
        <div className="w-full h-full p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-center text-[10px] text-[#777180]">
            <span className="font-mono">PHOTOCARD PACKING</span>
            <span className="text-[#8B6CF6] bg-[#E9E1FF] px-1.5 py-0.5 rounded text-[9px]">SAMPLE</span>
          </div>
          <div className="my-auto flex justify-center items-center gap-3 py-4">
            <div className="w-24 h-36 bg-white border border-[#B8A1F7]/50 rounded shadow-md p-2 flex flex-col justify-between rotate-[-4deg]">
              <div className="w-full h-18 bg-gradient-to-br from-[#E9E1FF] to-[#B8A1F7]/40 rounded-sm" />
              <div className="h-1.5 w-12 bg-[#D4C6FC] rounded-full" />
              <div className="h-1 w-8 bg-[#E8E3F0] rounded-full" />
            </div>
            <div className="w-24 h-36 bg-white border-2 border-[#8B6CF6]/40 rounded shadow-lg p-2 flex flex-col justify-between rotate-[3deg] scale-105">
              <div className="w-full h-18 bg-gradient-to-br from-[#8B6CF6]/30 to-[#E9E1FF] rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12" />
              </div>
              <div className="text-[9px] font-bold text-[#514078]">OPP SEALED</div>
              <div className="h-1 w-10 bg-[#8B6CF6]/60 rounded-full" />
            </div>
          </div>
          <div className="text-[11px] text-[#777180] flex justify-between">
            <span>55×85mm Standard</span>
            <span className="text-[#514078] font-medium">Dust-Free Work</span>
          </div>
        </div>
      )}

      {type === 'sleeve' && (
        <div className="w-full h-full p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-center text-[10px] text-[#777180]">
            <span className="font-mono">OPP & SLEEVE</span>
            <span className="text-[#8B6CF6] bg-[#E9E1FF] px-1.5 py-0.5 rounded text-[9px]">SAMPLE</span>
          </div>
          <div className="my-auto flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-28 bg-white/80 border border-[#8B6CF6]/30 shadow-md p-3 flex flex-col justify-between">
              {/* Adhesive Strip Illustration */}
              <div className="w-full h-3 bg-[#E9E1FF] border-b border-[#B8A1F7] text-[8px] flex items-center justify-center text-[#514078] font-mono">
                ADHESIVE PEEL OFF STRIP
              </div>
              <div className="my-2 border border-dashed border-[#B8A1F7] p-2 text-center text-[10px] text-[#777180]">
                HIGH-TRANSPARENCY POLYMER
              </div>
              <div className="text-[9px] text-right font-mono text-[#8B6CF6]">
                0.04mm THICKNESS
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#777180] flex justify-between">
            <span>Adhesive & Non-Adhesive</span>
            <span className="text-[#514078] font-medium">Clean Corner Fold</span>
          </div>
        </div>
      )}

      {type === 'benefits' && (
        <div className="w-full h-full p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-center text-[10px] text-[#777180]">
            <span className="font-mono">SPECIAL BENEFITS</span>
            <span className="text-[#8B6CF6] bg-[#E9E1FF] px-1.5 py-0.5 rounded text-[9px]">SAMPLE</span>
          </div>
          <div className="my-auto flex justify-center items-center py-4">
            <div className="w-48 h-32 bg-[#B8A1F7]/30 border border-[#8B6CF6]/40 shadow-md rounded p-3 flex flex-col justify-between relative">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#514078]">ALBUM PRE-ORDER</span>
                <span className="text-[9px] font-mono text-[#777180]">POB 01</span>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-14 bg-white border border-[#E8E3F0] rounded-xs shadow-xs" />
                <div className="w-10 h-14 bg-white border border-[#E8E3F0] rounded-xs shadow-xs" />
                <div className="w-10 h-14 bg-white border border-[#E8E3F0] rounded-xs shadow-xs" />
              </div>
              <div className="text-[9px] text-[#514078] font-medium">
                Individual Envelope & Blind Bag Packing
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#777180] flex justify-between">
            <span>Random Inclusions</span>
            <span className="text-[#514078] font-medium">Batch Verification</span>
          </div>
        </div>
      )}

      {type === 'set' && (
        <div className="w-full h-full p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-center text-[10px] text-[#777180]">
            <span className="font-mono">GOODS SET PACKING</span>
            <span className="text-[#8B6CF6] bg-[#E9E1FF] px-1.5 py-0.5 rounded text-[9px]">SAMPLE</span>
          </div>
          <div className="my-auto flex justify-center items-center py-4">
            <div className="w-52 h-32 bg-white border-2 border-[#E8E3F0] shadow-md p-3 grid grid-cols-3 gap-2 rounded">
              <div className="col-span-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded p-1 flex flex-col items-center justify-center text-[9px] text-[#514078] font-medium">
                STAND
              </div>
              <div className="col-span-1 bg-[#E9E1FF] rounded p-1 flex flex-col items-center justify-center text-[9px] text-[#514078] font-medium">
                KEYRING
              </div>
              <div className="col-span-1 bg-[#F7F4FF] border border-[#B8A1F7]/40 rounded p-1 flex flex-col items-center justify-center text-[9px] text-[#514078] font-medium">
                CARDS
              </div>
              <div className="col-span-3 bg-[#514078]/10 rounded flex items-center justify-center text-[9px] text-[#514078] font-medium">
                CUSTOM MATTE WRAP & SEAL
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#777180] flex justify-between">
            <span>Multi-Item Curation</span>
            <span className="text-[#514078] font-medium">Cushioned Box Packing</span>
          </div>
        </div>
      )}

      {type === 'workbench' && (
        <div className="w-full h-full p-6 flex flex-col justify-between relative">
          <div className="flex justify-between items-center text-[10px] text-[#777180]">
            <span className="font-mono">STUDIO ENVIRONMENT</span>
            <span className="text-[#8B6CF6] bg-[#E9E1FF] px-1.5 py-0.5 rounded text-[9px]">SAMPLE</span>
          </div>
          <div className="my-auto flex flex-col items-center justify-center py-6">
            <div className="w-48 h-2 bg-[#8B6CF6]/40 rounded-full mb-3" />
            <div className="text-center">
              <div className="text-xs font-bold text-[#514078] tracking-wider mb-1">
                DUST-CONTROLLED WORKBENCH
              </div>
              <div className="text-[11px] text-[#777180]">
                정전기 방지 매트 · 지문 방지 코튼 글러브 작업
              </div>
            </div>
          </div>
          <div className="text-[11px] text-[#777180] flex justify-between">
            <span>Precise Alignment</span>
            <span className="text-[#514078] font-medium">Strict Quality Control</span>
          </div>
        </div>
      )}
    </div>
  );
};
