import {forwardRef} from 'react';
import type {HTMLAttributes} from 'react';
import type {IconProps} from 'toolbar/components/icon/types';
import {iconSizes} from 'toolbar/components/icon/types';
import {useIconDefaultsContext} from 'toolbar/context/IconDefaultsContext';

export interface PlatformIconProps extends IconProps, HTMLAttributes<typeof HTMLElement> {}

const PlatformIconBase = forwardRef<HTMLDivElement, PlatformIconProps>(function PlatformIconBase(
  props: PlatformIconProps,
  ref
) {
  const {size: providedSize = 'sm', ...rest} = useIconDefaultsContext(props);

  const size = iconSizes[providedSize];

  return <div {...rest} style={{position: 'relative', width: size, height: size, ...props.style}} ref={ref} />;
});

export default PlatformIconBase;
