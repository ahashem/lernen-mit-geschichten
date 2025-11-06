/**
 * Trophy Cabinet System
 * 50+ unique trophies to earn from achievements and badges
 * Features: 3D display, materials (bronze-diamond), cabinet customization
 */

import type { Locale } from './i18n';
import { BADGES, type Badge, type BadgeRarity } from './badge-system';
import { achievementTracker } from './achievements';
import { starWallet } from './star-wallet';
import { confetti } from './confetti';
import { soundEffects } from './sound-effects';

export type TrophyMaterial = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'crystal';
export type TrophySize = 'small' | 'medium' | 'large' | 'mega';
export type TrophyShape = 'cup' | 'star' | 'medal' | 'statue' | 'special';
export type CabinetStyle = 'classic-wood' | 'modern-glass' | 'antique-bronze' | 'crystal-display' | 'space-station';
export type CabinetScene = 'study' | 'trophy-room' | 'museum' | 'treasure-vault';
export type CabinetLighting = 'warm' | 'cool' | 'spotlight' | 'rainbow';

// Map badge rarity to trophy material
export const RARITY_TO_MATERIAL: Record<BadgeRarity, TrophyMaterial> = {
  bronze: 'bronze',
  silver: 'silver',
  gold: 'gold',
  platinum: 'platinum',
  diamond: 'diamond',
};

// Trophy size based on badge series order or rarity
export function getTrophySize(badge: Badge): TrophySize {
  if (badge.rarity === 'diamond') return 'mega';
  if (badge.rarity === 'platinum') return 'large';
  if (badge.rarity === 'gold') return 'medium';
  return 'small';
}

// Trophy shape based on category
export function getTrophyShape(badge: Badge): TrophyShape {
  switch (badge.category) {
    case 'reading':
      return 'cup';
    case 'skill':
      return 'star';
    case 'activity':
      return 'medal';
    case 'challenge':
      return 'statue';
    case 'secret':
    case 'seasonal':
      return 'special';
    default:
      return 'cup';
  }
}

export interface Trophy {
  id: string;
  badgeId: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  material: TrophyMaterial;
  size: TrophySize;
  shape: TrophyShape;
  icon: string;
  isAnimated: boolean;
  isHolographic: boolean;
  earnedAt?: number;
  shelfPosition?: { shelf: number; slot: number }; // 5 shelves, 10 slots each
  relatedBadge: string;
  nextTier?: string; // ID of next tier trophy (for progressive achievements)
}

export interface CabinetCustomization {
  style: CabinetStyle;
  scene: CabinetScene;
  lighting: CabinetLighting;
  shelfMaterial: 'wood' | 'glass' | 'metal' | 'marble';
  unlockedStyles: CabinetStyle[];
}

export interface TrophyProgress {
  trophies: Map<string, Trophy>;
  earnedTrophies: Set<string>;
  shelfLayout: (string | null)[][]; // 5 shelves × 10 slots
  customization: CabinetCustomization;
  cabinetRotation: number; // Current rotation angle
  showcaseTrophy?: string; // Featured trophy ID
  statistics: {
    totalEarned: number;
    byMaterial: Record<TrophyMaterial, number>;
    bySize: Record<TrophySize, number>;
    byShape: Record<TrophyShape, number>;
    completedShelves: number;
  };
}

// Material colors and visual properties
export const MATERIAL_COLORS: Record<TrophyMaterial, {
  primary: string;
  secondary: string;
  glow: string;
  reflection: number; // 0-1
  shine: number; // 0-1
}> = {
  bronze: {
    primary: '#CD7F32',
    secondary: '#8B4513',
    glow: '#FFD700',
    reflection: 0.3,
    shine: 0.4,
  },
  silver: {
    primary: '#C0C0C0',
    secondary: '#808080',
    glow: '#E8E8E8',
    reflection: 0.6,
    shine: 0.7,
  },
  gold: {
    primary: '#FFD700',
    secondary: '#FFA500',
    glow: '#FFFF00',
    reflection: 0.7,
    shine: 0.8,
  },
  platinum: {
    primary: '#E5E4E2',
    secondary: '#B9F2FF',
    glow: '#00CED1',
    reflection: 0.8,
    shine: 0.9,
  },
  diamond: {
    primary: '#B9F2FF',
    secondary: '#4169E1',
    glow: '#00FFFF',
    reflection: 0.95,
    shine: 1.0,
  },
  crystal: {
    primary: '#FFFFFF',
    secondary: '#E0E0FF',
    glow: '#FF00FF',
    reflection: 1.0,
    shine: 1.0,
  },
};

