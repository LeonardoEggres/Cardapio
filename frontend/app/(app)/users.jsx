import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import apiClient from '../../api/client';
import { useFocusEffect } from 'expo-router';

export default function UsersScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        apiClient.get('/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error("Erro ao buscar usuários:", error))
            .finally(() => setLoading(false));
    }, []);

    useFocusEffect(fetchUsers);

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text>{item.email}</Text>
                    </View>
                )}
                onRefresh={fetchUsers}
                refreshing={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    itemContainer: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemText: { fontSize: 18, fontWeight: 'bold' },
});