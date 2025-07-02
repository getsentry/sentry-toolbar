import type {Dispatch, ReactNode, SetStateAction} from 'react';
import {createContext, useContext, useState} from 'react';

export interface Coord {
  x: number;
  y: number;
}
type MaybeCoord = null | Coord;

const MousePositionContext = createContext<[MaybeCoord, Dispatch<SetStateAction<MaybeCoord>>]>([null, () => {}]);

export function MousePositionProvider({children}: {children: ReactNode}) {
  const state = useState<MaybeCoord>(null);
  return <MousePositionContext.Provider value={state}>{children}</MousePositionContext.Provider>;
}

export function useMousePositionContext() {
  return useContext(MousePositionContext);
}
