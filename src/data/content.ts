import { ServiceItem, ArchiveItem } from '../types';

export const BRAND_INFO = {
  nameKr: '신나라패키지',
  nameEn: 'SINNARA PACKAGE',
  concept: 'LAVENDER GOODS PACKAGING STUDIO',
  slogan: 'Your Goods, Wrapped with Care.',
  mainMessage: '굿즈의 설렘까지\n포장하다.',
  subMessage: '포토카드부터 앨범 특전과 다양한 아이돌 굿즈까지. 신나라패키지가 꼼꼼하고 감각적인 포장 작업을 함께합니다.',
  specialtyTag: '아이돌 굿즈 포장 전문 서비스',
  intro: {
    kicker: 'MORE THAN PACKAGING',
    title: '굿즈를 보호하고,\n브랜드의 경험을 완성합니다.',
    description: '포장의 디테일은 굿즈를 만나는 순간의 인상을 바꿉니다. 신나라패키지는 굿즈의 종류와 구성에 맞는 포장 작업을 상담하고, 깔끔하고 일관된 결과를 위해 작업 조건을 함께 확인합니다.'
  },
  targetClients: [
    '아이돌 굿즈 판매 업체',
    '포토카드 및 앨범 특전 판매자',
    '팬덤 굿즈 제작 업체',
    '굿즈 전문 쇼핑몰',
    '이벤트 굿즈 운영 업체',
    '대량 굿즈 포장을 의뢰하는 사업자'
  ],
  business: {
    regNumber: '568-04-03215', // 사업자등록번호
    addressJibun: '인천광역시 부평구 갈산동 94번지 인천테크노밸리유1센터 제6층 제디동615호',
    addressRoad: '인천광역시 부평구 주부토로 236 인천테크노밸리 U1 센터 D동 615호',
    building: '인천테크노밸리U1센터 제6층 D동 615호',
    postalCode: '21315',
    subway: '인천 1호선 갈산역 2번 출구 (도보 약 10~12분)',
    car: '경인고속도로 부평IC 진출 3분 거리 (방문객 및 화물 하역 전용 주차 공간 완비)',
    bus: '부평세관 / 인천테크노밸리U1센터 정류장 하차',
    goodsDelivery: '대량 굿즈 입고 화물차량 D동 전용 하역장 진입 및 화물 엘리베이터 이용 가능',
    email: 'ares361@naver.com',
    phone: '010-4591-0334',
    tel: 'tel:01045910334',
    naverMapUrl: 'https://map.naver.com/p/search/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EB%B6%80%ED%8F%89%EA%B5%AC%20%EA%B0%88%EC%82%B0%EB%8F%99%2094',
    kakaoMapUrl: 'https://map.kakao.com/link/search/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EB%B6%80%ED%8F%89%EA%B5%AC%20%EA%B0%88%EC%82%B0%EB%8F%99%2094%20%EC%9D%B8%EC%B2%9C%ED%85%8C%ED%81%AC%EB%85%B8%EB%B0%B8%EB%A6%ACU1%EC%84%BC%ED%84%B0'
  }
};

export const CORE_SERVICES: ServiceItem[] = [
  {
    id: 'photocard-packing',
    enTitle: 'PHOTOCARD PACKING',
    krTitle: '포토카드 포장',
    description: '포토카드의 형태와 구성에 맞춘 개별 포장 작업을 상담합니다.',
    details: [
      '표준 55×85mm 규격 및 비규격 포토카드 맞춤 정렬',
      '표면 지문 및 스크래치 방지를 위한 섬세한 핸들링',
      '단면 / 양면 / 홀로그램 특수 재질별 맞춤 공정'
    ],
    materials: ['고투명 슬리브', '하드 탑로더', '정전기 방지 필름'],
    category: 'photocard'
  },
  {
    id: 'opp-and-sleeve',
    enTitle: 'OPP & SLEEVE',
    krTitle: 'OPP · 슬리브 포장',
    description: '굿즈의 특성과 크기에 맞춘 포장재 활용 작업을 상담합니다.',
    details: [
      '투명 접착 / 비접착 OPP 규격 선택 및 깔끔한 실링',
      '기포 및 구김 없는 일정한 마감 각도 유지',
      '바코드 또는 라벨 부착 공정 연계 상담 가능'
    ],
    materials: ['고투명 접착 OPP', '헤더 OPP', '무광 슬리브'],
    category: 'opp'
  },
  {
    id: 'special-benefits',
    enTitle: 'SPECIAL BENEFITS',
    krTitle: '앨범 특전 및 굿즈 포장',
    description: '앨범 특전과 다양한 굿즈 구성품의 포장 작업을 상담합니다.',
    details: [
      '예판 특전 봉투입 / 스티커 팩 / 미니 포스터 포장',
      '미공개 포토카드 랜덤 삽입 또는 지정 세트 구성',
      '행사 일정 및 납품 타임라인에 맞춘 공정 조율'
    ],
    materials: ['특전 전용 봉투', '크라프트/라벤더 간지', '안심 에어캡'],
    category: 'benefits'
  },
  {
    id: 'goods-set-packing',
    enTitle: 'GOODS SET PACKING',
    krTitle: '굿즈 세트 포장',
    description: '여러 구성품을 함께 담는 굿즈 세트 포장 작업을 상담합니다.',
    details: [
      '아크릴 스탠드, 키링, 엽서, 틴케이스 등 복합 세트 패키징',
      '흔들림 방지 완충 배합 및 구성품 누락 방지 전수 검수',
      '팬덤 언박싱 감성을 살린 정돈된 레이아웃 배치'
    ],
    materials: ['맞춤형 완충재', '라벤더 씰링 스티커', '박스 패킹'],
    category: 'set'
  }
];

