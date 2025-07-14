import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, RefreshControl, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/client';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function StudentMenuScreen() {
    const { user } = useAuth();
    const [preference, setPreference] = useState('day');
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchMenus = useCallback(async (currentPref, dateToFetch) => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let url = '';

            if (currentPref === 'day') {
                const formattedDate = format(dateToFetch, 'yyyy-MM-dd');
                url = `/menus/day/${formattedDate}`;
            } else {
                const startOfWeekDate = format(startOfWeek(dateToFetch, { weekStartsOn: 1 }), 'yyyy-MM-dd');
                url = `/menus/week/${startOfWeekDate}`;
            }

            const response = await apiClient.get(url);
            setMenus(response.data ? (Array.isArray(response.data) ? response.data : [response.data]) : []);
        } catch (error) {
            console.error('Erro ao buscar cardápios:', error.response?.data || error.message);
            Alert.alert('Erro', 'Não foi possível carregar os cardápios.');
            setMenus([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchMenus(preference, currentDate);
        }, [fetchMenus, preference, currentDate])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchMenus(preference, currentDate);
    }, [fetchMenus, preference, currentDate]);

    const handlePrevious = () => {
        if (preference === 'day') {
            setCurrentDate(prevDate => subDays(prevDate, 1));
        } else {
            setCurrentDate(prevDate => subDays(prevDate, 7));
        }
    };

    const handleNext = () => {
        if (preference === 'day') {
            setCurrentDate(prevDate => addDays(prevDate, 1));
        } else {
            setCurrentDate(prevDate => addDays(prevDate, 7));
        }
    };

    const renderMenuItem = (item) => (
        <View key={item.id} style={styles.menuItemContainer}>
            <Text style={styles.menuItemType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}:</Text>
            <Text style={styles.menuItemDescription}>{item.description}</Text>
        </View>
    );

    const renderMenuListItem = ({ item }) => (
        <View style={styles.menuBox}>
            <Text style={styles.menuDate}>
                {item.date ? format(new Date(item.date), 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR }) : 'Data Indisponível'}
            </Text>
            {item.menu_items && item.menu_items.length > 0 ? (
                item.menu_items.map(renderMenuItem)
            ) : (
                <Text style={styles.noMenuItems}>Nenhum item de cardápio para este dia.</Text>
            )}
        </View>
    );

    const displayDateOrWeek = () => {
        if (preference === 'day') {
            return format(currentDate, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR });
        } else {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(start, 'dd/MM', { locale: ptBR })} - ${format(end, 'dd/MM/yyyy', { locale: ptBR })}`;
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando cardápios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Visualização de Cardápios</Text>

            <View style={styles.preferenceToggle}>
                <Pressable
                    onPress={() => {
                        setPreference('day');
                    }}
                    style={[styles.toggleButton, preference === 'day' && styles.toggleButtonActive]}
                >
                    <Text style={[styles.toggleButtonText, preference === 'day' && styles.toggleButtonTextActive]}>Dia</Text>
                </Pressable>
                <Pressable
                    onPress={() => {
                        setPreference('week');
                    }}
                    style={[styles.toggleButton, preference === 'week' && styles.toggleButtonActive]}
                >
                    <Text style={[styles.toggleButtonText, preference === 'week' && styles.toggleButtonTextActive]}>Semana</Text>
                </Pressable>
            </View>

            <View style={styles.navigationContainer}>
                <Pressable onPress={handlePrevious} style={styles.navButton}>
                    <Text style={styles.navButtonText}>{'<'}</Text>
                </Pressable>
                <Text style={styles.currentPeriodText}>{displayDateOrWeek()}</Text>
                <Pressable onPress={handleNext} style={styles.navButton}>
                    <Text style={styles.navButtonText}>{'>'}</Text>
                </Pressable>
            </View>

            <FlatList
                data={menus}
                keyExtractor={(item, index) => (item && item.id != null ? item.id.toString() : `item-${index}`)}
                renderItem={renderMenuListItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <Text style={styles.emptyListText}>
                        Nenhum cardápio disponível para o período selecionado.
                    </Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    preferenceToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        overflow: 'hidden',
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 25,
    },
    toggleButtonActive: {
        backgroundColor: '#007bff',
    },
    toggleButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    toggleButtonTextActive: {
        color: '#fff',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    navButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    navButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    currentPeriodText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    listContainer: {
        paddingBottom: 20
    },
    menuBox: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuDate: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5
    },
    menuItemContainer: {
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    menuItemType: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#555',
        minWidth: 80
    },
    menuItemDescription: {
        fontSize: 16,
        color: '#666',
        flexShrink: 1
    },
    noMenuItems: {
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: '#777',
    }
});