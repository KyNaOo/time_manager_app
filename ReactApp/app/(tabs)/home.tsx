import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import axios from "axios";
import moment from "moment";
import {useStorageState} from "@/utils/useStorageState";
import {jwtDecode} from "jwt-decode";
import TeamDetailsModal from "@/components/teamDetailsModal";

export default function HomePage() {
    const [lastAction, setLastAction] = useState<'clockIn' | 'clockOut' | null>(null);
    const ngrokUrl = process.env.EXPO_PUBLIC_API_URL;
    const [workingTimes, setWorkingTimes] = useState([]);
    const [token, setToken] = useStorageState("token");
    const [refreshLastClock, setRefreshLastClock] = useState(false);
    const [lastWT, setLastWT] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

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

            const workingTimeResponse = await axios.post(`${ngrokUrl}/api/workingtime/${idUser}`, {
                "start": now,
                "end": now,
            }, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });

            setRefreshLastClock(!refreshLastClock);
            Alert.alert('Clock In', 'Vous avez clock in avec succès');
            fetchWorkingTimes();
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du clock in');
        }
    };

    const handleClockOut = async () => {
        try {
            const myToken = jwtDecode(token[1]);
            const idUser = myToken["sub"];
            const now = moment();
            // @ts-ignore
            let idWT = lastWT.id
            const response = await axios.post(`${ngrokUrl}/api/clocks/${idUser}`, {
                "time": now,
                "status": false,
            }, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });

            const responseUpdate = await axios.put(`${ngrokUrl}/api/workingtime/${idWT}`, {
                "workingtime": {
                    "end": now
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });
            Alert.alert('Clock Out', 'Vous avez clock out avec succès');
            setRefreshLastClock(!refreshLastClock);
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors du clock out');
        }
    };

    const fetchTeams = async () => {
        try {
            const myToken = jwtDecode(token[1]);
            const idUser = myToken["sub"];

            const response = await axios.get(`${ngrokUrl}/api/user/teams/${idUser}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });

            setTeams(response.data.teams);
            console.warn(response.data.teams);
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors de la récupération des teams');
        }

    };

    const fetchWorkingTimes = async () => {
        try {
            const myToken = jwtDecode(token[1]);
            const idUser = myToken["sub"];

            const response = await axios.get(`${ngrokUrl}/api/workingtime/${idUser}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });
            setWorkingTimes(response.data.data);
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors de la récupération des working times');
        }
        console.warn(token[1]);
    };

    const handleDelete = async (id: any) => {
        try {
            await axios.delete(`${ngrokUrl}/api/workingtime/${id}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });
            Alert.alert('Success', 'Working time supprimé');
            fetchWorkingTimes();
        } catch (error) {
            Alert.alert('Erreur', 'Erreur lors de la suppression du working time');
        }
    };

    const handleClockAction = () => {
        if (lastAction === 'clockIn') {
            handleClockOut();
        } else {
            handleClockIn();
        }
    };

    const getLastWT = async () => {
        const myToken = jwtDecode(token[1]);
        const idUser = myToken["sub"];
        const response = await axios.get(`${ngrokUrl}/api/workingtime/${idUser}`, {
            headers: {
                Authorization: `Bearer ${token[1]}`,
            }
        });
        let compare = 0;
        let theLastWT = null;
        for (let workingtime of response.data.data) {
            if (workingtime.id > compare) {
                compare = workingtime.id;
                theLastWT = workingtime;
            }
        }
        setLastWT(theLastWT);
    }

    const getLastClock = async () => {
        const myToken = jwtDecode(token[1]);
        const idUser = myToken["sub"];
        const response = await axios.get(`${ngrokUrl}/api/clocks/${idUser}`, {
            headers: {
                Authorization: `Bearer ${token[1]}`,
            }
        });
        if(response.data.data.length != 0){
            let compare = 0;
            let theLastClock = null
            for (let clock of response.data.data){
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
    }

    const openTeamDetails = (teamId: any) => {
        setSelectedTeamId(teamId);
        setIsModalVisible(true);
    };

    useEffect(() => {
        if (!token[0]){
            getLastClock();
            getLastWT();
            fetchWorkingTimes();
            fetchTeams();
        }
    }, [refreshLastClock, token]);

    return (
        <View>
        <View style={styles.header}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleProfile} style={styles.headerButton}>
                    <Text style={styles.buttonText}>Profil</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
                    <Text style={styles.buttonText}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
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

                <View style={styles.workingTimesTable}>
                    <Text style={styles.tableTitle}>Working Times</Text>

                    <View style={styles.tableHeader}>
                        <Text style={styles.headerText}>Début</Text>
                        <Text style={styles.headerText}>Fin</Text>
                        <Text style={styles.headerText}>Action</Text>
                    </View>

                    {workingTimes.map((wt, index) => (
                        <View key={index} style={styles.workingTimeRow}>
                            <Text style={styles.workingTimeText}>{moment(wt.start).format('DD/MM/YYYY HH:mm')}</Text>
                            <Text style={styles.workingTimeText}>{moment(wt.end).format('DD/MM/YYYY HH:mm')}</Text>
                            <TouchableOpacity onPress={() => handleDelete(wt.id)} style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <View style={styles.teamsTable}>
                    <Text style={styles.tableTitle}>Teams</Text>
                    {teams.length > 0 ? (
                        teams.map((team, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.teamRow}
                                onPress={() => openTeamDetails(team.team_id)}
                            >
                                <Text style={styles.teamText}>{team.team_name}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noTeamsText}>Aucun team trouvé.</Text>
                    )}
                </View>
                <TeamDetailsModal
                    teamId={selectedTeamId}
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                />
            </View>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        paddingBottom: 10,
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
    workingTimesTable: {
        marginTop: 40,
        width: '100%',
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    workingTimeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    workingTimeText: {
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 12,
    },
    teamsTable: {
        marginTop: 40,
        width: '100%',
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    teamText: {
        fontSize: 14,
    },
    noTeamsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
});
