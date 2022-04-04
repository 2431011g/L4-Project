import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import PropTypes from 'prop-types'

export default class StarRating extends Component {
  static defaultProps = {
    maxStars: 5,
    rating: 1,
    starSize: -1,
    interItemSpacing: 0,
    valueChanged: (index) => {
    },
    editAble: true,
  };
  static propTypes = {
    maxStars: PropTypes.number,
    rating: PropTypes.number,
    unSelectStar: PropTypes.number.isRequired,
    selectStar: PropTypes.number.isRequired,
    valueChanged: PropTypes.func,
    starSize: PropTypes.number,
    interItemSpacing: PropTypes.number,
    editAble: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      maxStars: this.props.maxStars,
      rating: this.props.rating,
      firstImageLayout: null,
      starSize: this.props.starSize,
    };
  }

  render() {
    let starArray = [];
    let imageSource = null;
    for (let i = 1; i <= this.state.maxStars; i++) {
      if (i <= this.props.rating) {
        imageSource = this.props.selectStar;
      } else {
        imageSource = this.props.unSelectStar;
      }

      let styleArray = [];
      if (i !== this.state.maxStars) {
        styleArray.push({ marginRight: this.props.interItemSpacing });
      }
      if (this.state.starSize > 0) {
        styleArray.push({ width: this.state.starSize, height: this.state.starSize });
      }

      //push Image
      starArray.push(
        <TouchableOpacity
          key={i}
          onPress={() => {
            if (this.props.editAble) {
              this.props.valueChanged(i);
            }
          }}
        >

          <Image source={imageSource} style={styleArray} resizeMode={'contain'} />
        </TouchableOpacity>,
      );


    }

    return (
      <View style={styles.container}>
        {starArray}
      </View>
    );

  }

};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
});
