import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../../types';
import {
  fetchAdminPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  togglePortfolioPublish,
  softDeletePortfolioItem,
  restorePortfolioItem,
  hardDeletePortfolioItem,
  seedInitialPortfolioFromSamples,
} from '../../lib/portfolioService';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowUpDown,
  X,
  CheckCircle2,
  ExternalLink,
  Layers,
  Search,
} from 'lucide-react';

interface PortfolioManagerProps {
  adminEmail: string | null;
  emailVerified: boolean;
}

const CATEGORY_PRESETS = [
  'PHOTOCARD',
  'OPP & SLEEVE',
  'SPECIAL BENEFITS',
  'GOODS SET',
];

interface FormState {
  id?: string;
  title: string;
  category: string;
  customCategory: string;
  goodsType: string;
  packMethod: string;
  imageUrl: string;
  description: string;
  order: number;
  is_published: boolean;
}

const INITIAL_FORM: FormState = {
  title: '',
  category: 'PHOTOCARD',
  customCategory: '',
  goodsType: '',
  packMethod: '',
  imageUrl: '',
  description: '',
  order: 1,
  is_published: true,
};

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  adminEmail,
  emailVerified,
}) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Tab filtering: 'active' | 'published' | 'draft' | 'trash'
  const [activeFilter, setActiveFilter] = useState<'active' | 'published' | 'draft' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  // Restore Modal State (explicit choice between private and published)
  const [restoreTargetItem, setRestoreTargetItem] = useState<PortfolioItem | null>(null);
  const [restorePublishChoice, setRestorePublishChoice] = useState<'keep_private' | 'publish'>('keep_private');
  const [isRestoring, setIsRestoring] = useState<boolean>(false);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Load items
  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminPortfolio(true);
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching admin portfolio:', err);
      if (err?.code === 'permission-denied') {
        setError('Firestore 접근 권한이 거부되었습니다. (이메일 인증 확인 및 firestore.rules 배포 필요)');
      } else {
        setError(err?.message || '작업 사례 목록을 불러오는 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    // default order to next highest number
    const maxOrder = items.reduce((max, it) => Math.max(max, it.order || 0), 0);
    setForm({
      ...INITIAL_FORM,
      order: maxOrder + 1,
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (item: PortfolioItem) => {
    const isPreset = CATEGORY_PRESETS.includes(item.category);
    setForm({
      id: item.id,
      title: item.title,
      category: isPreset ? item.category : 'CUSTOM',
      customCategory: isPreset ? '' : item.category,
      goodsType: item.goodsType || '',
      packMethod: item.packMethod || '',
      imageUrl: item.imageUrl || '',
      description: item.description || '',
      order: item.order || 0,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert('작업 사례 제목을 입력해 주세요.');
      return;
    }

    const finalCategory =
      form.category === 'CUSTOM'
        ? (form.customCategory.trim() || 'PHOTOCARD')
        : form.category;

    setIsSubmitting(true);
    try {
      if (form.id) {
        // Update
        await updatePortfolioItem(form.id, {
          title: form.title,
          category: finalCategory,
          goodsType: form.goodsType,
          packMethod: form.packMethod,
          imageUrl: form.imageUrl,
          description: form.description,
          order: Number(form.order) || 0,
          is_published: form.is_published,
        });
        showNotification(`'${form.title}' 작업 사례가 성공적으로 수정되었습니다.`);
      } else {
        // Create
        await createPortfolioItem({
          title: form.title,
          category: finalCategory,
          goodsType: form.goodsType,
          packMethod: form.packMethod,
          imageUrl: form.imageUrl,
          description: form.description,
          order: Number(form.order) || 0,
          is_published: form.is_published,
          is_deleted: false,
        });
        showNotification(`새 작업 사례 '${form.title}'이(가) 등록되었습니다.`);
      }

      setIsModalOpen(false);
      await loadItems();
    } catch (err: any) {
      console.error('Error saving portfolio item:', err);
      alert(`저장 실패: ${err?.message || '잠시 후 다시 시도해 주세요.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (item: PortfolioItem) => {
    try {
      const nextStatus = await togglePortfolioPublish(item.id, item.is_published);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, is_published: nextStatus } : it))
      );
      showNotification(
        `'${item.title}' 상태가 [${nextStatus ? '공개' : '비공개'}]로 변경되었습니다.`
      );
    } catch (err: any) {
      alert(`상태 변경 실패: ${err?.message}`);
    }
  };

  const handleSoftDelete = async (item: PortfolioItem) => {
    if (!confirm(`'${item.title}' 항목을 삭제하시겠습니까?\n(방문자 화면에서 즉시 숨겨지며 휴지통 탭에서 언제든 복구할 수 있습니다.)`)) {
      return;
    }

    try {
      await softDeletePortfolioItem(item.id);
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, is_deleted: true, is_published: false } : it))
      );
      showNotification(`'${item.title}' 항목이 삭제(휴지통 보관)되었습니다.`);
    } catch (err: any) {
      alert(`삭제 실패: ${err?.message}`);
    }
  };

  const handleOpenRestoreModal = (item: PortfolioItem) => {
    setRestoreTargetItem(item);
    setRestorePublishChoice('keep_private');
  };

  const handleConfirmRestore = async () => {
    if (!restoreTargetItem) return;
    setIsRestoring(true);
    try {
      await restorePortfolioItem(restoreTargetItem.id, restorePublishChoice);
      const isNowPublished = restorePublishChoice === 'publish';
      setItems((prev) =>
        prev.map((it) =>
          it.id === restoreTargetItem.id
            ? { ...it, is_deleted: false, is_published: isNowPublished }
            : it
        )
      );
      showNotification(
        `'${restoreTargetItem.title}' 항목이 [${
          isNowPublished ? '공개 중' : '비공개 보관'
        }] 상태로 복구되었습니다.`
      );
      setRestoreTargetItem(null);
    } catch (err: any) {
      alert(`복구 실패: ${err?.message || '잠시 후 다시 시도해 주세요.'}`);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleHardDelete = async (item: PortfolioItem) => {
    if (!confirm(`[영구 삭제 경고]\n'${item.title}' 항목을 Firestore에서 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await hardDeletePortfolioItem(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      showNotification(`'${item.title}' 항목이 영구 삭제되었습니다.`);
    } catch (err: any) {
      alert(`영구 삭제 실패: ${err?.message}`);
    }
  };

  const handleQuickOrderChange = async (item: PortfolioItem, delta: number) => {
    const newOrder = Math.max(1, (item.order || 1) + delta);
    try {
      await updatePortfolioItem(item.id, { order: newOrder });
      setItems((prev) =>
        prev
          .map((it) => (it.id === item.id ? { ...it, order: newOrder } : it))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      );
    } catch (err: any) {
      alert(`순서 변경 실패: ${err?.message}`);
    }
  };

  const handleSeedSamples = async () => {
    const confirmed = confirm(
      '[기본 규격 예시 데이터 등록 안내]\n\n' +
      '신나라패키지 표준 제작 규격 예시 샘플 4건을 Firestore에 등록하시겠습니까?\n\n' +
      '• 이 데이터는 실제 고객 작업 사례가 아닌 "사양 안내용 예시 데이터"로 등록됩니다.\n' +
      '• 방문자 화면에 즉시 노출되지 않도록 기본 [비공개(is_published: false)] 임시 자료로 안전하게 저장됩니다.\n' +
      '• 등록 후 관리자 화면에서 내용을 검토하거나 실제 작업 사진 및 사양을 입력한 뒤 직접 [공개 중]으로 전환해야 방문자에게 표시됩니다.\n\n' +
      '계속 진행하시겠습니까?'
    );

    if (!confirmed) {
      return;
    }

    setIsSeeding(true);
    try {
      const count = await seedInitialPortfolioFromSamples();
      showNotification(`기본 예시 규격 샘플 ${count}건이 [비공개] 상태로 등록되었습니다. 검토 후 공개 여부를 설정해 주세요.`);
      await loadItems();
    } catch (err: any) {
      alert(`시딩 실패: ${err?.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    // Tab filter
    if (activeFilter === 'active') {
      if (item.is_deleted) return false;
    } else if (activeFilter === 'published') {
      if (item.is_deleted || !item.is_published) return false;
    } else if (activeFilter === 'draft') {
      if (item.is_deleted || item.is_published) return false;
    } else if (activeFilter === 'trash') {
      if (!item.is_deleted) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchGoods = (item.goodsType || '').toLowerCase().includes(q);
      const matchPack = (item.packMethod || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchGoods && !matchPack) {
        return false;
      }
    }

    return true;
  });

  const activeCount = items.filter((i) => !i.is_deleted).length;
  const publishedCount = items.filter((i) => !i.is_deleted && i.is_published).length;
  const draftCount = items.filter((i) => !i.is_deleted && !i.is_published).length;
  const trashCount = items.filter((i) => i.is_deleted).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-2 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Firestore 작업 사례 로드 안내</div>
            <div className="text-xs mt-0.5 leading-relaxed">{error}</div>
            {!emailVerified && (
              <div className="text-[11px] mt-1 text-rose-700">
                💡 상단의 <strong>인증 이메일 발송</strong> 버튼을 눌러 이메일 인증을 완료해야 Firestore 쓰기 권한이 부여됩니다.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Bar & Stats */}
      <div className="bg-white border border-[#E8E3F0] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8E3F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F7F4FF] text-[#8B6CF6] border border-[#B8A1F7]/40">
                FIRESTORE · portfolio
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#292532]">
                작업 사례 (포트폴리오) 관리
              </h2>
            </div>
            <p className="text-xs text-[#777180] mt-1">
              신나라패키지 홈페이지 방문자 화면에 노출되는 작업 사례를 실시간으로 등록, 수정, 노출 제어합니다.
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#514078] bg-[#FAF9FC] px-2.5 py-1 rounded-lg border border-[#E8E3F0] w-fit">
              <span className="font-semibold text-[#8B6CF6]">보안 안내:</span>
              <span>클라이언트 검증과 더불어 Firestore Security Rules가 비공개/삭제 데이터의 무단 열람 및 변조를 서버 측에서 원천 강제 차단합니다.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeCount === 0 && !loading && (
              <button
                onClick={handleSeedSamples}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] text-xs font-semibold border border-[#B8A1F7]/50 transition-colors"
                title="신나라패키지 표준 제작 규격 예시 4건을 비공개(임시 저장) 자료로 가져옵니다"
              >
                {isSeeding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#8B6CF6]" />
                )}
                <span>규격 예시 4건 가져오기 (비공개 등록)</span>
              </button>
            )}

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B6CF6] hover:bg-[#7854f3] active:bg-[#6842e4] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>새 작업 사례 등록</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div
            onClick={() => setActiveFilter('active')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeFilter === 'active'
                ? 'border-[#8B6CF6] bg-[#F7F4FF]'
                : 'border-[#E8E3F0] bg-white hover:bg-[#FAF9FC]'
            }`}
          >
            <div className="text-[11px] text-[#777180] font-medium">전체 활성 항목</div>
            <div className="text-xl font-bold text-[#292532] mt-0.5">{activeCount}</div>
          </div>

          <div
            onClick={() => setActiveFilter('published')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeFilter === 'published'
                ? 'border-emerald-400 bg-emerald-50/50'
                : 'border-[#E8E3F0] bg-white hover:bg-[#FAF9FC]'
            }`}
          >
            <div className="text-[11px] text-emerald-700 font-medium">공개 중 (방문자 노출)</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">{publishedCount}</div>
          </div>

          <div
            onClick={() => setActiveFilter('draft')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeFilter === 'draft'
                ? 'border-amber-400 bg-amber-50/50'
                : 'border-[#E8E3F0] bg-white hover:bg-[#FAF9FC]'
            }`}
          >
            <div className="text-[11px] text-amber-700 font-medium">비공개 (임시 저장)</div>
            <div className="text-xl font-bold text-amber-700 mt-0.5">{draftCount}</div>
          </div>

          <div
            onClick={() => setActiveFilter('trash')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeFilter === 'trash'
                ? 'border-rose-400 bg-rose-50/50'
                : 'border-[#E8E3F0] bg-white hover:bg-[#FAF9FC]'
            }`}
          >
            <div className="text-[11px] text-rose-700 font-medium">삭제된 항목 (휴지통)</div>
            <div className="text-xl font-bold text-rose-700 mt-0.5">{trashCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#F7F4FF] border border-[#E8E3F0] rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'active'
                ? 'bg-white text-[#514078] shadow-xs'
                : 'text-[#777180] hover:text-[#292532]'
            }`}
          >
            전체 ({activeCount})
          </button>
          <button
            onClick={() => setActiveFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'published'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-[#777180] hover:text-[#292532]'
            }`}
          >
            공개 중 ({publishedCount})
          </button>
          <button
            onClick={() => setActiveFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'draft'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-[#777180] hover:text-[#292532]'
            }`}
          >
            비공개 ({draftCount})
          </button>
          <button
            onClick={() => setActiveFilter('trash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'trash'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-[#777180] hover:text-[#292532]'
            }`}
          >
            휴지통 ({trashCount})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#777180] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 카테고리, 포장방식 검색..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777180] hover:text-[#292532]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white border border-[#E8E3F0] rounded-2xl p-12 text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B6CF6] mx-auto mb-3" />
          <p className="text-xs text-[#777180]">Firestore에서 작업 사례 목록을 가져오는 중입니다...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
        <div className="bg-white border border-[#E8E3F0] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F4FF] text-[#8B6CF6] flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#292532] mb-1">
            {searchQuery
              ? '검색 결과와 일치하는 작업 사례가 없습니다.'
              : activeFilter === 'trash'
              ? '휴지통이 비어 있습니다.'
              : '등록된 작업 사례가 아직 없습니다.'}
          </h3>
          <p className="text-xs text-[#777180] max-w-md mx-auto mb-5 leading-relaxed">
            {activeFilter === 'trash'
              ? '소프트 삭제된 작업 사례는 이곳에 보관되며 언제든 복구할 수 있습니다.'
              : '새 작업 사례를 등록하거나 기본 샘플 데이터를 가져와 바로 시작할 수 있습니다.'}
          </p>
          {activeFilter !== 'trash' && !searchQuery && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleSeedSamples}
                disabled={isSeeding}
                className="px-4 py-2 rounded-xl bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] text-xs font-semibold border border-[#B8A1F7]/40"
              >
                규격 예시 4건 가져오기 (비공개 등록)
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 rounded-xl bg-[#8B6CF6] hover:bg-[#7854f3] text-white text-xs font-bold"
              >
                직접 새로 등록하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* Portfolio Items Table / List */}
      {!loading && filteredItems.length > 0 && (
        <div className="bg-white border border-[#E8E3F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#292532] border-collapse">
              <thead>
                <tr className="bg-[#FAF9FC] border-b border-[#E8E3F0] text-[11px] font-mono text-[#777180] uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">순서</th>
                  <th className="py-3 px-4 w-20">미리보기</th>
                  <th className="py-3 px-4">작업 사례 정보</th>
                  <th className="py-3 px-4 w-32">카테고리</th>
                  <th className="py-3 px-4 w-28 text-center">공개 상태</th>
                  <th className="py-3 px-4 w-36 text-right">관리 작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3F0]">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FAF9FC] transition-colors ${
                      item.is_deleted ? 'bg-rose-50/20 opacity-75' : ''
                    }`}
                  >
                    {/* Order Controls */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      {!item.is_deleted ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-mono font-bold text-xs text-[#514078] bg-[#F7F4FF] px-2 py-0.5 rounded border border-[#E8E3F0]">
                            #{item.order}
                          </span>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <button
                              onClick={() => handleQuickOrderChange(item, -1)}
                              disabled={item.order <= 1}
                              title="순서 앞으로 (-1)"
                              className="p-0.5 text-[#777180] hover:text-[#8B6CF6] disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => handleQuickOrderChange(item, 1)}
                              title="순서 뒤로 (+1)"
                              className="p-0.5 text-[#777180] hover:text-[#8B6CF6]"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-[#777180]">#{item.order}</span>
                      )}
                    </td>

                    {/* Thumbnail Preview */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F7F4FF] border border-[#E8E3F0] flex items-center justify-center relative shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.thumb-fallback') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`thumb-fallback w-full h-full flex flex-col items-center justify-center text-[#B8A1F7] ${item.imageUrl ? 'hidden' : 'flex'}`}>
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-[9px] font-mono text-[#777180] mt-0.5">SAMPLE</span>
                        </div>
                      </div>
                    </td>

                    {/* Title & Info */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="font-bold text-sm text-[#292532] flex items-center gap-1.5 flex-wrap">
                        <span>{item.title}</span>
                        {item.isLegacyDocument && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                            title="기본 필드(is_published/is_deleted)가 누락되어 방문자 조회 쿼리에서 자동 제외됩니다. 수정 후 저장하면 최신 스키마로 표준화됩니다."
                          >
                            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                            기본 필드 누락 (수정 시 표준화)
                          </span>
                        )}
                        {item.imageUrl && (
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B6CF6] hover:text-[#7854f3]"
                            title="원본 사진 URL 열기"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <div className="text-[11px] text-[#514078] mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                        {item.goodsType && (
                          <span>
                            <strong>굿즈:</strong> {item.goodsType}
                          </span>
                        )}
                        {item.packMethod && (
                          <span>
                            <strong>포장:</strong> {item.packMethod}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#777180] line-clamp-1 mt-1 max-w-xl">
                        {item.description}
                      </p>
                    </td>

                    {/* Category Badge */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#F7F4FF] text-[#8B6CF6] border border-[#B8A1F7]/30">
                        {item.category}
                      </span>
                    </td>

                    {/* Publish Toggle */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      {item.is_deleted ? (
                        <span className="text-[11px] font-mono text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          삭제됨
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                            item.is_published
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                          title="클릭하여 공개/비공개 전환"
                        >
                          {item.is_published ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>공개 중</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-amber-600" />
                              <span>비공개</span>
                            </>
                          )}
                        </button>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right align-middle">
                      {item.is_deleted ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenRestoreModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors"
                            title="삭제 취소 및 복구 상태 선택"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>복구</span>
                          </button>
                          <button
                            onClick={() => handleHardDelete(item)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Firestore에서 영구 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F7F4FF] hover:bg-[#E9E1FF] text-[#514078] border border-[#E8E3F0] text-xs font-semibold transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8B6CF6]" />
                            <span>수정</span>
                          </button>
                          <button
                            onClick={() => handleSoftDelete(item)}
                            className="p-1.5 rounded-lg text-[#777180] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="소프트 삭제 (휴지통으로 이동)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#FAF9FC] border-t border-[#E8E3F0] flex items-center justify-between text-[11px] text-[#777180] px-4 font-mono">
            <span>총 {filteredItems.length}건 표시 중</span>
            <span>방문자 화면은 is_published == true 및 is_deleted == false 조건만 노출</span>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => !isSubmitting && setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E8E3F0] my-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-[#E8E3F0] flex items-center justify-between bg-[#FAF9FC]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8B6CF6] uppercase tracking-wider">
                  PORTFOLIO MANAGEMENT
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#292532]">
                  {form.id ? '작업 사례 수정' : '새 작업 사례 등록'}
                </h3>
              </div>
              <button
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                disabled={isSubmitting}
                className="p-1.5 text-[#777180] hover:text-[#292532] hover:bg-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              {form.id && items.find((i) => i.id === form.id)?.isLegacyDocument && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">레거시 문서 스키마 안내:</span>
                    <p className="mt-0.5 leading-relaxed text-[11px] text-amber-800">
                      이 문서는 과거에 등록되어 <code>is_published</code> 또는 <code>is_deleted</code> 필드가 누락되어 있었습니다. 현재 수정 화면에서 내용을 검토하고 저장하시면 최신 보안 및 조회 스키마로 안전하게 자동 표준화됩니다.
                    </p>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-semibold text-[#514078] mb-1">
                  작업 사례 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 포토카드 개별 고투명 OPP 포장"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9FC] border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                  required
                />
              </div>

              {/* Category & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#514078] mb-1">
                    카테고리 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9FC] border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="CUSTOM">직접 입력...</option>
                  </select>

                  {form.category === 'CUSTOM' && (
                    <input
                      type="text"
                      value={form.customCategory}
                      onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                      placeholder="카테고리명 직접 입력"
                      className="w-full mt-2 px-3 py-2 bg-white border border-[#8B6CF6] rounded-xl text-xs text-[#292532]"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#514078] mb-1">
                    표시 순서 (작을수록 앞) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF9FC] border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors font-mono"
                    required
                  />
                </div>
              </div>

              {/* Goods Type & Packaging Method Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#514078] mb-1">
                    굿즈 종류
                  </label>
                  <input
                    type="text"
                    value={form.goodsType}
                    onChange={(e) => setForm({ ...form, goodsType: e.target.value })}
                    placeholder="예: 아이돌 앨범 포토카드 55×85mm"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9FC] border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#514078] mb-1">
                    포장 방식
                  </label>
                  <input
                    type="text"
                    value={form.packMethod}
                    onChange={(e) => setForm({ ...form, packMethod: e.target.value })}
                    placeholder="예: 초밀착 고투명 OPP 슬리브 실링"
                    className="w-full px-3.5 py-2.5 bg-[#FAF9FC] border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Image URL Input (Direct URL input per requirements) */}
              <div>
                <label className="block font-semibold text-[#514078] mb-1">
                  사진 이미지 URL <span className="text-[#777180] font-normal">(직접 URL 입력 방식)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... 또는 외부 이미지 링크"
                    className="flex-1 px-3.5 py-2.5 bg-[#FAF9FC] border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors font-mono"
                  />
                  {form.imageUrl && (
                    <a
                      href={form.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-[#F7F4FF] border border-[#E8E3F0] text-[#514078] hover:text-[#8B6CF6] flex items-center justify-center shrink-0"
                      title="입력한 URL 새 탭에서 열기"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-[#777180] mt-1 leading-relaxed">
                  * 1차 구현에서는 이미지 URL을 직접 입력합니다. 비워두면 기존 스튜디오 벡터 그래픽이 샘플로 자동 표기됩니다.
                </p>

                {/* Instant Live Preview of Image URL */}
                {form.imageUrl && (
                  <div className="mt-2.5 p-2 bg-[#FAF9FC] rounded-xl border border-[#E8E3F0] flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                          const err = e.currentTarget.parentElement?.querySelector('.prev-err') as HTMLElement;
                          if (err) err.style.display = 'flex';
                        }}
                      />
                      <div className="prev-err hidden w-full h-full items-center justify-center bg-rose-50 text-rose-600 text-[10px] text-center p-1">
                        잘못된 URL
                      </div>
                    </div>
                    <div className="text-[11px] text-[#514078] leading-tight">
                      <span className="font-semibold block text-[#292532] mb-0.5">이미지 미리보기</span>
                      위 썸네일에 사진이 정상 표시되면 올바른 링크입니다.
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#514078] mb-1">
                  작업 상세 설명 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="포장의 특징, 투명도, 밀봉 방식, 검수 포인트 등을 작성해 주세요."
                  className="w-full px-3.5 py-2.5 bg-[#FAF9FC] border border-[#E8E3F0] rounded-xl text-xs text-[#292532] focus:outline-none focus:border-[#8B6CF6] focus:bg-white transition-colors resize-none leading-relaxed"
                  required
                />
              </div>

              {/* Publication Status Checkbox */}
              <div className="pt-2 border-t border-[#E8E3F0]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B6CF6] border-[#E8E3F0] focus:ring-[#8B6CF6]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#292532]">
                      저장 즉시 방문자 화면에 공개 (is_published: true)
                    </span>
                    <p className="text-[11px] text-[#777180]">
                      체크 해제 시 비공개(임시 저장) 상태로 등록되며 방문자에게 노출되지 않습니다.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E8E3F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-[#E8E3F0] text-[#777180] hover:text-[#292532] hover:bg-[#FAF9FC] font-semibold transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#8B6CF6] hover:bg-[#7854f3] active:bg-[#6842e4] text-white font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>저장 중...</span>
                    </>
                  ) : (
                    <span>{form.id ? '수정 내용 저장' : '새 작업 사례 등록'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Explicit Restoration Choice Modal */}
      {restoreTargetItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E3F0] shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E3F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#292532]">작업 사례 복구 설정</h3>
                  <p className="text-[11px] text-[#777180]">복구 시의 공개 상태를 명시적으로 선택해 주세요.</p>
                </div>
              </div>
              <button
                onClick={() => !isRestoring && setRestoreTargetItem(null)}
                disabled={isRestoring}
                className="text-[#777180] hover:text-[#292532] p-1 rounded-lg hover:bg-[#FAF9FC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              <div className="p-3 bg-[#FAF9FC] rounded-xl border border-[#E8E3F0]">
                <span className="text-[10px] font-mono font-bold text-[#777180] uppercase tracking-wider block mb-0.5">
                  복구 대상 항목
                </span>
                <div className="text-xs font-bold text-[#292532] flex items-center gap-1.5 flex-wrap">
                  <span>{restoreTargetItem.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F7F4FF] text-[#8B6CF6] border border-[#B8A1F7]/30">
                    {restoreTargetItem.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-bold text-[#514078]">
                  복구 후 공개 여부 선택 <span className="text-rose-500">*</span>
                </span>

                {/* Option 1: Keep Private (Recommended) */}
                <label
                  onClick={() => setRestorePublishChoice('keep_private')}
                  className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                    restorePublishChoice === 'keep_private'
                      ? 'border-[#8B6CF6] bg-[#F7F4FF]/70 shadow-xs ring-1 ring-[#8B6CF6]'
                      : 'border-[#E8E3F0] hover:bg-[#FAF9FC]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="restoreChoice"
                      value="keep_private"
                      checked={restorePublishChoice === 'keep_private'}
                      onChange={() => setRestorePublishChoice('keep_private')}
                      className="mt-0.5 text-[#8B6CF6] focus:ring-[#8B6CF6]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#292532]">
                          비공개로 안전 복구
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          권장 (안전)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777180] mt-1 leading-relaxed">
                        복구 후 방문자 화면에 즉시 노출되지 않습니다. 관리자 목록에서 내용을 최종 확인한 후 언제든 [공개 중]으로 변경할 수 있어 안전합니다.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Option 2: Publish immediately */}
                <label
                  onClick={() => setRestorePublishChoice('publish')}
                  className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                    restorePublishChoice === 'publish'
                      ? 'border-[#8B6CF6] bg-[#F7F4FF]/70 shadow-xs ring-1 ring-[#8B6CF6]'
                      : 'border-[#E8E3F0] hover:bg-[#FAF9FC]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="restoreChoice"
                      value="publish"
                      checked={restorePublishChoice === 'publish'}
                      onChange={() => setRestorePublishChoice('publish')}
                      className="mt-0.5 text-[#8B6CF6] focus:ring-[#8B6CF6]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#292532]">
                          공개 상태로 즉시 복구
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-[#8B6CF6]">
                          즉시 공개
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777180] mt-1 leading-relaxed">
                        복구 완료와 동시에 홈페이지 작업 사례 아카이브 갤러리에 즉시 노출됩니다.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E8E3F0]">
              <button
                type="button"
                onClick={() => setRestoreTargetItem(null)}
                disabled={isRestoring}
                className="px-4 py-2 rounded-xl border border-[#E8E3F0] text-[#777180] hover:text-[#292532] hover:bg-[#FAF9FC] text-xs font-semibold transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmRestore}
                disabled={isRestoring}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B6CF6] hover:bg-[#7854f3] text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                {isRestoring ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>복구 진행 중...</span>
                  </>
                ) : (
                  <span>선택한 상태로 복구</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
