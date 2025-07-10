import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

export default function DailyMenuScreen() {
    const { user } = useAuth();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (!user) return;

            const fetchDailyMenu = async () => {
                try {
                    setLoading(true);
                    // Usando a rota especial que definimos
                    const response = await apiClient.get(`/menus/day/${user.id}`);
                    setMenu(response.data);
                } catch (error) {
                    Alert.alert('Erro', 'Não foi possível carregar o cardápio do dia.');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDailyMenu();
        }, [user])
    );

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            {menu ? (
                <View>
                    <Text style={styles.title}>Cardápio de Hoje ({new Date(menu.date).toLocaleDateString()})</Text>
                    <Text>Exemplo: {menu.menu_items[0]?.description || 'Sem itens'}</Text>
                </View>
            ) : (
                <Text style={styles.title}>Nenhum cardápio para hoje.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
});