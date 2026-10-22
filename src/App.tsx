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
import { AssetManagerModal } from './components/AssetManagerModal';
import { GoogleSitesGuideModal } from './components/GoogleSitesGuideModal';
import { ArrowUpRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('home');
  const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);
  const [isGoogleSitesModalOpen, setIsGoogleSitesModalOpen] = useState<boolean>(false);
  const [customAssets, setCustomAssets] = useState<CustomAssets>({});

  // Load any previously saved custom assets (logo, puppy, hero)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sinnara_assets');
      if (saved) {
        setCustomAssets(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNavigate = (tab: PageTab) => {
    setCurrentTab(tab);
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
          <QuoteView onOpenGoogleSitesGuide={() => setIsGoogleSitesModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGoogleSitesGuide={() => setIsGoogleSitesModalOpen(true)}
        onOpenAssetManager={() => setIsAssetModalOpen(true)}
      />

      {/* Modals */}
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

      {/* Floating Quick Action CTA for mobile/tablet when not on quote page */}
      {currentTab !== 'quote' && (
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
