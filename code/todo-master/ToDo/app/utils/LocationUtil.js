
import {PermissionsAndroid, Platform} from 'react-native';
import { BaiduMapManager,Geolocation } from 'rn-baidu-map'



const iosAK  = "w7YstFazBrEXtXbHMZmNIdo6Et1YvP7Z"
const androidAK  = "aV5wUifm8C7gMpkZrvIdQekE9YQrNORY"


const checkPermission = async (callback)=>{
    //获取定位权限
    try{

        let granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if(!granted){
            granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        }
        console.log('定位权限',granted)
        if(granted){
            callback()
        }else{

        }

    }catch (err) {

    }
}

class LocationUtilClass {


    getLocation(callback){
        if(Platform.OS === 'android'){
            checkPermission(()=>{
                this.getCurrentLocation(callback)
            })
        }else{
            this.getCurrentLocation(callback)
        }
    }

    async getCurrentLocation(callback){
        try{
            console.log('start loc')
            const location = await Geolocation.getCurrentPosition()
            console.log('获取定位成功--',location)
            this.location = location
            callback(location)
        }catch (error) {

            console.log('获取定位失败--',error)
        }

    }


    initSDK(){
        const key = Platform.OS == 'ios' ? iosAK : androidAK
        BaiduMapManager.initSDK(key);

    }

    setCity(city){
        console.log('locationUtil setCity',city)
        this.city = city
    }
}

const locationUtil = new LocationUtilClass()

export default locationUtil

