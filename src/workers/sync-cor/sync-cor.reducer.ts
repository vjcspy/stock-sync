import { createReducer } from '@reduxjs/toolkit';
import { SyncCorStateFactory } from './sync-cor.state';
import { appInitAction } from '@app/store/actions';

export const syncCorReducer = createReducer(SyncCorStateFactory(), builder => {
  builder.addCase(appInitAction, () => {
  });
});
