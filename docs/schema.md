# 스키마 설계

> 현재 문서는 **1단계 — 보드 시스템** 구현에 필요한 데이터 구조만 정의합니다.  
> 카드·전투·적 AI·파티·성장 시스템의 스키마는 각 시스템 문서 완성 후 추가될 예정입니다.  
> 구조체 동작 상세는 [`docs/systems/board.md`](systems/board.md)를 참조하십시오.

---

## 구조체 목록

| 구조체 | 분류 | 설명 |
|--------|------|------|
| [`BoardState`](#boardstate) | 런타임 상태 | 전투 중 보드 전체 상태를 관리하는 최상위 구조체 |
| [`Tile`](#tile) | 연산 임시 | 슬라이드 연산 중 타일 단위 데이터를 표현하는 임시 구조체 |
| [`StageConfig`](#stageconfig) | 정적 설정 | 스테이지별 보드 관련 설정값. 전투 시작 시 `BoardState`에 주입 |
| [`TileSpawnConfig`](#tilespawnconfig) | 정적 설정 | `StageConfig`에 포함되는 타일 생성 규칙 |

---

## ERD

```
┌──────────────────────────┐          ┌────────────────────────────────┐
│        StageConfig       │          │          TileSpawnConfig        │
├──────────────────────────┤  1 ── 1  ├────────────────────────────────┤
│ maxSlides: number        │──────────│ values:  number[]              │
│ tileSpawnConfig          │          │ weights: number[]              │
└──────────────────────────┘          └────────────────────────────────┘
            │ 전투 시작 시 주입
            ▼
┌──────────────────────────────────────────────────────────┐
│                        BoardState                        │
├──────────────────────────────────────────────────────────┤
│ board:           number[][]  (4×4, 빈 칸 = 0)           │
│ slideCount:      number                                  │
│ maxSlides:       number      ← StageConfig에서 주입      │
│ isSlideBlocked:  boolean                                 │
└──────────────────────────────────────────────────────────┘
            │ 슬라이드 연산 시작 시 변환
            ▼
┌──────────────────────────┐
│           Tile           │
├──────────────────────────┤   슬라이드 완료 후
│ value:           number  │──────────────────▶ 정수값만 board[][]에 반환
│ mergedThisTurn:  boolean │   mergedThisTurn 전체 false 초기화
└──────────────────────────┘
```

**관계 설명**

| 관계 | 설명 |
|------|------|
| `StageConfig` → `BoardState` | 전투 시작 시 `StageConfig.maxSlides`가 `BoardState.maxSlides`로 주입된다. `StageConfig` 자체는 런타임에 보존되지 않는다. |
| `StageConfig` → `TileSpawnConfig` | `StageConfig`가 `tileSpawnConfig` 필드로 `TileSpawnConfig`를 포함한다 (컴포지션). |
| `BoardState.board` → `Tile` | 슬라이드 연산 진입 시 `board[r][c]` 정수값을 `Tile` 객체로 변환하여 처리한다. 연산 완료 후 다시 정수값으로 평탄화한다. |

---

## 구조체 상세

### BoardState

전투 중 보드 전체 상태를 관리하는 최상위 런타임 구조체.  
슬라이드 처리, 횟수 관리, 불능 감지 등 모든 보드 연산의 기준 데이터를 보유한다.

> 상세 동작: [`docs/systems/board.md` §2-4. BoardState 구조체](systems/board.md)

| 필드 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| `board` | `number[][]` | 4×4 전체 `0` | 4행 × 4열 정수 배열. 빈 칸은 `0`, 타일이 있는 칸은 `2` 이상의 양의 정수. |
| `slideCount` | `number` | `maxSlides` 값 | 현재 턴에 남은 슬라이드 횟수. 유효 슬라이드 확정 시 1 감소. `0`이 되면 슬라이드 입력 차단. |
| `maxSlides` | `number` | `StageConfig.maxSlides` | 스테이지에서 설정된 턴당 최대 슬라이드 횟수. 액션 버튼 처리 완료 → 새 핸드 드로우 완료 후 `slideCount`를 이 값으로 초기화. 코드에 하드코딩하지 않는다. |
| `isSlideBlocked` | `boolean` | `false` | 슬라이드 불능 상태 여부. 4방향 모두 무효 슬라이드일 때 `true`. `true`이면 슬라이드 입력 차단. `slideCount === 0`에 의한 차단과 독립적으로 동작. |

**제약 조건**

| 항목 | 규칙 |
|------|------|
| `board` 크기 | 기본 4×4. 유물·패시브에 의해 확장 가능(예: 5×5). 확장 시 배열 크기와 슬라이드 알고리즘 순회 범위를 함께 변경. |
| `board` 원소 | `0` 또는 `2`의 거듭제곱 양의 정수 (`2, 4, 8, 16, 32, 64, 128, …`). 다른 값은 허용하지 않는다. |
| `slideCount` | `0` 이상 `maxSlides` 이하. 음수가 되지 않도록 감소 전 `0` 여부를 확인. |
| `maxSlides` | 양의 정수. `0`이면 슬라이드 불가 스테이지로 동작. 스테이지 데이터에서 주입. |

---

### Tile

슬라이드 연산 중에만 사용하는 임시 구조체.  
`board[r][c]` 정수값을 연산 진입 시 `Tile` 객체로 변환하고, 슬라이드 완료 후 다시 정수값으로 평탄화한다.

> 상세 동작: [`docs/systems/board.md` §2-2. 타일 단위 데이터](systems/board.md)

| 필드 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| `value` | `number` | 변환 원본 정수 | 타일의 숫자 값. `2`의 거듭제곱 (`2, 4, 8, 16, 32, 64, 128, …`). 병합 시 두 배가 된다. |
| `mergedThisTurn` | `boolean` | `false` | 현재 슬라이드에서 이미 병합된 타일이면 `true`. 연쇄 병합 차단에 사용. 슬라이드 1회 완료 시 보드 전체에서 `false`로 초기화. |

**사용 흐름**

```
슬라이드 연산 진입
  → board[r][c] (정수) → Tile { value, mergedThisTurn: false } 변환
  → 이동 + 병합 처리
      병합 발생 시: 앞쪽 타일 value × 2, mergedThisTurn = true
                   뒤쪽 타일 제거
  → 결과 배열을 board[r][c] (정수) 로 평탄화
  → 보드 전체 Tile.mergedThisTurn = false 초기화
```

**제약 조건**

| 항목 | 규칙 |
|------|------|
| 병합 조건 | `value`가 동일하고, 두 타일 모두 `mergedThisTurn === false`일 때만 병합. |
| 연쇄 병합 | 불허. `mergedThisTurn === true`인 타일은 같은 슬라이드 내에서 재병합 대상이 되지 않는다. |
| 빈 칸 표현 | `Tile` 없음(배열에서 제거). 슬라이드 연산 중 빈 칸은 `Tile` 객체를 생성하지 않고 공간을 비워 둔다. |

---

### StageConfig

스테이지별 보드 관련 설정값을 정의하는 정적 설정 구조체.  
전투 시작 시 `BoardState`에 값을 주입하고 역할을 마친다.

> 이 구조체는 보드 관련 항목만 포함합니다. 적 구성, 스토리 이벤트 등 다른 스테이지 설정은 추후 추가될 예정입니다.

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `maxSlides` | `number` | 스테이지별 기획값 | 해당 스테이지의 턴당 최대 슬라이드 횟수. 전투 시작 시 `BoardState.maxSlides`로 주입된다. |
| `tileSpawnConfig` | `TileSpawnConfig` | `{ values: [2], weights: [1] }` | 해당 스테이지의 타일 생성 규칙. 상세는 [`TileSpawnConfig`](#tilespawnconfig) 참조. |

**제약 조건**

| 항목 | 규칙 |
|------|------|
| `maxSlides` | 양의 정수. `0` 설정 시 해당 스테이지에서는 슬라이드를 사용할 수 없다. |
| `tileSpawnConfig` | 반드시 유효한 `TileSpawnConfig` 인스턴스를 포함해야 한다. `null` 허용하지 않음. |

---

### TileSpawnConfig

슬라이드 완료 후 새 타일 생성 시 어떤 값의 타일을 어떤 확률로 생성할지를 정의하는 구조체.  
`StageConfig`에 포함되어 스테이지별로 타일 생성 분포를 다르게 설정할 수 있다.

> 상세 동작: [`docs/systems/board.md` §4-3. 생성 값](systems/board.md)

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `values` | `number[]` | `[2]` | 생성 가능한 타일 값 목록. 각 원소는 `2`의 거듭제곱이어야 한다. |
| `weights` | `number[]` | `[1]` | `values`의 각 값에 대응하는 생성 가중치. `values`와 반드시 같은 길이여야 한다. 가중치가 높을수록 해당 값의 타일이 더 자주 생성된다. |

**가중치 해석 예시**

| `values` | `weights` | 동작 |
|----------|-----------|------|
| `[2]` | `[1]` | 항상 `2` 생성 (초기 구현 단계 기본값) |
| `[2, 4]` | `[3, 1]` | `2` 75%, `4` 25% 확률로 생성 |
| `[2, 4, 8]` | `[6, 3, 1]` | `2` 60%, `4` 30%, `8` 10% 확률로 생성 |

**제약 조건**

| 항목 | 규칙 |
|------|------|
| 배열 길이 | `values.length === weights.length`. 길이가 다르면 오류 처리. |
| `values` 원소 | `2`의 거듭제곱인 양의 정수. (`2, 4, 8, 16, …`). |
| `weights` 원소 | 양의 정수. `0` 이하 허용하지 않음. |
| 최소 항목 수 | `values`는 최소 1개 이상의 원소를 포함해야 한다. |

---

## 향후 추가 예정 구조체

다음 구조체는 각 시스템 문서 완성 후 이 파일에 추가됩니다.

| 구조체 | 관련 시스템 | 참고 문서 |
|--------|------------|-----------|
| `Card` | 카드 | `docs/systems/card.md` (작성 예정) |
| `Deck` | 카드 | `docs/systems/card.md` (작성 예정) |
| `Enemy` | 적 AI | `docs/systems/enemy.md` (작성 예정) |
| `Character` | 파티 | `docs/systems/party.md` (작성 예정) |
| `Relic` | 성장 | `docs/systems/growth.md` (작성 예정) |
| `PassiveSkill` | 성장 | `docs/systems/growth.md` (작성 예정) |
| `ChapterProgress` | 진행 | `docs/progression.md` (작성 예정) |
| `CombatState` | 전투 | `docs/systems/combat.md` (작성 예정) |
