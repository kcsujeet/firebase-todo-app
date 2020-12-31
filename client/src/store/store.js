import React from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
  user: {},
  userLoading: true
};

const {useGlobalState} = createGlobalState(initialState);

export default useGlobalState