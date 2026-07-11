import { useRoutes,Navigate} from 'react-router-dom';
import {arr,adminChild} from './router'
import sotre from './redux/store'

export default  function App() {
    const {username,role} = sotre.getState().userInfo.user
    // 权限管理
    // 是否具有该权限
    function hasAuth(item){
        if(!item.children){
            return role.includes(item.path)  
        }
        else if(item.children){
            return item.children.find((item2)=>{
                return role.includes(item2.path)
            })
        }
    }

    if(username === 'admin'){
        arr[1].children = adminChild
    }else if(username){
        // 筛选具有权限的路由
        let newarr = adminChild.filter((item)=>{
            if(hasAuth(item)) return item
        })
        // console.log(newarr);
        newarr.push({
            path:'',
            element: <Navigate to='home'/>,
        })
        // console.log(newarr);
        if(newarr.length) arr[1].children=newarr
    }

    const element=useRoutes(arr)
    return ( 
        <div className = "app" >
                {element}
        </div>
    );
}


