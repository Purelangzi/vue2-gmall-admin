import request from '@/utils/request'

// 品牌列表接口
export const reqTradeMark = (page,limit) => request.get(`/admin/product/baseTrademark/${page}/${limit}`)