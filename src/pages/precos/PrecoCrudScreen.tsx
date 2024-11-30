import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

interface Preco {
  id: number;
  nome: string;
  valor: number;
}

const PrecoCrudScreen: React.FC = () => {
  const navigation = useNavigation();
  const [precos, setPrecos] = useState<Preco[]>([]);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPrecos();
  }, []);

  const fetchPrecos = async () => {
    try {
      const response = await axios.get('http://192.168.192.145:3000/precos');
      setPrecos(response.data);
    } catch (error) {
      console.error('Erro ao buscar preços:', error);
    }
  };

  const handleAddUpdate = async () => {
    if (!nome || !valor) {
      Alert.alert('Erro', 'Nome e Valor são obrigatórios');
      return;
    }

    const preco = parseFloat(valor);
    if (isNaN(preco)) {
      Alert.alert('Erro', 'Valor deve ser um número válido');
      return;
    }

    try {
      if (editingId === null) {
        await axios.post('http://192.168.192.145:3000/precos', { nome, valor: preco });
        Alert.alert('Sucesso', 'Preço adicionado com sucesso');
      } else {
        await axios.put(`http://192.168.192.145:3000/precos/${editingId}`, { nome, valor: preco });
        Alert.alert('Sucesso', 'Preço atualizado com sucesso');
        setEditingId(null);
      }

      setNome('');
      setValor('');
      fetchPrecos();
    } catch (error) {
      console.error('Erro ao salvar preço:', error);
      Alert.alert('Erro', 'Erro ao salvar preço');
    }
  };

  const handleEdit = (preco: Preco) => {
    setNome(preco.nome);
    setValor(preco.valor.toString());
    setEditingId(preco.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://192.168.192.145:3000/precos/${id}`);
      Alert.alert('Sucesso', 'Preço excluído com sucesso');
      fetchPrecos();
    } catch (error) {
      console.error('Erro ao excluir preço:', error);
      Alert.alert('Erro', 'Erro ao excluir preço');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Preços</Text>
      <FlatList
        data={precos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome} - R$ {typeof item.valor === 'number' ? item.valor.toFixed(2) : item.valor}</Text>
            <Button title="Editar" onPress={() => handleEdit(item)} />
            <Button title="Excluir" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor"
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />
        <Button
          title={editingId !== null ? 'Atualizar Preço' : 'Adicionar Preço'}
          onPress={handleAddUpdate}
        />
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}> 
          <Text style={styles.buttonText}>Voltar</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  form: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default PrecoCrudScreen;
