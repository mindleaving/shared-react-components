import { useSyncExternalStore } from 'react';
import type { ApiClientState } from '../types/apiTypes';
import { apiClient } from './ApiClient';

export const useApiClientState = (): ApiClientState =>
    useSyncExternalStore(apiClient.instance!.subscribe, apiClient.instance!.getState);
