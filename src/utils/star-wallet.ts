/**
 * Star Wallet System
 * Manages star currency, transactions, and earning/spending mechanics
 */

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  timestamp: number;
  itemId?: string;
}

export interface StarWallet {
  total: number; // Total stars earned all-time
  spent: number; // Total stars spent
  current: number; // Available balance
  transactions: Transaction[];
}

export type EarnReason =
  | 'quiz-completion'
  | 'perfect-quiz'
  | 'story-read'
  | 'daily-challenge'
  | 'achievement-unlock'
  | 'easter-egg'
  | 'story-created'
  | 'story-shared'
  | 'streak-milestone'
  | 'first-story'
  | 'language-explorer'
  | 'refund';

export const EARN_AMOUNTS: Record<EarnReason, number> = {
  'quiz-completion': 5,
  'perfect-quiz': 10,
  'story-read': 3,
  'daily-challenge': 10,
  'achievement-unlock': 15,
  'easter-egg': 2,
  'story-created': 20,
  'story-shared': 10,
  'streak-milestone': 25,
  'first-story': 10,
  'language-explorer': 5,
  refund: 0, // Variable amount
};

export class StarWalletManager {
  private storageKey = 'star-wallet';
  private wallet: StarWallet;

  constructor() {
    this.wallet = this.loadWallet();
  }

  private loadWallet(): StarWallet {
    if (typeof window === 'undefined') {
      return this.getDefaultWallet();
    }

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      return this.getDefaultWallet();
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        total: parsed.total || 0,
        spent: parsed.spent || 0,
        current: parsed.current || 0,
        transactions: parsed.transactions || [],
      };
    } catch (error) {
      console.error('Failed to load star wallet:', error);
      return this.getDefaultWallet();
    }
  }

  private getDefaultWallet(): StarWallet {
    return {
      total: 0,
      spent: 0,
      current: 0,
      transactions: [],
    };
  }

  private saveWallet(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.wallet));
  }

  /**
   * Earn stars
   */
  earnStars(reason: EarnReason, customAmount?: number): number {
    const amount = customAmount || EARN_AMOUNTS[reason];

    const transaction: Transaction = {
      id: `earn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'earn',
      amount,
      reason,
      timestamp: Date.now(),
    };

    this.wallet.total += amount;
    this.wallet.current += amount;
    this.wallet.transactions.push(transaction);
    this.saveWallet();

    // Dispatch event for UI updates
    this.dispatchWalletUpdate('earn', amount, reason);

    return amount;
  }

  /**
   * Spend stars (for shop purchases)
   */
  spendStars(amount: number, itemId: string, itemName: string): boolean {
    if (this.wallet.current < amount) {
      return false; // Insufficient balance
    }

    const transaction: Transaction = {
      id: `spend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'spend',
      amount,
      reason: `Shop purchase: ${itemName}`,
      timestamp: Date.now(),
      itemId,
    };

    this.wallet.current -= amount;
    this.wallet.spent += amount;
    this.wallet.transactions.push(transaction);
    this.saveWallet();

    // Dispatch event for UI updates
    this.dispatchWalletUpdate('spend', amount, itemName);

    return true;
  }

  /**
   * Refund a purchase (within 5 minutes)
   */
  refundPurchase(transactionId: string): boolean {
    const transaction = this.wallet.transactions.find(t => t.id === transactionId);

    if (!transaction || transaction.type !== 'spend') {
      return false;
    }

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    if (transaction.timestamp < fiveMinutesAgo) {
      return false; // Too late for refund
    }

    // Create refund transaction
    const refund: Transaction = {
      id: `refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'earn',
      amount: transaction.amount,
      reason: `Refund: ${transaction.reason}`,
      timestamp: Date.now(),
      itemId: transaction.itemId,
    };

    this.wallet.current += transaction.amount;
    this.wallet.spent -= transaction.amount;
    this.wallet.transactions.push(refund);
    this.saveWallet();

    return true;
  }

  /**
   * Get current balance
   */
  getBalance(): number {
    return this.wallet.current;
  }

  /**
   * Get total earned
   */
  getTotalEarned(): number {
    return this.wallet.total;
  }

  /**
   * Get total spent
   */
  getTotalSpent(): number {
    return this.wallet.spent;
  }

  /**
   * Get transaction history
   */
  getTransactions(type?: 'earn' | 'spend', limit?: number): Transaction[] {
    let transactions = [...this.wallet.transactions].sort((a, b) => b.timestamp - a.timestamp);

    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    if (limit) {
      transactions = transactions.slice(0, limit);
    }

    return transactions;
  }

  /**
   * Get recent refundable purchases (within 5 minutes)
   */
  getRefundablePurchases(): Transaction[] {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return this.wallet.transactions.filter(
      t => t.type === 'spend' && t.timestamp >= fiveMinutesAgo
    );
  }

  /**
   * Check if can afford item
   */
  canAfford(price: number): boolean {
    return this.wallet.current >= price;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalEarned: number;
    totalSpent: number;
    currentBalance: number;
    transactionCount: number;
    avgEarnPerTransaction: number;
    avgSpendPerTransaction: number;
    biggestEarn: number;
    biggestSpend: number;
  } {
    const earns = this.wallet.transactions.filter(t => t.type === 'earn');
    const spends = this.wallet.transactions.filter(t => t.type === 'spend');

    return {
      totalEarned: this.wallet.total,
      totalSpent: this.wallet.spent,
      currentBalance: this.wallet.current,
      transactionCount: this.wallet.transactions.length,
      avgEarnPerTransaction: earns.length > 0
        ? earns.reduce((sum, t) => sum + t.amount, 0) / earns.length
        : 0,
      avgSpendPerTransaction: spends.length > 0
        ? spends.reduce((sum, t) => sum + t.amount, 0) / spends.length
        : 0,
      biggestEarn: earns.length > 0
        ? Math.max(...earns.map(t => t.amount))
        : 0,
      biggestSpend: spends.length > 0
        ? Math.max(...spends.map(t => t.amount))
        : 0,
    };
  }

  /**
   * Reset wallet (for testing/demo)
   */
  reset(): void {
    this.wallet = this.getDefaultWallet();
    this.saveWallet();
  }

  /**
   * Dispatch custom event for wallet updates
   */
  private dispatchWalletUpdate(type: 'earn' | 'spend', amount: number, reason: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('star-wallet-update', {
          detail: {
            type,
            amount,
            reason,
            balance: this.wallet.current,
          },
        })
      );
    }
  }
}

// Global instance
export const starWallet = new StarWalletManager();