export const DETAILED_SERVICES: ServiceItem[] = [
  ...CORE_SERVICES,
  {
    id: 'individual-photocard',
    enTitle: 'INDIVIDUAL PACKING',
    krTitle: '포토카드 개별 포장',
    description: '한 장씩 정성스럽게 개별 포장하여 수집 가치를 높이는 포장 작업입니다.',
    details: ['1매 개별 OPP 실링', '멤버별 분류 정렬', '손상 방지 검수'],
    materials: ['0.04mm 고투명 OPP', '카드 보호용 간지'],
    category: 'photocard'
  },
  {
    id: 'custom-idol-goods',
    enTitle: 'OTHER IDOL GOODS',
    krTitle: '기타 아이돌 굿즈 포장',
    description: '응원봉 액세서리, 슬로건, 뱃지, 패브릭 등 특수 규격 굿즈 포장 작업을 맞춤 상담합니다.',
    details: ['비정형 굿즈 보호 포장', '오염 방지 밀봉', '대량 포장 일정 협의'],
    materials: ['지퍼백', '수축필름', '맞춤형 포장재'],
    category: 'custom'
  }
];

export const ARCHIVE_SAMPLES: ArchiveItem[] = [
  {
    id: 'arc-1',
    title: '포토카드 개별 고투명 OPP 포장',
    category: 'PHOTOCARD',
    goodsType: '아이돌 정규 앨범 포토카드 55×85mm',
    packMethod: '초밀착 고투명 OPP 슬리브 실링 및 멤버별 정렬',
    description: '투명도 높은 필름을 적용해 카드 본연의 색감과 홀로그램 광택을 손상 없이 보존한 기본 개별 포장 예시입니다.',
    isSample: true,
    accentColor: '#B8A1F7'
  },
  {
    id: 'arc-2',
    title: '하드 탑로더 + 보호 슬리브 이중 보호',
    category: 'OPP & SLEEVE',
    goodsType: '미공개 특전 포토카드 & 럭키드로우',
    packMethod: '스크래치 방지 이너 슬리브 + 하드 탑로더 + 외포장 OPP',
    description: '고가 특전이나 희귀 포토카드의 배송 중 휨 방지를 위해 단단한 탑로더에 거치 후 밀봉한 포장 구조입니다.',
    isSample: true,
    accentColor: '#8B6CF6'
  },
  {
    id: 'arc-3',
    title: '앨범 특전 패키지 & 라벤더 실링 봉투',
    category: 'SPECIAL BENEFITS',
    goodsType: '예약구매 특전 미니 엽서 & 포카 세트',
    packMethod: '전용 불투명 라벤더 봉투 + 원형 라벨 씰링 마감',
    description: '팬들이 봉투를 개봉할 때 기대감을 느낄 수 있도록 감각적인 톤앤매너로 패키징된 특전 포장 예시입니다.',
    isSample: true,
    accentColor: '#E9E1FF'
  },
  {
    id: 'arc-4',
    title: '팬덤 웰컴 키트 굿즈 세트 패키징',
    category: 'GOODS SET',
    goodsType: '아크릴 스탠드 + 키링 + 포카 4종 + 스티커팩',
    packMethod: '구성품별 개별 보호 후 맞춤 트레이 고정 및 일괄 박스 패킹',
    description: '각기 다른 부피와 질감을 지닌 굿즈들을 하나의 박스 안에 깔끔하고 안정적으로 수납한 세트 포장입니다.',
    isSample: true,
    accentColor: '#514078'
  },
  {
    id: 'arc-5',
    title: '홀로그램 엽서 & 슬로건 OPP 포장',
    category: 'OPP & SLEEVE',
    goodsType: '콘서트 슬로건 타월 & 홀로그램 엽서',
    packMethod: '방수형 투명 지퍼백 / 와이드 접착 OPP 마감',
    description: '먼지 및 습기로부터 패브릭 굿즈를 완벽하게 보호하는 실링 작업 예시입니다.',
    isSample: true,
    accentColor: '#B8A1F7'
  },
  {
    id: 'arc-6',
    title: '랜덤 특전 구성 블라인드 팩킹',
    category: 'SPECIAL BENEFITS',
    goodsType: '팝업스토어 랜덤 럭키 드로우 포토카드',
    packMethod: '빛 비침 없는 은박 차광 봉투 초음파/열 실링',
    description: '내부 멤버 이미지가 비치지 않도록 차광 봉투를 활용해 블라인드 추첨용으로 제작한 포장 방식입니다.',
    isSample: true,
    accentColor: '#8B6CF6'
  }
];

