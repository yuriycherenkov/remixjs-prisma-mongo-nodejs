import type { IconType } from 'react-icons';

export interface IPricingPlan {
  title: string;
  price: string;
  perks: string[];
  icon: IconType;
}
