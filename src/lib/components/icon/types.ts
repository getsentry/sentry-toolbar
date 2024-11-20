const iconNumberSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 32,
} as const;

export const iconSizes = {
  xs: `${iconNumberSizes.xs}px`,
  sm: `${iconNumberSizes.sm}px`,
  md: `${iconNumberSizes.md}px`,
  lg: `${iconNumberSizes.lg}px`,
  xl: `${iconNumberSizes.xl}px`,
  xxl: `${iconNumberSizes.xxl}px`,
} as const;

export interface IconProps {
  className?: string;
  color?: string | 'currentColor';
  size?: keyof typeof iconSizes;
}
