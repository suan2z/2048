# 문서화 계획

> 작성일: 2026-04-15  
> 채택 컨셉: **안 C — 2048 에너지 보드 × 덱 카드 RPG**

---

## 현황 요약

| 문서 | 상태 | 비고 |
|------|------|------|
| `docs/index.md` | 완성 | 게임 개요 및 문서 구조 정리됨 |
| `docs/concepts/index.md` | 완성 | 3개 안 비교표 완비 |
| `docs/concepts/concept_C.md` | 완성 | 채택 안. 전투 메커니즘·성장·패시브·유물 예시 포함 |
| `docs/concepts/concept_A.md` | 완성 | 참고용 (미채택) |
| `docs/concepts/concept_B.md` | 완성 | 참고용 (미채택) |
| `docs/concepts/executors.md` | 완성 | 참고용 세계관 안 (미채택) |
| `docs/concepts/nightmare.md` | 완성 | 참고용 세계관 안 (미채택) |
| `docs/concepts/prison.md` | 완성 | 참고용 세계관 안 (미채택) |
| `docs/references/limbus.md` | 완성 | 림버스컴퍼니 심층 분석 레퍼런스 |
| `docs/references/chaos_zero_nightmare.md` | 완성 | 카제나 심층 분석 레퍼런스 |
| `docs/systems/overview.md` | **플레이스홀더** | 테이블·섹션 제목만 존재, 내용 없음 |
| `docs/schema.md` | **플레이스홀더** | ERD·테이블 모두 빈 템플릿 |
| `docs/ux.md` | **플레이스홀더** | 화면 목록·흐름도 빈 템플릿 |
| `docs/resources.md` | **플레이스홀더** | 아트/사운드 목록 전부 `-` |
| `docs/systems/board.md` | **누락** | 2048 보드 규칙 상세 문서 없음 |
| `docs/systems/card.md` | **누락** | 카드 시스템 상세 (덱·드로우·강화) 없음 |
| `docs/systems/combat.md` | **누락** | 전투 흐름·턴 구조·위기 처리 없음 |
| `docs/systems/enemy.md` | **누락** | 적 행동 카운트·예고 시스템·적 유형 없음 |
| `docs/systems/growth.md` | **누락** | 레벨업 패시브·유물 시스템 상세 없음 |
| `docs/systems/party.md` | **누락** | 파티 연계 발동·3인 구성 규칙 없음 |
| `docs/world.md` | **누락** | 세계관·스토리 챕터 구조 없음 |
| `docs/characters.md` | **누락** | 캐릭터 목록·역할·고유 스킬 없음 |
| `docs/balance.md` | **누락** | 숫자 밸런스 설계 (타일 수치·카드 등급표) 없음 |
| `docs/progression.md` | **누락** | 챕터 진행 구조·난이도 곡선·엔딩 분기 없음 |

---

## 우선순위 작업 목록

### 높음 — 핵심 시스템 (게임 플레이에 직접 영향)

1. **`docs/systems/board.md` 신규 작성**  
   2048 보드의 모든 규칙 — 타일 생성 조건, 슬라이드 방향별 동작, 병합 규칙, 보드 꽉 참 판정, 행동 불능 조건, 보드 크기 기본값(4×4)과 확장 방식.  
   참고: `concept_C.md` §전투 시스템 > 보드 슬라이드와 행동 카운트

2. **`docs/systems/combat.md` 신규 작성**  
   전투 시작부터 종료까지의 단계별 흐름 — 보드 초기화, 드로우, 슬라이드 → 카운트 소모 → 타일 완성 → 카드 발동 → 적 행동 → 전투 종료 조건. 위기 상황(행동 불능) 처리 규칙 포함.  
   참고: `concept_C.md` §코어 루프, §보드 위기 상황

3. **`docs/systems/card.md` 신규 작성**  
   카드 정의 — 발동 숫자, 등급(4/8/16/32/64/128), 카드 사용 흐름(타일 소모 → 효과 발동). 덱 구성 규칙(3인 파티 합산), 초기 드로우 5장, 드로우 타이밍, 카드 강화(2장 합성), 카드 보상 선택 방식.  
   참고: `concept_C.md` §스킬 카드와 발동 조건, §덱 성장

4. **`docs/systems/enemy.md` 신규 작성**  
   적 행동 카운트 구조 — 카운트 초기값 범위, 슬라이드당 감소 폭, 카운트 0 도달 시 행동 실행 → 리셋 규칙. 행동 예고 UI 정보 항목(행동 유형, 수치, 대상). 적 유형 분류 기준(일반·엘리트·보스).  
   참고: `concept_C.md` §적 행동 예고, §핵심 긴장 구조

5. **`docs/systems/overview.md` 보완**  
   현재 플레이스홀더만 존재. 핵심 시스템 목록 표(보드·전투·카드·적 AI·성장·파티)와 각 시스템 하위 문서 링크로 채움.  
   참고: 위 신규 문서 작성 후 링크 연결

---

### 중간 — 보조 시스템 (플레이어 경험에 영향)

6. **`docs/systems/party.md` 신규 작성**  
   3인 파티 고정 구조, 공용 덱 드로우 풀 생성 방식, 파티 연계 발동 조건(슬라이드 없이 연속 카드 발동), 연계 보너스 규칙, 연계 시 타일 2개 소모 처리.  
   참고: `concept_C.md` §파티 연계 발동

