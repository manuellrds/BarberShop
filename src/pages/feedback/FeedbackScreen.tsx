import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

interface Feedback {
  id: number;
  mensagem: string;
  data: string;
}

const FeedbackScreen = () => {
  const [mensagem, setMensagem] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [editandoFeedback, setEditandoFeedback] = useState<Feedback | null>(null);

  const navigation = useNavigation(); // Get navigation prop

  const carregarFeedbacks = async () => {
    try {
      const response = await axios.get('http://192.168.192.145:3000/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Erro ao carregar feedbacks:', error);
      Alert.alert('Erro', 'Erro ao carregar feedbacks');
    }
  };

  useEffect(() => {
    carregarFeedbacks();
  }, []);

  const handleEditFeedback = (feedback: Feedback) => {
    setMensagem(feedback.mensagem);
    setEditandoFeedback(feedback);
  };
  
  const handleAddFeedback = async () => {
    if (!mensagem) {
      Alert.alert('Erro', 'A mensagem é obrigatória');
      return;
    }
  
    try {
      if (editandoFeedback) {
        const response = await axios.put(`http://192.168.192.145:3000/feedback/${editandoFeedback.id}`, { mensagem });
        if (response.status === 200) {
          Alert.alert('Sucesso', 'Feedback atualizado com sucesso');
        }
      } else {
        await axios.post('http://192.168.192.145:3000/feedback', { mensagem });
        Alert.alert('Sucesso', 'Feedback enviado com sucesso');
      }
  
      setMensagem('');
      setEditandoFeedback(null);
      carregarFeedbacks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao enviar feedback:', error.response || error.message || error);
        Alert.alert('Erro', `Erro ao enviar feedback: ${error.response?.data?.message || error.message}`);
      } else {
        console.error('Erro desconhecido:', error);
        Alert.alert('Erro', 'Erro desconhecido ao enviar feedback');
      }
    }
  };
  
  const handleDeleteFeedback = async (id: number) => {
    try {
      await axios.delete(`http://192.168.192.145:3000/feedback/${id}`);
      Alert.alert('Sucesso', 'Feedback excluído com sucesso');
      carregarFeedbacks();
    } catch (error) {
      console.error('Erro ao excluir feedback:', error);
      Alert.alert('Erro', 'Erro ao excluir feedback');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <TextInput
        style={styles.input}
        placeholder="Escreva seu feedback"
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddFeedback}>
        <Text style={styles.buttonText}>{editandoFeedback ? 'Atualizar' : 'Enviar'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}> 
              <Text style={styles.buttonText}>Voltar</Text> 
            </TouchableOpacity>
      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>{item.mensagem}</Text>
            <Text style={styles.feedbackDate}>{new Date(item.data).toLocaleDateString('pt-BR')}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteFeedback(item.id)}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditFeedback(item)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedbackContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});
