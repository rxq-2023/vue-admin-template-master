import request from '@/utils/request'

//  获取品牌列表
export const reqTradeMarkList=(page,limit)=>{
  return request({
    url:`/admin/product/baseTrademark/${page}/${limit}`,
    methods:'get'
  })
}
