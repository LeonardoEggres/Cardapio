import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert, Modal, TextInput } from 'react-native';
import apiClient from '../../api/client';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

function MenuForm({ onSaved, onCancel, menu, user }) { 
    const [date, setDate] = useState(menu?.date ? new Date(menu.date).toISOString().split('T')[0] : '');
    const [items, setItems] = useState(menu?.menu_items?.length ? menu.menu_items : [
        { type: 'café', description: '' },
        { type: 'almoço', description: '' },
        { type: 'janta', description: '' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleChange = (index, value) => {
        const newItems = [...items];
        newItems[index].description = value;
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (!date) {
            Alert.alert('Erro', 'A data é obrigatória.');
            return;
        }
        
        setLoading(true);
        try {
            let menuId = menu?.id;

            // Criar ou atualizar o menu
            if (!menuId) {
                const res = await apiClient.post('/menus', { 
                    date, 
                    created_by: user.id 
                });
                menuId = res.data.data ? res.data.data.id : res.data.id;
            } else {
                await apiClient.put(`/menus/${menuId}`, { date });
            }

            // Processar os itens do menu
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.id) {
                    // Atualizar item existente
                    await apiClient.put(`/menu-items/${item.id}`, {
                        type: item.type,
                        description: item.description,
                    });
                } else {
                    // Criar novo item
                    await apiClient.post('/menu-items', {
                        menu_id: menuId,
                        type: item.type,
                        description: item.description,
                    });
                }
            }
            
            Alert.alert('Sucesso', 'Cardápio salvo com sucesso!');
            onSaved();
        } catch (e) {
            console.error('Erro ao salvar cardápio:', e);
            const errorMsg = e.response?.data?.errors
                ? Object.values(e.response.data.errors).flat().join('\n')
                : e.response?.data?.message || 'Não foi possível salvar o cardápio.';
            Alert.alert('Erro', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{menu ? 'Editar Cardápio' : 'Novo Cardápio'}</Text>
            
            <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
            <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="AAAA-MM-DD"
            />
            
            {items.map((item, idx) => (
                <View key={item.type} style={styles.inputGroup}>
                    <Text style={styles.label}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
                    <TextInput
                        style={styles.input}
                        value={item.description}
                        onChangeText={text => handleChange(idx, text)}
                        placeholder={`Descrição para ${item.type}`}
                    />
                </View>
            ))}
            
            <View style={styles.buttonGroup}>
                <Button 
                    title={loading ? 'Salvando...' : 'Salvar'} 
                    onPress={handleSubmit} 
                    disabled={loading} 
                />
                <Button title="Cancelar" color="gray" onPress={onCancel} />
            </View>
        </View>
    );
}

export default function NutricionistMenusScreen() {
    const { user } = useAuth();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    const fetchMenus = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/menus');
            console.log('Menus recebidos:', response.data);
            
            // Garantir que sempre temos um array
            const menusData = Array.isArray(response.data) ? response.data : 
                            response.data.data ? response.data.data : [];
            
            setMenus(menusData);
        } catch (error) {
            console.error('Erro ao buscar cardápios:', error);
            Alert.alert('Erro', 'Não foi possível carregar os cardápios.');
            setMenus([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(fetchMenus);

    const handleDelete = async (menuId) => {
        Alert.alert(
            'Confirmar Exclusão', 
            'Deseja realmente excluir este cardápio?', 
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await apiClient.delete(`/menus/${menuId}`);
                            Alert.alert('Sucesso', 'Cardápio excluído com sucesso!');
                            fetchMenus(); // Recarregar a lista
                        } catch (error) {
                            console.error('Erro ao excluir cardápio:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o cardápio.');
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = (menu) => {
        setSelectedMenu(menu);
        setModalVisible(true);
    };

    const handleCreate = () => {
        setSelectedMenu(null);
        setModalVisible(true);
    };

    const handleSaved = () => {
        setModalVisible(false);
        setSelectedMenu(null);
        fetchMenus();
    };

    const handleCancel = () => {
        setModalVisible(false);
        setSelectedMenu(null);
    };

    const renderItem = ({ item }) => (
        <View style={styles.menuBox}>
            <View style={styles.menuContent}>
                <Text style={styles.menuDate}>
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                </Text>
                {item.menu_items?.map(menuItem => (
                    <Text key={menuItem.id} style={styles.menuItem}>
                        <Text style={styles.menuItemType}>
                            {menuItem.type.charAt(0).toUpperCase() + menuItem.type.slice(1)}:
                        </Text> {menuItem.description}
                    </Text>
                ))}
            </View>
            <View style={styles.menuActions}>
                <Button title="Editar" onPress={() => handleEdit(item)} />
                <Button title="Excluir" color="red" onPress={() => handleDelete(item.id)} />
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <Button title="Novo Cardápio" onPress={handleCreate} />
            <FlatList
                data={menus}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cardápio encontrado.</Text>}
            />
            <Modal visible={modalVisible} animationType="slide" onRequestClose={handleCancel}>
                <MenuForm
                    user={user}
                    menu={selectedMenu}
                    onSaved={handleSaved}
                    onCancel={handleCancel}
                />
            </Modal>
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
    listContainer: {
        paddingVertical: 15
    },
    menuBox: { 
        marginBottom: 15, 
        padding: 15, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee'
    },
    menuContent: {
        marginBottom: 10
    },
    menuDate: { 
        fontWeight: 'bold', 
        fontSize: 18, 
        marginBottom: 8, 
        color: '#333' 
    },
    menuItem: { 
        fontSize: 16, 
        marginBottom: 5, 
        color: '#555' 
    },
    menuItemType: {
        fontWeight: 'bold'
    },
    menuActions: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        gap: 10 
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666'
    },
    // Estilos do formulário
    formContainer: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#fff', 
        justifyContent: 'center' 
    },
    formTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    label: { 
        fontWeight: 'bold', 
        marginBottom: 5, 
        fontSize: 16 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        padding: 10, 
        fontSize: 16, 
        marginBottom: 10,
        backgroundColor: '#f9f9f9'
    },
    inputGroup: { 
        marginBottom: 15 
    },
    buttonGroup: {
        gap: 10
    }
});