// Cabinet style unlock conditions
export const CABINET_STYLE_REQUIREMENTS: Record<CabinetStyle, { trophies: number; description: Record<Locale, string> }> = {
  'classic-wood': {
    trophies: 0,
    description: {
      de: 'Standard-Holzschrank',
      ar: 'خزانة خشبية كلاسيكية',
      en: 'Classic wooden cabinet',
      tr: 'Klasik ahşap dolap',
      ur: 'کلاسک لکڑی کی الماری',
    },
  },
  'modern-glass': {
    trophies: 10,
    description: {
      de: 'Moderner Glasschrank',
      ar: 'خزانة زجاجية حديثة',
      en: 'Modern glass cabinet',
      tr: 'Modern cam dolap',
      ur: 'جدید شیشے کی الماری',
    },
  },
  'antique-bronze': {
    trophies: 25,
    description: {
      de: 'Antiker Bronze-Schrank',
      ar: 'خزانة برونزية عتيقة',
      en: 'Antique bronze cabinet',
      tr: 'Antik bronz dolap',
      ur: 'قدیم کانسی کی الماری',
    },
  },
  'crystal-display': {
    trophies: 40,
    description: {
      de: 'Kristall-Vitrine',
      ar: 'عرض كريستالي',
      en: 'Crystal display',
      tr: 'Kristal vitrin',
      ur: 'کرسٹل ڈسپلے',
    },
  },
  'space-station': {
    trophies: 50,
    description: {
      de: 'Raumstation',
      ar: 'محطة فضائية',
      en: 'Space station',
      tr: 'Uzay istasyonu',
      ur: 'خلائی اسٹیشن',
    },
  },
};

class TrophyCabinetManager {
  private storageKey = 'trophy-cabinet';
  private progress: TrophyProgress;

  constructor() {
    this.progress = this.loadProgress();
    this.syncWithBadges();
  }

