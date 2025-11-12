import type {SVGAttributes} from 'react';
import type {IconProps} from 'toolbar/components/icon/types';
import {iconSizes} from 'toolbar/components/icon/types';
import {useIconDefaultsContext} from 'toolbar/context/IconDefaultsContext';

export interface SVGIconProps extends IconProps, SVGAttributes<SVGSVGElement> {}

export default function SVGIconBase(props: SVGIconProps) {
  const {color = 'currentColor', size: providedSize = 'sm', ...rest} = useIconDefaultsContext(props);

  const size = iconSizes[providedSize];

  return <svg viewBox="0 0 16 16" {...rest} fill={color} height={size} width={size} />;
}
