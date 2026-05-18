// ─── 열거형 ───────────────────────────────────────────────────────────────────

export type TileRank = 'BASIC' | 'NORMAL' | 'ENHANCED' | 'POWERFUL' | 'LETHAL' | 'TRANSCENDENT';
export type StageType = 'NORMAL' | 'ELITE' | 'BOSS';
export type EnemyType = 'NORMAL' | 'ELITE' | 'BOSS';
export type CardEffectType = 'ATTACK' | 'HEAL' | 'BUFF' | 'DEBUFF';
export type TargetType = 'SINGLE_ENEMY' | 'ALL_ENEMIES' | 'SINGLE_ALLY' | 'ALL_ALLIES';
export type ActionType = 'ATTACK_SINGLE' | 'ATTACK_AOE' | 'DEBUFF' | 'BUFF_SELF';
export type TargetMode = 'SINGLE' | 'ALL';

// ─── 기획 테이블 ──────────────────────────────────────────────────────────────

export interface Stage {
  id: string;
  chapterId: string;
  orderInChapter: number;
  stageType: StageType;
  maxSlides: number;
  tileSpawnConfig: { values: number[]; weights: number[] };
  monsters: { monsterId: string; position: number }[];
}

export interface Character {
  id: string;
  name: string;
  baseHp: number;
  isDlc: boolean;
}

export interface EffectParams {
  targetType: TargetType;
  damage?: number;
  healAmount?: number;
  buffId?: string;
  debuffId?: string;
  duration?: number;
}

export interface Card {
  id: string;
  ownerCharacterId: string;
  name: string;
  tileRank: TileRank;
  effectType: CardEffectType;
  effectParams: EffectParams;
  upgradedTileRank?: TileRank;
}

export interface EnemyAction {
  actionType: ActionType;
  targetMode: TargetMode;
  power: number;
  effectId?: string;
  effectDuration?: number;
  resetCount: number;
  scheduledTurns?: number[];
}

export interface ActionPattern {
  initialCount: number;
  actions: EnemyAction[];
  defaultAction: EnemyAction;
}

export interface PhaseThreshold {
  phaseNumber: number;
  triggerValue: number;
  actionPattern: ActionPattern;
  transitionAction?: EnemyAction;
}

export interface Monster {
  id: string;
  displayName: string;
  enemyType: EnemyType;
  maxHp: number;
  initialShield: number;
  actionPattern: ActionPattern;
  phaseThresholds?: PhaseThreshold[];
}
