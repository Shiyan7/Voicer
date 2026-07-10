export interface SpritesMap {
  common: 'chart';
  'crypto-logo': 'bnb' | 'btc' | 'eth' | 'solana';
}
export const SPRITES_META = {
  common: ['chart'],
  'crypto-logo': ['bnb', 'btc', 'eth', 'solana'],
} satisfies {
  common: Array<'chart'>;
  'crypto-logo': Array<'bnb' | 'btc' | 'eth' | 'solana'>;
};
