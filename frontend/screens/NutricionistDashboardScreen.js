import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import MenuForm from '../components/MenuForm';

export default function NutricionistDashboardScreen() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const fetchMenus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/menus', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMenus(response.data);
    } catch (error) {
      console.error('Erro ao buscar cardápios:', error);
      Alert.alert('Erro', 'Falha ao buscar os cardápios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
  };

  const handleSaved = () => {
    setSelectedMenu(null);
    fetchMenus();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleEdit(item)}>
      <Text style={styles.menuDate}>📅 Data: {item.date}</Text>
      <View style={styles.menuItemList}>
        {item.menu_items && item.menu_items.length > 0 ? (
          item.menu_items.map((menuItem, index) => (
            <Text key={index} style={styles.menuText}>
              🍽️ <Text style={{ fontWeight: 'bold' }}>{menuItem.type}:</Text> {menuItem.description}
            </Text>
          ))
        ) : (
          <Text style={styles.menuText}>Sem itens cadastrados.</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedMenu ? (
        <MenuForm menu={selectedMenu} onSaved={handleSaved} />
      ) : (
        <>
          <Text style={styles.title}>Cardápios Criados</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0d6efd" />
          ) : (
            <FlatList
              data={menus}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  menuItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f8f9fa'
  },
  menuDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  menuText: {
    fontSize: 14,
    color: '#333',
    marginTop: 2
  },
  menuItemList: {
    marginTop: 5
  }
});
