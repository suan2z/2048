# 운빨존많겜 아웃게임 역기획서

> 본 문서는 운빨존많겜(Lucky Defense)의 아웃게임 시스템을 분석하고,  
> 신규 게임 설계 시 참고할 인사이트를 도출하기 위한 역기획서입니다.  
> 인게임(전투/타워 디펜스) 내용은 별도 문서로 다룹니다.

---

## 목차

1. [문서 개요](#1-문서-개요)
2. [게임 개요](#2-게임-개요)
3. [계정 시스템](#3-계정-시스템)
4. [성장 시스템](#4-성장-시스템)
5. [수익화 시스템](#5-수익화-시스템)
6. [UI/UX](#6-uiux)
7. [스키마 설계](#7-스키마-설계)
8. [총평 및 시사점](#8-총평-및-시사점)

---

## 1. 문서 개요

### 1.1 역기획 목적 및 범위

본 역기획서는 **운빨존많겜**의 아웃게임 시스템을 분석 대상으로 삼는다.  
역기획의 목적은 크게 두 가지다.

- **기존 시스템 이해**: 개발사 111퍼센트가 어떤 설계 의도로 각 시스템을 구성했는지 파악한다.
- **신규 게임 설계 레퍼런스 도출**: 분석한 내용을 바탕으로 새로운 게임에 적용할 수 있는 구조적 인사이트를 정리한다.

**분석 범위**

| 포함 | 제외 |
|------|------|
| 계정 시스템 | 인게임 전투 메커니즘 |
| UI/UX 흐름 | 타워 배치 및 합성 시스템 |
| 성장 시스템 (영웅/유물/룬/펫) | 웨이브 밸런스 설계 |
| 수익화 시스템 (과금/가챠/광고) | 상대 라인 간섭 메커니즘 |

### 1.2 분석 방법론

- 앱스토어(Google Play / App Store) 리뷰 및 평점 데이터 참조
- 커뮤니티(카페, 디스코드, 유튜브) 유저 반응 수집
- 공개된 마케팅 데이터 및 수익 지표 참조
- 직접 플레이를 통한 화면 흐름 및 UI 구조 기록

### 1.3 용어 정의

| 용어 | 정의 |
|------|------|
| 아웃게임 | 전투 외의 모든 시스템 (성장, 수익화, 계정, UI 등) |
| 가챠 | 확률 기반 아이템 뽑기 시스템 |
| 천장(pity) | 일정 횟수 이상 뽑으면 고등급을 보장하는 보호 장치 |
| 버스 | 고렙 유저가 저렙 유저를 이끌어 클리어하는 행위 |
| 무과금 | 실제 현금을 사용하지 않는 유저 |
| VVIP | 월정액 최상위 구독 상품 |
| 메타 | 현재 가장 강력하거나 효율적인 영웅/조합 |

---

## 2. 게임 개요

### 2.1 게임 정체성 및 핵심 컨셉

**운빨존많겜**은 개발사 **111퍼센트**(랜덤 다이스 제작사)가 2024년 출시한 2인 협동 랜덤 타워 디펜스 게임이다.

게임의 핵심 정체성은 **"운과 전략의 하이브리드"** 다.

- 영웅 소환, 합성 결과, 모집 과정이 모두 무작위(랜덤)로 결정된다.
- 동시에 협동, 딜 구성, 자원 분배 등 전략적 판단이 승패에 영향을 미친다.
- 이 두 요소의 결합이 코어 게이머와 하이퍼캐주얼 게이머 모두에게 어필하는 핵심 강점이다.

**주요 지표**

| 항목 | 수치 |
|------|------|
| 누적 다운로드 | 300만+ |
| 누적 매출 | 약 $2,000만 |
| 한국 다운로드 비중 | 70.7% |
| 한국 매출 비중 | 79.4% |
| Google Play 평점 | 4.3 |
| App Store 평점 | 4.4 |

### 2.2 타겟 유저 페르소나

운빨존많겜은 단일 페르소나가 아닌 **두 개의 상반된 유저층**을 동시에 흡수하는 데 성공했다.

**페르소나 A — 코어 게이머**
- 일반 대비 +569% 비율로 유입
- 메타 분석, 최적 조합 탐구, 고난이도 콘텐츠(지옥/신 모드) 클리어를 목표로 함
- 커뮤니티 활동 활발, 영웅 티어표 및 공략 콘텐츠 소비

**페르소나 B — 하이퍼캐주얼 게이머**
- 일반 대비 +206% 비율로 유입
- 간단한 조작, 짧은 세션, 귀여운 캐릭터에 반응
- 무과금 또는 소액 과금 성향

### 2.3 아웃게임 구조 전체 맵 (시스템 간 연관도)

```
[계정]
  └── 레벨/등급 → 콘텐츠 해금 조건
  └── 랭킹 데이터 → 경쟁 동기 부여

[UI/UX]
  └── 메인 로비 → 각 시스템 진입점
  └── 상점 화면 → 구매 전환 유도
  └── 알림/보상 → 리텐션 유도

[성장 시스템]
  영웅 ──┐
  유물 ──┤→ 난이도 게이팅 → 콘텐츠 진행
  룬  ──┤
  펫  ──┘

[수익화]
  재화 ──→ 가챠 ──→ 성장 시스템
  구독 ──→ 편의 혜택 (2배속, 광고 제거)
  광고 ──→ 무과금 유저 수익원
```

---

## 3. 계정 시스템

### 3.1 계정 등급 및 레벨 체계

운빨존많겜은 플레이어의 전체 성장을 **계정 레벨** 단위로 관리한다.

- 게임 플레이, 퀘스트 완료, 던전 클리어 등을 통해 경험치를 획득한다.
- 계정 레벨 상승에 따라 신규 콘텐츠(지옥 모드, 신 모드 등)가 단계적으로 해금된다.
- 레벨 구간별 보상(재화, 영웅 소환권 등)을 지급하여 초반 진입 장벽을 낮춘다.

**설계 의도**: 콘텐츠를 레벨 뒤에 숨겨 장기 플레이를 유도하면서, 초반 보상으로 신규 유저의 이탈을 방지하는 구조다.

### 3.2 로그인 및 데이터 연동 구조

**게스트 → 소셜 계정 전환 유도 흐름**

1. 최초 진입 시 게스트 계정으로 즉시 플레이 가능 (진입 장벽 최소화)
2. 게임 진행 중 일정 시점에 계정 연동 유도 팝업 노출
3. 구글/애플 로그인 연동 시 추가 재화 지급 (전환 인센티브)
4. 연동 후 기기 변경, 데이터 복구 가능 (데이터 보호 명분)

**설계 의도**: 소셜 로그인 전환은 단순한 편의 기능이 아니라 **유저 이탈 방지 장치**다. 계정에 데이터가 묶이는 순간 유저의 이탈 비용이 높아진다.

### 3.3 랭킹 시스템과 계정 데이터 연계

- 영웅 수집 현황, 던전 클리어 기록, 누적 골드 등이 랭킹 지표로 활용된다.
- 랭킹 시스템은 과금 유저의 성과를 가시화하여 경쟁 심리를 자극한다.
- 2025년 이후 랭킹 시스템 및 영웅 정보 편의성이 업데이트되며 개선됨.

### 3.4 계정 정지 및 환불 정책 (CS 리스크 분석)

**이슈 개요**

앱스토어에서 결제 환불을 진행한 유저에 대해 계정 영구정지 처리 사례가 다수 보고되었다. 이에 대한 고객지원 대응이 미흡하다는 불만이 누적되고 있다.

**문제 구조 분석**

| 항목 | 내용 |
|------|------|
| 발생 원인 | 앱스토어 환불 → 자동 계정 정지 로직 |
| 유저 반응 | 정지 사유 불명확, CS 무응답/지연 불만 |
| 리스크 | 앱스토어 평점 하락, 부정 리뷰 누적 |
| 개선 방향 | 환불 정책 명문화, CS 응답 속도 개선 |

**시사점**: 계정 정지 자동화 로직은 어뷰저 방지 목적이지만, 오남용 시 일반 유저 경험을 크게 훼손한다. 신규 게임 설계 시 환불-정지 연계 로직에 수동 검토 단계를 추가하는 것이 필요하다.

---

## 4. 성장 시스템

### 4.1 영웅 시스템

#### 4.1.1 등급 체계 (일반 → 신화 → 불멸)

운빨존많겜의 영웅 등급 체계는 수직적 성장 구조를 명확하게 시각화한다.

| 등급 | 특징 |
|------|------|
| 일반 | 초반 진입용, 소환 확률 높음 |
| 희귀 | 중간 단계, 합성 재료 역할 |
| 신화 | 고성능, 과금 연계 |
| 불멸 | 최상위 등급, 최근 추가된 클래스 |

- 2025년 이후 **신화 → 불멸** 클래스 체계가 확장되며 천장이 높아졌다.
- '기가채드' 등 불멸 영웅이 신규 추가되며 과금 유저의 메타 우위가 강화되었다.

#### 4.1.2 영웅 획득 경로

- **무작위 소환**: 골드 또는 다이아 사용, 어떤 영웅이 나올지 알 수 없음
- **이벤트 지급**: 한정 이벤트, 출석 보상, 업적 달성 시 지급
- **합성**: 동일 영웅 3~4마리 합성 → 상위 영웅 획득 (결과 역시 랜덤)
- **상점 구매**: 일부 영웅 직접 구매 가능 (고가)

#### 4.1.3 영웅 강화 및 합성 구조

- **강화**: 골드 소모 → 영웅 스탯 수치 상승
- **합성**: 동일 영웅 3~4마리 합성 → 상위 등급 영웅으로 변환 (핵심 수집 루프)
- **스킨**: 전투력에 영향 없는 외형 변환, 감성 과금 유도

합성 구조는 게임 이름의 핵심인 "운"을 구현하는 장치다. 좋은 영웅을 합성해서 더 좋은 영웅이 나올 수도 있고, 원하지 않는 영웅이 나올 수도 있다.

#### 4.1.4 메타 영향력 및 밸런스 설계 의도

- 정기 밸런스 패치를 통해 메타를 순환시킨다.
- 특정 영웅이 장기간 최강 메타를 유지하면 비과금 유저도 해당 영웅을 확보하게 되므로, 주기적 메타 교체로 **새로운 과금 동기**를 생성한다.
- 불멸 마딜 캐릭터 중심의 메타 재편이 최근 진행됨.

### 4.2 유물 시스템

#### 4.2.1 유물 종류 및 효과

| 유물 | 주요 효과 |
|------|-----------|
| 금고 | 골드 획득량 증가 |
| 머니건 | 전투 중 골드 생성 |
| 행운석 | 소환 확률 보정 |

#### 4.2.2 유물 레벨업 구조 및 재화 흐름

- 유물 강화에는 전용 재화(결정석 등) 및 골드가 소모된다.
- 유물 레벨이 높을수록 전투에서 유리한 조건(골드 효율, 소환 확률)을 확보한다.
- 상위 유물 재료는 던전 클리어 및 과금으로 획득 가능하다.

#### 4.2.3 난이도 게이팅 수단으로서의 역할

유물 시스템은 단순한 성장 콘텐츠가 아니라 **난이도 진입 장벽**으로 기능한다.

- 지옥 모드, 신 모드 등 고난이도 콘텐츠는 유물 레벨이 일정 수준 이상이어야 실질적인 클리어가 가능하다.
- 이를 통해 유저가 유물 강화에 지속적으로 재화를 투자하도록 유도한다.

### 4.3 룬 시스템

#### 4.3.1 룬 등급 및 획득 방식

- 룬은 일반 / 고급 / 희귀 / 전설 등 등급으로 구분된다.
- 던전 보상, 이벤트, 가챠(다이아 소모)를 통해 획득 가능하다.
- 고등급 룬일수록 가챠 의존도가 높아지는 구조다.

#### 4.3.2 영웅과의 시너지 설계

- 특정 룬이 특정 영웅 유형(물리/마법)과 조합될 때 시너지 효과가 발생한다.
- 최적 조합에 대한 정보는 커뮤니티 공략으로 확산되며, 이를 따라가기 위한 추가 수집/과금 동기가 생성된다.

#### 4.3.3 가챠와의 연계 구조

- 룬 뽑기는 펫 뽑기와 함께 **핵심 가챠 콘텐츠**다.
- 다이아를 소모하여 룬을 소환하며, 고등급 룬 확률은 낮게 설정되어 있다.
- 2026년 2월 확률 편향 오류 발각 시 가장 큰 피해를 입은 콘텐츠 중 하나다.

### 4.4 펫 시스템

#### 4.4.1 펫 획득 및 성장 구조

- 펫은 가챠(다이아 소모) 또는 이벤트를 통해 획득한다.
- 획득한 펫은 레벨업, 진화 등을 통해 성장시킬 수 있다.
- 펫 성장 재료 역시 던전 또는 과금으로 수급한다.

#### 4.4.2 전투 기여도 및 과금 연계

- 펫은 전투 중 패시브/액티브 스킬로 유의미한 성능 차이를 만든다.
- 고등급 펫은 과금 또는 장기 플레이 없이는 확보가 어렵다.
- 펫 시스템은 무과금 유저와 과금 유저 간 **성능 격차를 만드는 핵심 장치** 중 하나다.

---

## 5. 수익화 시스템

### 5.1 재화 체계

#### 5.1.1 재화 종류

| 재화 | 획득 방법 | 주요 용도 |
|------|-----------|-----------|
| 골드 | 플레이, 던전, 광고 시청 | 영웅 소환, 강화 |
| 다이아 | 과금, 이벤트 보상 | 가챠(펫/룬), 프리미엄 상품 |
| 기타 전용 재화 | 던전, 이벤트, 패스 보상 | 유물 강화, 특수 상점 |

#### 5.1.2 재화 획득 경로 및 소모 구조

- 골드는 플레이만으로 꾸준히 수급되지만, 다이아는 과금 없이는 소량만 획득 가능하다.
- 재화 소모 구조가 복잡하게 설계되어 있어 유저가 실제 지출 규모를 직관적으로 파악하기 어렵다.

#### 5.1.3 유료·무료 재화 분리 설계 의도

- 무료 재화(골드)로는 기본 플레이가 가능하도록 설계하여 무과금 유저의 이탈을 방지한다.
- 고성능 콘텐츠(고등급 영웅, 최상위 룬)는 유료 재화(다이아)에 의존하도록 설계한다.
- 이 분리 구조가 "무과금도 즐길 수 있다"는 긍정적 리뷰의 근거가 된다.

### 5.2 구독 모델

#### 5.2.1 사냥 패스 구조 및 보상 설계

- 사냥 패스는 월정액 구독 상품으로, 매일 일정량의 재화를 지급한다.
- 무료 패스와 유료 패스로 구분되며, 유료 패스 구매 시 추가 보상 라인이 해금된다.
- 일일 접속 보상 구조와 결합하여 **매일 진입할 이유**를 만든다.

#### 5.2.2 VVIP 혜택 분석

| 혜택 | 설명 |
|------|------|
| 게임 2배속 | 전투 시간 단축, 파밍 효율 2배 |
| 광고 제거 | 강제 광고 시청 없이 보상 수령 |
| 추가 재화 | 일정량 다이아/골드 추가 지급 |

- 2배속은 **타임 퍼체이스(time purchase)** 의 전형적인 사례다. 게임 시간을 단축시켜주는 것 자체가 가치 있는 상품이 된다.
- 광고 제거는 무과금 유저의 불편함을 역이용한 설계로, 무과금 유저가 광고를 경험하면서 VVIP의 필요성을 느끼게 한다.

#### 5.2.3 무과금 유저와의 경험 격차 설계

- 무과금 유저도 기본 플레이는 가능하지만, 파밍 효율과 고난이도 콘텐츠 진행 속도에서 차이가 발생한다.
- 이 격차가 "불편하지만 납득 가능한 수준"으로 설계된 것이 4점대 평점을 유지하는 이유 중 하나다.

### 5.3 가챠 시스템

#### 5.3.1 펫·룬 소환 확률 구조

- 펫과 룬은 각각 별도의 가챠 풀에서 소환된다.
- 고등급 확률은 낮게 설정되어 있으며, 공개 확률표는 스토어 정책상 표기된다.
- 소환 시 시각적 연출(빛, 파티클 등)로 기대감을 극대화한다.

#### 5.3.2 천장(pity) 시스템 유무 분석

- 천장 시스템의 존재 여부 및 구체적 수치는 명확히 공개되어 있지 않다.
- 커뮤니티 내에서 체감 천장이 논의되고 있으나 공식 확인은 미비하다.
- **시사점**: 천장 미공개는 단기 수익에는 유리하지만, 신뢰도 리스크를 내포한다.

#### 5.3.3 2026.02 확률 오류 사태 분석 및 시사점

**사태 개요**

2026년 2월, 펫 뽑기 및 룬 뽑기에서 확률 편향 오류가 발각되었다. 표기된 확률과 실제 확률이 다르게 적용되고 있었으며, 개발사는 공식 사과 및 재화 보상을 지급했다.

**구조적 분석**

| 항목 | 내용 |
|------|------|
| 원인 | 확률 계산 로직의 버그 또는 설계 오류 |
| 영향 | 과금 유저 신뢰도 급락, 커뮤니티 반발 |
| 대응 | 공개 사과 + 재화 보상 지급 |
| 한계 | 과금 유저 비판 지속, 완전 신뢰 회복 미달 |

**시사점**: 가챠 확률은 법적 공시 의무가 있는 항목이다. 오류 발생 시 신뢰도 회복 비용이 매우 크므로, 신규 게임 설계 시 확률 로직 검증 및 실시간 모니터링 체계를 구축해야 한다.

### 5.4 스킨 및 한정 아이템

#### 5.4.1 스킨 종류 및 획득 경로

- 영웅 스킨(전투력 무관), 프로필 스킨, UI 테마 등으로 구분된다.
- 상점 직접 구매, 배틀패스 보상, 한정 이벤트를 통해 획득한다.
- '하이테크 랜슬롯' 등 신규 스킨이 정기적으로 추가된다.

#### 5.4.2 배틀패스와의 결합 운영 방식

- 시즌 배틀패스의 최종 보상으로 한정 스킨을 배치하여 완주 동기를 높인다.
- 배틀패스 기간 동안 스킨 미리보기를 로비에 노출하여 구매 욕구를 자극한다.

#### 5.4.3 한정 아이템의 희소성 설계

- "기간 한정", "수량 한정" 문구와 카운트다운 UI로 긴박감을 조성한다.
- 한정 아이템은 재판매/재등장 하지 않는다는 기대감이 수집 동기를 강화한다.
- FOMO(Fear of Missing Out) 심리를 활용한 전형적인 설계다.

### 5.5 광고 수익 모델

#### 5.5.1 보상형 광고 구조

- 무과금 유저는 광고 시청을 통해 추가 골드, 소환권 등을 획득할 수 있다.
- 광고는 일일 시청 횟수 제한이 있어 무한 수급을 방지한다.
- AdMob 네트워크 점유율 2위, YouTube 광고 4위를 기록하며 초기 UA 비용에 기여했다.

#### 5.5.2 VVIP 광고 제거와의 관계

- 광고 시청 자체가 불편함으로 설계되어 있어, 이를 제거하는 VVIP의 가치를 높인다.
- 무과금 유저의 광고 시청 → 개발사 수익 발생 + VVIP 전환 동기 유발이라는 **이중 수익 구조**다.

---

## 6. UI/UX

### 6.1 전체 화면 플로우 및 네비게이션 구조

**주요 화면 계층**

```
[스플래시/로딩]
    ↓
[메인 로비]
    ├── 매칭 버튼 (인게임 진입)
    ├── 영웅 관리
    ├── 유물/룬 관리
    ├── 상점
    ├── 던전/이벤트
    └── 설정/계정
```

- 메인 로비는 **모든 아웃게임 시스템의 허브** 역할을 한다.
- 하단 탭바 또는 아이콘 배치로 주요 기능에 1~2탭 안에 접근 가능하도록 구성되어 있다.
- 신규 콘텐츠/이벤트는 로비 화면에 배너 또는 팝업으로 노출하여 유저 주목을 유도한다.

### 6.2 메인 로비 구성 및 정보 위계

- **상단**: 재화(골드, 다이아 등) 현황 항상 노출 → 부족감 인지 유도
- **중앙**: 매칭 버튼 (가장 큰 CTA) → 핵심 플레이 루프 진입 유도
- **하단/측면**: 이벤트, 출석, 알림 뱃지 → 리텐션 유도 장치

**설계 의도**: 재화를 항상 노출함으로써 유저가 자신의 자원 상태를 인식하게 만들고, 자연스럽게 충전(과금) 동기를 유발한다.

### 6.3 상점·가챠 화면 설계 (구매 유도 UX)

- 상점 화면은 **추천 상품을 상단에 배치**하여 시선을 집중시킨다.
- 가챠 화면에서는 최근 당첨 영웅 목록을 실시간으로 노출하여 기대감을 자극한다.
- 한정 상품에는 **카운트다운 타이머**를 적용하여 긴박감을 조성한다.
- 소액 상품(스타터 팩 등)을 전면에 배치하여 첫 결제 허들을 낮춘다.

**주요 구매 유도 패턴**

| 패턴 | 설명 |
|------|------|
| 앵커링 | 고가 상품을 먼저 노출 후 중가 상품을 "합리적"으로 보이게 함 |
| 희소성 | 한정 수량/기간 강조 |
| 사회적 증거 | 다른 유저의 당첨 결과 실시간 노출 |
| 첫 구매 혜택 | 첫 결제 시 추가 보상 지급 |

### 6.4 성장 관련 화면 (영웅·유물·룬 관리 UI)

- 영웅 목록은 **등급별 색상 코딩**(일반/희귀/신화/불멸)으로 시각적 위계를 구성한다.
- 보유하지 않은 영웅은 **실루엣으로 노출**하여 수집 욕구를 자극한다 (제노가챠 UX).
- 유물·룬 강화 화면은 강화 성공 시 **연출 효과**를 강조하여 성취감을 극대화한다.
- 영웅 정보 화면에서 스킬 설명, 추천 조합을 함께 제공하여 진입 장벽을 낮춘다.

### 6.5 알림 및 보상 수령 UX (리텐션 유도 장치)

- 출석 체크, 일일 퀘스트, 이벤트 알림을 통해 **매일 진입할 이유**를 만든다.
- 보상 수령 화면은 애니메이션과 사운드를 활용하여 **도파민 루프**를 강화한다.
- 복귀 유저에게는 7일간 누적 보상 팝업을 노출하여 재진입 동기를 높인다.

### 6.6 온보딩 및 튜토리얼 흐름

- 튜토리얼은 **강제 진행** 방식으로 핵심 루프(소환 → 합성 → 전투)를 체험시킨다.
- 튜토리얼 완료 직후 초기 보상(영웅 소환권, 재화)을 대량 지급하여 몰입감을 높인다.
- 이후 단계적으로 유물, 룬, 상점 등 아웃게임 기능을 순차 소개한다.

**설계 의도**: 초반 보상 집중 지급으로 "이 게임이 후하다"는 첫인상을 형성하고, 이후 보상 밀도가 낮아지면서 자연스럽게 과금 동기를 유발하는 구조다.

---

## 7. 스키마 설계

> 본 섹션은 역기획 분석을 토대로 신규 게임 구현 시 필요한 데이터베이스 스키마를 정의한다.  
> 인게임 관련 테이블은 별도 문서에서 추가한다.

---

### 7.1 계정 (Account)

```sql
-- 유저 계정 기본 정보
CREATE TABLE account (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  uuid            VARCHAR(36)  NOT NULL UNIQUE,          -- 외부 노출용 식별자
  nickname        VARCHAR(32)  NOT NULL,
  login_type      ENUM('guest','google','apple') NOT NULL DEFAULT 'guest',
  social_id       VARCHAR(128),                          -- 소셜 로그인 고유 ID
  level           INT          NOT NULL DEFAULT 1,
  exp             BIGINT       NOT NULL DEFAULT 0,
  last_login_at   DATETIME,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_banned       BOOLEAN      NOT NULL DEFAULT FALSE,
  ban_reason      VARCHAR(256),
  ban_expires_at  DATETIME                               -- NULL이면 영구정지
);

-- 계정 디바이스 연동 (멀티 디바이스 대응)
CREATE TABLE account_device (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id  BIGINT      NOT NULL REFERENCES account(id),
  device_id   VARCHAR(128) NOT NULL,
  platform    ENUM('android','ios') NOT NULL,
  linked_at   DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7.2 재화 (Currency)

```sql
-- 재화 종류 정의
CREATE TABLE currency_type (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(32)  NOT NULL UNIQUE,   -- 'gold', 'diamond', 'crystal' 등
  name        VARCHAR(64)  NOT NULL,
  is_premium  BOOLEAN      NOT NULL DEFAULT FALSE  -- 유료 재화 여부
);

-- 유저별 재화 보유량
CREATE TABLE account_currency (
  account_id      BIGINT NOT NULL REFERENCES account(id),
  currency_type_id INT   NOT NULL REFERENCES currency_type(id),
  amount          BIGINT NOT NULL DEFAULT 0,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id, currency_type_id)
);

-- 재화 변동 이력 (수급/소모 모두 기록)
CREATE TABLE currency_transaction (
  id               BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id       BIGINT      NOT NULL REFERENCES account(id),
  currency_type_id INT         NOT NULL REFERENCES currency_type(id),
  delta            BIGINT      NOT NULL,           -- 양수: 획득, 음수: 소모
  balance_after    BIGINT      NOT NULL,
  source           VARCHAR(64) NOT NULL,           -- 'gacha', 'purchase', 'quest' 등
  source_ref_id    BIGINT,                         -- 연관 트랜잭션 ID (구매, 가챠 등)
  created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7.3 영웅 (Hero)

```sql
-- 영웅 마스터 데이터
CREATE TABLE hero (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  code          VARCHAR(64)  NOT NULL UNIQUE,
  name          VARCHAR(64)  NOT NULL,
  grade         ENUM('normal','rare','epic','mythic','immortal') NOT NULL,
  damage_type   ENUM('physical','magic') NOT NULL,
  base_atk      INT          NOT NULL DEFAULT 0,
  base_hp       INT          NOT NULL DEFAULT 0,
  is_limited    BOOLEAN      NOT NULL DEFAULT FALSE,   -- 한정 영웅 여부
  release_at    DATETIME,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE
);

-- 유저가 보유한 영웅
CREATE TABLE account_hero (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id      BIGINT NOT NULL REFERENCES account(id),
  hero_id         INT    NOT NULL REFERENCES hero(id),
  level           INT    NOT NULL DEFAULT 1,
  enhance_level   INT    NOT NULL DEFAULT 0,           -- 강화 단계
  skin_id         INT    REFERENCES hero_skin(id),
  obtained_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 영웅 스킨
CREATE TABLE hero_skin (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  hero_id   INT         NOT NULL REFERENCES hero(id),
  name      VARCHAR(64) NOT NULL,
  is_limited BOOLEAN    NOT NULL DEFAULT FALSE,
  price_diamond INT                                    -- NULL이면 이벤트 전용
);
```

---

### 7.4 유물 (Artifact)

```sql
-- 유물 마스터 데이터
CREATE TABLE artifact (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(64) NOT NULL,
  type        ENUM('vault','money_gun','luck_stone') NOT NULL,
  max_level   INT         NOT NULL DEFAULT 30,
  description VARCHAR(256)
);

-- 유저별 유물 보유 및 레벨
CREATE TABLE account_artifact (
  account_id   BIGINT NOT NULL REFERENCES account(id),
  artifact_id  INT    NOT NULL REFERENCES artifact(id),
  level        INT    NOT NULL DEFAULT 1,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id, artifact_id)
);
```

---

### 7.5 룬 (Rune)

```sql
-- 룬 마스터 데이터
CREATE TABLE rune (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(64) NOT NULL,
  grade       ENUM('normal','advanced','rare','legendary') NOT NULL,
  effect_type VARCHAR(64) NOT NULL,    -- 'atk_up', 'hp_up', 'cooldown_down' 등
  effect_value DECIMAL(10,4) NOT NULL
);

-- 유저가 보유한 룬
CREATE TABLE account_rune (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id  BIGINT NOT NULL REFERENCES account(id),
  rune_id     INT    NOT NULL REFERENCES rune(id),
  is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
  hero_slot   INT,                     -- 장착된 영웅의 account_hero.id
  obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7.6 펫 (Pet)

```sql
-- 펫 마스터 데이터
CREATE TABLE pet (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(64) NOT NULL,
  grade       ENUM('normal','rare','epic','legendary') NOT NULL,
  skill_desc  VARCHAR(256),
  max_level   INT NOT NULL DEFAULT 20,
  is_limited  BOOLEAN NOT NULL DEFAULT FALSE
);

-- 유저가 보유한 펫
CREATE TABLE account_pet (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id  BIGINT NOT NULL REFERENCES account(id),
  pet_id      INT    NOT NULL REFERENCES pet(id),
  level       INT    NOT NULL DEFAULT 1,
  is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
  obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7.7 가챠 (Gacha)

```sql
-- 가챠 풀 정의
CREATE TABLE gacha_pool (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(64) NOT NULL,
  pool_type   ENUM('hero','rune','pet') NOT NULL,
  cost_currency_id INT NOT NULL REFERENCES currency_type(id),
  cost_amount INT NOT NULL,
  pity_count  INT,             -- 천장 횟수 (NULL이면 미적용)
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  start_at    DATETIME,
  end_at      DATETIME         -- NULL이면 상시
);

-- 가챠 풀별 확률 테이블
CREATE TABLE gacha_pool_item (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  pool_id      INT           NOT NULL REFERENCES gacha_pool(id),
  item_type    ENUM('hero','rune','pet') NOT NULL,
  item_id      INT           NOT NULL,   -- hero.id / rune.id / pet.id
  weight       DECIMAL(10,4) NOT NULL,   -- 가중치 (합산 기준으로 확률 계산)
  is_pity_item BOOLEAN       NOT NULL DEFAULT FALSE  -- 천장 보장 아이템 여부
);

-- 가챠 시도 이력
CREATE TABLE gacha_log (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id  BIGINT NOT NULL REFERENCES account(id),
  pool_id     INT    NOT NULL REFERENCES gacha_pool(id),
  item_type   ENUM('hero','rune','pet') NOT NULL,
  item_id     INT    NOT NULL,
  is_pity     BOOLEAN NOT NULL DEFAULT FALSE,   -- 천장으로 획득했는지 여부
  pity_count_at_draw INT NOT NULL DEFAULT 0,   -- 당시 누적 횟수
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 유저별 가챠 풀 천장 카운터
CREATE TABLE account_gacha_pity (
  account_id  BIGINT NOT NULL REFERENCES account(id),
  pool_id     INT    NOT NULL REFERENCES gacha_pool(id),
  count       INT    NOT NULL DEFAULT 0,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id, pool_id)
);
```

---

### 7.8 구독 및 패스 (Subscription & Pass)

```sql
-- 구독 상품 정의
CREATE TABLE subscription_product (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  code        VARCHAR(64) NOT NULL UNIQUE,
  name        VARCHAR(64) NOT NULL,
  tier        ENUM('hunt_pass','vvip') NOT NULL,
  price_usd   DECIMAL(8,2) NOT NULL,
  duration_days INT NOT NULL DEFAULT 30,
  perks       JSON         -- 혜택 목록 (2x_speed, ad_free, daily_diamond 등)
);

-- 유저 구독 현황
CREATE TABLE account_subscription (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id     BIGINT NOT NULL REFERENCES account(id),
  product_id     INT    NOT NULL REFERENCES subscription_product(id),
  started_at     DATETIME NOT NULL,
  expires_at     DATETIME NOT NULL,
  is_active      BOOLEAN  NOT NULL DEFAULT TRUE,
  store          ENUM('google','apple') NOT NULL,
  store_order_id VARCHAR(128) NOT NULL UNIQUE
);

-- 배틀패스 시즌 정의
CREATE TABLE battle_pass_season (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  name        VARCHAR(64) NOT NULL,
  start_at    DATETIME    NOT NULL,
  end_at      DATETIME    NOT NULL,
  max_level   INT         NOT NULL DEFAULT 100
);

-- 배틀패스 보상 테이블
CREATE TABLE battle_pass_reward (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  season_id   INT  NOT NULL REFERENCES battle_pass_season(id),
  level       INT  NOT NULL,
  tier        ENUM('free','premium') NOT NULL,
  reward_type VARCHAR(64) NOT NULL,   -- 'currency', 'hero', 'skin', 'rune' 등
  reward_id   INT,
  reward_amount INT NOT NULL DEFAULT 1
);

-- 유저 배틀패스 진행 현황
CREATE TABLE account_battle_pass (
  account_id  BIGINT NOT NULL REFERENCES account(id),
  season_id   INT    NOT NULL REFERENCES battle_pass_season(id),
  level       INT    NOT NULL DEFAULT 0,
  exp         INT    NOT NULL DEFAULT 0,
  is_premium  BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (account_id, season_id)
);
```

---

### 7.9 구매 이력 (Purchase)

```sql
-- 인앱 결제 이력
CREATE TABLE purchase (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  account_id      BIGINT       NOT NULL REFERENCES account(id),
  store           ENUM('google','apple') NOT NULL,
  store_order_id  VARCHAR(128) NOT NULL UNIQUE,
  product_code    VARCHAR(64)  NOT NULL,
  amount_usd      DECIMAL(10,2) NOT NULL,
  status          ENUM('pending','completed','refunded','disputed') NOT NULL DEFAULT 'pending',
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at    DATETIME,
  refunded_at     DATETIME
);
```

---

### 7.10 테이블 관계 요약

```
account
  ├── account_device          (1:N)
  ├── account_currency        (1:N) ← currency_type
  ├── currency_transaction    (1:N) ← currency_type
  ├── account_hero            (1:N) ← hero, hero_skin
  ├── account_artifact        (1:N) ← artifact
  ├── account_rune            (1:N) ← rune
  ├── account_pet             (1:N) ← pet
  ├── gacha_log               (1:N) ← gacha_pool
  ├── account_gacha_pity      (1:N) ← gacha_pool
  ├── account_subscription    (1:N) ← subscription_product
  ├── account_battle_pass     (1:N) ← battle_pass_season
  └── purchase                (1:N)

gacha_pool
  └── gacha_pool_item         (1:N) → hero / rune / pet

battle_pass_season
  └── battle_pass_reward      (1:N)
```

---

## 8. 총평 및 시사점

### 8.1 아웃게임 시스템 강점 요약

| 항목 | 강점 |
|------|------|
| 진입 장벽 | 게스트 로그인, 무과금 플레이 가능 구조로 초반 이탈 최소화 |
| 수익화 | 구독(VVIP) + 가챠 + 광고의 3중 구조로 다양한 유저층에서 수익 확보 |
| 성장 시스템 | 영웅/유물/룬/펫의 다층 성장 구조로 장기 플레이 동기 유지 |
| 리텐션 | IP 오프라인 확장(콜라보, 팝업스토어)으로 게임 밖 경험 창출 |
| 타겟 확장 | 코어 + 하이퍼캐주얼 두 페르소나를 동시에 흡수하는 설계 |

### 8.2 구조적 문제점 및 리스크

| 항목 | 문제점 |
|------|--------|
| 확률 시스템 신뢰도 | 2026.02 오류 사태로 가챠 신뢰도 타격, 회복 미완료 |
| CS 대응 | 환불-정지 자동화 로직 오남용, 고객지원 응답 미흡 |
| 과금 격차 | 불멸 등급 추가로 무과금 유저와의 성능 격차 확대 |
| 게임 시간 | 한 판 플레이 시간이 길어 세션 부담 존재 |
| 플랫폼 제한 | 맥북 등 일부 플랫폼 미지원으로 유저층 제한 |

### 8.3 신규 게임 설계 시 참고할 포인트

1. **무과금 플레이 가능 구조 유지**: "즐길 수 있다"는 인식이 평점과 오가닉 다운로드에 직결된다.
2. **구독 모델의 시간 절약 가치**: 2배속 등 시간 퍼체이스 혜택은 성능 격차 없이 수익화할 수 있는 효과적인 방법이다.
3. **가챠 확률 로직 검증 필수**: 확률 오류는 신뢰도 회복 비용이 매우 크다. 실시간 모니터링 및 이중 검증 체계가 필요하다.
4. **CS 정책 명문화**: 환불/정지 정책을 명확히 공시하고 수동 검토 단계를 두어야 한다.
5. **메타 순환 설계**: 주기적 밸런스 패치로 새로운 과금 동기를 생성하되, 기존 투자 가치가 급격히 훼손되지 않도록 조율이 필요하다.
6. **오프라인 IP 확장 가능성 고려**: 게임 내 캐릭터와 세계관이 오프라인 굿즈/콜라보로 확장될 수 있는 설계가 장기 리텐션에 유리하다.

---

*문서 작성일: 2026년 4월*  
*분석 대상 버전: 2026년 1분기 기준*  
*인게임 시스템 분석은 별도 문서에서 다룸*
