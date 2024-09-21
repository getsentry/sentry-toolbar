/* eslint-disable react-refresh/only-export-components */
import {createContext, useContext} from 'react';
import type {ComponentProps} from 'react';
import type SvgIcon from 'toolbar/components/icon/SvgIcon';

type Props = ComponentProps<typeof SvgIcon>;

const IconDefaultsContext = createContext<Props>({});

/**
 * Use this context provider to set default values for icons.
 */
export function IconDefaultsProvider({children, ...props}: Props) {
  return <IconDefaultsContext.Provider value={props}>{children}</IconDefaultsContext.Provider>;
}

/**
 * Provides default props for SVGIconProps via
 */
export function useIconDefaultsContext(props: Props) {
  return {
    ...useContext(IconDefaultsContext),
    ...props,
  };
}
