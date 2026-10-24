import React, { useState, useEffect } from 'react';
import { PageTab, CustomAssets } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { ServiceSection } from './components/ServiceSection';
import { PackagingArchiveSection } from './components/PackagingArchiveSection';
import { ProcessSection } from './components/ProcessSection';
import { LocationStrip } from './components/LocationStrip';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { ServicesView } from './views/ServicesView';
import { ArchiveView } from './views/ArchiveView';
import { HowItWorksView } from './views/HowItWorksView';
import { LocationView } from './views/LocationView';
import { QuoteView } from './views/QuoteView';
import { AdminView } from './views/AdminView';
import { AssetManagerModal } from './components/AssetManagerModal';
import { GoogleSitesGuideModal } from './components/GoogleSitesGuideModal';
import { KakaoChatButton } from './components/KakaoChatButton';
import { KakaoConfigModal } from './components/KakaoConfigModal';
import { ArrowUpRight } from 'lucide-react';

const DEFAULT_KAKAO_URL = 'https://pf.kakao.com/_CXxcmX';

// Helper to determine initial tab from URL pathname or hash
const getInitialTab = (): PageTab => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/admin' || hash === '#admin') return 'admin';
    if (path === '/quote' || hash === '#quote') return 'quote';
    if (path === '/services' || hash === '#services') return 'services';
    if (path === '/archive' || hash === '#archive') return 'archive';
    if (path === '/process' || hash === '#process') return 'process';
    if (path === '/location' || hash === '#location') return 'location';
  }
  return 'home';
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>(getInitialTab);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);
  const [isGoogleSitesModalOpen, setIsGoogleSitesModalOpen] = useState<boolean>(false);
  const [isKakaoModalOpen, setIsKakaoModalOpen] = useState<boolean>(false);
  const [customAssets, setCustomAssets] = useState<CustomAssets>({
    kakaoChannelUrl: DEFAULT_KAKAO_URL,
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load any previously saved custom assets (logo, puppy, hero)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sinnara_assets');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomAssets({
          kakaoChannelUrl: parsed.kakaoChannelUrl || DEFAULT_KAKAO_URL,
          ...parsed,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNavigate = (tab: PageTab) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      const newPath = tab === 'home' ? '/' : `/${tab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#292532] selection:bg-[#E9E1FF] selection:text-[#514078]">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        customAssets={customAssets}
        onOpenAssetManager={() => setIsAssetModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              onNavigate={handleNavigate}
              customHeroImage={customAssets.heroImage}
            />
            <IntroSection />
            <ServiceSection onNavigate={handleNavigate} />
            <PackagingArchiveSection onNavigate={handleNavigate} />
            <ProcessSection onNavigate={handleNavigate} />
            <LocationStrip onNavigate={handleNavigate} />
            <FinalCtaSection onNavigate={handleNavigate} />
          </>
        )}

        {currentTab === 'services' && (
          <ServicesView onNavigate={handleNavigate} />
        )}

        {currentTab === 'archive' && (
          <ArchiveView onNavigate={handleNavigate} />
        )}

        {currentTab === 'process' && (
          <HowItWorksView onNavigate={handleNavigate} />
        )}

        {currentTab === 'location' && (
          <LocationView onNavigate={handleNavigate} />
        )}

        {currentTab === 'quote' && (
          <QuoteView
            onOpenGoogleSitesGuide={() => setIsGoogleSitesModalOpen(true)}
            kakaoChannelUrl={customAssets.kakaoChannelUrl}
            onOpenKakaoConfig={() => setIsKakaoModalOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGoogleSitesGuide={() => setIsGoogleSitesModalOpen(true)}
        onOpenAssetManager={() => setIsAssetModalOpen(true)}
      />

      {/* Floating KakaoTalk 1:1 Consultation Button (Responsive PC & Mobile) */}
      <KakaoChatButton
        kakaoChannelUrl={customAssets.kakaoChannelUrl}
        onOpenConfig={() => setIsKakaoModalOpen(true)}
      />

      {/* Modals */}
      <KakaoConfigModal
        isOpen={isKakaoModalOpen}
        onClose={() => setIsKakaoModalOpen(false)}
        currentUrl={customAssets.kakaoChannelUrl}
        onSaveUrl={(url) => {
          const updated = { ...customAssets, kakaoChannelUrl: url };
          setCustomAssets(updated);
          try {
            localStorage.setItem('sinnara_assets', JSON.stringify(updated));
          } catch {
            // ignore
          }
        }}
      />

      <AssetManagerModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        customAssets={customAssets}
        onUpdateAssets={setCustomAssets}
      />

      <GoogleSitesGuideModal
        isOpen={isGoogleSitesModalOpen}
        onClose={() => setIsGoogleSitesModalOpen(false)}
      />

      {/* Floating Quick Action CTA for mobile/tablet when not on quote or admin page */}
      {currentTab !== 'quote' && currentTab !== 'admin' && (
        <div className="sm:hidden fixed bottom-4 right-4 z-30">
          <button
            onClick={() => handleNavigate('quote')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#8B6CF6] text-white text-xs font-bold rounded-full shadow-lg shadow-purple-900/20 active:scale-95 transition-transform"
            aria-label="견적 문의하기"
          >
            <span>견적 문의</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
