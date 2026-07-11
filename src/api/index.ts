/**
 * 项目中所有请求由该文件发出
 * 以后每当发请求之前，都要在该文件里添加一个真正发送请求的方法
 */
import myaxios from './myAxios';
import { BASE_URL, BASE_URL_WEATHER, CITY, WEATHER_AK } from '../config';

// ============ 登录相关 ============
export const reqLogin = (values: { username: string; password: string }) =>
  myaxios.post(BASE_URL + '/api1/login', values);

// ============ 分类相关 ============
export const reqCategoryList = () => myaxios.get(`/api1/manage/category/list`);

export const reqAddCategory = ({ categoryname }: { categoryname: string }) =>
  myaxios.post(BASE_URL + '/api1/manage/category/add', {
    categoryname: categoryname.trim(),
  });

export const reqUpdateCategory = ({
  categoryid,
  categoryname,
}: {
  categoryid: string;
  categoryname: string;
}) =>
  myaxios.post(BASE_URL + '/api1/manage/category/update', {
    categoryid,
    categoryname: categoryname.trim(),
  });

// ============ 天气相关 ============
export const reqweather = () =>
  myaxios.get(
    BASE_URL_WEATHER +
      `/api2/v3/weather/weatherInfo?city=${CITY}&key=${WEATHER_AK}`
  );

// ============ 商品相关 ============
export const reqProductList = (pageNum: number, pageSize: number) =>
  myaxios.get(`/api1/manage/product/list`, { params: { pageNum, pageSize } });

export const reqUPdateProdStatus = (productId: string, status: number) =>
  myaxios.post(`/api1/manage/product/updateStatus`, { productId, status });

export const reqSearchProduct = (
  pageNum: number,
  pageSize: number,
  searchType: string,
  keyWord: string
) =>
  myaxios.get(`/api1/manage/product/search`, {
    params: { pageNum, pageSize, [searchType]: keyWord },
  });

export const reqProdById = (productId: string) =>
  myaxios.get(`/api1/manage/product/info`, { params: { productId } });

export const reqDeletePicture = (name: string) =>
  myaxios.post(`/api1/manage/img/delete`, { name });

export const reqAddProduct = (values: Record<string, unknown>) =>
  myaxios.post(`/api1/manage/product/add`, { values });

export const reqUpdateProduct = (values: Record<string, unknown>) =>
  myaxios.post(`/api1/manage/product/update`, { values });

// ============ 角色相关 ============
export const reqRoleList = () =>
  myaxios.get(BASE_URL + `/api1/manage/role/list`);

export const reqAddRole = ({ roleName }: { roleName: string }) =>
  myaxios.post(`/api1/manage/role/add`, { roleName });

export const reqAuthRole = (roleObj: Record<string, unknown>) =>
  myaxios.post(`/api1/manage/role/update`, {
    ...roleObj,
    auth_time: new Date().getTime(),
  });

// ============ 用户相关 ============
export const reqUserList = () =>
  myaxios.get(BASE_URL + `/api1/manage/user/list`);

export const reqAddUser = (userObj: Record<string, unknown>) =>
  myaxios.post(`/api1/manage/user/add`, { ...userObj });