export const PROCESS_STEPS = [
  {
    num: '01',
    enTitle: 'INQUIRY',
    krTitle: '문의 접수',
    description: '굿즈 종류와 예상 수량을 알려주세요.',
    detailText: '포장하실 굿즈의 품목(포토카드, 특전, 세트 등), 대략적인 수량, 원하시는 포장 방식과 희망 일정을 온라인 견적 폼으로 남겨주시면 담당자가 신속히 확인합니다.'
  },
  {
    num: '02',
    enTitle: 'CONFIRMATION',
    krTitle: '굿즈 및 작업 조건 확인',
    description: '구성품, 포장 방식과 작업 범위를 확인합니다.',
    detailText: '굿즈의 정확한 규격, 재질, 부자재 준비 상태(고객사 제공 여부 또는 스튜디오 조달 필요 여부)와 검수 기준을 꼼꼼하게 대조합니다.'
  },
  {
    num: '03',
    enTitle: 'QUOTE',
    krTitle: '견적 및 일정 협의',
    description: '의뢰 조건에 맞춰 견적과 일정을 협의합니다.',
    detailText: '확정된 작업 범위와 수량에 맞추어 투명한 견적을 산출하고, 굿즈 입고일과 최종 출고 일정을 상호 조율하여 확정합니다.'
  },
  {
    num: '04',
    enTitle: 'PACKING',
    krTitle: '포장 작업 진행',
    description: '합의된 조건에 따라 포장 작업을 진행합니다.',
    detailText: '정돈된 스튜디오 환경에서 전담 인력이 지문 방지 장갑 착용 후 정밀하게 포장을 진행하며, 완료 후 안전하게 포장하여 출고합니다.'
  }
];

export const CONTACT_CHANNELS = {
  phone: {
    label: '전화 문의',
    value: '010-4591-0334',
    tel: 'tel:01045910334',
    note: '상담 가능 시간: 평일 10:00 - 18:00 (점심시간 12:30 - 13:30)',
    isPlaceholder: false,
    instruction: '모바일 클릭 시 바로 전화 연결, PC 클릭 시 번호가 복사됩니다.'
  },
  kakao: {
    label: '카카오톡 문의',
    value: '신나라패키지 카카오톡 채널',
    link: 'http://pf.kakao.com/_CXxcmX',
    note: '실시간 1:1 채팅 상담 및 사진 전송 문의',
    isPlaceholder: false,
    instruction: '클릭 시 카카오톡 채널 1:1 상담 채팅으로 즉시 연결됩니다.'
  },
  email: {
    label: '이메일 문의',
    value: 'ares361@naver.com',
    mailto: 'mailto:ares361@naver.com?subject=%5B%EC%8B%A0%EB%82%98%EB%9D%BC%ED%8C%A8%ED%82%A4%EC%A7%80%5D%20%EC%95%84%EC%9D%B4%EB%8F%8C%20%EA%B5%BF%EC%A6%88%20%ED%8F%AC%EC%9E%A5%20%EA%B2%AC%EC%A0%81%20%EB%B0%8F%20%EC%9E%91%EC%97%85%20%EB%AC%B8%EC%9D%98',
    note: '대량 주문서 및 견적 요청서 파일 첨부 문의',
    isPlaceholder: false,
    instruction: '클릭 시 ares361@naver.com 주소가 클립보드에 복사됩니다.'
  },
  googleForm: {
    label: 'Google Forms 연결',
    value: '구글 폼 접수 연동 지원',
    note: '스프레드시트로 자동 취합이 필요한 경우 간편하게 폼 URL을 연결할 수 있습니다.',
    isPlaceholder: true,
    instruction: '구글 폼 생성 후 주소를 넣으면 즉시 새 탭으로 연결됩니다.'
  }
};
