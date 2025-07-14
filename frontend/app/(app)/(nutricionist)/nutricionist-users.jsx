import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import apiClient from '../../../api/client'; 
import { useFocusEffect } from 'expo-router';

export default function NutricionistUsersScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        apiClient.get('/users')
            .then(response => setUsers(response.data.filter(user => user.role === 'student'))) // Filtra para mostrar apenas alunos
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
                        <View>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Text>{item.email}</Text>
                        </View>
                    </View>
                )}
                ListHeaderComponent={() => <Text style={styles.header}>Lista de Alunos</Text>}
                ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>}
                onRefresh={fetchUsers}
                refreshing={loading}
                contentContainerStyle={{ padding: 10 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: 'gray',
    },
});