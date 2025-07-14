import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Button,
    Alert,
    Pressable
} from 'react-native';
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
        return <ActivityIndicator size="large" color={styles.colors.primary} style={styles.centered} />;
    }

    if (!menu) {
        return <View style={styles.centered}><Text>Cardápio não encontrado.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cardápio de {new Date(menu.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>

            <View style={styles.card}>
                <Text style={styles.subtitle}>Itens do Cardápio</Text>
                {menu.menu_items?.length > 0 ? (
                    menu.menu_items.map(item => (
                        <View key={item.id} style={styles.itemRow}>
                            <Text style={styles.itemType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}:</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.itemDescription}>Nenhum item cadastrado.</Text>
                )}
            </View>

            {user?.role === 'nutricionist' && (
                <View style={styles.buttonContainer}>
                    <Pressable style={[styles.button, styles.editButton]} onPress={() => router.push(`/menus/edit/${id}`)}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Excluir</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const colors = {
    primary: 'rgb(50, 160, 65)',
    danger: 'rgb(200, 25, 30)',
    black: 'rgb(0, 0, 0)',
    white: '#FFFFFF',
    lightGray: '#f9f9f9',
    mediumGray: '#ccc',
    darkGray: '#555',
};

const styles = StyleSheet.create({
    colors,
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.white,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 25,
        color: colors.black,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.mediumGray,
        paddingBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    itemType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkGray,
        marginRight: 8,
    },
    itemDescription: {
        fontSize: 16,
        color: colors.darkGray,
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 'auto',
        paddingBottom: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: colors.primary,
    },
    deleteButton: {
        backgroundColor: colors.danger,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
