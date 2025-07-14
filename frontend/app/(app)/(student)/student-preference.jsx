import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/client';

export default function StudentPreferenceScreen() {
    const { user } = useAuth();
    const [currentPref, setCurrentPref] = useState('day');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentPreference = async () => {
            if (!user?.id) return;
            
            setInitialLoading(true);
            try {
                const response = await apiClient.get(`/visualization-preferences?user_id=${user.id}`);
                console.log('Preferências recebidas:', response.data);
                
                const preferences = Array.isArray(response.data) ? response.data : [];
                const userPref = preferences.find(p => p.user_id === user.id);
                
                if (userPref) {
                    setCurrentPref(userPref.view_type);
                } else {
                    setCurrentPref('day');
                }
            } catch (error) {
                console.error('Erro ao buscar preferência atual:', error);
                setCurrentPref('day');
            } finally {
                setInitialLoading(false);
            }
        };
        
        fetchCurrentPreference();
    }, [user?.id]);

    const setPreference = async (viewType) => {
        if (!user?.id) {
            Alert.alert('Erro', 'Usuário não identificado.');
            return;
        }
        
        setLoading(true);
        try {
            const response = await apiClient.get(`/visualization-preferences?user_id=${user.id}`);
            const preferences = Array.isArray(response.data) ? response.data : [];
            const existingPref = preferences.find(p => p.user_id === user.id);
            
            if (existingPref) {
                await apiClient.put(`/visualization-preferences/${existingPref.id}`, {
                    view_type: viewType,
                });
                console.log('Preferência atualizada:', viewType);
            } else {
                await apiClient.post('/visualization-preferences', {
                    user_id: user.id,
                    view_type: viewType,
                });
                console.log('Nova preferência criada:', viewType);
            }
            
            setCurrentPref(viewType);
            Alert.alert('Sucesso!', `Preferência alterada para ${viewType === 'day' ? 'Cardápio do Dia' : 'Cardápio da Semana'}`);
            
        } catch (error) {
            console.error('Erro ao salvar preferência:', error);
            const errorMessage = error.response?.data?.message || 'Não foi possível salvar a preferência.';
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando preferências...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Como você prefere visualizar o cardápio?</Text>
            
            <Text style={styles.currentPref}>
                Preferência atual: {currentPref === 'day' ? 'Cardápio do Dia' : 'Cardápio da Semana'}
            </Text>
            
            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <Button
                        title="Cardápio do Dia"
                        onPress={() => setPreference('day')}
                        color={currentPref === 'day' ? '#28a745' : '#007AFF'}
                        disabled={loading}
                    />
                </View>
                
                <View style={styles.buttonWrapper}>
                    <Button
                        title="Cardápio da Semana"
                        onPress={() => setPreference('week')}
                        color={currentPref === 'week' ? '#28a745' : '#007AFF'}
                        disabled={loading}
                    />
                </View>
            </View>
            
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.loadingText}>Salvando preferência...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20,
        backgroundColor: '#fff'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    title: { 
        fontSize: 22, 
        fontWeight: 'bold',
        marginBottom: 20, 
        textAlign: 'center',
        color: '#333'
    },
    currentPref: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic'
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        gap: 15
    },
    buttonWrapper: {
        marginBottom: 10
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    loadingText: {
        marginLeft: 10,
        color: '#666',
        fontSize: 16
    }
});