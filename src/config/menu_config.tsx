import {
  HomeOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ToolOutlined,
  UserOutlined,
  AreaChartOutlined,
  SafetyOutlined,
  PieChartOutlined,
  LineChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

// 项目的菜单配置
export interface MenuItemConfig {
  title: string; // 菜单的标题名称
  key: string; // 对应path
  icon: React.ReactElement;
  children?: MenuItemConfig[]; // 子菜单列表
  isPublic?: boolean;
}

const menuConfig: MenuItemConfig[] = [
  {
    title: '首页',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    title: '商品',
    key: 'prod_about',
    icon: <AppstoreOutlined />,
    children: [
      {
        title: '分类管理',
        key: 'category',
        icon: <UnorderedListOutlined />,
      },
      {
        title: '商品管理',
        key: 'product',
        icon: <ToolOutlined />,
      },
    ],
  },
  {
    title: '用户管理',
    key: 'user',
    icon: <UserOutlined />,
  },
  {
    title: '角色管理',
    key: 'role',
    icon: <SafetyOutlined />,
  },
  {
    title: '图形图表',
    key: 'charts',
    icon: <AreaChartOutlined />,
    children: [
      {
        title: '柱状图',
        key: 'bar',
        icon: <BarChartOutlined />,
      },
      {
        title: '饼图',
        key: 'pie',
        icon: <PieChartOutlined />,
      },
      {
        title: '折线图',
        key: 'line',
        icon: <LineChartOutlined />,
      },
    ],
  },
];

export default menuConfig;
