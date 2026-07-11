// ========== 用户 & 认证 ==========
export interface User {
  username: string;
  role: string[];
  [key: string]: unknown;
}

export interface UserInfo {
  user: User | null;
  token: string;
  isLogin: boolean;
}

// ========== 业务实体 ==========
export interface CategoryItem {
  _id?: string;
  categoryid?: string;
  name: string;
  categoryname?: string;
}

export interface ProductItem {
  _id?: string;
  productId?: string;
  name: string;
  desc: string;
  price: number;
  status?: number;        // 1=在售, 2=已下架
  imgs?: string[];
  detail?: string;
  categoryId?: string;
  categoryName?: string;
}

export interface ProductListResponse {
  list: ProductItem[];
  total: number;
  pageNum: number;
}

export interface ProductSearchParams {
  pageNum: number;
  pageSize: number;
  searchType: string;
  keyWord: string;
}

export interface RoleItem {
  _id?: string;
  name: string;
  roleName?: string;
  menus?: string[];
  auth_time?: number;
  auth_name?: string;
  create_time?: number;
}

export interface UserItem {
  _id?: string;
  username: string;
  password?: string;
  email?: string;
  phone?: string;
  role_id?: string;
  create_time?: number;
}

// ========== API 通用响应 ==========
export interface ApiResponse<T = unknown> {
  status: number;
  code: number;
  data: T;
  msg?: string;
}

// ========== 路由配置 ==========
export interface RouteConfig {
  path: string;
  element: React.ReactElement;
  children?: RouteConfig[];
}
