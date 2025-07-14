import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Text,
    Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '../../../../api/client';
import { useAuth } from '../../../../context/AuthContext';

export default function CreateMenu() {
    const { user } = useAuth();
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (user?.role !== 'nutricionist') {
        return null;
    }

    const handleCreate = () => {
        if (!date) {
            Alert.alert('Erro', 'Por favor, insira uma data.');
            return;
        }
        setLoading(true);
        apiClient.post('/menus', { date, created_by: user.id })
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
            <Text style={styles.title}>Criar Novo Cardápio</Text>
            <Text style={styles.label}>Data do Cardápio (AAAA-MM-DD)</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex: 2025-07-14"
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#999"
            />
            <Pressable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCreate}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Salvando...' : 'Salvar Cardápio'}
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