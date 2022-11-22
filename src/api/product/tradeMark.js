import request from '@/utils/request'

// 请求品牌列表
export const reqTradeMark = (page,limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)
// 请求添加或修改品牌信息
export const reqAddOrUpdateTradeMark = (data) => {
    if(!data.id){
        return request({method:'post',url:'/admin/product/baseTrademark/save',data})
    }else{
        return request({method:'put',url:'/admin/product/baseTrademark/update',data})
    }
}
// 请求删除某个品牌
export const reqDeleteTradeMark = (id) => request.delete(`/admin/product/baseTrademark/remove/${id}`)

