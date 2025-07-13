import React, { useState, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import apiClient from '../../../../api/client'; 
import { useAuth } from '../../../../context/AuthContext';

export default function EditMenu() {
    const { id } = useLocalSearchParams();
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth();

    useFocusEffect(
        useCallback(() => {
            setPageLoading(true);
            apiClient.get(`/menus/${id}`)
                .then(response => {
                    const formattedDate = new Date(response.data.date).toISOString().split('T')[0];
                    setDate(formattedDate);
                })
                .catch(err => Alert.alert('Erro', 'Não foi possível carregar os dados.'))
                .finally(() => setPageLoading(false));
        }, [id])
    );

    const handleUpdate = () => {
        setLoading(true);
        apiClient.put(`/menus/${id}`, { date })
            .then(() => {
                Alert.alert('Sucesso', 'Cardápio atualizado com sucesso!');
                router.back();
            })
            .catch(error => Alert.alert('Erro', 'Não foi possível atualizar.'))
            .finally(() => setLoading(false));
    };

    if (user?.role === 'student') {
        return null; 
    }

    if (pageLoading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Data do Cardápio (AAAA-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 2025-07-10"
                value={date}
                onChangeText={setDate}
            />
            <Button title={loading ? 'Salvando...' : 'Salvar Alterações'} onPress={handleUpdate} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 },
});