/* eslint-disable react-refresh/only-export-components */
import type {ReactNode} from 'react';
import {createContext, useContext} from 'react';
import type {IconProps} from 'toolbar/components/icon/types';
const IconDefaultsContext = createContext<IconProps>({});

/**
 * Use this context provider to set default values for icons.
 */
export function IconDefaultsProvider({children, ...props}: IconProps & {children: ReactNode}) {
  return <IconDefaultsContext.Provider value={props}>{children}</IconDefaultsContext.Provider>;
}

/**
 * Provides default props for SVGIconProps via
 */
export function useIconDefaultsContext(props: IconProps) {
  return {
    ...useContext(IconDefaultsContext),
    ...props,
  };
}
