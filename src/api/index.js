// 将商品管理下的四个模块请求的接口函数统一暴露
import * as tradeMark from '@/api/product/tradeMark'
import * as attr from '@/api/product/attr'
import * as spu from '@/api/product/spu'
import * as sku from '@/api/product/sku'



export {
    tradeMark,attr,spu,sku
}