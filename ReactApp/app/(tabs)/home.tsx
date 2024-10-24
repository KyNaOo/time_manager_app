import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import axios from "axios";
import moment from "moment";
import {useStorageState} from "@/utils/useStorageState";
import {jwtDecode} from "jwt-decode";

export default function HomePage() {
    const [lastAction, setLastAction] = useState<'clockIn' | 'clockOut' | null>(null);
    const ngrokUrl = process.env.EXPO_PUBLIC_API_URL;
    const [token, setToken] = useStorageState("token");
    const [refreshLastClock, setRefreshLastClock] = useState(false)

    const handleLogout = () => {
        Alert.alert('Déconnexion', 'Vous êtes déconnecté');
        router.navigate('/login');
    };

    const handleProfile = () => {
        router.navigate('/profile');
    };

    const handleClockIn = async () => {
        try {
            const myToken = jwtDecode(token[1]);
            const idUser = myToken["sub"];
            const now = moment();
            const response = await axios.post(`${ngrokUrl}/api/clocks/${idUser}`, {
                "time": now,
                "status": true,
            }, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });
            setRefreshLastClock(!refreshLastClock);
            Alert.alert('Vous avez clock in avec succès');
            setLastAction('clockIn');
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du clock in');
        }
    };

    const handleClockOut = async () => {
        try {
            const myToken = jwtDecode(token[1]);
            const idUser = myToken["sub"];
            const now = moment();
            const response = await axios.post(`${ngrokUrl}/api/clocks/${idUser}`, {
                "time": now,
                "status": false,
            }, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });

            Alert.alert('Clock Out', 'Vous avez clock out avec succès');
            setLastAction('clockOut');
            setRefreshLastClock(!refreshLastClock);
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du clock out');
        }
    };

    const handleClockAction = () => {
        if (lastAction === 'clockIn') {
            handleClockOut();
        } else {
            handleClockIn();
        }
    };

    const getLastClock = async () => {
        const myToken = jwtDecode(token[1]);
        const idUser = myToken["sub"];
        const response = await axios.get(`${ngrokUrl}/api/clocks/${idUser}`, {
            headers: {
                Authorization: `Bearer ${token[1]}`,
            }
        });
        console.warn(response.data)
        let compare = 0;
        let theLastClock = null
        for (let clock of response.data.data){
            console.warn(clock)
            if (clock.id > compare){
                compare = clock.id;
                theLastClock = clock;
            }
        }
        if (theLastClock.status == true){
            setLastAction('clockIn');
        } else {
            setLastAction('clockOut')
        }
    }

    useEffect(() => {
        if (!token[0]){
            getLastClock();
        }
    }, [refreshLastClock, token]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Topbar / Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>MonLogo</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleProfile} style={styles.headerButton}>
                        <Text style={styles.buttonText}>Profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
                        <Text style={styles.buttonText}>Déconnexion</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.body}>
                <Text style={styles.slogan}>
                    D'un simple "clock in" à un rapide "clock out", prenez le contrôle
                    de votre journée en un clin d'œil – pas besoin de Bat-Signal !
                </Text>

                <TouchableOpacity style={styles.clockButton} onPress={handleClockAction}>
                    <Text style={styles.clockButtonText}>
                        {lastAction === 'clockIn' ? 'Clock Out' : 'Clock In'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#333',
        height: 100,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    logoContainer: {
        flex: 1,
    },
    logo: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    headerButton: {
        marginLeft: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    body: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    slogan: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
    },
    clockButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 20,
    },
    clockButtonText: {
        color: 'white',
        fontSize: 18,
    },
});
