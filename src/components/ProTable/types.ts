import type { ReactNode } from 'react';
import type { TableProps, FormItemProps } from 'antd';
import type { ColumnType } from 'antd/es/table';

/** 从 TableProps 提取 rowSelection 类型 */
type RowSelection<T> = NonNullable<TableProps<T>['rowSelection']>;

// ========== 搜索表单 ==========

/** 表单项类型 */
export type SearchFormItemType =
  | 'input'
  | 'select'
  | 'datePicker'
  | 'rangePicker';

/** 单个搜索表单项配置 */
export interface SearchFormItem {
  /** 字段名，对应接口查询参数名 */
  name: string;
  /** 标签文字 */
  label: string;
  /** 表单项类型 */
  type: SearchFormItemType;
  /** placeholder，不传则自动生成 */
  placeholder?: string;
  /** select 类型的选项（type='select' 时必传） */
  options?: { value: string | number; label: string }[];
  /** 宽度 */
  width?: number | string;
  /** 初始值 */
  initialValue?: unknown;
  /** 校验规则 */
  rules?: FormItemProps['rules'];
  /** 透传给 antd Form.Item 的其他属性 */
  formItemProps?: Record<string, unknown>;
  /** 透传给具体表单项组件（Input/Select/DatePicker等）的属性 */
  componentProps?: Record<string, unknown>;
}

/** 搜索表单整体配置 */
export interface SearchFormConfig {
  /** 表单项列表 */
  items: SearchFormItem[];
  /** 搜索回调（url 模式时不需传，组件内部处理；手动模式时必须传） */
  onSearch?: (values: Record<string, unknown>) => void;
  /** 重置回调 */
  onReset?: () => void;
  /** 表单初始值 */
  initialValues?: Record<string, unknown>;
  /** 搜索按钮文字 */
  searchText?: string;
  /** 重置按钮文字 */
  resetText?: string;
  /** 是否显示重置按钮，默认 true */
  showReset?: boolean;
  /**
   * 超过多少个表单项时折叠
   * 默认 3（超过3个自动折叠）。设为 0 则不折叠
   */
  collapseCount?: number;
}

// ========== 分页器 ==========

/** 分页器配置 */
export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  pageSizeOptions?: string[];
  /** 分页变化回调（url 模式时不需传，手动模式时必须传） */
  onChange?: (page: number, pageSize: number) => void;
  /** 其他 antd Pagination 原生属性 */
  [key: string]: unknown;
}

// ========== 表格 ==========

/** 表格配置（antd Table 参数集中在此） */
export interface TableConfig<T = any>
  extends Omit<TableProps<T>, 'pagination' | 'scroll' | 'rowSelection'> {
  /** 列配置 */
  columns: (ColumnType<T> & {
    /** 是否允许拖拽列宽，默认 true */
    resizable?: boolean;
  })[];
  /** 数据源（url 模式时可不传，由组件自动维护） */
  dataSource?: T[];
  /** 行唯一标识 */
  rowKey?: string | ((record: T) => string);
  /** 加载状态（url 模式时由组件自动维护） */
  loading?: boolean;
  /** 是否有边框 */
  bordered?: boolean;
  /** 空数据时的自定义展示 */
  emptyText?: ReactNode;
}

// ========== 组件整体配置 ==========

/** 组件整体配置项 */
export interface ProTableOptions<T = any> {
  // ----- 请求相关 -----
  /**
   * 查询接口 URL
   * - 传了 → 组件内部自动发请求（接管 onSearch / pagination.onChange）
   * - 不传 → 走手动模式（需传 searchForm.onSearch 和 pagination.onChange）
   */
  url?: string;
  /** 请求方法，默认 'get' */
  method?: 'get' | 'post';
  /**
   * 自定义数据适配器
   * 默认假设接口返回：{ code: 0, data: { list, total, pageNum } }
   */
  adaptResponse?: (res: any) => {
    list: T[];
    total: number;
    pageNum: number;
  };
  /** 是否挂载时自动请求，默认 true（url 模式有效） */
  autoFetch?: boolean;
  /** 额外固定参数，每次请求都带上 */
  extraParams?: Record<string, unknown>;
  /** 请求成功回调 */
  onLoad?: (data: { list: T[]; total: number; pageNum: number }) => void;
  /** 请求失败回调 */
  onError?: (error: any) => void;

  // ----- 行选择 -----
  /**
   * 行选择配置
   * - true：启用默认复选框
   * - 传入对象：完整的 antd rowSelection 配置
   */
  rowSelection?:
    | boolean
    | (Omit<RowSelection<T>, 'onChange'> & {
        onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
      });

  // ----- 外观 -----
  /** 斑马纹（隔行变色），默认 false */
  stripe?: boolean;
  /** 是否显示操作栏区域（表格上方），默认 false */
  showToolbar?: boolean;
  /** 操作栏自定义渲染内容 */
  toolbarRender?: ReactNode;
  /** 容器自定义类名 */
  className?: string;

  // ----- 序号列 -----
  /**
   * 是否显示序号列（行号），默认 false
   * 序号会自动根据分页器计算（第2页第1条显示 pageSize+1）
   */
  showRowNumber?: boolean;
  /** 序号列宽度（px），默认 60 */
  rowNumberWidth?: number;

  // ----- 虚拟滚动 -----
  /**
   * 是否启用虚拟滚动，默认 true
   * 关闭时退化为原生渲染（适用于小数据量或需要行展开等场景）
   */
  virtual?: boolean;
  /** 虚拟滚动的行高预估值（px），默认 54 */
  virtualRowHeight?: number;
  /** 虚拟滚动 overscan 行数，默认 5 */
  virtualOverscan?: number;
}

// ========== ProTable 主 Props ==========

export interface ProTableProps<T = any> {
  /** 搜索表单配置 */
  searchForm?: SearchFormConfig;
  /** 表格配置 */
  table: TableConfig<T>;
  /** 分页器配置 */
  pagination?: PaginationConfig;
  /**
   * 组件整体配置项
   * - url 模式：传 url 即可，组件内部自动管理请求/分页/数据
   * - 手动模式：不传 url，通过 searchForm.onSearch 和 pagination.onChange 自行控制
   */
  options?: ProTableOptions<T>;
  /**
   * 表格 body 滚动区域高度（px）
   * 不传则自动计算：容器高度 - 搜索区 - 分页区 - 表头
   */
  scrollY?: number;
  /** 容器自定义类名 */
  className?: string;
}
