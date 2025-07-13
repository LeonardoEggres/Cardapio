import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

export default function StudentMenuScreen() {
    const { user } = useAuth();
    const [preference, setPreference] = useState('day');
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const fetchPreference = async () => {
                try {
                    setLoading(true);
                    const prefRes = await apiClient.get(`/visualization-preferences?user_id=${user.id}`);
                    const pref = prefRes.data.find(p => p.user_id === user.id);
                    setPreference(pref?.view_type || 'day');
                } catch (error) {
                    setPreference('day');
                }
            };
            fetchPreference();
        }, [user])
    );

    useFocusEffect(
        useCallback(() => {
            if (!user) return;
            const fetchMenu = async () => {
                try {
                    setLoading(true);
                    let response;
                    if (preference === 'week') {
                        response = await apiClient.get(`/menus/week/${user.id}`);
                        setMenus(Array.isArray(response.data) ? response.data : []);
                    } else {
                        response = await apiClient.get(`/menus/day/${user.id}`);
                        setMenus(response.data ? [response.data] : []);
                    }
                } catch (error) {
                    Alert.alert('Erro', 'Não foi possível carregar o cardápio.');
                    setMenus([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchMenu();
        }, [user, preference])
    );

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    if (!menus.length) {
        return <View style={styles.centered}><Text>Nenhum cardápio encontrado.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {preference === 'week' ? 'Cardápio da Semana' : 'Cardápio do Dia'}
            </Text>
            <FlatList
                data={menus.filter(Boolean)}
                keyExtractor={item => item?.id ? item.id.toString() : Math.random().toString()}
                renderItem={({ item }) => (
                    <View style={styles.menuBox}>
                        <Text style={styles.menuDate}>
                            {item.date ? new Date(item.date).toLocaleDateString() : 'Sem data'}
                        </Text>
                        {item.menu_items?.map(menuItem => (
                            <Text key={menuItem.id || menuItem.type} style={styles.menuItem}>
                                {menuItem.type.charAt(0).toUpperCase() + menuItem.type.slice(1)}: {menuItem.description}
                            </Text>
                        ))}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    menuBox: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 },
    menuDate: { fontWeight: 'bold', marginBottom: 8 },
    menuItem: { fontSize: 16, marginBottom: 5 },
});
