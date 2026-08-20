import { FortuneResult, UserProfile, FortuneCategoryDetail, LuckyPoint } from '../types';

// Deterministic seed hash generator
export function generateDailySeed(birthDate: string, gender: string, dateStr: string): number {
  const combined = `${birthDate}_${gender}_${dateStr}_dailyfortune_secret`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Pseudo-random number generator from seed
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Returns number between 0 and 1
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Returns integer between min and max inclusive
  nextInt(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  // Pick one from array
  pick<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }
}

const STATUS_TIERS = [
  {
    min: 90,
    max: 100,
    title: '최고의 하루',
    descriptions: [
      '모든 기운이 당신을 향해 미소 짓는 날입니다. 마음먹은 일을 적극적으로 시도해보세요.',
      '기대 이상의 눈부신 행운과 기회가 당신을 찾아옵니다. 자신감을 가지세요.',
      '주변 사람들과의 조화 속에서 큰 성과를 이룰 수 있는 특별한 날입니다.'
    ]
  },
  {
    min: 80,
    max: 89,
    title: '아주 좋은 하루',
    descriptions: [
      '오늘은 새로운 기회를 발견하기 좋은 하루입니다.',
      '기분 좋은 변화가 찾아오며 마음에 여유가 가득해집니다.',
      '그동안 준비해온 일들이 순조롭게 결실을 맺을 징조가 보입니다.'
    ]
  },
  {
    min: 70,
    max: 79,
    title: '좋은 하루',
    descriptions: [
      '평온하고 긍정적인 에너지가 가득하여 순조롭게 흘러가는 하루입니다.',
      '작은 기쁨들이 이어져 소소한 행복을 느낄 수 있는 날입니다.',
      '생각했던 일들이 무리 없이 하나씩 차분하게 해결됩니다.'
    ]
  },
  {
    min: 60,
    max: 69,
    title: '무난한 하루',
    descriptions: [
      '일상의 루틴을 지키며 차분하게 하루를 보내기에 안성맞춤인 날입니다.',
      '급한 결정보다는 한 번 더 여유를 두고 차분하게 점검해보세요.',
      '기본에 충실할수록 편안하고 안정된 기운을 유지할 수 있습니다.'
    ]
  },
  {
    min: 50,
    max: 59,
    title: '조금 조심할 하루',
    descriptions: [
      '주변 사람들과의 대화에서 작은 배려와 귀 기울임이 큰 힘이 됩니다.',
      '무리한 확장보다는 현재 가진 것에 집중하고 정돈하는 시간을 가져보세요.',
      '서두르기보다는 따뜻한 차 한 잔과 함께 심호흡을 추천합니다.'
    ]
  },
  {
    min: 30,
    max: 49,
    title: '신중함이 필요한 하루',
    descriptions: [
      '새로운 시도보다는 내실을 다지고 충전하기에 좋은 시점입니다.',
      '감정적인 결정보다는 논리적이고 차분한 판단이 유리합니다.',
      '오늘은 스스로에게 편안한 휴식을 선물해주는 것도 지혜로운 선택입니다.'
    ]
  },
  {
    min: 0,
    max: 29,
    title: '무리하지 않는 것이 좋은 하루',
    descriptions: [
      '에너지를 아끼고 마음의 안정을 우선으로 삼아야 할 날입니다.',
      '중요한 결정은 내일로 잠시 미루고 충분한 수면과 휴식을 취해보세요.',
      '조용한 음악과 함께 나만의 시간을 보내며 기운을 회복하세요.'
    ]
  }
];

