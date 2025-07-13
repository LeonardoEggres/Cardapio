import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import apiClient from '../../api/client';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function NutricionistUsersScreen() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudents = useCallback(() => {
        setLoading(true);
        apiClient.get('/users')
            .then(response => {
                const alunos = response.data.filter(u => u.role === 'student');
                setStudents(alunos);
            })
            .catch(error => console.error("Erro ao buscar alunos:", error))
            .finally(() => setLoading(false));
    }, []);

    useFocusEffect(fetchStudents);

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alunos Cadastrados</Text>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text>{item.email}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>Nenhum aluno encontrado.</Text>}
                onRefresh={fetchStudents}
                refreshing={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    itemContainer: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemText: { fontSize: 18, fontWeight: 'bold' },
});
