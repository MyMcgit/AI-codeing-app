import { combineReducers } from 'redux'
import loginRecuder from './login_reducer'
import titleReducer from './title_reducer'
import productReducer from './product_reducer'
import categoryReducer from './category_reducer'

// 整合所有reducer，汇总所有状态
export default combineReducers({
    // 该对象里的key决定着store里保存该状态的key
    // 该对象里的value决定着store里保存该状态的value
    userInfo: loginRecuder,
    title: titleReducer,
    productList:productReducer,
    categoryList:categoryReducer
})