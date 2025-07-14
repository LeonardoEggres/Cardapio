import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Pressable,
    ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';
import { FontAwesome } from '@expo/vector-icons';

const colors = {
    primary: 'rgb(50, 160, 65)',
    danger: 'rgb(200, 25, 30)',
    black: 'rgb(0, 0, 0)',
    white: '#FFFFFF',
    lightGray: '#f0f0f0',
    mediumGray: '#ccc',
    darkGray: '#555',
};

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
            Alert.alert('Sucesso!', 'Sua preferência foi salva.');
            router.back();
        } catch (e) {
            console.error("Erro ao salvar preferência:", e.response?.data || e.message);
            Alert.alert('Erro', 'Não foi possível salvar a preferência.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.darkGray }}>Salvando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FontAwesome name="sliders" size={60} color={colors.primary} style={{ marginBottom: 20 }} />
            <Text style={styles.title}>Como você prefere visualizar o cardápio?</Text>
            <Text style={styles.subtitle}>
                Sua escolha será lembrada na próxima vez que abrir o aplicativo.
            </Text>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => setPreference('day')}>
                    <FontAwesome name="calendar-o" size={24} color={colors.white} />
                    <Text style={styles.buttonText}>Cardápio do Dia</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => setPreference('week')}>
                    <FontAwesome name="calendar" size={24} color={colors.white} />
                    <Text style={styles.buttonText}>Cardápio da Semana</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.white,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: colors.black,
    },
    subtitle: {
        fontSize: 16,
        color: colors.darkGray,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 12,
        marginBottom: 15,
        gap: 15,
    },
    buttonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
