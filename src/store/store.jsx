import React, { useReducer, createContext } from "react";

export const Store = createContext();

export const createStoreProvider = ({ initialState, reducers }) => ({
  children,
}) => {
  const reducer = (state, action) => reducers[action.type](state, action);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
