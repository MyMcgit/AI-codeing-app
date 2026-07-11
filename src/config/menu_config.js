// 引入需要的icon
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
    BarChartOutlined
  } from '@ant-design/icons';
// 项目的菜单配置
export default [
   {
    title:'首页',//菜单的标题名称
    key:'home',//对应path
    icon:<HomeOutlined/>
   },
   {
    title:'商品',
    key:'prod_about',
    icon:<AppstoreOutlined />,
    children:[//子菜单列表
        {
            title:'分类管理',
            key:'category',
            icon:<UnorderedListOutlined />
        },
        {
            title:'商品管理',
            key:'product',
            icon:<ToolOutlined />
        }
    ]
   },
   {
    title:'用户管理',//菜单的标题名称
    key:'user',//对应path
    icon:<UserOutlined />
   },
   {
    title:'角色管理',//菜单的标题名称
    key:'role',//对应path
    icon:<SafetyOutlined />
   },
   {
    title:'图形图表',//菜单的标题名称
    key:'charts',//对应path
    icon:<AreaChartOutlined />,
    children:[
        {
            title:'柱状图',//菜单的标题名称
            key:'bar',//对应path
            icon:<BarChartOutlined />
        },
        {
            title:'饼图',//菜单的标题名称
            key:'pie',//对应path
            icon:<PieChartOutlined />
        },
        {
            title:'折线图',//菜单的标题名称
            key:'line',//对应path
            icon:<LineChartOutlined />
        },
    ]
   },
]