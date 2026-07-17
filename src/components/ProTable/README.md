# ProTable 通用表格组件

基于 antd 5.x 封装的通用表格组件，集成搜索表单、分页器、列宽拖拽、高度自适应等能力。

## 快速开始

```tsx
import ProTable from '@/components/ProTable';

function MyPage() {
  return (
    <div style={{ height: '100%' }}>
      <ProTable
        searchForm={searchForm}
        table={table}
        pagination={pagination}
        options={options}
      />
    </div>
  );
}
```

> **重要**：外层容器必须有确定的高度（如 `height: 100%`、`calc(100vh - xxx)`），否则滚动和表头固定失效。

---

## Props

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `table` | `TableConfig` | ✅ | 表格配置，antd Table 参数集中在此 |
| `searchForm` | `SearchFormConfig` | ❌ | 搜索表单配置，不传则不显示 |
| `pagination` | `PaginationConfig` | ❌ | 分页器配置，不传则不显示 |
| `options` | `ProTableOptions` | ❌ | 组件整体配置（请求/行选择/外观） |
| `scrollY` | `number` | ❌ | 表格 body 滚动高度（px），不传自动计算 |
| `className` | `string` | ❌ | 外层容器自定义类名 |

---

## 两种使用模式

### 1. url 模式（推荐）

传 `options.url`，组件内部自动发请求、管理分页和数据。搜索和翻页全自动。

```tsx
<ProTable
  options={{
    url: '/api/product/list',
    method: 'get',            // 默认 get
    autoFetch: true,          // 默认 true，挂载时自动请求
    extraParams: { type: 1 }, // 每次请求额外带的固定参数
    onLoad: (data) => console.log('加载成功', data),
    onError: (err) => console.log('加载失败', err),
    // 自定义数据适配器（默认适配 { code:0, data:{ list, total, pageNum } }）
    adaptResponse: (res) => ({
      list: res.data.records,
      total: res.data.total,
      pageNum: res.data.current,
    }),
  }}
  searchForm={{
    items: [
      { name: 'productName', label: '商品名称', type: 'input' },
      { name: 'status', label: '状态', type: 'select', options: [...] },
    ],
  }}
  table={{ columns, rowKey: 'id', bordered: true }}
  pagination={{ pageSize: 10 }}
/>
```

**请求参数**：`{ pageNum, pageSize, ...搜索表单值, ...extraParams }`

### 2. 手动模式

不传 `url`，通过 `searchForm.onSearch` 和 `pagination.onChange` 自行控制。

```tsx
const [data, setData] = useState({ list: [], total: 0, pageNum: 1 });

<ProTable
  searchForm={{
    items: [...],
    onSearch: (values) => fetchData(1, values),
    onReset: () => setData(initialData),
  }}
  table={{ columns, dataSource: data.list, loading }}
  pagination={{
    current: data.pageNum,
    total: data.total,
    pageSize: 5,
    onChange: (page, size) => fetchData(page),
  }}
/>
```

---

## 类型详情

### SearchFormConfig — 搜索表单

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `items` | `SearchFormItem[]` | — | 表单项列表 |
| `onSearch` | `(values) => void` | — | 搜索回调（手动模式必传） |
| `onReset` | `() => void` | — | 重置回调 |
| `initialValues` | `Record<string, any>` | — | 表单初始值 |
| `searchText` | `string` | `'搜索'` | 搜索按钮文字 |
| `resetText` | `string` | `'重置'` | 重置按钮文字 |
| `showReset` | `boolean` | `true` | 是否显示重置按钮 |
| `collapseCount` | `number` | `3` | 超过多少个表单项时折叠，0 不折叠 |

### SearchFormItem — 单个表单项

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `name` | `string` | — | 字段名，**直接作为接口查询参数名** |
| `label` | `string` | — | 标签文字 |
| `type` | `'input' \| 'select' \| 'datePicker' \| 'rangePicker'` | — | 表单项类型 |
| `placeholder` | `string` | 自动生成 | 占位提示文字 |
| `options` | `{ value, label }[]` | — | select 类型的选项 |
| `width` | `number \| string` | `180` / `300`(rangePicker) | 表单项宽度 |
| `initialValue` | `any` | — | 初始值 |
| `rules` | `FormItemProps['rules']` | — | 校验规则 |
| `formItemProps` | `object` | — | 透传给 antd `Form.Item` 的属性 |
| `componentProps` | `object` | — | 透传给具体表单项组件（Input/Select/DatePicker）的属性 |

### TableConfig — 表格配置

继承 antd `TableProps`（排除了 `pagination`、`scroll`、`rowSelection`，这三个由组件托管）。

| 额外参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `columns[].resizable` | `boolean` | `true` | 该列是否允许拖拽调整宽度 |

> **注意**：`resizable: false` 仅对设了 `dataIndex` 或 `key` 的列生效。

### PaginationConfig — 分页器

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `current` | `number` | — | 当前页 |
| `pageSize` | `number` | — | 每页条数 |
| `total` | `number` | — | 总条数 |
| `showSizeChanger` | `boolean` | `true` | 是否显示每页条数切换器 |
| `showQuickJumper` | `boolean` | `true` | 是否显示快速跳转 |
| `showTotal` | `(total, range) => string` | `共 x 条，当前 a-b` | 总数显示 |
| `pageSizeOptions` | `string[]` | `[5, 10, 20, 50]` | 每页条数选项 |
| `onChange` | `(page, size) => void` | — | 分页回调（手动模式必传） |

