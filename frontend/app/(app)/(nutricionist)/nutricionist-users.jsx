import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import apiClient from '../../../api/client';
import { useFocusEffect } from 'expo-router';

const colors = {
    primary: 'rgb(50, 160, 65)',
    danger: 'rgb(200, 25, 30)',
    black: 'rgb(0, 0, 0)',
    white: '#FFFFFF',
    lightGray: '#f9f9f9',
    mediumGray: '#ccc',
    darkGray: '#555',
    overlay: 'rgba(0,0,0,0.5)',
};
export default function NutricionistUsersScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        apiClient.get('/users')
            .then(response => setUsers(response.data.filter(user => user.role === 'student')))
            .catch(error => console.error("Erro ao buscar usuários:", error))
            .finally(() => setLoading(false));
    }, []);

    useFocusEffect(fetchUsers);

    if (loading) {
        return <ActivityIndicator size="large" color={colors.primary} style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View>
                            <Text style={styles.itemTextName}>{item.name}</Text>
                            <Text style={styles.itemTextEmail}>{item.email}</Text>
                        </View>
                    </View>
                )}
                ListHeaderComponent={() => <Text style={styles.header}>Lista de Alunos</Text>}
                ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>}
                onRefresh={fetchUsers}
                refreshing={loading}
                contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 10 }}
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
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: colors.darkGray,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        marginBottom: 10,
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
