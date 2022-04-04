import React from 'react';
import Logs from './Logs';
import {AsyncStorage, Text, TouchableHighlight, View,} from 'react-native';
import {MapView, Overlay} from 'rn-baidu-map';
import {AppConfig} from "./utils/constants";
import locationUtil from "./utils/LocationUtil";

const {Marker} = Overlay

class Map extends React.Component {
    constructor(props) {
        super(props);
        const routeParams = this.props.route.params
      console.log(routeParams)
        this.state = {
            location: locationUtil.location,
            geocode: {
                country: '',
                province: '',
                street: ''
            },
            type: 1,
            typeIndex: 0,
            typeText: ['country', 'province', 'street'],

        };


        Logs({
            url: 'http://175.24.183.174:8080/page/log',
            session_id: AppConfig.sessionId,
            page_id: 5
        }, (data) => {
            console.log(data)
        })
    }

    componentDidMount() {

    }


    render() {
        const {location} = this.state
        return (
            <View style={{flex: 1, backgroundColor: '#FFF'}}>
                <MapView
                    zoom={15}
                    showsUserLocation={true}
                    location={location}
                    center={{latitude: location.latitude, longitude: location.longitude}}
                    style={{width: '100%', height: '50%'}}
                >
                    <Marker
                        key={'house'}
                        location={{longitude:location.longitude,latitude:location.latitude}}
                        />
                </MapView>
                <Text allowFontScaling={false} style={{...styles.geocode}}>

                </Text>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    marginBottom: '15%'
                }}>
                    <TouchableHighlight
                        underlayColor="none" activeOpacity={0.5} style={styles.reject}
                        onPress={() => {
                          this.props.navigation.goBack()
                        }}>
                        <Text allowFontScaling={false} style={{color: '#FFF'}}>Back</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = {
    // container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    touch: {
        backgroundColor: '#FFF',
        borderWidth: 0.5,
        borderColor: 'rgba(204, 204, 204, 0.5)',
        padding: 15,
        borderRadius: 5
    },
    list: {margin: 15, padding: 15, borderRadius: 5, backgroundColor: '#FFF'},
    description: {marginTop: 15},
    // policy
    policy: {
        width: 90,
        height: 90,
        marginRight: 40,
        marginBottom: 20
    },
    modal: {
        padding: 15,
        marginTop: 80
    },
    modalTitle: {
        fontWeight: '800',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10
    },
    geocode: {fontSize: 18, textAlign: 'center', margin: 20},
    modalText: {fontSize: 16, marginBottom: 10},
    accept: {
        backgroundColor: '#01aecc',
        padding: 15,
        borderRadius: 20,
        width: 120,
        alignItems: 'center',
        marginHorizontal: 16
    },
    reject: {
        backgroundColor: '#878787',
        padding: 15,
        borderRadius: 20,
        width: 120,
        alignItems: 'center',
        marginHorizontal: 16
    },
}

module.exports = Map;
