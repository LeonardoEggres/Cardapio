import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client'; 

export default function PreferenceScreen() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const setPreference = async (viewType) => {
        setLoading(true);
        try {
            await apiClient.post('/visualization-preferences', {
                user_id: user.id,
                view_type: viewType,
            });
            Alert.alert('Preferência salva!');
            if (viewType === 'day') {
                router.push('/daily-menu');
            } else {
                router.push('/weekly-menu');
            }
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível salvar a preferência.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Como você prefere visualizar o cardápio?</Text>
            <Button title="Cardápio do Dia" onPress={() => setPreference('day')} disabled={loading} />
            <Button title="Cardápio da Semana" onPress={() => setPreference('week')} disabled={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 22, marginBottom: 30, textAlign: 'center' },
});
