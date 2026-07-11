
import { Navigate } from 'react-router-dom'
import Login from '../containers/Login'
import Admin from '../containers/Admin'
import Home from '../conponent/Home'
import Category from '../containers/Category'
import Product from '../containers/Product'
import Detail from '../containers/Product/Detail'
import AddUpdate from '../containers/Product/Add_update'
import Role from '../containers/Role'
import User from '../containers/User'
import Bar from '../containers/Bar'
import Line from '../containers/Line'
import Pie from '../containers/Pie'
import NotFound from '../conponent/NotFound'

export  const arr= [
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/admin',
        element: <Admin/>,
    },
    {
        path:'/',
        element: <Navigate to='/admin'/>
    },
    {
        path:'*',
        element: <NotFound/>
    }
]

export const adminChild = [
    {
        path:'home',
        element: <Home/>,
    },
    {
        path:'prod_about',
        children:[
            {
                path:'category',
                element: <Category/>,
            },
            {
                path:'product',
                exact:true,
                element: <Product/>,
                children:[
                    {
                        path:'detail/:pid',
                        element: <Detail/>,
                    },
                    {
                        path:'addupdate',
                        element: <AddUpdate/>,
                    },
                    {
                        path:'addupdate/:pid',
                        element: <AddUpdate/>,
                    }
                ]
            }
        ]
    },
    {
        path:'user',
        element: <User/>,
    },
    {
        path:'role',
        element: <Role/>,
    },
    {
        path:'charts',
        children:[
            {
                path:'bar',
                element: <Bar/>,
            },
            {
                path:'pie',
                element: <Pie/>,
            },
            {
                path:'line',
                element: <Line/>,
            }
        ]
    },
    {
        path:'',
        element: <Navigate to='home'/>,
    }
]