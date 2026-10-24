import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured, ADMIN_ALLOWED_EMAIL } from './firebase';
import { PortfolioItem, ArchiveItem } from '../types';
import { ARCHIVE_SAMPLES } from '../data/content';

export const PORTFOLIO_COLLECTION = 'portfolio';

/**
 * Pre-flight client verification for administrative portfolio operations.
 *
 * [CRITICAL SECURITY ARCHITECTURE]:
 * This client-side verification provides immediate UX feedback and guards against unintentional calls,
 * but client-side code ALONE CANNOT guarantee database security.
 * Real data protection and access control are strictly enforced server-side by Firestore Security Rules
 * (firestore.rules) and Netlify Functions (which verify cryptographic Google ID token signatures).
 */
export const assertAdminClientPermission = async (): Promise<void> => {
  if (!isFirebaseConfigured() || !db || !auth) {
    throw new Error('Firebase 서비스가 정상적으로 초기화되지 않았습니다.');
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('관리자 로그인이 필요합니다. (인증 세션 없음)');
  }

  const email = (currentUser.email || '').toLowerCase().trim();
  const targetAdmin = (ADMIN_ALLOWED_EMAIL || 'rlawltn2232@gmail.com').toLowerCase().trim();

  if (email !== targetAdmin) {
    throw new Error(`관리자 권한이 부여되지 않은 계정입니다: ${email || '이메일 없음'}`);
  }

  if (!currentUser.emailVerified) {
    throw new Error('이메일 인증이 완료되지 않았습니다. 메일함에서 인증 링크를 클릭한 후 다시 시도해 주세요.');
  }
};

/**
 * Normalizes Firestore document data into a strongly typed PortfolioItem.
 * Handles legacy documents missing explicit is_published / is_deleted fields:
 * - Firestore visitor query requires where('is_published', '==', true) & where('is_deleted', '==', false).
 * - Any document in Firestore missing these fields is automatically excluded by Firestore query indexes.
 * - To prevent contradiction between client UI and visitor queries, missing is_published is normalized to false,
 *   and the document is tagged with isLegacyDocument: true so the admin can safely review and update it.
 * - No automatic bulk updates are performed on existing database records.
 */
