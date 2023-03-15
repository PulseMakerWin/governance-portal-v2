/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

import create from 'zustand';
import { DelegateOrderByEnum, OrderDirectionEnum } from '../delegates.constants';

type StoreDelegates = {
  filters: {
    creationDate: null | Date;
    showShadow: boolean;
    showRecognized: boolean;
    showExpired: boolean;
    name: string | null;
    tags: { [key: string]: boolean };
  };
  sort: DelegateOrderByEnum;
  sortDirection: OrderDirectionEnum;
  setCreationDateFilter: (creationDate: Date | null) => void;
  setShowShadowFilter: (showShadow: boolean) => void;
  setShowRecognizedFilter: (showRecognized: boolean) => void;
  setShowExpiredFilter: (showExpired: boolean) => void;
  setSort: (sort: DelegateOrderByEnum) => void;
  setSortDirection: (sortDirection: OrderDirectionEnum) => void;
  setTagFilter: (tag: { [key: string]: boolean }) => void;
  setName: (text: string) => void;
  resetFilters: () => void;
};

const [useDelegatesFiltersStore] = create<StoreDelegates>((set, get) => ({
  filters: {
    creationDate: null,
    showShadow: true,
    showRecognized: true,
    showExpired: false,
    name: null,
    tags: {}
  },
  sort: DelegateOrderByEnum.RANDOM,
  sortDirection: OrderDirectionEnum.DESC,

  setName: (name: string) => {
    set({
      filters: {
        ...get().filters,
        name
      }
    });
  },

  setSort: sort => {
    set({
      sort
    });
  },
  setSortDirection: sortDirection => {
    set({
      sortDirection
    });
  },
  setCreationDateFilter: creationDate => {
    set({
      filters: {
        ...get().filters,
        creationDate
      }
    });
  },
  setShowShadowFilter: showShadow => {
    set({
      filters: {
        ...get().filters,
        showShadow
      }
    });
  },

  setShowExpiredFilter: showExpired => {
    set({
      filters: {
        ...get().filters,
        showExpired
      }
    });
  },

  setShowRecognizedFilter: showRecognized => {
    set({
      filters: {
        ...get().filters,
        showRecognized
      }
    });
  },

  setTagFilter: tags => {
    set({
      filters: {
        ...get().filters,
        tags
      }
    });
  },

  resetFilters: () => {
    set({
      filters: {
        tags: {},
        name: null,
        creationDate: null,
        showShadow: true,
        showRecognized: true,
        showExpired: false
      }
    });
  },

  resetSort: () => {
    set({
      sort: DelegateOrderByEnum.RANDOM
    });
  }
}));

export default useDelegatesFiltersStore;
