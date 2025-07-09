import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Modal, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function MenuForm({ menu, onClose }) {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (menu) {
      setDate(menu.date);
      setDescription(menu.description);
    } else {
      setDate('');
      setDescription('');
    }
  }, [menu]);

  const handleSave = async () => {
    if (!date || !description) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (menu) {
        await api.put(`/menus/${menu.id}`, { date, description }, config);
        Alert.alert('Sucesso', 'Cardápio atualizado.');
      } else {
        await api.post('/menus', { date, description }, config);
        Alert.alert('Sucesso', 'Cardápio criado.');
      }
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o cardápio.');
    }
  };

  return (
    <Modal visible={true} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>{menu ? 'Editar Cardápio' : 'Novo Cardápio'}</Text>
          <TextInput
            placeholder="Data (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 100 }]}
            multiline
          />
          <View style={styles.buttons}>
            <Button title="Salvar" onPress={handleSave} />
            <Button title="Cancelar" color="red" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    backgroundColor: '#fff', margin: 20, borderRadius: 10, padding: 20
  },
  title: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center'
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-around'
  }
});
