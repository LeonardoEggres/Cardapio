import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function MenuForm({ menu, onSaved, onCancel }) {
  const [date, setDate] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (menu) {
      setDate(menu.date ? new Date(menu.date).toLocaleDateString('pt-BR') : '');
      setMenuItems(menu.menu_items || []);
    } else {
      setDate('');
      setMenuItems([
        { type: 'café', description: '' },
        { type: 'almoço', description: '' },
        { type: 'janta', description: '' }
      ]);
    }
  }, [menu]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    updatedItems[index][field] = value;
    setMenuItems(updatedItems);
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      let menuId;

      if (menu?.id) {
        await api.put(`/menus/${menu.id}`, {
          date: formatDateToISO(date)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        menuId = menu.id;

        for (const item of menuItems) {
          if (item.id) {
            await api.put(`/menu-items/${item.id}`, item, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } else {
            await api.post('/menu-items', {
              menu_id: menuId,
              ...item
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        }

        Alert.alert('Sucesso', 'Cardápio atualizado com sucesso!');
      } else {
        const newMenuResponse = await api.post('/menus', {
          date: formatDateToISO(date)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        menuId = newMenuResponse.data.data.id;

        for (const item of menuItems) {
          await api.post('/menu-items', {
            menu_id: menuId,
            ...item
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        Alert.alert('Sucesso', 'Cardápio criado com sucesso!');
      }

      onSaved();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o cardápio.');
    }
  };

  function formatDateToISO(dateStr) {
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return null;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {menu?.id ? 'Editar Cardápio' : 'Novo Cardápio'}
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Data do Cardápio</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      {menuItems.map((item, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
          <TextInput
            style={styles.input}
            value={item.description}
            onChangeText={(text) => handleChange(index, 'description', text)}
            placeholder={`Descrição para ${item.type}`}
            placeholderTextColor="#999"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000'
  },
  button: {
    backgroundColor: '#0d6efd',
    padding: 15,
    borderRadius: 5,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  cancelButton: {
    marginTop: 10,
    padding: 15
  },
  cancelText: {
    color: '#dc3545',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
