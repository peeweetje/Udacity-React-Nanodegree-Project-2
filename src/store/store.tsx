import * as React from "react";
import { useReducer, createContext } from "react";
import type { ReactNode, Dispatch } from "react";

// Define generic types for our store
export type Action = { type: string; [key: string]: any };
export type ThunkAction = (dispatch: Dispatch<any>) => Promise<any> | void;
export type Reducers<S, A> = Record<string, (state: S, action: A) => S>;

export interface StoreContextValue<S, A> {
  state: S;
  dispatch: Dispatch<A | ThunkAction>;
}

export const Store = createContext<StoreContextValue<any, any> | undefined>(undefined);

export function useDispatch() {
  const context = React.useContext(Store);
  if (!context) {
    throw new Error('useDispatch must be used within Store Provider');
  }
  return context.dispatch;
}

export function useSelector<T>(selector: (state: any) => T): T {
  const context = React.useContext(Store);
  if (!context) {
    throw new Error('useSelector must be used within Store Provider');
  }
  return selector(context.state);
}

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