const CATEGORY_BANK = {
  love: {
    high: [
      {
        summary: '오늘은 솔직한 표현이 좋은 결과로 이어질 수 있어요.',
        detail: '상대방과의 소통이 막힘없이 술술 풀리는 날입니다. 진심 어린 칭찬이나 따뜻한 안부 인사가 서로의 거리를 한층 가깝게 만들어줍니다. 싱글이라면 뜻밖의 매력적인 인연을 만날 기운이 감돕니다.',
        tip: '평소 전하지 못했던 다정한 마음을 짧은 메시지로 먼저 건네보세요.'
      },
      {
        summary: '뜻밖의 대화가 설레는 인연이나 감동으로 이어집니다.',
        detail: '마음의 문을 열고 타인을 대하면 예상치 못한 따뜻한 감동이 찾아옵니다. 가까운 연인이나 친구와 사소한 농담 속에서도 깊은 유대감을 느낄 수 있습니다.',
        tip: '상대방의 눈을 바라보며 미소를 지어보세요.'
      }
    ],
    mid: [
      {
        summary: '상대방의 이야기를 천천히 경청해보세요.',
        detail: '말하기보다는 들어주는 자세가 관계를 더욱 단단하게 만듭니다. 사소한 오해가 생길 수 있으니 감정적인 판단보다는 부드러운 대화로 풀어가세요.',
        tip: '고마웠던 순간을 떠올려 가볍게 감사 표현을 해보세요.'
      },
      {
        summary: '작은 배려가 관계를 더 포근하고 아름답게 만듭니다.',
        detail: '서로의 취향을 존중하고 작은 배려를 실천하면 편안한 온기를 유지할 수 있습니다.',
        tip: '따뜻한 음료를 함께 나누며 잔잔한 대화를 나눠보세요.'
      }
    ],
    low: [
      {
        summary: '오늘은 감정적인 말보다 차분한 거리두기가 좋아요.',
        detail: '서로 피로가 누적되어 있다면 사소한 말 한마디에 민감해질 수 있습니다. 조급해하지 말고 혼자만의 충전 시간을 갖는 것이 관계에 더 긍정적입니다.',
        tip: '서운한 점이 있다면 오늘 바로 말하기보다 하루 뒤 생각해보세요.'
      }
    ]
  },
  money: {
    high: [
      {
        summary: '기대 이상의 쏠쏠한 이득이나 기회가 찾아옵니다.',
        detail: '그동안 계획했던 재정적 선택이 긍정적인 흐름을 탑니다. 뜻밖의 할인, 이벤트 당첨, 혹은 유용한 정보를 얻을 수 있는 좋은 기운입니다.',
        tip: '필요했던 물건을 좋은 조건으로 구매하기 적절한 타이밍입니다.'
      },
      {
        summary: '안정적인 흐름 속에 알짜 재정 정보가 들어옵니다.',
        detail: '지출을 현명하게 관리하면서도 나를 위한 가치 있는 소비에 보람을 느낄 수 있습니다.',
        tip: '자산 계획이나 가계부를 점검하며 중장기 목표를 세워보세요.'
      }
    ],
    mid: [
      {
        summary: '충동적인 소비보다는 꼭 필요한 물건인지 한 번 더 생각해보세요.',
        detail: '큰 손실은 없으나 사소한 지출이 쌓일 수 있는 날입니다. 장바구니에 담아두고 몇 시간 뒤 다시 확인하는 여유를 가지세요.',
        tip: '영수증을 챙기고 오늘 쓴 금액을 간단히 기록해보세요.'
      },
      {
        summary: '적당한 절약과 가성비 중심의 선택이 유리합니다.',
        detail: '계획된 예산 안에서 알뜰하게 소비하면 마음도 가뿐해집니다.',
        tip: '외식 대신 건강한 홈메이드 식사를 즐겨보세요.'
      }
    ],
    low: [
      {
        summary: '무리한 투자나 큰 결제는 잠시 보류하는 것이 현명합니다.',
        detail: '예상치 못한 부대 비용이 발생할 수 있으니 비상금을 점검하고 충동 구매를 피하세요.',
        tip: '온라인 쇼핑 앱 알림을 잠시 끄고 마음의 여유를 가지세요.'
      }
    ]
  },
  work: {
    high: [
      {
        summary: '집중력이 뛰어난 날이에요. 미뤄왔던 일을 처리하기 좋습니다.',
        detail: '아이디어가 샘솟고 업무나 학업 효율이 최고조에 달합니다. 당신의 추진력과 꼼꼼함이 주변의 인정을 받게 됩니다.',
        tip: '가장 어렵고 까다로운 일부터 오전에 먼저 시작해보세요.'
      },
      {
        summary: '새로운 프로젝트나 목표를 향해 자신 있게 첫걸음을 내딛으세요.',
        detail: '협업과 커뮤니케이션에서 주도적인 역할을 맡아도 좋은 반응을 얻습니다.',
        tip: '메모장에 오늘 완료할 핵심 3가지를 적고 하나씩 지워보세요.'
      }
    ],
    mid: [
      {
        summary: '기본 루틴을 충실히 수행하면 순조롭게 마무리가 됩니다.',
        detail: '새로운 일을 무리하게 벌이기보다는 기존 과제를 차분하게 정돈하고 마감 일정을 확인하는 것이 안전합니다.',
        tip: '책상 위와 컴퓨터 바탕화면을 정돈하고 시작하세요.'
      },
      {
        summary: '동료나 팀원들과의 의견 조율에 신경 쓰면 성과가 배가됩니다.',
        detail: '혼자 모든 것을 짊어지려 하지 말고 주변에 적절한 도움과 피드백을 요청하세요.',
        tip: '회의나 보고 전에 핵심 요점을 1줄로 먼저 정리해보세요.'
      }
    ],
    low: [
      {
        summary: '서두르면 사소한 실수가 생길 수 있으니 더블 체크하세요.',
        detail: '피로로 인해 집중력이 흐려질 수 있습니다. 50분 집중 후 10분 스트레칭 규칙을 지켜보세요.',
        tip: '중요한 서류나 메일은 전송 전 수신인과 첨부파일을 재확인하세요.'
      }
    ]
  },
  health: {
    high: [
      {
        summary: '활력과 생기가 넘쳐 기분 좋고 상쾌한 하루를 보냅니다.',
        detail: '몸과 마음의 컨디션이 모두 최상입니다. 가벼운 러닝이나 헬스, 요가 등 운동을 통해 기분 좋은 땀을 흘리기에 더없이 좋습니다.',
        tip: '햇볕을 쬐며 15분 이상 활기차게 산책해보세요.'
      },
      {
        summary: '피로가 빠르게 회복되며 맑은 정신으로 하루를 시작합니다.',
        detail: '몸의 신진대사가 원활하여 무엇을 해도 지치지 않는 쾌적한 상태입니다.',
        tip: '제철 신선한 과일이나 채소로 상큼한 에너지를 충전하세요.'
      }
    ],
    mid: [
      {
        summary: '전체적인 컨디션은 좋지만 늦은 시간까지 무리하지 않는 것이 좋아요.',
        detail: '일과 중 가벼운 목, 어깨 스트레칭을 곁들이면 피로 누적을 미리 방지할 수 있습니다.',
        tip: '물 1리터 이상 섭취하고 바른 자세를 유지하세요.'
      },
      {
        summary: '규칙적인 식사와 가벼운 움직임이 컨디션을 지켜줍니다.',
        detail: '과식이나 자극적인 야식만 피한다면 편안하고 안정된 컨디션을 누릴 수 있습니다.',
        tip: '식후 가벼운 걷기로 소화를 돕고 혈액순환을 촉진하세요.'
      }
    ],
    low: [
      {
        summary: '면역력과 수면 관리에 각별히 신경 써야 하는 하루입니다.',
        detail: '충분한 수면과 휴식이 최고의 보약입니다. 일정을 가볍게 조율하고 일찍 잠자리에 드세요.',
        tip: '따뜻한 온수로 샤워하고 스마트폰을 멀리 둔 채 편안히 쉬세요.'
      }
    ]
  }
};

