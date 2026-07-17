import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  memo,
  type ReactNode,
} from 'react';
import {
  ConfigProvider,
  Form,
  Button,
  Table,
  Input,
  Select,
  DatePicker,
  Pagination,
  message,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { useVirtualizer } from '@tanstack/react-virtual';
import axios from 'axios';
import type { TableProps } from 'antd';
import type {
  ProTableProps,
  SearchFormItem,
  SearchFormConfig,
} from './types';
import './index.scss';

const { RangePicker } = DatePicker;

// ==================== 模块级常量（避免每次render重建） ====================
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500, 1000, 2000];

function defaultShowTotal(total: number, range: [number, number]) {
  return `共 ${total} 条，当前 ${range[0]}-${range[1]}`;
}

function defaultAdaptResponse(res: any) {
  const body = res.data ?? res;
  return {
    list: body?.list ?? [],
    total: body?.total ?? 0,
    pageNum: body?.pageNum ?? 1,
  };
}

// ==================== 辅助：渲染表单项 ====================
function renderFormItem(item: SearchFormItem) {
  const { type, placeholder, options, componentProps } = item;

  switch (type) {
    case 'select':
      return (
        <Select
          placeholder={placeholder ?? `请选择${item.label}`}
          options={options}
          allowClear
          style={{ width: item.width ?? 180 }}
          {...componentProps}
        />
      );
    case 'datePicker':
      return (
        <DatePicker
          placeholder={placeholder ?? `请选择${item.label}`}
          allowClear
          style={{ width: item.width ?? 180 }}
          {...componentProps}
        />
      );
    case 'rangePicker':
      return (
        <RangePicker
          allowClear
          style={{ width: item.width ?? 300 }}
          {...componentProps}
        />
      );
    case 'input':
    default:
      return (
        <Input
          placeholder={placeholder ?? `请输入${item.label}`}
          allowClear
          style={{ width: item.width ?? 180 }}
          {...componentProps}
        />
      );
  }
}

