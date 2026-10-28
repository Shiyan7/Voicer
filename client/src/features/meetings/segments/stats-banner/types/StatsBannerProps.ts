import { StatTile } from '../../../types/StatTile';

export interface StatsBannerProps {
  greeting: string;
  tiles: StatTile[];
  isLoading: boolean;
}
