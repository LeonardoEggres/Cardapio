import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function StudentMenu() {
  const [menu, setMenu] = useState([]);
  const [viewType, setViewType] = useState('day'); // 'day' or 'week'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [viewType]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let endpoint = viewType === 'day' ? '/menu/day' : '/menu/week';
      const response = await api.get(endpoint, config);
      setMenu(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o cardápio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cardápio - Visualização por {viewType}</Text>
      <View style={styles.buttonRow}>
        <Button title="Dia" onPress={() => setViewType('day')} />
        <Button title="Semana" onPress={() => setViewType('week')} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0d6efd" />
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.menuItem}>
              <Text style={styles.menuDate}>{item.date}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>Nenhum item no cardápio.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  menuItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  menuDate: { fontWeight: 'bold' }
});
