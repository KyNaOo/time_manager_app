import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';  // Pour la navigation

export default function HomePage() {
    const navigation = useNavigation();
    const [lastAction, setLastAction] = useState<'clockIn' | 'clockOut' | null>(null);

    const handleLogout = () => {
        // Implémentation de la déconnexion (par exemple, suppression du token et retour à la page de login)
        Alert.alert('Déconnexion', 'Vous êtes déconnecté');
        router.navigate('/login');
    };

    const handleProfile = () => {
        // Redirection vers la page de profil
        router.navigate('/profile');
    };

    const handleClockIn = async () => {
        try {
            // Implémentation de l'API pour clock in
            Alert.alert('Clock In', 'Vous avez clock in avec succès');
            setLastAction('clockIn');
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du clock in');
        }
    };

    const handleClockOut = async () => {
        try {
            // Implémentation de l'API pour clock out
            Alert.alert('Clock Out', 'Vous avez clock out avec succès');
            setLastAction('clockOut');
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

    return (
        <View style={styles.container}>
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

            {/* Corps de la page */}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#333',  // Gris foncé
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    },
    clockButtonText: {
        color: 'white',
        fontSize: 18,
    },
});
