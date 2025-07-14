import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import apiClient from '../../../../api/client';
import { useAuth } from '../../../../context/AuthContext';

export default function MenuDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMenu = useCallback(() => {
        setLoading(true);
        apiClient.get(`/menus/${id}`)
            .then(response => setMenu(response.data))
            .catch(error => {
                console.error(error);
                Alert.alert('Erro', 'Não foi possível carregar os detalhes do cardápio.');
            })
            .finally(() => setLoading(false));
    }, [id]);

    useFocusEffect(fetchMenu);

    const handleDelete = () => {
        Alert.alert(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir este cardápio?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        apiClient.delete(`/menus/${id}`)
                            .then(() => {
                                Alert.alert('Sucesso', 'Cardápio excluído com sucesso!');
                                router.back();
                            })
                            .catch(error => {
                                console.error(error);
                                Alert.alert('Erro', 'Não foi possível excluir o cardápio.');
                            });
                    },
                },
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    if (!menu) {
        return <View style={styles.centered}><Text>Cardápio não encontrado.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cardápio de {new Date(menu.date).toLocaleDateString()}</Text>
            <Text style={styles.subtitle}>Itens:</Text>
            {menu.menu_items?.map(item => (
                <Text key={item.id} style={styles.item}>{item.description}</Text>
            ))}
            {user?.role === 'nutricionist' && (
                <View style={styles.buttonContainer}>
                    <Button title="Editar" onPress={() => router.push(`/menus/edit/${id}`)} />
                    <Button title="Excluir" color="red" onPress={handleDelete} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
    item: { fontSize: 16, marginBottom: 5 },
    buttonContainer: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-around' },
});