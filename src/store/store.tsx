import * as React from "react";
import { useReducer, createContext } from "react";
import type { ReactNode, Dispatch } from "react";

// Define generic types for our store
export type Action = { type: string; [key: string]: any };
export type Reducers<S, A> = Record<string, (state: S, action: A) => S>;

export interface StoreContextValue<S, A> {
  state: S;
  dispatch: Dispatch<A>;
}

export const Store = createContext<StoreContextValue<any, any> | undefined>(undefined);

export interface CreateStoreProviderProps<S, A> {
  initialState: S;
  reducers: Reducers<S, A>;
}

export const createStoreProvider = <S, A extends Action>({ 
  initialState, 
  reducers 
}: CreateStoreProviderProps<S, A>) => ({
  children,
}: {
  children: ReactNode;
}) => {
  const reducer = (state: S, action: A) => {
    const reducerFn = reducers[action.type];
    return reducerFn ? reducerFn(state, action) : state;
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>
      {children}
    </Store.Provider>
  );
};
