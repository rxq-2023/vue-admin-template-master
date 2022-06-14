import request from '@/utils/request'

//  获取品牌列表
export const reqTradeMarkList=(page,limit)=>{
  return request({
    url:`/admin/product/baseTrademark/${page}/${limit}`,
    methods:'get'
  })
}
//  新增/修改 品牌
export const reqAddOrUpdateTradeMark=(tradeMark)=>{
  //  带给服务器请求包含id 则为修改请求
  if(tradeMark.id){
    return request({
      url:`/admin/product/baseTrademark/update`,
      method:'put',
      data:tradeMark
    })
  }else{
    return request({
      url:`/admin/product/baseTrademark/save`,
      method:'post',
      data:tradeMark
    })
  }
}

//  删除品牌 P133
export const reqDeleteTradeMark=(id)=>{
  return request({
    url:`/admin/product/baseTrademark/remove/${id}`,
    method:'delete'
  })
}