7. **`docs/systems/growth.md` 신규 작성**  
   레벨업 패시브 선택 구조(3종 중 택 1), 패시브 목록 및 효과 상세. 유물 시스템 — 획득 조건(챕터 보스), 효과 분류(보드 규칙 변경 / 카드 조건 변경), 유물 목록 초안.  
   참고: `concept_C.md` §캐릭터 레벨 패시브, §유물

8. **`docs/characters.md` 신규 작성**  
   캐릭터 목록(최소 3인 파티 구성원), 각 캐릭터의 역할(딜·지원·탱), 고유 카드 계열, 고유 패시브 방향성. 세계관 연결 최소 설명 포함.  
   참고: `concept_C.md` 전체 (캐릭터 구체 설정은 신규 기획 필요)

9. **`docs/progression.md` 신규 작성**  
   챕터 진행 구조 — 챕터 수, 챕터별 구성(일반 전투 → 엘리트 → 보스), 거점 귀환 루틴(덱 편집·강화). 난이도 곡선 설계(초반 낮은 카운트·낮은 숫자 → 후반 짧은 카운트·높은 숫자). 엔딩 분기 조건.  
   참고: `concept_C.md` §패키지 게임 특성 반영, §코어 루프

10. **`docs/ux.md` 보완**  
    화면 목록 — 전투 화면(보드·손패·적 상태·카운트 표시), 덱 편집 화면, 챕터 맵, 유물/패시브 선택 화면. 화면 전환 흐름도 작성.  
    참고: `concept_C.md` 보드 다이어그램, 레퍼런스 `limbus.md` §UX 분석

---

### 낮음 — 참고·보조 자료

11. **`docs/world.md` 신규 작성**  
    세계관 기본 설정 — 배경, 적 존재(이형·괴이)의 성격, 챕터별 스토리 주제. 서사와 시스템 연결 방식(카드 = 캐릭터 능력 서사화 등).  
    참고: `concepts/executors.md`, `concepts/prison.md`, `concepts/nightmare.md` (세계관 후보 참고)

12. **`docs/balance.md` 신규 작성**  
    수치 설계 초안 — 타일 수치 분포(2·4·8·16·32·64·128), 슬라이드당 생성 타일 수, 카운트 초기값 범위(챕터별), 카드 등급별 기대 데미지/효과 수치, 덱 규모 상한.  
    참고: `concept_C.md` §스킬 카드 등급표, §성장 시스템

13. **`docs/schema.md` 보완**  
    핵심 엔티티 ERD — Card, Deck, BoardState, Enemy, Character, Relic, PassiveSkill, ChapterProgress. 각 테이블 컬럼 정의.  
    참고: `docs/systems/` 문서 완성 후 작성 권장

14. **`docs/resources.md` 보완**  
    아트·사운드·폰트 리소스 목록 채우기 — AI 생성 리소스 활용 방침, 캐릭터 일러스트 수량 계획, 보드 UI 에셋 목록, BGM 분위기 방향.  
    참고: `concepts/executors.md` §AI 리소스 활용

---

## doc-writer 호출 가이드

각 항목을 doc-writer에게 위임할 때 전달할 컨텍스트:

### 1순위: `docs/systems/board.md`
- **파일**: `docs/systems/board.md` (신규)
- **섹션**: 보드 초기화, 타일 생성 규칙, 슬라이드 동작, 병합 규칙, 행동 불능 판정, 보드 확장 방식
- **참고 문서**: `docs/concepts/concept_C.md` §전투 시스템 > 보드 슬라이드와 행동 카운트, §보드 위기 상황

### 2순위: `docs/systems/combat.md`
- **파일**: `docs/systems/combat.md` (신규)
- **섹션**: 전투 시작 조건, 턴 구조(슬라이드 페이즈·카드 발동 페이즈·적 행동 페이즈), 전투 종료 조건, 보드 위기 처리
- **참고 문서**: `docs/concepts/concept_C.md` §코어 루프, §보드 위기 상황, `docs/systems/board.md`

### 3순위: `docs/systems/card.md`
- **파일**: `docs/systems/card.md` (신규)
- **섹션**: 카드 구조(발동 숫자·등급·효과 유형), 덱 구성 규칙, 드로우 타이밍, 발동 조건, 카드 강화
- **참고 문서**: `docs/concepts/concept_C.md` §스킬 카드와 발동 조건, §덱 성장

### 4순위: `docs/systems/enemy.md`
- **파일**: `docs/systems/enemy.md` (신규)
- **섹션**: 행동 카운트 구조, 행동 예고 UI 항목, 적 유형 분류, 보스 기믹 방향성
- **참고 문서**: `docs/concepts/concept_C.md` §적 행동 예고, §핵심 긴장 구조

### 5순위: `docs/systems/overview.md`
- **파일**: `docs/systems/overview.md` (보완)
- **섹션**: 핵심 시스템 목록 표 채우기, 하위 문서 링크 연결
- **참고 문서**: `docs/systems/board.md`, `docs/systems/combat.md`, `docs/systems/card.md`, `docs/systems/enemy.md`
