import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../../../api/client'; 
import { useAuth } from '../../../../context/AuthContext';

export default function CreateMenu() {
    const { user } = useAuth();
    if (user?.role === 'student') {
        return null;
    }

    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = () => {
        if (!date) {
            Alert.alert('Erro', 'Por favor, insira uma data.');
            return;
        }
        setLoading(true);
        apiClient.post('/menus', { date, created_by: 1 })
            .then(() => {
                Alert.alert('Sucesso', 'Cardápio criado com sucesso!');
                router.back();
            })
            .catch(error => {
                console.error(error.response?.data);
                Alert.alert('Erro', 'Não foi possível criar o cardápio.');
            })
            .finally(() => setLoading(false));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Data do Cardápio (AAAA-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 2025-07-10"
                value={date}
                onChangeText={setDate}
            />
            <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={handleCreate} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 },
});