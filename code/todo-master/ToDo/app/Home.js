import React from 'react';
import Logs from './Logs';
import Moment from 'moment';
import icons from './Icons';
import {MapView, Overlay} from 'rn-baidu-map';

const {Marker} = Overlay;
import {
    Alert,
    DeviceEventEmitter,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AppConfig} from './utils/constants';
import request from './utils/request';
import Api from './utils/Api';
import Icons from './Icons';
import locationUtil from './utils/LocationUtil';
import StarRating from './components/StarRating';
import Images from './images/Images';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import screen from './utils/screen';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            location: null,
            star: 0,
            geocode: {
                country: '',
                province: '',
                street: '',
            },
            lists: [],
            listsLocation: [],
            type: 1,
            typeText: ['country', 'province', 'street'],
            feedback: '',
            category: [],
        };
        this.showWindow = false;
        this.location();

        Logs(
            {
                url: 'http://175.24.183.174:8080/page/log',
                session_id: AppConfig.sessionId,
                page_id: 2,
            },
            data => {
                console.log(data);
            },
        );

        this.fetchData();

        this.fetchCategoryList();
        this.fetchDataLocation();

        // 首页弹窗 3 天一次

        // AsyncStorage.removeItem('day')
        AsyncStorage.getItem('day')
            .then(response => {
                console.log(
                    'day',
                    response,
                    Moment(response).add(0, 'days').format('YYYY-MM-DD'),
                    Moment().format('YYYY-MM-DD'),
                );
                if (response) {
                    if (
                        Moment(response).add(0, 'days').format('YYYY-MM-DD') ==
                        Moment().format('YYYY-MM-DD')
                    ) {
                        console.log('显示地图弹窗');
                        this.fetchNeedWindow();
                    } else {
                        console.log('不显示地图弹窗');
                        // this.setState({type: 1, modalVisible: true})
                    }
                } else {
                    AsyncStorage.setItem('day', Moment().format('YYYY-MM-DD'));
                }
            })
            .catch(error => {
                console.log('err: ', error);
            });
    }

    componentDidMount() {
        const routeParam = this.props.route.params;
        console.log('home route param', routeParam);
        this.setNav();
        this.listener = DeviceEventEmitter.addListener('Change', () => {
            this.fetchData();
            this.fetchCategoryList();
        });

        this.listener = DeviceEventEmitter.addListener('disFocus', () => {
            this.fetchData();
            this.fetchCategoryList();
        });
    }

    setNav() {
        this.props.navigation.setOptions({
            headerShown: true,
            headerRight: () => (
                <TouchableHighlight
                    onPress={() => this.props.navigation.navigate('Add')}
                    activeOpacity={0.9}
                    underlayColor="none">
                    <Image
                        resizeMode="cover"
                        style={{width: 30, height: 30}}
                        source={{uri: Icons.plus}}
                    />
                </TouchableHighlight>
            ),
        });
    }



    fetchDataLocation() {
        request
            .post(Api.locLog)
            .then(responseData => {
                if (responseData.status == 'success') {
                    // for (var i = 2; i < responseData.data.length; i++) {
                    //     if (responseData.data[i].place) {
                    //         var parse = JSON.parse(responseData.data[i].place)
                    //         responseData.data[i].parse = parse
                    //     }
                    // }
                    if (responseData.data) {
                        this.setState({
                            listsLocation: responseData.data,
                        });
                    }
                }
            })
            .catch(error => {
                console.log('loc log err: ', error);
            });
    }

    fetchCategoryList() {
        request
            .post(Api.categoryList)
            .then(responseData => {
                console.log('fetchCategoryList', responseData);
                this.setState({
                    category: responseData.data,
                });
            }).catch(error => {
            console.log('err: ', error);
        });
    }

    fetchDataCategoryDelete(tag) {
        Alert.alert('Tips', '', [
            {
                text: 'DELETE',
                onPress: () => {
                    request
                        .post(Api.deleteTask, {tag})
                        .then(responseData => {
                            if (responseData.status == 'success') {
                                // this.props.navigation.goBack()
                                this.fetchCategoryList();
                            }
                        })
                        .catch(error => {
                            console.log('err: ', error);
                        });
                },
            },
            {
                text: 'UPDATE',
                onPress: () => {
                    this.props.navigation.navigate('Category', {old_tag: tag});
                },
            },
            {
                text: 'CANCEL',
            },
        ]);
    }

    fetchNeedWindow() {
        //是否显示百度地图弹窗
        request.post(Api.needWindow).then(responseData => {
                console.log('need_window', responseData);
                if (responseData.status == 'success') {
                    if (responseData.need) {
                        this.showWindow = true;
                        this.windowId = responseData.window_id;
                        this.setState({type: 1, modalVisible: true});
                    }
                }
            })
            .catch(error => {
                console.log('err: ', error);
            });
    }

    closeWindow = () => {
        this.setState({modalVisible: false});
        if(!this.windowId) return
        const {star, feedback} = this.state;
        let param = {
            window_id: this.windowId,
            rate: star,
            comment: feedback,
        };
        console.log('close win', param);
        request
            .post(Api.closeWindow, param)
            .then(responseData => {
                console.log('closeWindow record', responseData);
            })
            .catch(error => {
                console.log('closeWindow err: ', error);
            });

    };

    collectData(type){
        let param = {type}
        request.post(Api.dataCollect,param).then(responseData => {
            console.log('collect data ' + type + ':',responseData)
        }).catch(error => {

        });
    }

    fetchLocationRecord(longitude, latitude, place) {
        // console.log(longitude, latitude, place);
        let param = {
            longitude: longitude.toString(),
            latitude: latitude.toString(),
            place,
        };
        request
            .post(Api.locationRecord, param)
            .then(responseData => {
                console.log('loc record', responseData);
            })
            .catch(error => {
                console.log('err: ', error);
            });
    }

    fetchData() {
        request
            .post(Api.taskList)
            .then(responseData => {
                if (responseData.status == 'success') {
                    this.setState({
                        lists: responseData.data,
                    });
                }
                if (responseData.status == 'fail') {
                    this.props.navigation.navigate('Login');
                }
            })
            .catch(error => {
                console.log('err: ', error);
            });
    }

    location() {
        locationUtil.getLocation(loc => {
            this.setState({location: loc});
            this.collectData('location')
        });
    }

    renderModalMap() {
        const {location} = this.state;
        if (!location) return null;
        return (
            <Modal
                animationType="slide"
                visible={this.state.modalVisible}
                transparent={true}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    }}>
                    {this.state.type == 1 ? (
                        <View
                            style={{
                                alignItems: 'center',
                                padding: 20,
                                borderColor: '#000',
                                width: screen.width - 40,
                                borderWidth: 3,
                                borderRadius: 20,
                                backgroundColor: '#fff',
                            }}>
                            <Text
                                style={{fontSize: 22, marginVertical: 20, textAlign: 'center'}}>
                                The app now recognizes your current location. How do you feel
                                about this?
                            </Text>
                            <MapView
                                // satellite
                                showsUserLocation={true}
                                zoom={15}
                                location={location}
                                center={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                }}
                                // center={{ latitude: 39.2, longitude: 112.4 }}
                                locationEnabled
                                style={{
                                    height: 200,
                                    width: screen.width - 80,
                                    marginVertical: 20,
                                }}>
                                <Marker
                                    key={'user'}
                                    location={{
                                        longitude: location.longitude,
                                        latitude: location.latitude,
                                    }}
                                />
                                {this.state.listsLocation.map((item, key) => {
                                    if (item.longitude && item.latitude) {
                                        console.log('loc itm', item);
                                        return (
                                            <Marker
                                                key={'loc_' + key}
                                                location={{
                                                    longitude:Number(item.longitude) ,
                                                    latitude: Number(item.latitude) ,
                                                }}
                                            />
                                        );
                                    }
                                })}
                            </MapView>

                            {/*
                               <Text allowFontScaling={false} style={{...styles.geocode}}>
                                    {this.state.location.address}
                                </Text>
                                */}
                            <View style={{width: screen.width - 80}}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10,
                                    }}>
                                    <Text style={{fontSize: 18}}>Relaxed</Text>
                                    <Text style={{fontSize: 18}}>Concerned</Text>
                                </View>

                                <StarRating
                                    selectStar={Images.star_full}
                                    unSelectStar={Images.star_empty}
                                    starSize={20}
                                    maxStars={5}
                                    interItemSpacing={30}
                                    valueChanged={star => {
                                        console.log(star);
                                        this.setState({
                                            star,
                                        });
                                    }}
                                    rating={this.state.star}
                                />
                                <Text style={{marginTop: 10}}>
                                    If you have any things want to say:
                                </Text>
                                <View style={[styles.list, {marginHorizontal: 0, height: 60}]}>
                                    <TextInput
                                        allowFontScaling={false}
                                        style={{flex: 1, padding: 0}}
                                        placeholder="Type here"
                                        clearButtonMode="while-editing"
                                        defaultValue={this.state.feedback}
                                        placeholderTextColor="#CCC"
                                        onChangeText={text => this.setState({feedback: text})}
                                    />
                                </View>
                            </View>

                            {/*<ScrollView>
                                    <View>
                                        {
                                            this.state.listsLocation.map((item, key) => {
                                                console.log('loc itm', item)
                                                return (
                                                    <TouchableHighlight
                                                        style={styles.list} key={key}
                                                        activeOpacity={0.9}
                                                        underlayColor="none"
                                                        onPress={() => this.props.navigation.navigate('Map', {
                                                            longitude: item.longitude ?? '',
                                                            latitude: item.latitude ?? ''
                                                        })}>
                                                        <View>
                                                            <Text allowFontScaling={false}
                                                                  style={styles.item}>{item.place ?? ''}</Text>
                                                            <Text allowFontScaling={false}
                                                                  style={styles.description}>{item.create_time}</Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                )
                                            })
                                        }
                                    </View>
                                </ScrollView>
                                */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-around',
                                    marginBottom: '10%',
                                    paddingTop: 15,
                                }}>
                                {/*  <TouchableHighlight
                                        underlayColor="none"
                                        activeOpacity={0.5}
                                        style={styles.reject}
                                        onPress={() => {
                                            this.closeWindow()
                                        }}>
                                        <Text allowFontScaling={false}>No</Text>
                                    </TouchableHighlight>
                                    */}
                                <TouchableHighlight
                                    underlayColor="none"
                                    activeOpacity={0.5}
                                    style={styles.accept}
                                    onPress={() => {
                                        this.fetchLocationRecord(
                                            location.longitude,
                                            location.latitude,
                                            location.address,
                                        );
                                        this.closeWindow();
                                    }}>
                                    <Text allowFontScaling={false}>close</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    ) : (
                        <></>
                    )}
                </View>
            </Modal>
        );
    }

    render() {
        return (
            <View style={{backgroundColor: '#F2CAC5', flex: 1}}>
                <ScrollView>
                    <View style={styles.container}>
                        {this.state.category.map((item, index) => {
                            return (
                                <TouchableHighlight
                                    key={index}
                                    style={styles.list}
                                    activeOpacity={0.9}
                                    underlayColor="none">
                                    <View>
                                        <Text
                                            allowFontScaling={false}
                                            style={{fontSize: 24, padding: 10}}
                                            onPress={() =>
                                                this.props.navigation.navigate('TaskList', {
                                                    tag: item.tag.tag,
                                                })
                                            }
                                            onLongPress={() =>
                                                this.fetchDataCategoryDelete(item.tag.tag)
                                            }>
                                            {item.tag.tag}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            );
                        })}

                        {this.state.lists &&
                            this.state.lists.map((item, key) => {
                                return (
                                    <TouchableHighlight
                                        style={styles.list}
                                        key={key}
                                        activeOpacity={0.9}
                                        underlayColor="none"
                                        onPress={() =>
                                            this.props.navigation.navigate('Task', {
                                                task_id: item.task_id,
                                            })
                                        }>
                                        <View key={key}>
                                            <Text allowFontScaling={false} style={styles.item}>
                                                {item.task_name}
                                            </Text>
                                            <Text allowFontScaling={false} style={styles.item}>
                                                {item.task_date}
                                            </Text>
                                            <Image
                                                resizeMode="cover"
                                                style={styles.task_status}
                                                source={{
                                                    uri:
                                                        item.task_status == 'in_progress'
                                                            ? icons.check
                                                            : icons.checked,
                                                }}
                                            />
                                            <Text allowFontScaling={false} style={styles.description}>
                                                {item.complete_time}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                );
                            })}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableHighlight
                        underlayColor="none"
                        activeOpacity={0.5}
                        onPress={() => this.props.navigation.navigate('Category')}>
                        <Text allowFontScaling={false} style={{color: 'rgb(4, 134, 255)'}}>
                            Add Category
                        </Text>
                    </TouchableHighlight>
                </View>

                {this.renderModalMap()}
            </View>
        );
    }
}

const styles = {
    container: {marginTop: 120, flex: 1, justifyContent: 'center'},
    touch: {
        backgroundColor: '#FFF',
        borderWidth: 0.5,
        borderColor: 'rgba(204, 204, 204, 0.5)',
        padding: 15,
        borderRadius: 5,
    },
    description: {marginTop: 15},
    task_status: {width: 15, height: 15, position: 'absolute', top: 0, right: 0},
    // policy
    policy: {
        width: 90,
        height: 90,
        marginRight: 40,
        marginBottom: 20,
    },
    modal: {
        padding: 15,
        marginTop: 80,
    },
    modalTitle: {
        fontWeight: '800',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    geocode: {fontSize: 18, textAlign: 'center', margin: 20},
    modalText: {fontSize: 16, marginBottom: 10},
    accept: {
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#F2CAC5',
        padding: 15,
        borderRadius: 20,
        width: 120,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    reject: {
        borderColor: '#000',
        borderWidth: 1,
        backgroundColor: '#F2CAC5',
        padding: 15,
        borderRadius: 20,
        width: 120,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    footer: {
        height: 100,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    list: {
        margin: 15,
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#F8ECC1',
        borderColor: '#000',
        borderWidth: 1,
    },
};

module.exports = Home;
