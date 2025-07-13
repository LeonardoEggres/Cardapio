import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

export default function StudentPreferenceScreen() {
    const { user } = useAuth();
    const [currentPref, setCurrentPref] = useState('day');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPref = async () => {
            try {
                const prefRes = await apiClient.get(`/visualization-preferences?user_id=${user.id}`);
                const pref = prefRes.data.find(p => p.user_id === user.id);
                setCurrentPref(pref?.view_type || 'day');
            } catch {
                setCurrentPref('day');
            }
        };
        fetchPref();
    }, [user]);

    const setPreference = async (viewType) => {
        setLoading(true);
        try {
            const prefRes = await apiClient.get(`/visualization-preferences?user_id=${user.id}`);
            const pref = prefRes.data.find(p => p.user_id === user.id);
            if (pref) {
                await apiClient.put(`/visualization-preferences/${pref.id}`, {
                    view_type: viewType,
                });
            } else {
                await apiClient.post('/visualization-preferences', {
                    user_id: user.id,
                    view_type: viewType,
                });
            }
            setCurrentPref(viewType);
            Alert.alert('Preferência salva!');
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível salvar a preferência.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Como você prefere visualizar o cardápio?</Text>
            <Button
                title="Cardápio do Dia"
                onPress={() => setPreference('day')}
                color={currentPref === 'day' ? 'green' : 'gray'}
                disabled={loading}
            />
            <Button
                title="Cardápio da Semana"
                onPress={() => setPreference('week')}
                color={currentPref === 'week' ? 'green' : 'gray'}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 22, marginBottom: 30, textAlign: 'center' },
});
