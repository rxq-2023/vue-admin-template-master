//  平台属性管理模块
import request from '@/utils/request'

//  获取一级分类
export const reqCategory1List=()=>{
  return request({
    url:`/admin/product/getCategory1`,
    methods:'get'
  })
}
//  获取二级分类
export const reqCategory2List=(category1Id)=>{
  return request({
    url:`/admin/product/getCategory2/${category1Id}`,
    methods:'get'
  })
}
//  获取三级分类
export const reqCategory3List=(category2Id)=>{
  return request({
    url:`/admin/product/getCategory3/${category2Id}`,
    methods:'get'
  })
}
//  获取平台属性
export const reqAttrList=(category1Id,category2Id,category3Id)=>{
  return request({
    url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    methods:'get'
  })
}
