import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Button} from 'react-native';
import {router} from "expo-router";

export default function AuthScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Button
                    title={"Se connecter"}
                    onPress={() => router.navigate('/login')} />
                <Button
                    title={"S'inscrire"}
                    onPress={() => router.navigate('/register')} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007bff',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    authLink: {
        color: '#007bff',
        marginTop: 15,
    },
});
