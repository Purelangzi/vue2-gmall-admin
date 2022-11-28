import request from '@/utils/request'
// 请求获取一级分类
export const reqCategory1List = () => request.get('/admin/product/getCategory1')

// 请求根据一级分类的id获取二级分类
export const reqCategory2List = (category1Id) => request.get(`/admin/product/getCategory2/${category1Id}`)

// 请求根据二级分类的id获取三级分类  
export const reqCategory3List = (category2Id) => request.get(`/admin/product/getCategory3/${category2Id}`)

// 根据分类id获取商品属性
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
