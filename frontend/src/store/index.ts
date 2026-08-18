import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

/**
 * Redux store configuration.
 * Slices are added per phase:
 *   Phase 3: authSlice
 *   Phase 4: jobsSlice
 *   Phase 5: profileSlice
 *   Phase 6: applicationsSlice
 *   Phase 7: adminSlice
 *   Phase 8: notificationsSlice, messagesSlice
 */
export const store = configureStore({
  reducer: {
    // Slices added in upcoming phases
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks — use these throughout the app instead of raw useDispatch/useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
