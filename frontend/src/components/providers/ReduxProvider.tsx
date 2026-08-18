'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';

interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps children with the Redux store provider.
 * This component is a Client Component so it can use the Redux Provider.
 */
export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
