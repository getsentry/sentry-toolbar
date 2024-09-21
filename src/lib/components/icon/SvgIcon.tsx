import {forwardRef} from 'react';
import {useIconDefaultsContext} from 'toolbar/context/IconDefaultsContext';

import type {SVGAttributes} from 'react';

const iconNumberSizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 72,
} as const;

const iconSizes = {
  xs: `${iconNumberSizes.xs}px`,
  sm: `${iconNumberSizes.sm}px`,
  md: `${iconNumberSizes.md}px`,
  lg: `${iconNumberSizes.lg}px`,
  xl: `${iconNumberSizes.xl}px`,
  xxl: `${iconNumberSizes.xxl}px`,
} as const;

export interface SvgIconProps extends SVGAttributes<SVGSVGElement> {
  className?: string;
  color?: string | 'currentColor';
  size?: keyof typeof iconSizes;
}

const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>((props: SvgIconProps, ref) => {
  const {
    color = 'currentColor',
    size: providedSize = 'sm',
    viewBox = '0 0 16 16',
    ...rest
  } = useIconDefaultsContext(props);

  const size = iconSizes[providedSize];

  return <svg {...rest} viewBox={viewBox} fill={color} height={size} width={size} ref={ref} />;
});

SvgIcon.displayName = 'SvgIcon';

export default SvgIcon;