const LUCKY_COLORS = [
  { name: '민트 그린', hex: '#a3defe' },
  { name: '라벤더 퍼플', hex: '#B8B5FF' },
  { name: '선샤인 옐로우', hex: '#FFD369' },
  { name: '코랄 핑크', hex: '#ff9e9e' },
  { name: '스카이 블루', hex: '#78c0e6' },
  { name: '세이지 그린', hex: '#a7c4bc' },
  { name: '소프트 화이트', hex: '#f0f4f8' },
  { name: '로즈 골드', hex: '#e8b4b8' },
  { name: '미드나잇 네이비', hex: '#5947c5' }
];

const LUCKY_ITEMS = [
  'Coffee', '노트', '우산', '텀블러', '무선 이어폰',
  '손목시계', '열쇠고리', '책', '핸드크림', '안경',
  '모자', '향수', '동전 지갑', '다이어리'
];

const LUCKY_TIMES = [
  '08:00 AM', '09:30 AM', '11:00 AM', '01:30 PM',
  '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM', '09:00 PM'
];

const LUCKY_FOODS = [
  '🍜 따뜻한 국수', '☕ 향긋한 드립 커피', '🥗 신선한 샐러드',
  '🍫 달콤한 다크초콜릿', '🥐 갓 구운 크루아상', '🥪 든든한 샌드위치',
  '🍲 따끈한 버섯전골', '🍓 상큼한 베리 스무디', '🍙 정갈한 삼각김밥'
];

