import React, { useState, useCallback } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Text,
    ActivityIndicator,
    Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import apiClient from '../../../../../api/client';
import { useAuth } from '../../../../../context/AuthContext';

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
        return <ActivityIndicator size="large" color={styles.colors.primary} style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Cardápio</Text>
            <Text style={styles.label}>Data do Cardápio</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 2025-07-14"
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#999"
            />
            <Pressable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleUpdate}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Text>
            </Pressable>
        </View>
    );
}

const colors = {
    primary: 'rgb(50, 160, 65)',
    danger: 'rgb(200, 25, 30)',
    black: 'rgb(0, 0, 0)',
    white: '#FFFFFF',
    lightGray: '#f0f0f0',
    mediumGray: '#ccc',
};

const styles = StyleSheet.create({
    colors, 
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '600',
        color: colors.black,
    },
    input: {
        height: 50,
        borderColor: colors.mediumGray,
        borderWidth: 1,
        marginBottom: 25,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: colors.lightGray,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: colors.mediumGray,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});