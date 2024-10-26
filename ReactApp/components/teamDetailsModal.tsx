import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Alert, SafeAreaView} from 'react-native';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {useStorageState} from "@/utils/useStorageState";

interface TeamDetailModalProps {
    teamId: number;
    visible: boolean;
    onClose: () => void;
}

// @ts-ignore
export default function TeamDetailsModal({ teamId, visible, onClose }: TeamDetailModalProps) {
    const [team, setTeam] = useState(null);
    const [teamMembers, setTeamMembers] = useState([])
    const ngrokUrl = process.env.EXPO_PUBLIC_API_URL;
    const [token, setToken] = useStorageState("token");

    const fetchTeamDetails = async () => {

        const myToken = jwtDecode(token[1]);
        const idUser = myToken["sub"];
            const response = await axios.get(`${ngrokUrl}/api/team/users/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });
            const responseTeam = await axios.get(`${ngrokUrl}/api/team/${teamId}`, {
                headers: {
                    Authorization: `Bearer ${token[1]}`,
                }
            });
        setTeam(responseTeam.data.data);
        setTeamMembers(response.data.users);
    };

    useEffect(() => {
        if(!token[0]) {
            fetchTeamDetails();
        }
    }, [teamId]);

    if (!team) return null;

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
                <ScrollView>
                    <Text style={styles.teamTitle}>{team.title}</Text>
                    <Text style={styles.teamSubTitle}>Membres</Text>
                    {teamMembers.map((member, index) => (
                        <View key={index} style={styles.memberRow}>
                            <Text style={[styles.memberText, styles.columnText]}>{member.name}</Text>
                            <Text style={[styles.memberText, styles.columnText]}>
                                {member.is_team_leader ? "Leader" : "Membre"}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeButtonText: {
        color: 'red',
        fontSize: 16,
    },
    teamTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    teamSubTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
    membersTable: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
    },
    memberText: {
        fontSize: 16,
        textAlign: 'left',
    },
    columnText: {
        flex: 1,
        paddingHorizontal: 5,
    },
});
