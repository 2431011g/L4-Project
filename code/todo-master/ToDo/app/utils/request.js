
import {Platform} from 'react-native'
import Api,{apiBase} from "./Api";
import {AppConfig} from "./constants";

const request = {};


export const genUrl= (url,params)=>{

    if (!url.startsWith('http')) {
        url = `${apiBase}${url}`;
    }

    if (params) {
        let paramsArray = [];
        Object.keys(params).forEach(key =>
            paramsArray.push(key + '=' + params[key]),
        );
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += '&' + paramsArray.join('&');
        }
    }
    return url
}

request.get = (url, params,filter) => {

    let finalUrl = genUrl(url,params)

    return request.sendRequest('GET',finalUrl,null)


};

request.post = (url, param,filter) => {

    let body = JSON.stringify(param)
    return request.sendRequest('POST',url,body,filter)

};

request.sendRequest = (method,url,params,filter = true,isFormData = false) => {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    if(isFormData ){
        //如果是formdata
        headers['Content-Type'] = 'multipart/form-data';
    }

    if(AppConfig.sessionId){
        headers['session_id'] = AppConfig.sessionId
    }

    // console.log(headers)

    let isOk;
    // console.log('请求url',url)
    // console.log('请求参数',params)
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            headers: headers,
            body: params,
        })
            .then((response) => {
                if (response.ok) {
                    isOk = true;
                } else {
                    isOk = false;
                }
                return response.json();
            })
            .then((json) => {

                if (isOk ) {
                    if(filter){
                        if(json.status == 'success'){
                            console.log('请求url',url)
                            console.log('请求参数',params)
                            console.log('响应response',json)
                            resolve(json)
                        }else if(json.status == 'fail'){
                            //token 过期
                            console.log('请求url',url)
                            console.log('login expire',json)
                            resolve(json)
                        }else{
                            console.log('错误 url : ' + url,json)
                            reject(json)
                        }
                    }else{
                        resolve(json)
                    }

                } else {
                    console.log('请求url',url)
                    console.log('未知错误')
                    reject('未知错误')
                }
            })
            .catch((err) => {
                console.log('请求url '+url + ' error : ' + err)
                reject('未知错误');
            })
    })

}

export default request;
