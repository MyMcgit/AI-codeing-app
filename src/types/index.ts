// ========== 用户 & 认证 ==========
export interface User {
  username: string;
  role: string[];
  [key: string]: unknown;
}

// ========== 业务实体 ==========
export interface CategoryItem {
  _id?: string;
  name: string;
}

export interface ProductItem {
  _id?: string;
  name: string;
  desc: string;
  price: number;
  status?: number;
  imgs?: string[];
  detail?: string;
  categoryid?: string;
}

export interface RoleItem {
  _id?: string;
  name: string;
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
  register_time?: number;
}
