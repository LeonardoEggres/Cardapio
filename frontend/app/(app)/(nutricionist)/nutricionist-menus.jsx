import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Pressable,
    Alert,
    Modal,
    TextInput,
} from "react-native";
import apiClient from "../../../api/client";
import { useFocusEffect } from "expo-router";
import { useAuth } from "../../../context/AuthContext";

const colors = {
    primary: 'rgb(50, 160, 65)',
    danger: 'rgb(200, 25, 30)',
    black: 'rgb(0, 0, 0)',
    white: '#FFFFFF',
    lightGray: '#f9f9f9',
    mediumGray: '#ccc',
    darkGray: '#555',
    overlay: 'rgba(0,0,0,0.5)',
};

function ConfirmationModal({ isVisible, onConfirm, onCancel }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalCenteredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
                    <Text style={styles.modalText}>
                        Deseja realmente excluir este cardápio?
                    </Text>
                    <View style={styles.modalButtonContainer}>
                        <Pressable style={[styles.buttonBase, styles.modalCancelButton]} onPress={onCancel}>
                            <Text style={[styles.buttonText, { color: colors.darkGray }]}>Cancelar</Text>
                        </Pressable>
                        <Pressable style={[styles.buttonBase, styles.modalConfirmButton]} onPress={onConfirm}>
                            <Text style={styles.buttonText}>Excluir</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function MenuForm({ onSaved, onCancel, menu, user }) {
    const [date, setDate] = useState(
        menu?.date ? new Date(menu.date).toISOString().split("T")[0] : ""
    );
    const [items, setItems] = useState(
        menu?.menu_items?.length
            ? menu.menu_items
            : [
                { type: "café", description: "" },
                { type: "almoço", description: "" },
                { type: "janta", description: "" },
            ]
    );
    const [loading, setLoading] = useState(false);

    const handleChange = (index, value) => {
        const newItems = [...items];
        newItems[index].description = value;
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (!date) {
            Alert.alert("Erro", "A data é obrigatória.");
            return;
        }
        setLoading(true);
        try {
            let menuId = menu?.id;
            if (!menuId) {
                const res = await apiClient.post("/menus", { date, created_by: user.id });
                menuId = res.data.data.id;
            } else {
                await apiClient.put(`/menus/${menuId}`, { date });
            }
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.id) {
                    await apiClient.put(`/menu-items/${item.id}`, { type: item.type, description: item.description });
                } else {
                    await apiClient.post("/menu-items", { menu_id: menuId, type: item.type, description: item.description });
                }
            }
            Alert.alert("Sucesso", "Cardápio salvo!");
            onSaved();
        } catch (e) {
            const errorMsg = e.response?.data?.errors ? Object.values(e.response.data.errors).flat().join("\n") : e.response?.data?.message || "Não foi possível salvar o cardápio.";
            Alert.alert("Erro", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
                {menu ? "Editar Cardápio" : "Novo Cardápio"}
            </Text>
            <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
            <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#999"
            />
            {items.map((item, idx) => (
                <View key={item.type} style={styles.inputGroup}>
                    <Text style={styles.label}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Text>
                    <TextInput
                        style={styles.input}
                        value={item.description}
                        onChangeText={(text) => handleChange(idx, text)}
                        placeholder={`Descrição para ${item.type}`}
                        placeholderTextColor="#999"
                    />
                </View>
            ))}
            <View style={{ gap: 10, marginTop: 20 }}>
                <Pressable style={[styles.buttonBase, styles.primaryButton, loading && styles.disabledButton]} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar"}</Text>
                </Pressable>
                <Pressable style={[styles.buttonBase, styles.cancelButton]} onPress={onCancel}>
                    <Text style={[styles.buttonText, { color: colors.darkGray }]}>Cancelar</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function NutricionistMenusScreen() {
    const { user } = useAuth();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
    const [menuToDeleteId, setMenuToDeleteId] = useState(null);

    const fetchMenus = useCallback(() => {
        setLoading(true);
        apiClient.get("/menus")
            .then(response => setMenus(response.data))
            .catch(error => Alert.alert("Erro", "Não foi possível buscar os cardápios."))
            .finally(() => setLoading(false));
    }, []);

    useFocusEffect(fetchMenus);

    const handleConfirmDelete = async () => {
        if (!menuToDeleteId) return;
        setIsDeleteConfirmationVisible(false);
        try {
            await apiClient.delete(`/menus/${menuToDeleteId}`);
            Alert.alert("Sucesso", "Cardápio apagado!");
            setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== menuToDeleteId));
        } catch (e) {
            const errorMsg = e.response?.data?.message || "Não foi possível excluir o cardápio.";
            Alert.alert("Erro", errorMsg);
        } finally {
            setMenuToDeleteId(null);
        }
    };

    const handleDeletePress = (menuId) => {
        setMenuToDeleteId(menuId);
        setIsDeleteConfirmationVisible(true);
    };

    const handleEdit = (menu) => { setSelectedMenu(menu); setFormModalVisible(true); };
    const handleCreate = () => { setSelectedMenu(null); setFormModalVisible(true); };
    const handleCancelForm = () => { setFormModalVisible(false); setSelectedMenu(null); };
    const handleSaved = () => { setFormModalVisible(false); setSelectedMenu(null); fetchMenus(); };

    const renderItem = ({ item }) => (
        <View style={styles.menuBox}>
            <View>
                <Text style={styles.menuDate}>
                    {new Date(item.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                </Text>
                {item.menu_items?.map((menuItem) => (
                    <Text key={menuItem.id} style={styles.menuItem}>
                        <Text style={{ fontWeight: "bold" }}>
                            {menuItem.type.charAt(0).toUpperCase() + menuItem.type.slice(1)}:
                        </Text>{" "}
                        {menuItem.description}
                    </Text>
                ))}
            </View>
            <View style={styles.menuActions}>
                <Pressable style={[styles.actionButton, styles.editButton]} onPress={() => handleEdit(item)}>
                    <Text style={styles.actionButtonText}>Editar</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeletePress(item.id)}>
                    <Text style={styles.actionButtonText}>Excluir</Text>
                </Pressable>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color={colors.primary} style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <Pressable style={[styles.buttonBase, styles.primaryButton]} onPress={handleCreate}>
                <Text style={styles.buttonText}>Novo Cardápio</Text>
            </Pressable>
            <FlatList
                data={menus}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 20 }}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum cardápio encontrado.</Text>}
            />

            <Modal visible={formModalVisible} animationType="slide" onRequestClose={handleCancelForm}>
                <MenuForm user={user} menu={selectedMenu} onSaved={handleSaved} onCancel={handleCancelForm} />
            </Modal>

            <ConfirmationModal
                isVisible={isDeleteConfirmationVisible}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsDeleteConfirmationVisible(false);
                    setMenuToDeleteId(null);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: colors.white },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.white },
    emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: colors.darkGray },
    menuBox: {
        marginBottom: 15,
        padding: 20,
        backgroundColor: colors.lightGray,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    menuDate: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 12,
        color: colors.primary,
    },
    menuItem: { fontSize: 16, marginBottom: 8, color: colors.darkGray, lineHeight: 22 },
    menuActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    actionButtonText: {
        color: colors.white,
        fontWeight: '600',
    },
    editButton: { backgroundColor: colors.primary },
    deleteButton: { backgroundColor: colors.danger },

    formContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.white,
        justifyContent: "center",
    },
    formTitle: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: colors.black,
    },
    label: { fontWeight: "600", marginBottom: 8, fontSize: 16, color: colors.black },
    input: {
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: colors.lightGray,
    },
    inputGroup: { marginBottom: 20 },

    buttonBase: {
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryButton: {
        backgroundColor: colors.primary,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    disabledButton: {
        backgroundColor: colors.mediumGray,
    },

    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.overlay,
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "85%",
        maxWidth: 400,
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: colors.black,
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontSize: 16,
        color: colors.darkGray,
        lineHeight: 22,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalConfirmButton: {
        backgroundColor: colors.danger,
        flex: 1,
        marginLeft: 5,
    },
    modalCancelButton: {
        backgroundColor: '#e0e0e0',
        flex: 1,
        marginRight: 5,
    },
});
