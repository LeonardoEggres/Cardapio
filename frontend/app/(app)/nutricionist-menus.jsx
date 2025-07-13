import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Pressable, Alert, Modal, TextInput } from 'react-native';
import apiClient from '../../api/client';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

function MenuForm({ onSaved, onCancel, menu }) {
    const [date, setDate] = useState(menu?.date ? new Date(menu.date).toISOString().split('T')[0] : '');
    const [items, setItems] = useState(menu?.menu_items || [
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
        setLoading(true);
        try {
            let menuId = menu?.id;
            if (!menuId) {
                const res = await apiClient.post('/menus', { date });
                menuId = res.data.data.id;
            } else {
                await apiClient.put(`/menus/${menuId}`, { date });
            }
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.id) {
                    await apiClient.put(`/menu-items/${item.id}`, {
                        type: item.type,
                        description: item.description,
                    });
                } else {
                    await apiClient.post('/menu-items', {
                        menu_id: menuId,
                        type: item.type,
                        description: item.description,
                    });
                }
            }
            Alert.alert('Sucesso', 'Cardápio salvo!');
            onSaved();
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível salvar o cardápio.');
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
                placeholder="2025-07-10"
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
            <Button title={loading ? 'Salvando...' : 'Salvar'} onPress={handleSubmit} disabled={loading} />
            <Button title="Cancelar" color="red" onPress={onCancel} />
        </View>
    );
}

export default function NutricionistMenusScreen() {
    const { user } = useAuth();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    const fetchMenus = useCallback(() => {
        setLoading(true);
        apiClient.get('/menus')
            .then(response => setMenus(response.data))
            .catch(error => Alert.alert("Erro ao buscar cardápios:", error.message))
            .finally(() => setLoading(false));
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
                            setMenus(prev => prev.filter(menu => menu.id !== menuId));
                            setSelectedMenu(null);
                            setModalVisible(false);
                            Alert.alert('Sucesso', 'Cardápio apagado!');
                        } catch (e) {
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
            <Pressable onPress={() => handleEdit(item)}>
                <Text style={styles.menuDate}>{new Date(item.date).toLocaleDateString()}</Text>
                {item.menu_items?.map(menuItem => (
                    <Text key={menuItem.id} style={styles.menuItem}>
                        {menuItem.type.charAt(0).toUpperCase() + menuItem.type.slice(1)}: {menuItem.description}
                    </Text>
                ))}
            </Pressable>
            <View style={styles.menuActions}>
                <Button title="Editar" onPress={() => handleEdit(item)} />
                <Button
                    title="Excluir"
                    color="red"
                    onPress={() => handleDelete(item.id)}
                />
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
                ListEmptyComponent={<Text>Nenhum cardápio encontrado.</Text>}
            />
            <Modal visible={modalVisible} animationType="slide">
                <MenuForm
                    menu={selectedMenu}
                    onSaved={handleSaved}
                    onCancel={handleCancel}
                />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    menuBox: { marginBottom: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8 },
    menuDate: { fontWeight: 'bold', marginBottom: 8 },
    menuItem: { fontSize: 16, marginBottom: 5 },
    menuActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    formContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
    formTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    label: { fontWeight: 'bold', marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, fontSize: 16, color: '#000', marginBottom: 10 },
    inputGroup: { marginBottom: 15 },
});
