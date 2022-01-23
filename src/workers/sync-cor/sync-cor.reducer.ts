import { createReducer } from '@reduxjs/toolkit';
import { SyncCorStateFactory } from './sync-cor.state';
import { corGetNextPageAfterAction } from './sync-cor.actions';

export const syncCorReducer = createReducer(SyncCorStateFactory(), builder => {
  builder.addCase(corGetNextPageAfterAction, (state) => {
    state.page = state.page + 1;
  });
});