const DAILY_QUOTES = [
  '작은 선택이 좋은 변화를 만들 수 있어요.',
  '당신이 내딛는 발걸음마다 새로운 꽃이 피어납니다.',
  '우연처럼 다가온 순간이 가장 빛나는 선물이 됩니다.',
  '오늘 하루, 스스로를 가장 많이 칭찬해주세요.',
  '마음을 편안하게 가질 때 가장 좋은 답이 떠오릅니다.',
  '어제의 걱정은 내려놓고 오늘의 눈부신 햇살을 맞이하세요.',
  '천천히 걸어도 올바른 방향으로 나아가고 있습니다.',
  '당신의 맑은 미소가 주변 사람들에게도 큰 위로가 됩니다.'
];

export function getTodayDateString(): { raw: string; formatted: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const raw = `${year}-${month}-${day}`;

  const daysKo = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = daysKo[now.getDay()];
  const formatted = `${year}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${dayName}`;

  return { raw, formatted };
}

export function generateFortune(profile: UserProfile, targetDate?: string): FortuneResult {
  const { raw: todayRaw, formatted: todayFormatted } = getTodayDateString();
  const dateStr = targetDate || todayRaw;
  const birthDateStr = `${profile.birthYear}-${profile.birthMonth.padStart(2, '0')}-${profile.birthDay.padStart(2, '0')}`;

  const seed = generateDailySeed(birthDateStr, profile.gender, dateStr);
  const rng = new SeededRandom(seed);

  // Generate category scores (between 55 and 99 with realistic organic spread)
  const loveScore = rng.nextInt(58, 97);
  const moneyScore = rng.nextInt(55, 96);
  const workScore = rng.nextInt(60, 98);
  const healthScore = rng.nextInt(62, 97);

  // Overall score is weighted average + minor organic variation
  const avg = Math.round((loveScore * 0.25) + (moneyScore * 0.25) + (workScore * 0.25) + (healthScore * 0.25));
  const overallScore = Math.max(30, Math.min(99, avg));

  // Determine status tier
  const tier = STATUS_TIERS.find(t => overallScore >= t.min && overallScore <= t.max) || STATUS_TIERS[3];
  const statusTitle = tier.title;
  const statusDescription = rng.pick(tier.descriptions);

  // Helper for category detail
  const buildCategoryDetail = (
    id: 'love' | 'money' | 'work' | 'health',
    name: string,
    nameEn: string,
    score: number,
    icon: string
  ): FortuneCategoryDetail => {
    const starRatio = score / 20;
    const stars = Math.max(1, Math.min(5, Math.round(starRatio)));
    const bank = CATEGORY_BANK[id];
    let pool = bank.mid;
    if (score >= 80) pool = bank.high;
    else if (score < 65) pool = bank.low;
    const item = rng.pick(pool);

    return {
      id,
      name,
      nameEn,
      score,
      stars,
      icon,
      summary: item.summary,
      detail: item.detail,
      tip: item.tip
    };
  };

  const categories = {
    love: buildCategoryDetail('love', '연애운', 'Love', loveScore, 'favorite'),
    money: buildCategoryDetail('money', '금전운', 'Money', moneyScore, 'attach_money'),
    work: buildCategoryDetail('work', '직장·학업운', 'Work', workScore, 'work'),
    health: buildCategoryDetail('health', '건강운', 'Health', healthScore, 'health_and_safety')
  };

  const luckyColor = rng.pick(LUCKY_COLORS);
  const luckyPoint: LuckyPoint = {
    number: rng.nextInt(1, 9),
    colorName: luckyColor.name,
    colorHex: luckyColor.hex,
    item: rng.pick(LUCKY_ITEMS),
    time: rng.pick(LUCKY_TIMES),
    food: rng.pick(LUCKY_FOODS)
  };

  const dailyQuote = rng.pick(DAILY_QUOTES);

  return {
    id: `fortune_${birthDateStr}_${dateStr}`,
    dateStr,
    dateFormatted: todayFormatted,
    overallScore,
    statusTitle,
    statusDescription,
    categories,
    lucky: luckyPoint,
    dailyQuote,
    createdAt: new Date().toISOString()
  };
}
