import { CommonActions } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

const reset = (navigation,routeName,param)=>{
    navigation.dispatch(
        CommonActions.reset({
            index: 1,
            routes: [
                { name: routeName,params:param },
            ],
        })
    );
}

const replace = (navigation,routeName,param)=>{
    navigation.dispatch(
        StackActions.replace(routeName,param)
    );
}

const onAuthCheckClick = (navigation,func)=>{
    if(!global.token){
        navigation.navigate('Login')
    }else {
        func && func()
    }
}

export {
    reset,
    replace,
    onAuthCheckClick
}
