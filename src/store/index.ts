import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserInfo, User, ProductItem, CategoryItem } from '../types';

// ========== Slice 类型定义 ==========
interface AuthSlice {
  userInfo: UserInfo;
  saveUserInfo: (value: { user: User; token: string }) => void;
  deleteUserInfo: () => void;
}

interface TitleSlice {
  title: string;
  saveTitle: (value: string) => void;
}

interface CacheSlice {
  productList: ProductItem[];
  saveProductList: (list: ProductItem[]) => void;
  categoryList: CategoryItem[];
  saveCategoryList: (list: CategoryItem[]) => void;
}

export type AppStore = AuthSlice & TitleSlice & CacheSlice;

// ========== 辅助函数 ==========
function getInitialUserInfo(): UserInfo {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (userStr && token) {
    try {
      return { user: JSON.parse(userStr), token, isLogin: true };
    } catch {
      /* fall through */
    }
  }
  return { user: null, token: '', isLogin: false };
}

function cloneDeep<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// ========== 创建 Store ==========
export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      // ===== Auth =====
      userInfo: getInitialUserInfo(),
      saveUserInfo: (value) => {
        localStorage.setItem('user', JSON.stringify(value.user));
        localStorage.setItem('token', value.token);
        localStorage.setItem('isLogin', 'true');
        set({ userInfo: { user: value.user, token: value.token, isLogin: true } });
      },
      deleteUserInfo: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('isLogin');
        set({ userInfo: { user: null, token: '', isLogin: false } });
      },

      // ===== Title =====
      title: '',
      saveTitle: (value) => set({ title: value }),

      // ===== Cache =====
      productList: [],
      saveProductList: (list) => set({ productList: cloneDeep(list) }),
      categoryList: [],
      saveCategoryList: (list) => set({ categoryList: cloneDeep(list) }),
    }),
    { name: 'app-store' }
  )
);
