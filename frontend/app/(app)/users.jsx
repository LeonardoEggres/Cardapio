import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    RefreshControl
} from 'react-native';
import apiClient from '../../api/client';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

const colors = {
    primary: 'rgb(50, 160, 65)',
    danger: 'rgb(200, 25, 30)',
    black: 'rgb(0, 0, 0)',
    white: '#FFFFFF',
    lightGray: '#f9f9f9',
    mediumGray: '#e0e0e0',
    darkGray: '#555',
};

export default function UsersScreen() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    if (user?.role !== 'nutricionist') {
        return null;
    }

    const fetchUsers = useCallback(() => {
        setLoading(true);
        apiClient.get('/users')
            .then(response => {
                const students = response.data.filter(u => u.role === 'student');
                setUsers(students);
            })
            .catch(error => console.error("Erro ao buscar usuários:", error))
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, []);

    useFocusEffect(fetchUsers);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUsers();
    }, [fetchUsers]);

    if (loading && !refreshing) {
        return <ActivityIndicator size="large" color={colors.primary} style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <FontAwesome name="user-circle" size={40} color={colors.primary} />
                        <View style={styles.itemTextContainer}>
                            <Text style={styles.itemTextName}>{item.name}</Text>
                            <Text style={styles.itemTextEmail}>{item.email}</Text>
                        </View>
                    </View>
                )}
                ListHeaderComponent={() => <Text style={styles.header}>Lista de Alunos</Text>}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="users" size={60} color={colors.mediumGray} />
                        <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                    />
                }
                contentContainerStyle={{ paddingHorizontal: 15 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: colors.black,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: colors.darkGray,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 12,
        marginBottom: 10,
        gap: 15,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTextName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
    },
    itemTextEmail: {
        fontSize: 14,
        color: colors.darkGray,
        marginTop: 4,
    },
});