// ==================== 搜索表单（React.memo） ====================
const SearchFormBlock = memo(function SearchFormBlock(props: {
  config: SearchFormConfig;
  onSearch: () => void;
  onReset: () => void;
}) {
  const { config, onSearch, onReset } = props;
  const [collapsed, setCollapsed] = useState(true);

  const collapseCount = config.collapseCount ?? 3;
  const needCollapse =
    collapseCount > 0 && config.items.length > collapseCount;

  const visibleItems =
    needCollapse && collapsed
      ? config.items.slice(0, collapseCount)
      : config.items;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="pro-table-search" onKeyDown={handleKeyDown}>
      <Form layout="inline" initialValues={config.initialValues}>
        {visibleItems.map((item) => (
          <Form.Item
            key={item.name}
            name={item.name}
            label={item.label}
            rules={item.rules}
            initialValue={item.initialValue}
            style={{ marginBottom: 12 }}
            {...item.formItemProps}
          >
            {renderFormItem(item)}
          </Form.Item>
        ))}

        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={onSearch} icon={<SearchOutlined />}>
            {config.searchText ?? '搜索'}
          </Button>
          {config.showReset !== false && (
            <Button
              onClick={onReset}
              icon={<ReloadOutlined />}
              style={{ marginLeft: 8 }}
            >
              {config.resetText ?? '重置'}
            </Button>
          )}
          {needCollapse && (
            <Button
              type="link"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <DownOutlined /> : <UpOutlined />}
            >
              {collapsed ? '展开' : '收起'}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
});

// ==================== 主组件 ====================
function ProTable<T extends object = any>(props: ProTableProps<T>) {
  const { searchForm, table, pagination, options, scrollY, className } = props;
  const [form] = Form.useForm();

  // ---------- url 模式 / 手动模式 ----------
  const isUrlMode = !!options?.url;

  // ---------- 内部数据状态（url 模式） ----------
  const [internalData, setInternalData] = useState<T[]>([]);
  const [internalTotal, setInternalTotal] = useState(0);
  const [internalPageNum, setInternalPageNum] = useState(
    pagination?.current ?? 1
  );
  const [internalPageSize, setInternalPageSize] = useState(
    pagination?.pageSize ?? 20
  );
  const [internalLoading, setInternalLoading] = useState(false);

  useEffect(() => {
    if (isUrlMode && options?.autoFetch !== false) {
      doFetch(internalPageNum, internalPageSize);
    }
  }, []);

  // ---------- 内部请求方法 ----------
  const doFetch = useCallback(
    async (page: number, size: number) => {
      if (!options?.url) return;

      setInternalLoading(true);
      try {
        const formValues = form.getFieldsValue();
        const cleaned: Record<string, unknown> = {};
        Object.entries(formValues).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            cleaned[k] = v;
          }
        });

        const params: Record<string, unknown> = {
          pageNum: page,
          pageSize: size,
          ...cleaned,
          ...(options.extraParams ?? {}),
        };

        let res: any;
        if ((options.method ?? 'get') === 'post') {
          res = await axios.post(options.url, params);
        } else {
          res = await axios.get(options.url, { params });
        }

        const adapter = options.adaptResponse ?? defaultAdaptResponse;
        const adapted = adapter(res);

        setInternalData(adapted.list as T[]);
        setInternalTotal(adapted.total);
        setInternalPageNum(adapted.pageNum);

        options.onLoad?.({
          list: adapted.list as T[],
          total: adapted.total,
          pageNum: adapted.pageNum,
        });
      } catch (err: any) {
        message.error(err?.message ?? '请求失败');
        options.onError?.(err);
      } finally {
        setInternalLoading(false);
      }
    },
    [form, options]
  );

  // ---------- 最终数据源 ----------
  const dataSource: T[] = isUrlMode
    ? internalData
    : (table.dataSource as T[]) ?? [];

  const loading = isUrlMode ? internalLoading : (table.loading ?? false);
  const total = isUrlMode ? internalTotal : (pagination?.total ?? 0);
  const currentPage = isUrlMode
    ? internalPageNum
    : (pagination?.current ?? 1);
  const pageSize = isUrlMode
    ? internalPageSize
    : (pagination?.pageSize ?? 20);

  // ---------- 搜索 ----------
  const handleSearch = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        const cleaned: Record<string, unknown> = {};
        Object.entries(values).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            cleaned[k] = v;
          }
        });

        if (isUrlMode) {
          setInternalPageNum(1);
          doFetch(1, internalPageSize);
        } else {
          searchForm?.onSearch?.(cleaned);
        }
      })
      .catch(() => {});
  }, [form, searchForm, isUrlMode, doFetch, internalPageSize]);

  const handleReset = useCallback(() => {
    form.resetFields();
    if (isUrlMode) {
      setInternalPageNum(1);
      doFetch(1, internalPageSize);
    } else {
      searchForm?.onReset?.();
    }
  }, [form, searchForm, isUrlMode, doFetch, internalPageSize]);

  // ---------- 分页变化 ----------
  const handlePaginationChange = useCallback(
    (page: number, size: number) => {
      if (isUrlMode) {
        setInternalPageNum(page);
        setInternalPageSize(size);
        doFetch(page, size);
      } else {
        pagination?.onChange?.(page, size);
      }
    },
    [isUrlMode, doFetch, pagination]
  );

  // ---------- 行选择 ----------
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  type RowSel = NonNullable<TableProps<T>['rowSelection']>;
  const rowSelection: RowSel | undefined = useMemo(() => {
    if (!options?.rowSelection) return undefined;

    if (options.rowSelection === true) {
      return {
        selectedRowKeys,
        onChange: (keys) => {
          setSelectedRowKeys(keys);
        },
      };
    }

    const { onChange: customOnChange, ...rest } = options.rowSelection as any;
    return {
      selectedRowKeys,
      onChange: (keys: React.Key[], rows: T[]) => {
        setSelectedRowKeys(keys);
        customOnChange?.(keys, rows);
      },
      ...rest,
    };
  }, [options?.rowSelection, selectedRowKeys]);

  // ==================== 列宽拖拽（ref优化：拖拽中不setState） ====================
  const columnWidthsRef = useRef<Record<string, number>>({});
  const [columnWidthsVersion, setColumnWidthsVersion] = useState(0);
  const resizingCol = useRef<string | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const rafRef = useRef<number>(0);

  // 初始化列宽到 ref
  useEffect(() => {
    if (table.columns) {
      table.columns.forEach((col: Record<string, unknown>) => {
        const key = (col.dataIndex || col.key) as string;
        if (key && col.width && !(key in columnWidthsRef.current)) {
          columnWidthsRef.current[key] =
            typeof col.width === 'number'
              ? col.width
              : parseInt(col.width as string, 10) || 100;
        }
      });
      setColumnWidthsVersion((v) => v + 1);
    }
  }, [table.columns]);

  const handleMouseMoveRef = useRef((e: MouseEvent) => {
    if (!resizingCol.current) return;
    const diff = e.clientX - startXRef.current;
    const newWidth = Math.max(60, startWidthRef.current + diff);
    columnWidthsRef.current[resizingCol.current] = newWidth;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      setColumnWidthsVersion((v) => v + 1);
    });
  });

  const handleMouseUpRef = useRef(() => {
    if (!resizingCol.current) return;
    resizingCol.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMoveRef.current);
    document.removeEventListener('mouseup', handleMouseUpRef.current);
    setColumnWidthsVersion((v) => v + 1);
  });

  const startResize = useCallback(
    (dataIndex: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resizingCol.current = dataIndex;
      startXRef.current = e.clientX;
      startWidthRef.current = columnWidthsRef.current[dataIndex] || 100;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMoveRef.current);
      document.addEventListener('mouseup', handleMouseUpRef.current);
    },
    []
  );

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveRef.current);
      document.removeEventListener('mouseup', handleMouseUpRef.current);
    };
  }, []);

  // ==================== 高度自适应（RAF节流 + 去重） ====================
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedScrollY, setComputedScrollY] = useState<number>(0);
  const lastScrollYRef = useRef(0);
  const scrollYRafRef = useRef(0);

  useEffect(() => {
    if (scrollY !== undefined) {
      setComputedScrollY(scrollY);
      return;
    }
    const calcHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const searchEl =
          containerRef.current.querySelector('.pro-table-search');
        const searchHeight = searchEl?.clientHeight ?? 0;
        const paginationEl = containerRef.current.querySelector(
          '.pro-table-pagination'
        );
        const paginationHeight = paginationEl?.clientHeight ?? 0;
        const toolbarEl = containerRef.current.querySelector(
          '.pro-table-toolbar'
        );
        const toolbarHeight = toolbarEl?.clientHeight ?? 0;
        const headerReserve = 50;
        const y =
          containerHeight -
          searchHeight -
          paginationHeight -
          toolbarHeight -
          headerReserve;

        if (y !== lastScrollYRef.current) {
          lastScrollYRef.current = y;
          setComputedScrollY(Math.max(y, 120));
        }
      }
    };

    const onResize = () => {
      if (scrollYRafRef.current) return;
      scrollYRafRef.current = requestAnimationFrame(() => {
        scrollYRafRef.current = 0;
        calcHeight();
      });
    };

    calcHeight();
    const observer = new ResizeObserver(onResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
      if (scrollYRafRef.current) cancelAnimationFrame(scrollYRafRef.current);
    };
  }, [scrollY]);

  // ==================== 虚拟滚动 ====================
  const virtualEnabled = options?.virtual !== false;
  const virtualRowHeight = options?.virtualRowHeight ?? 54;
  const virtualOverscan = options?.virtualOverscan ?? 5;

  // 用自己的 scroll 容器替代查找 .ant-table-body，避免异步时机问题
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

  // 稳定回调 ref：挂载时设置 scroll 元素，不依赖外部状态避免反复 detach/attach
  const setScrollContainer = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setScrollEl(node);
    }
  }, []);

  const virtualizer = useVirtualizer({
    count: virtualEnabled ? dataSource.length : 0,
    getScrollElement: () => scrollEl,
    estimateSize: () => virtualRowHeight,
    overscan: virtualOverscan,
  });

  // 虚拟行号映射（序号列需要）
  const rowKeyMap = useMemo(() => {
    if (!virtualEnabled || !options?.showRowNumber) return null;
    const map = new Map<string, number>();
    dataSource.forEach((item: any, i: number) => {
      const key = String(
        typeof table.rowKey === 'function'
          ? (table.rowKey as (r: any) => string)(item)
          : table.rowKey
            ? item[table.rowKey as string]
            : item._id ?? i
      );
      map.set(key, i);
    });
    return map;
  }, [virtualEnabled, options?.showRowNumber, dataSource, table.rowKey]);

  // 总列数（含序号列），spacer 需要跨所有列
  const totalColumnCount = useMemo(() => {
    let count = (table.columns as Record<string, unknown>[])?.length ?? 1;
    if (options?.showRowNumber) count += 1;
    return count;
  }, [table.columns, options?.showRowNumber]);

  // 拼接带 spacer 的数据源：保持表格 colgroup 对齐
  // 注意：此处不能使用 useMemo，因为滚动时 virtualizer 内部状态变化触发了重渲染，
  // 但 useMemo 的所有依赖项（virtualizer、dataSource 等）引用均未改变，会导致
  // getVirtualItems() 不被调用，渲染行永远停留在初始可见区域
  const virtualDataSource = (() => {
    if (!virtualEnabled || !scrollEl) return dataSource;

    const items = virtualizer.getVirtualItems();
    if (items.length === 0) return dataSource;

    const result: any[] = [];
    const colCount = totalColumnCount;

    // 顶部 spacer
    if (items[0].index > 0) {
      result.push({
        _spacerKey: '__spacer_top__',
        _spacerHeight: items[0].start,
        _colSpan: colCount,
      });
    }

    // 可见行
    items.forEach((vItem) => {
      if (dataSource[vItem.index] !== undefined) {
        result.push(dataSource[vItem.index]);
      }
    });

    // 底部 spacer
    const lastItem = items[items.length - 1];
    const totalSize = virtualizer.getTotalSize();
    const bottomGap = totalSize - (lastItem?.end ?? 0);
    if (bottomGap > 0) {
      result.push({
        _spacerKey: '__spacer_bottom__',
        _spacerHeight: bottomGap,
        _colSpan: colCount,
      });
    }

    return result;
  })();

  // 自定义行渲染：spacer 行只用一个跨列 td
  const virtualRowComponent = useMemo(() => {
    if (!virtualEnabled) return undefined;

    function SpacerRow(props: any) {
      const record = props.children?.[0]?.props?.record;
      if (record?._spacerKey) {
        return (
          <tr style={{ height: record._spacerHeight }} aria-hidden="true">
            <td colSpan={record._colSpan} style={{ padding: 0, border: 0 }} />
          </tr>
        );
      }
      return <tr {...props} />;
    }

    return SpacerRow;
  }, [virtualEnabled]);

  // ==================== 序号列 ====================
  const rowNumberColumn = useMemo(() => {
    if (!options?.showRowNumber) return null;

    return {
      title: '#',
      key: '__pro_table_row_number__',
      width: options.rowNumberWidth ?? 60,
      align: 'center' as const,
      fixed: 'left' as const,
      resizable: false,
      render: (_: any, record: any, index: number) => {
        // 虚拟模式下 spacer 行不渲染序号
        if (record?._spacerKey)
          return { children: null, props: { colSpan: 0 } };

        // 计算原始索引
        let realIndex: number;
        if (virtualEnabled && rowKeyMap) {
          const key = String(
            typeof table.rowKey === 'function'
              ? (table.rowKey as (r: any) => string)(record)
              : table.rowKey
                ? record[table.rowKey as string]
                : record._id ?? 0
          );
          realIndex = rowKeyMap.get(key) ?? 0;
        } else {
          realIndex = index;
        }
        return (currentPage - 1) * pageSize + realIndex + 1;
      },
    };
  }, [
    options?.showRowNumber,
    options?.rowNumberWidth,
    virtualEnabled,
    rowKeyMap,
    currentPage,
    pageSize,
    table.rowKey,
  ]);

  // ---------- 加工列（startResize 稳定，不再级联重算） ----------
  const processedColumns: TableProps<T>['columns'] = useMemo(() => {
    if (!table.columns) return [];

    let cols = table.columns.map((col: Record<string, unknown>) => {
      const dataIndex = (col.dataIndex || col.key) as string;
      const resizable = col.resizable !== false;
      const width = dataIndex ? columnWidthsRef.current[dataIndex] : undefined;

      if (!resizable || !dataIndex) {
        return {
          ...col,
          width: width ?? col.width,
        } as TableProps<T>['columns'][number];
      }

      const originalTitle = col.title;
      return {
        ...col,
        width: width ?? col.width,
        title: (
          <div className="pro-table-header-cell">
            <span className="pro-table-header-title">
              {originalTitle as ReactNode}
            </span>
            <span
              className="pro-table-resize-handle"
              onMouseDown={startResize(dataIndex)}
            />
          </div>
        ),
      } as TableProps<T>['columns'][number];
    });

    // 序号列插入最前
    if (rowNumberColumn) {
      cols = [rowNumberColumn as any, ...cols];
    }

    return cols;
  }, [table.columns, columnWidthsVersion, startResize, rowNumberColumn]);

  // ==================== 渲染 ====================
  const stripeClass = options?.stripe ? ' pro-table-striped' : '';

  const scrollConfig = useMemo(
    () => ({ x: 'max-content' as const }),
    []
  );

  const localeConfig = useMemo(
    () => ({
      emptyText: table.emptyText ?? '暂无数据',
      ...table.locale,
    }),
    [table.emptyText, table.locale]
  );

  const scrollContainerHeight =
    computedScrollY > 0 ? computedScrollY : undefined;

  return (
    <ConfigProvider locale={zhCN}>
      <div
        className={`pro-table-container${stripeClass}${className ? ' ' + className : ''}`}
        ref={containerRef}
      >
        {/* 搜索表单 */}
        {searchForm && searchForm.items?.length > 0 && (
          <SearchFormBlock
            config={searchForm}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        )}

        {/* 工具栏 */}
        {options?.showToolbar && (
          <div className="pro-table-toolbar">{options.toolbarRender}</div>
        )}

        {/* 表格主体：用自己的 scroll 容器替代 .ant-table-body */}
        <div className="pro-table-body">
          <div
            ref={setScrollContainer}
            className="pro-table-scroll-container"
            style={
              scrollContainerHeight
                ? { height: scrollContainerHeight, overflow: 'auto' }
                : { flex: 1, overflow: 'auto', minHeight: 0 }
            }
          >
            <Table<T>
              {...table}
              rowSelection={rowSelection}
              columns={processedColumns}
              dataSource={virtualDataSource}
              loading={loading}
              pagination={false}
              scroll={scrollConfig}
              rowKey={
                table.rowKey
                  ? (record: any) => {
                      if (record._spacerKey) return record._spacerKey;
                      if (typeof table.rowKey === 'function')
                        return (table.rowKey as (r: any) => string)(record);
                      return record[table.rowKey as string];
                    }
                  : '_id'
              }
              bordered={table.bordered !== false}
              locale={localeConfig}
              tableLayout="fixed"
              showSorterTooltip={false}
              components={
                virtualEnabled && virtualRowComponent
                  ? {
                      body: {
                        row: virtualRowComponent,
                      },
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {/* 分页器 */}
        {pagination && (
          <div className="pro-table-pagination">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger={pagination.showSizeChanger !== false}
              showQuickJumper={pagination.showQuickJumper !== false}
              showTotal={pagination.showTotal ?? defaultShowTotal}
              pageSizeOptions={
                pagination.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS
              }
              onChange={handlePaginationChange}
            />
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default ProTable;
export type {
  ProTableProps,
  SearchFormItem,
  SearchFormConfig,
  TableConfig,
  PaginationConfig,
  ProTableOptions,
  SearchFormItemType,
} from './types';