### ProTableOptions — 组件整体配置

| 分类 | 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|---|
| 请求 | `url` | `string` | — | 查询接口 URL |
| 请求 | `method` | `'get' \| 'post'` | `'get'` | 请求方法 |
| 请求 | `adaptResponse` | `(res) => { list, total, pageNum }` | 内置适配器 | 自定义数据适配器 |
| 请求 | `autoFetch` | `boolean` | `true` | 挂载时自动请求 |
| 请求 | `extraParams` | `object` | — | 每次请求额外参数 |
| 请求 | `onLoad` | `(data) => void` | — | 请求成功回调 |
| 请求 | `onError` | `(err) => void` | — | 请求失败回调 |
| 行选择 | `rowSelection` | `boolean \| antd rowSelection` | — | 行选择配置 |
| 外观 | `stripe` | `boolean` | `false` | 斑马纹 |
| 外观 | `showToolbar` | `boolean` | `false` | 显示工具栏区域 |
| 外观 | `toolbarRender` | `ReactNode` | — | 工具栏自定义内容 |
| 外观 | `showRowNumber` | `boolean` | `false` | 显示序号列（自动按分页计算行号） |
| 外观 | `rowNumberWidth` | `number` | `60` | 序号列宽度（px） |
| 性能 | `virtual` | `boolean` | `true` | 启用虚拟滚动（大数据量时强烈推荐） |
| 性能 | `virtualRowHeight` | `number` | `54` | 虚拟滚动行高预估值（px） |
| 性能 | `virtualOverscan` | `number` | `5` | 虚拟滚动预渲染行数 |

---

## 内置行为

### 搜索折叠

- `searchForm.items` 超过 **3 个**时自动折叠，出现「展开 / 收起」按钮
- 可通过 `collapseCount` 调整阈值，设为 `0` 永不折叠
- 按 **Enter 键**触发搜索

### 搜索 & 重置

- url 模式：搜索时自动重置到第 1 页
- 手动模式：`onSearch` 收到的 values 已自动清理掉空字符串 / null / undefined

### 列宽拖拽

- 鼠标移到表头列右边缘，出现蓝色竖线
- 按住拖拽调整列宽，最小 60px
- 单列可通过 `columns[x].resizable = false` 禁用

### 高度自适应

- 外层容器限高后，组件通过 `ResizeObserver` 自动计算表格可用高度
- 表头固定，body 区域独立滚动
- 也可通过 `scrollY` 手动指定高度

### 分页器

- url 模式：分页由组件内部维护，`pagination` 只需传 `pageSize`
- 手动模式：需传 `current`、`total`、`pageSize`、`onChange`

### 行选择

```tsx
// 简单模式
options={{ rowSelection: true }}

// 完整配置
options={{
  rowSelection: {
    type: 'checkbox',
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('已选:', selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record) => ({ disabled: record.status === 4 }),
  },
}}
```

选中 keys 由组件内部维护，也可以通过 `onChange` 回调拿到外部。

### 工具栏

```tsx
options={{
  showToolbar: true,
  toolbarRender: (
    <>
      <Button type="primary" icon={<PlusOutlined />}>新增</Button>
      <Button danger disabled={selectedIds.length === 0}>批量删除</Button>
    </>
  ),
}}
```

### 序号列

```tsx
options={{ showRowNumber: true }}
```

- 自动计算行号，已考虑分页偏移（第2页第1条从 pageSize+1 开始）
- 序号列固定在左侧，不可拖拽
- 可通过 `rowNumberWidth` 调整宽度（默认 60px）

### 虚拟滚动

```tsx
options={{
  virtual: true,          // 默认 true，大数据量自动启用
  virtualRowHeight: 54,   // 行高预估，越接近实际值越精确
  virtualOverscan: 5,     // 视口外预渲染行数
}}
```

- 1000+ 行数据时只渲染可见行 + overscan，大幅提升渲染性能
- 表头固定、列宽拖拽、行选择均与虚拟滚动兼容
- 小数据量（≤ 20 行）时虚拟滚动自动退化为全量渲染
- 如需行展开等场景可关闭：`virtual: false`

---

## 数据适配器

默认适配器兼容项目通用响应格式：

```ts
// 接口返回
{ code: 0, data: { list: [...], total: 100, pageNum: 1 } }

// 自动提取为：
{ list: [...], total: 100, pageNum: 1 }
```

如果你的接口返回格式不同，传 `adaptResponse`：

```tsx
options={{
  adaptResponse: (res) => ({
    list: res.records,      // 你的列表字段名
    total: res.totalCount,  // 你的总数字段名
    pageNum: res.page,      // 你的页码字段名
  }),
}}
```

适配器的 `res` 参数是 **axios 响应拦截器之后** 的数据。本项目的 axios 拦截器 `return response.data`，所以 `res` 已经是 `{ code, data, msg }` 那一层。

---

## 文件结构

```
src/components/ProTable/
├── types.ts       TypeScript 类型定义
├── index.tsx      主组件
├── index.scss     样式
└── README.md      本文档
```
