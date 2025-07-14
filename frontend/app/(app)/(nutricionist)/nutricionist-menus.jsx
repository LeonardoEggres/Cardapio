import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  Pressable,
  Alert, 
  Modal,
  TextInput,
} from "react-native";
import apiClient from "../../../api/client";
import { useFocusEffect } from "expo-router";
import { useAuth } from "../../../context/AuthContext";

function ConfirmationModal({ isVisible, onConfirm, onCancel }) {
  return (
    <Modal
      animationType="fade" 
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel} 
    >
      <View style={customModalStyles.centeredView}>
        <View style={customModalStyles.modalView}>
          <Text style={customModalStyles.modalTitle}>Confirmar Exclusão</Text>
          <Text style={customModalStyles.modalText}>
            Deseja realmente excluir este cardápio?
          </Text>
          <View style={customModalStyles.buttonContainer}>
            <Button title="Cancelar" onPress={onCancel} color="#888" />
            <Button title="Excluir" onPress={onConfirm} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const customModalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", 
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",  
    maxWidth: 400, 
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
    gap: 10, 
  },
});


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
        const res = await apiClient.post("/menus", {
          date,
          created_by: user.id,
        });
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
          await apiClient.post("/menu-items", {
            menu_id: menuId,
            type: item.type,
            description: item.description,
          });
        }
      }
      Alert.alert("Sucesso", "Cardápio salvo!");
      onSaved();
    } catch (e) {
      const errorMsg = e.response?.data?.errors
        ? Object.values(e.response.data.errors).flat().join("\n")
        : e.response?.data?.message || "Não foi possível salvar o cardápio.";
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
          />
        </View>
      ))}
      <View style={{ gap: 10 }}>
        <Button
          title={loading ? "Salvando..." : "Salvar"}
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

  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [menuToDeleteId, setMenuToDeleteId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchMenus = async () => {
        setLoading(true);
        try {
          const response = await apiClient.get("/menus");
          setMenus(response.data);
        } catch (error) {
          Alert.alert("Erro ao buscar cardápios:", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMenus();
    }, [])
  );

  const handleConfirmDelete = async () => {
    setIsDeleteConfirmationVisible(false); 
    if (menuToDeleteId) {
      try {
        await apiClient.delete(`/menus/${menuToDeleteId}`);
        Alert.alert("Sucesso", "Cardápio apagado!");
        setMenus((prevMenus) =>
          prevMenus.filter((menu) => menu.id !== menuToDeleteId)
        );
      } catch (e) {
        console.error("Erro ao excluir cardápio:", e);
        const errorMsg =
          e.response?.data?.message || "Não foi possível excluir o cardápio.";
        Alert.alert("Erro", errorMsg);
      } finally {
        setMenuToDeleteId(null); 
      }
    }
  };

  const handleDelete = (menuId) => {
    setMenuToDeleteId(menuId); 
    setIsDeleteConfirmationVisible(true); 
  };

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setModalVisible(true);
  };
  const handleCreate = () => {
    setSelectedMenu(null);
    setModalVisible(true);
  };
  const handleCancel = () => {
    setModalVisible(false);
    setSelectedMenu(null);
  };

  const handleSaved = () => {
    setModalVisible(false);
    setSelectedMenu(null);
    const refetch = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/menus");
        setMenus(response.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível recarregar os cardápios.");
      } finally {
        setLoading(false);
      }
    };
    refetch();
  };

  const renderItem = ({ item }) => (
    <View style={styles.menuBox}>
      <View>
        <Text style={styles.menuDate}>
          {new Date(item.date).toLocaleDateString()}
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 20 }}
        ListEmptyComponent={<Text>Nenhum cardápio encontrado.</Text>}
      />
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <MenuForm
          user={user}
          menu={selectedMenu}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
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
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  menuBox: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  menuDate: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  menuItem: { fontSize: 16, marginBottom: 5, color: "#555" },
  menuActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontWeight: "bold", marginBottom: 5, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  inputGroup: { marginBottom: 15 },
});
