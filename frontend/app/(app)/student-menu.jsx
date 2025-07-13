import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/client';

export default function StudentMenuScreen() {
    const { user } = useAuth();
    const [preference, setPreference] = useState('day');
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Função auxiliar para formatar a data como AAAA-MM-DD
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Função auxiliar para obter a data de início da semana (domingo)
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const diff = d.getDate() - day; // adjust date to get Sunday
        return new Date(d.setDate(diff));
    };

    // Buscar preferência do usuário
    const fetchPreference = useCallback(async () => {
        if (!user?.id) return;
        
        try {
            const response = await apiClient.get(`/visualization-preferences?user_id=${user.id}`); //
            const preferences = Array.isArray(response.data) ? response.data : []; //
            const userPref = preferences.find(p => p.user_id === user.id); //
            setPreference(userPref?.view_type || 'day'); //
        } catch (error) {
            console.error('Erro ao buscar preferência:', error); //
            setPreference('day'); // Fallback para 'day' //
        }
    }, [user?.id]); //

    // Buscar cardápios baseado na preferência
    const fetchMenus = useCallback(async () => {
        if (!user?.id) return; //
        
        setLoading(true); //
        try {
            let response; //
            const today = new Date();
            const formattedToday = formatDate(today); // Data de hoje formatada
            const startOfWeek = formatDate(getStartOfWeek(today)); // Data de início da semana formatada

            if (preference === 'week') { //
                // Ajustado para passar o userId e a data de início da semana
                response = await apiClient.get(`/menus/week/${user.id}/${startOfWeek}`); //
                console.log('Cardápio semanal recebido:', response.data); //
            } else { //
                // Ajustado para passar o userId e a data atual
                response = await apiClient.get(`/menus/day/${user.id}/${formattedToday}`); //
                console.log('Cardápio diário recebido:', response.data); //
            }
            
            // Processar resposta //
            let menusData = []; //
            if (response.data) { //
                if (Array.isArray(response.data)) { //
                    menusData = response.data.filter(menu => menu != null); //
                } else {
                    menusData = [response.data]; //
                }
            }
            
            setMenus(menusData); //
        } catch (error) {
            console.error('Erro ao buscar cardápios:', error.response?.data || error.message); //
            Alert.alert('Erro', 'Não foi possível carregar o cardápio.'); //
            setMenus([]); //
        } finally {
            setLoading(false); //
        }
    }, [user?.id, preference]); //

    // Carregar preferência quando a tela ganhar foco //
    useFocusEffect( //
        useCallback(() => { //
            fetchPreference(); //
        }, [fetchPreference]) //
    ); //

    // Carregar cardápios quando a preferência mudar //
    useFocusEffect( //
        useCallback(() => { //
            if (preference) { //
                fetchMenus(); //
            }
        }, [fetchMenus, preference]) //
    ); //

    const onRefresh = useCallback(async () => { //
        setRefreshing(true); //
        await fetchPreference(); //
        await fetchMenus(); //
        setRefreshing(false); //
    }, [fetchPreference, fetchMenus]); //

    const renderMenuItem = ({ item }) => { //
        if (!item) return null; //
        
        return (
            <View style={styles.menuBox}>
                <Text style={styles.menuDate}>
                    {item.date ? new Date(item.date).toLocaleDateString('pt-BR') : 'Data não disponível'}
                </Text>
                
                {item.menu_items && item.menu_items.length > 0 ? ( //
                    item.menu_items.map(menuItem => ( //
                        <View key={menuItem.id || menuItem.type} style={styles.menuItemContainer}>
                            <Text style={styles.menuItemType}>
                                {menuItem.type.charAt(0).toUpperCase() + menuItem.type.slice(1)}:
                            </Text>
                            <Text style={styles.menuItemDescription}>
                                {menuItem.description || 'Sem descrição'}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noItemsText}>Nenhum item no cardápio</Text> //
                )}
            </View>
        );
    };

    if (loading && !refreshing) { //
        return <ActivityIndicator size="large" style={styles.centered} />; //
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {preference === 'week' ? 'Cardápio da Semana' : 'Cardápio do Dia'}
            </Text>
            
            <FlatList
                data={menus} //
                keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()} //
                renderItem={renderMenuItem} //
                contentContainerStyle={styles.listContainer} //
                refreshControl={ //
                    <RefreshControl //
                        refreshing={refreshing} //
                        onRefresh={onRefresh} //
                    />
                }
                ListEmptyComponent={ //
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {preference === 'week' 
                                ? 'Nenhum cardápio semanal encontrado.' 
                                : 'Nenhum cardápio para hoje.'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 15,
        backgroundColor: '#fff' 
    },
    centered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center',
        color: '#333'
    },
    listContainer: {
        paddingBottom: 20
    },
    menuBox: { 
        marginBottom: 15, 
        padding: 15, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee'
    },
    menuDate: { 
        fontWeight: 'bold', 
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
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
        flex: 1,
        marginLeft: 10
    },
    noItemsText: {
        fontStyle: 'italic',
        color: '#999',
        textAlign: 'center',
        marginTop: 10
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    }
});