export const normalizePortfolioItem = (id: string, data: any): PortfolioItem => {
  const isLegacy = data.is_published === undefined || data.is_deleted === undefined;

  return {
    id,
    title: String(data.title || ''),
    category: String(data.category || 'PHOTOCARD'),
    goodsType: String(data.goodsType || ''),
    packMethod: String(data.packMethod || ''),
    description: String(data.description || ''),
    imageUrl: data.imageUrl ? String(data.imageUrl).trim() : undefined,
    order: typeof data.order === 'number' ? data.order : 0,
    // 공개 쿼리(where('is_published', '==', true))와 일치하도록 명시적으로 true인 경우만 true로 판정.
    // 필드가 누락된 레거시 문서는 Firestore 색인 쿼리에서 자동 제외되므로 false로 안전하게 정규화
    is_published: data.is_published === true,
    is_deleted: data.is_deleted === true,
    isLegacyDocument: isLegacy,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
};

/**
 * Fetches published and non-deleted portfolio items for public visitors.
 * Strictly adheres to Firestore Security Rules:
 *   where('is_published', '==', true) & where('is_deleted', '==', false).
 * Gracefully falls back to null if Firebase is not configured or in case of network/rule errors.
 */
export const fetchPublicPortfolio = async (): Promise<PortfolioItem[] | null> => {
  if (!isFirebaseConfigured() || !db) {
    return null;
  }

  try {
    const colRef = collection(db, PORTFOLIO_COLLECTION);
    // Strict constraints matching firestore.rules
    const q = query(
      colRef,
      where('is_published', '==', true),
      where('is_deleted', '==', false)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }

    const items: PortfolioItem[] = [];
    snapshot.forEach((docSnap) => {
      items.push(normalizePortfolioItem(docSnap.id, docSnap.data()));
    });

    // Sort in memory by order ascending, then by title
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return items;
  } catch (error) {
    // If security rules not deployed, index missing, or offline, fail gracefully
    console.warn('[fetchPublicPortfolio] Fallback to static archive:', error);
    return null;
  }
};

/**
 * Fetches all portfolio items for authorized administrators.
 * Can include soft-deleted items if includeDeleted is true.
 * Performs client-side pre-flight assertion and relies on firestore.rules for final authorization.
 */
export const fetchAdminPortfolio = async (includeDeleted: boolean = true): Promise<PortfolioItem[]> => {
  await assertAdminClientPermission();

  if (!db) {
    throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.');
  }

  const colRef = collection(db, PORTFOLIO_COLLECTION);
  const snapshot = await getDocs(colRef);

  const items: PortfolioItem[] = [];
  snapshot.forEach((docSnap) => {
    const item = normalizePortfolioItem(docSnap.id, docSnap.data());
    if (includeDeleted || !item.is_deleted) {
      items.push(item);
    }
  });

  // Sort by order ascending, then by createdAt descending
  items.sort((a, b) => {
    if (a.order !== b.order) {
      return (a.order ?? 0) - (b.order ?? 0);
    }
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

  return items;
};

/**
 * Creates a new portfolio item in Firestore.
 * Performs client-side pre-flight assertion and relies on firestore.rules for final authorization.
 */
export const createPortfolioItem = async (
  itemData: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt' | 'isLegacyDocument'>
): Promise<string> => {
  await assertAdminClientPermission();

  if (!db) {
    throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.');
  }

  const now = new Date().toISOString();
  const payload = {
    title: itemData.title.trim(),
    category: itemData.category.trim(),
    goodsType: itemData.goodsType.trim(),
    packMethod: itemData.packMethod.trim(),
    description: itemData.description.trim(),
    imageUrl: itemData.imageUrl ? itemData.imageUrl.trim() : '',
    order: Number(itemData.order) || 0,
    is_published: Boolean(itemData.is_published),
    is_deleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const colRef = collection(db, PORTFOLIO_COLLECTION);
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
};

/**
 * Updates an existing portfolio item in Firestore.
 * Performs client-side pre-flight assertion and relies on firestore.rules for final authorization.
 */
export const updatePortfolioItem = async (
  id: string,
  updates: Partial<Omit<PortfolioItem, 'id' | 'createdAt' | 'isLegacyDocument'>>
): Promise<void> => {
  await assertAdminClientPermission();

  if (!db) {
    throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.');
  }

  const docRef = doc(db, PORTFOLIO_COLLECTION, id);
  const payload: Record<string, any> = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Clean strings
  if (typeof payload.title === 'string') payload.title = payload.title.trim();
  if (typeof payload.imageUrl === 'string') payload.imageUrl = payload.imageUrl.trim();
  if (typeof payload.order === 'number') payload.order = Number(payload.order);

  await updateDoc(docRef, payload);
};

/**
 * Toggles the public publication state of an item.
 * Performs client-side pre-flight assertion and relies on firestore.rules for final authorization.
 */
export const togglePortfolioPublish = async (
  id: string,
  currentPublished: boolean
): Promise<boolean> => {
  await assertAdminClientPermission();
  const newStatus = !currentPublished;
  await updatePortfolioItem(id, { is_published: newStatus });
  return newStatus;
};

/**
 * Soft deletes an item by setting is_deleted: true and is_published: false.
 * This retains the data in Firestore while hiding it from public queries.
 * Performs client-side pre-flight assertion and relies on firestore.rules for final authorization.
 */
export const softDeletePortfolioItem = async (id: string): Promise<void> => {
  await assertAdminClientPermission();
  await updatePortfolioItem(id, { is_deleted: true, is_published: false });
};

/**
 * Restores a soft-deleted item with explicit publication choice.
 * @param id Document ID to restore
 * @param publishOption 'keep_private' (default/recommended) or 'publish' (immediate public visibility)
 */
export const restorePortfolioItem = async (
  id: string,
  publishOption: 'keep_private' | 'publish' = 'keep_private'
): Promise<void> => {
  await assertAdminClientPermission();
  await updatePortfolioItem(id, {
    is_deleted: false,
    is_published: publishOption === 'publish',
  });
};

/**
 * Hard deletes a document (Admin only, reserved for permanent purge).
 * Performs client-side pre-flight assertion and relies on firestore.rules for final authorization.
 */
export const hardDeletePortfolioItem = async (id: string): Promise<void> => {
  await assertAdminClientPermission();

  if (!db) {
    throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.');
  }
  const docRef = doc(db, PORTFOLIO_COLLECTION, id);
  await deleteDoc(docRef);
};

/**
 * Convenience helper to seed Firestore portfolio collection from 4 reference spec sample items.
 * Performs client-side pre-flight assertion and relies on firestore.rules for final authorization.
 *
 * [CRITICAL SECURITY & INTEGRITY]:
 * - Seeded samples are explicitly saved with is_published: false (private draft state).
 * - Titles and descriptions explicitly state they are illustrative reference spec samples,
 *   NOT real customer deliverables.
 * - The administrator must review them and explicitly choose to publish them.
 */
export const seedInitialPortfolioFromSamples = async (): Promise<number> => {
  await assertAdminClientPermission();

  if (!db) {
    throw new Error('Firestore 데이터베이스가 초기화되지 않았습니다.');
  }

  // Exactly 4 reference spec sample items
  const sampleItemsToSeed = ARCHIVE_SAMPLES.slice(0, 4);

  let count = 0;
  for (let i = 0; i < sampleItemsToSeed.length; i++) {
    const s = sampleItemsToSeed[i];
    await createPortfolioItem({
      title: `[예시 규격] ${s.title}`,
      category: s.category,
      goodsType: s.goodsType,
      packMethod: s.packMethod,
      description: `※ 본 사양은 실제 고객 작업 사례가 아닌 신나라패키지의 대표적인 포장 규격 및 방식을 안내하기 위한 예시 데이터(스튜디오 샘플)입니다.\n\n${s.description}`,
      imageUrl: '',
      order: i + 1,
      is_published: false, // 기본적으로 비공개(false)로 안전하게 저장
      is_deleted: false,
    });
    count++;
  }

  return count;
};

/**
 * Maps a PortfolioItem into an ArchiveItem format for unified display in visitor galleries.
 */
export const mapPortfolioToArchiveItem = (item: PortfolioItem): ArchiveItem => {
  return {
    id: item.id,
    title: item.title,
    category: item.category as any,
    goodsType: item.goodsType,
    packMethod: item.packMethod,
    description: item.description,
    isSample: !item.imageUrl, // sample graphic if no custom image URL
    accentColor: '#8B6CF6',
    imageUrl: item.imageUrl,
    order: item.order,
    is_published: item.is_published,
    is_deleted: item.is_deleted,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};
