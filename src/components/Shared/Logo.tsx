import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Logo = () => {
  return (
    <View>
      {/* Logo */}
      <Image
        source={require('../../assets/images/logo.png')} // Adjust the path to your logo file
        style={styles.logo}
      />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logo: {
    width: 150, // Width of the logo
    height: 150, // Height of the logo
    resizeMode: 'contain', // Maintain aspect ratio
  },
});
