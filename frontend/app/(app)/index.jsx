import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Pressable } from 'react-native';
import apiClient from '../../api/client';
import { useFocusEffect, useRouter } from 'expo-router';

export default function HomeScreen() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchMenus = useCallback(() => {
        setLoading(true);
        apiClient.get('/menus')
            .then(response => setMenus(response.data))
            .catch(error => console.error("Erro ao buscar cardápios:", error))
            .finally(() => setLoading(false));
    }, []);

    useFocusEffect(fetchMenus);

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <Button title="Criar Novo Cardápio" onPress={() => router.push('/menus/create')} />
            <FlatList
                data={menus}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={<Text style={styles.listTitle}>Todos os Cardápios</Text>}
                renderItem={({ item }) => (
                    <Pressable onPress={() => router.push(`/menus/${item.id}`)}>
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemText}>Cardápio de {new Date(item.date).toLocaleDateString()}</Text>
                        </View>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={styles.centeredText}>Nenhum cardápio encontrado.</Text>}
                onRefresh={fetchMenus}
                refreshing={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    centeredText: { textAlign: 'center', marginTop: 20 },
    listTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
    itemContainer: { padding: 15, backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 10 },
    itemText: { fontSize: 18 },
});