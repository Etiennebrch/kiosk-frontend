import React from 'react';
import { Text, StyleSheet } from "react-native";

import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const CustomText = (props) => {
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold
    });
    if(fontsLoaded) {
        let styles;
        if(props.style && props.style.fontWeight && props.style.fontWeight == 'bold') {
            styles = StyleSheet.create({
                fontFamily: {fontFamily: 'Montserrat_700Bold', fontWeight: '900'}
            });
        } else {
            styles = StyleSheet.create({
                fontFamily: {fontFamily: 'Montserrat_400Regular'}
            });
        }
        const text = StyleSheet.compose(props.style, styles.fontFamily);
        return (
            <Text {...props} style={text}>{props.children}</Text>
        );
    } else {
        return null
    }
};

export default CustomText;