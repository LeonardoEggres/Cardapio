import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, RefreshControl, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/client';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FontAwesome } from '@expo/vector-icons';

const colors = {
    primary: 'rgb(50, 160, 65)',
    danger: 'rgb(200, 25, 30)',
    black: 'rgb(0, 0, 0)',
    white: '#FFFFFF',
    lightGray: '#f9f9f9',
    mediumGray: '#e0e0e0',
    darkGray: '#555',
};

export default function StudentMenuScreen() {
    const { user } = useAuth();
    const [preference, setPreference] = useState('week');
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
        const newDate = preference === 'day' ? subDays(currentDate, 1) : subDays(currentDate, 7);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = preference === 'day' ? addDays(currentDate, 1) : addDays(currentDate, 7);
        setCurrentDate(newDate);
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
                {item.date ? format(new Date(item.date), "EEEE, dd 'de' MMMM", { locale: ptBR }) : 'Data Indisponível'}
            </Text>
            {item.menu_items && item.menu_items.length > 0 ? (
                item.menu_items.map(renderMenuItem)
            ) : (
                <Text style={styles.noMenuItems}>Nenhum item cadastrado para este dia.</Text>
            )}
        </View>
    );

    const displayDateOrWeek = () => {
        if (preference === 'day') {
            return format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        } else {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const end = endOfWeek(currentDate, { weekStartsOn: 1 });
            return `${format(start, 'dd/MM')} - ${format(end, 'dd/MM/yy')}`;
        }
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.darkGray }}>Carregando cardápio...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.preferenceToggle}>
                <Pressable
                    onPress={() => setPreference('day')}
                    style={[styles.toggleButton, preference === 'day' && styles.toggleButtonActive]}
                >
                    <Text style={[styles.toggleButtonText, preference === 'day' && styles.toggleButtonTextActive]}>Dia</Text>
                </Pressable>
                <Pressable
                    onPress={() => setPreference('week')}
                    style={[styles.toggleButton, preference === 'week' && styles.toggleButtonActive]}
                >
                    <Text style={[styles.toggleButtonText, preference === 'week' && styles.toggleButtonTextActive]}>Semana</Text>
                </Pressable>
            </View>

            <View style={styles.navigationContainer}>
                <Pressable onPress={handlePrevious} style={styles.navButton}>
                    <FontAwesome name="chevron-left" size={18} color={colors.primary} />
                </Pressable>
                <Text style={styles.currentPeriodText}>{displayDateOrWeek()}</Text>
                <Pressable onPress={handleNext} style={styles.navButton}>
                    <FontAwesome name="chevron-right" size={18} color={colors.primary} />
                </Pressable>
            </View>

            <FlatList
                data={menus}
                keyExtractor={(item, index) => (item?.id ? item.id.toString() : `item-${index}`)}
                renderItem={renderMenuListItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="calendar-times-o" size={60} color={colors.mediumGray} />
                        <Text style={styles.emptyListText}>
                            Nenhum cardápio disponível para o período selecionado.
                        </Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}  
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
        backgroundColor: colors.white,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    preferenceToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        backgroundColor: colors.mediumGray,
        borderRadius: 25,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    toggleButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    toggleButtonActive: {
        backgroundColor: colors.primary,
        borderRadius: 25,
    },
    toggleButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.darkGray,
    },
    toggleButtonTextActive: {
        color: colors.white,
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
    },
    currentPeriodText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.black,
    },
    listContainer: {
        paddingBottom: 20
    },
    menuBox: {
        marginBottom: 15,
        padding: 20,
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    menuDate: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
        color: colors.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.mediumGray,
        paddingBottom: 10,
        textTransform: 'capitalize',
    },
    menuItemContainer: {
        marginBottom: 10,
        flexDirection: 'row',
    },
    menuItemType: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.darkGray,
        width: 80, 
    },
    menuItemDescription: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    noMenuItems: {
        fontStyle: 'italic',
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: colors.darkGray,
        lineHeight: 24,
    }
});
