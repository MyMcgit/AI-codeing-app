# 商品管理系统

一个基于 **Vue 3 + TypeScript + Pinia + Ant Design Vue** 构建的后台商品管理 SPA（单页应用），涵盖商品分类、商品 CRUD、用户管理、角色权限授权以及数据可视化图表等常见后台功能。

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） | ^3.4 |
| 语言 | TypeScript | ~5.4 |
| 构建工具 | Vite | ^5.4 |
| 状态管理 | Pinia | ^2.1 |
| 路由 | Vue Router（Hash 模式） | ^4.3 |
| UI 组件库 | Ant Design Vue | ^4.1 |
| 图标 | @ant-design/icons-vue | ^7.0 |
| HTTP 请求 | Axios | ^1.7 |
| 富文本编辑 | @vueup/vue-quill | ^1.2 |
| 日期处理 | dayjs | ^1.11 |
| 样式预处理 | Sass | ^1.77 |

---

## 项目结构

```
app/
├── index.html               # HTML 入口
├── package.json
├── vite.config.ts            # Vite 配置（代理、别名）
├── tsconfig.json
├── public/
│   └── wer.png               # Logo 图标
└── src/
    ├── main.ts               # 应用入口（挂载 Vue、Pinia、Router、Antd）
    ├── App.vue               # 根组件（主题色配置）
    ├── env.d.ts               # TypeScript 类型声明
    ├── api/
    │   ├── request.ts         # Axios 实例封装（拦截器、超时、Token 注入）
    │   └── index.ts           # 所有后端 API 接口定义
    ├── config/
    │   ├── index.ts           # 全局常量（主题色 PRIMARY、分页大小 PAGE_SIZE）
    │   └── menu.ts            # 侧边栏菜单配置（含图标、层级、权限 key）
    ├── router/
    │   └── index.ts           # 路由表 + 导航守卫（未登录重定向到 /login）
    ├── stores/
    │   ├── auth.ts            # 认证状态（用户信息、Token、登录/登出）
    │   └── app.ts             # 应用状态（标题、商品列表、分类列表）
    ├── types/
    │   └── index.ts           # TypeScript 接口定义（User、ProductItem、CategoryItem 等）
    ├── components/
    │   ├── Sidebar.vue        # 侧边栏导航（菜单渲染、权限过滤、路由跳转）
    │   ├── HeaderBar.vue      # 顶部栏（全屏切换、天气、实时时钟、退出登录）
    │   ├── PictureWall.vue    # 图片上传/预览组件
    │   ├── RichTextEditor.vue # 富文本编辑器（基于 Quill）
    │   ├── NotFound.vue       # 404 页面
    │   └── NotAuth.vue        # 无权限提示页
    ├── views/
    │   ├── login/             # 登录页
    │   │   └── index.vue
    │   ├── admin/             # 后台管理布局（Sider + Header + Content + Footer）
    │   │   └── index.vue
    │   ├── home/              # 首页（仪表盘占位）
    │   │   └── index.vue
    │   ├── category/          # 商品分类管理（增、改、列表）
    │   │   └── index.vue
    │   ├── product/           # 商品管理（列表、搜索、上下架、新增/编辑、详情）
    │   │   ├── index.vue
    │   │   ├── add-update.vue
    │   │   └── detail.vue
    │   ├── user/              # 用户管理（列表、新增）
    │   │   └── index.vue
    │   ├── role/              # 角色管理（新增、权限树授权）
    │   │   └── index.vue
    │   └── charts/            # 数据可视化图表
    │       ├── bar.vue        # 柱状图
    │       ├── line.vue       # 折线图
    │       └── pie.vue        # 饼图
    └── static/
        └── imgs/
            └── wer.png
```

---

## 功能模块

### 1. 登录与认证
- 用户名 / 密码登录表单
- Token 存储在 `localStorage`，请求头携带 `Authorization`
- 路由守卫：未登录自动跳转登录页
- 退出登录二次确认弹窗

### 2. 布局框架
- **侧边栏（Sider）**：深色主题菜单，支持折叠/展开，根据用户角色动态过滤可见菜单
- **顶部栏（Header）**：显示当前页面标题、实时时钟、天气信息、全屏切换按钮、用户信息与退出
- **内容区（Content）**：白色圆角卡片承载子路由页面
- **底部栏（Footer）**：浏览器推荐提示

### 3. 首页（Home）
- 仪表盘占位页面，目前仅展示测试数据

### 4. 商品分类管理
- 分类列表（分页表格）
- 添加分类（模态表单）
- 修改分类名称

### 5. 商品管理
- 商品列表：分页 + 按名称/描述搜索
- 商品上下架状态切换
- 新增商品（含富文本详情、图片上传）
- 修改商品信息
- 商品详情查看