  private loadProgress(): TrophyProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      return this.getDefaultProgress();
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        trophies: new Map(parsed.trophies || []),
        earnedTrophies: new Set(parsed.earnedTrophies || []),
        shelfLayout: parsed.shelfLayout || this.createEmptyShelfLayout(),
        customization: parsed.customization || this.getDefaultCustomization(),
        cabinetRotation: parsed.cabinetRotation || 0,
        showcaseTrophy: parsed.showcaseTrophy,
        statistics: parsed.statistics || this.getDefaultStatistics(),
      };
    } catch (error) {
      console.error('Failed to load trophy cabinet:', error);
      return this.getDefaultProgress();
    }
  }

  private getDefaultProgress(): TrophyProgress {
    return {
      trophies: new Map(),
      earnedTrophies: new Set(),
      shelfLayout: this.createEmptyShelfLayout(),
      customization: this.getDefaultCustomization(),
      cabinetRotation: 0,
      statistics: this.getDefaultStatistics(),
    };
  }

  private createEmptyShelfLayout(): (string | null)[][] {
    // 5 shelves, 10 slots each
    return Array(5).fill(null).map(() => Array(10).fill(null));
  }

  private getDefaultCustomization(): CabinetCustomization {
    return {
      style: 'classic-wood',
      scene: 'study',
      lighting: 'warm',
      shelfMaterial: 'wood',
      unlockedStyles: ['classic-wood'],
    };
  }

  private getDefaultStatistics() {
    return {
      totalEarned: 0,
      byMaterial: {
        bronze: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
        diamond: 0,
        crystal: 0,
      },
      bySize: {
        small: 0,
        medium: 0,
        large: 0,
        mega: 0,
      },
      byShape: {
        cup: 0,
        star: 0,
        medal: 0,
        statue: 0,
        special: 0,
      },
      completedShelves: 0,
    };
  }

  private saveProgress(): void {
    if (typeof window === 'undefined') return;

    const toSave = {
      trophies: Array.from(this.progress.trophies.entries()),
      earnedTrophies: Array.from(this.progress.earnedTrophies),
      shelfLayout: this.progress.shelfLayout,
      customization: this.progress.customization,
      cabinetRotation: this.progress.cabinetRotation,
      showcaseTrophy: this.progress.showcaseTrophy,
      statistics: this.progress.statistics,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(toSave));
  }

  /**
   * Sync trophies with badge system
   * Convert unlocked badges to trophies
   */
  private syncWithBadges(): void {
    // This would normally sync with the actual badge system
    // For now, create trophies from all possible badges
    BADGES.forEach((badge) => {
      if (!this.progress.trophies.has(badge.id)) {
        const trophy = this.createTrophyFromBadge(badge);
        this.progress.trophies.set(badge.id, trophy);
      }
    });
  }

  /**
   * Create a trophy from a badge
   */
  private createTrophyFromBadge(badge: Badge): Trophy {
    const material = RARITY_TO_MATERIAL[badge.rarity];
    const size = getTrophySize(badge);
    const shape = getTrophyShape(badge);

    return {
      id: badge.id,
      badgeId: badge.id,
      name: badge.name,
      description: badge.description,
      material,
      size,
      shape,
      icon: badge.icon,
      isAnimated: badge.rarity === 'platinum' || badge.rarity === 'diamond',
      isHolographic: badge.rarity === 'diamond',
      earnedAt: badge.earnedAt,
      relatedBadge: badge.id,
    };
  }

  /**
   * Award a trophy when a badge is unlocked
   */
  awardTrophy(badgeId: string): void {
    const trophy = this.progress.trophies.get(badgeId);
    if (!trophy || this.progress.earnedTrophies.has(badgeId)) {
      return;
    }

    // Mark as earned
    this.progress.earnedTrophies.add(badgeId);
    trophy.earnedAt = Date.now();

    // Find empty slot on shelf
    const position = this.findNextShelfPosition();
    if (position) {
      trophy.shelfPosition = position;
      this.progress.shelfLayout[position.shelf][position.slot] = badgeId;
    }

    // Update statistics
    this.progress.statistics.totalEarned++;
    this.progress.statistics.byMaterial[trophy.material]++;
    this.progress.statistics.bySize[trophy.size]++;
    this.progress.statistics.byShape[trophy.shape]++;

    // Check for completed shelves
    this.updateCompletedShelves();

    // Check for style unlocks
    this.checkStyleUnlocks();

    // Save progress
    this.saveProgress();

    // Trigger presentation ceremony
    this.presentTrophy(trophy);
  }

  /**
   * Find the next available shelf position
   */
  private findNextShelfPosition(): { shelf: number; slot: number } | null {
    for (let shelf = 0; shelf < 5; shelf++) {
      for (let slot = 0; slot < 10; slot++) {
        if (this.progress.shelfLayout[shelf][slot] === null) {
          return { shelf, slot };
        }
      }
    }
    return null;
  }

  /**
   * Update completed shelves count
   */
  private updateCompletedShelves(): void {
    let completed = 0;
    for (const shelf of this.progress.shelfLayout) {
      if (shelf.every(slot => slot !== null)) {
        completed++;
      }
    }
    this.progress.statistics.completedShelves = completed;
  }

  /**
   * Check and unlock cabinet styles
   */
  private checkStyleUnlocks(): void {
    const totalTrophies = this.progress.statistics.totalEarned;

    Object.entries(CABINET_STYLE_REQUIREMENTS).forEach(([style, req]) => {
      if (totalTrophies >= req.trophies &&
          !this.progress.customization.unlockedStyles.includes(style as CabinetStyle)) {
        this.progress.customization.unlockedStyles.push(style as CabinetStyle);

        // Notify user
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cabinetStyleUnlocked', {
            detail: { style, trophiesRequired: req.trophies },
          }));
        }
      }
    });
  }

  /**
   * Present trophy with ceremony animation
   */
  private presentTrophy(trophy: Trophy): void {
    if (typeof window === 'undefined') return;

    // Play trophy award sound
    soundEffects.play('trophy-award');

    // Show confetti
    confetti.trigger();

    // Dispatch event for presentation ceremony
    window.dispatchEvent(new CustomEvent('trophyAwarded', {
      detail: { trophy },
    }));

    // Award bonus stars based on trophy size
    const starBonus = {
      small: 10,
      medium: 25,
      large: 50,
      mega: 100,
    };
    starWallet.earn(starBonus[trophy.size], 'achievement-unlock');
  }

  /**
   * Get all trophies
   */
  getTrophies(): Trophy[] {
    return Array.from(this.progress.trophies.values());
  }

  /**
   * Get earned trophies only
   */
  getEarnedTrophies(): Trophy[] {
    return this.getTrophies().filter(t => this.progress.earnedTrophies.has(t.id));
  }

  /**
   * Get trophy by ID
   */
  getTrophy(id: string): Trophy | undefined {
    return this.progress.trophies.get(id);
  }

  /**
   * Check if trophy is earned
   */
  isTrophyEarned(id: string): boolean {
    return this.progress.earnedTrophies.has(id);
  }

  /**
   * Get shelf layout
   */
  getShelfLayout(): (string | null)[][] {
    return this.progress.shelfLayout;
  }

  /**
   * Get trophies on specific shelf
   */
  getTrophiesOnShelf(shelfIndex: number): (Trophy | null)[] {
    return this.progress.shelfLayout[shelfIndex].map(trophyId =>
      trophyId ? this.progress.trophies.get(trophyId) || null : null
    );
  }

  /**
   * Set cabinet rotation
   */
  rotateCabinet(angle: number): void {
    this.progress.cabinetRotation = angle % 360;
    this.saveProgress();
  }

  /**
   * Get current rotation
   */
  getRotation(): number {
    return this.progress.cabinetRotation;
  }

  /**
   * Set showcase trophy
   */
  setShowcaseTrophy(trophyId: string): void {
    if (this.progress.earnedTrophies.has(trophyId)) {
      this.progress.showcaseTrophy = trophyId;
      this.saveProgress();
    }
  }

  /**
   * Get showcase trophy
   */
  getShowcaseTrophy(): Trophy | undefined {
    return this.progress.showcaseTrophy
      ? this.progress.trophies.get(this.progress.showcaseTrophy)
      : undefined;
  }

  /**
   * Update customization
   */
  updateCustomization(updates: Partial<CabinetCustomization>): void {
    this.progress.customization = {
      ...this.progress.customization,
      ...updates,
    };
    this.saveProgress();
  }

  /**
   * Get customization
   */
  getCustomization(): CabinetCustomization {
    return this.progress.customization;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return this.progress.statistics;
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const total = this.progress.trophies.size;
    const earned = this.progress.earnedTrophies.size;
    return total > 0 ? Math.round((earned / total) * 100) : 0;
  }

  /**
   * Search trophies
   */
  searchTrophies(query: string, locale: Locale = 'de'): Trophy[] {
    const lowerQuery = query.toLowerCase();
    return this.getTrophies().filter(trophy =>
      trophy.name[locale].toLowerCase().includes(lowerQuery) ||
      trophy.description[locale].toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter trophies
   */
  filterTrophies(filters: {
    material?: TrophyMaterial;
    size?: TrophySize;
    shape?: TrophyShape;
    earnedOnly?: boolean;
  }): Trophy[] {
    let trophies = this.getTrophies();

    if (filters.earnedOnly) {
      trophies = trophies.filter(t => this.progress.earnedTrophies.has(t.id));
    }

    if (filters.material) {
      trophies = trophies.filter(t => t.material === filters.material);
    }

    if (filters.size) {
      trophies = trophies.filter(t => t.size === filters.size);
    }

    if (filters.shape) {
      trophies = trophies.filter(t => t.shape === filters.shape);
    }

    return trophies;
  }

  /**
   * Sort trophies
   */
  sortTrophies(trophies: Trophy[], sortBy: 'date' | 'rarity' | 'name', locale: Locale = 'de'): Trophy[] {
    return [...trophies].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (b.earnedAt || 0) - (a.earnedAt || 0);
        case 'rarity':
          const materialOrder = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'crystal'];
          return materialOrder.indexOf(b.material) - materialOrder.indexOf(a.material);
        case 'name':
          return a.name[locale].localeCompare(b.name[locale]);
        default:
          return 0;
      }
    });
  }

  /**
   * Take screenshot of cabinet
   */
  async takeScreenshot(): Promise<Blob | null> {
    if (typeof window === 'undefined') return null;

    const cabinet = document.querySelector('.trophy-cabinet-3d');
    if (!cabinet) return null;

    try {
      // Use html2canvas or similar library
      // For now, return null
      return null;
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      return null;
    }
  }

  /**
   * Export trophy collection data
   */
  exportCollection(): string {
    const data = {
      trophies: this.getEarnedTrophies().map(t => ({
        id: t.id,
        name: t.name,
        earnedAt: t.earnedAt,
        material: t.material,
        size: t.size,
      })),
      statistics: this.progress.statistics,
      completionPercentage: this.getCompletionPercentage(),
    };

    return JSON.stringify(data, null, 2);
  }
}

// Singleton instance
export const trophyCabinet = new TrophyCabinetManager();
