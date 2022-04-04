export const apiBase = 'http://175.24.183.174:8080'


export const getApi = (path)=>{

    return apiBase + path
}


export default {
    taskList:getApi('/task/list'),
    categoryList:getApi('/task/category/list'),
    needWindow:getApi('/page/need_window'),
    closeWindow:getApi('/page/close_window'),
    locationRecord:getApi('/location/record'),
    deleteTask:getApi('/task/category/delete'),
    locLog:getApi('/location/logs'),
    collectList:getApi('/collected_data/list'),
    login:getApi('/user/login'),
    register:getApi('/user/register'),
    feedback:getApi('/feedback/submit'),
    dataCollect:getApi('/data/collect'),
    dataSummary:getApi('/data/collect/summary')
}