### 6. 用户管理
- 用户列表（用户名、邮箱、电话、注册时间、所属角色）
- 新增用户（选择角色、填写基本信息）

### 7. 角色管理
- 角色列表（名称、创建时间、授权时间、授权人）
- 新增角色
- 权限设置：通过树形组件勾选菜单权限（首页、商品、分类、用户、角色、图表子项）

### 8. 图形图表
- 柱状图（Bar Chart）
- 饼图（Pie Chart）
- 折线图（Line Chart）

### 9. 天气信息
- 顶部栏实时显示当前城市天气（通过高德地图 API 获取）

---

## 路由设计

| 路径 | 名称 | 组件 | 说明 |
|------|------|------|------|
| `/` | - | - | 自动重定向到 `/admin` |
| `/login` | login | `views/login/index.vue` | 登录页 |
| `/admin` | admin | `views/admin/index.vue` | 后台布局容器 |
| `/admin/home` | home | `views/home/index.vue` | 首页 |
| `/admin/prod_about/category` | category | `views/category/index.vue` | 分类管理 |
| `/admin/prod_about/product` | product | `views/product/index.vue` | 商品列表 |
| `/admin/prod_about/product/detail/:pid` | product-detail | `views/product/detail.vue` | 商品详情 |
| `/admin/prod_about/product/addupdate` | product-add | `views/product/add-update.vue` | 新增商品 |
| `/admin/prod_about/product/addupdate/:pid` | product-edit | `views/product/add-update.vue` | 编辑商品 |
| `/admin/user` | user | `views/user/index.vue` | 用户管理 |
| `/admin/role` | role | `views/role/index.vue` | 角色管理 |
| `/admin/charts/bar` | bar | `views/charts/bar.vue` | 柱状图 |
| `/admin/charts/line` | line | `views/charts/line.vue` | 折线图 |
| `/admin/charts/pie` | pie | `views/charts/pie.vue` | 饼图 |
| `/:pathMatch(.*)*` | not-found | `components/NotFound.vue` | 404 页面 |

---

## 状态管理

### Auth Store（`stores/auth.ts`）
- `user` — 当前登录用户信息
- `token` — 认证令牌
- `isLogin` — 计算属性，判断是否已登录
- `saveUserInfo()` — 登录成功后保存用户信息到 state 和 localStorage
- `deleteUserInfo()` — 登出时清除用户信息和 token

### App Store（`stores/app.ts`）
- `title` — 当前页面标题
- `productList` — 商品列表缓存
- `categoryList` — 分类列表缓存
- 各对应 setter 方法

---

## API 层

### Axios 封装（`api/request.ts`）
- 请求超时：4 秒
- 请求拦截器：自动注入 `Authorization` 头（格式：`atguigu_` + token）
- 响应拦截器：自动解包 `response.data`；统一处理超时和 401 鉴权失败

### 后端接口（`api/index.ts`）
所有接口通过 Vite 代理转发：

| 代理前缀 | 目标地址 |
|----------|----------|
| `/api1` | `http://localhost:4000`（业务后端） |
| `/api2` | `https://restapi.amap.com`（高德天气 API） |

主要接口包括：登录、分类 CRUD、商品 CRUD（含搜索/上下架/图片删除）、角色 CRUD（含授权）、用户 CRUD、天气查询。

---

## 启动与部署

### 环境要求
- Node.js >= 18
- 后端 API 服务运行在 `http://localhost:4000`

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动并自动打开浏览器。

### 构建生产包

```bash
npm run build
```

构建前会执行 `vue-tsc --noEmit` 进行类型检查，通过后输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

---

## 版本历史

| 提交 | 说明 |
|------|------|
| `e6fdd2d` | AI重构：将 React 项目迁移到 Vue3 + Pinia + TypeScript |
| `9fc7388` | AI重构：TypeScript + Zustand |
| `bc42b5a` | 老项目源代码初始化（原始 React 版本） |

该项目最初为 React 项目，后经 AI 辅助重构迁移至 Vue 3 + Pinia + TypeScript 技术栈。

---

## 注意事项

1. 开发环境默认端口为 **3000**，可在 `vite.config.ts` 中修改
2. 后端 API 需运行在 **4000** 端口，或相应修改 Vite 代理配置
3. 用户权限基于角色中的 `menus` 数组，通过 Sidebar 组件的 `hasAuth` 函数过滤菜单
4. 登录凭证存储在 `localStorage` 中，生产环境建议加强安全策略（如 HttpOnly Cookie + 短时效 Token）
5. 推荐使用谷歌浏览器获得最佳体验
