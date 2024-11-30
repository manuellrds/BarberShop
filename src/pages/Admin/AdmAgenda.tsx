import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Alert, ImageBackground, TextInput, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import styles from './styles';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RootStackParamList } from '../../../types'; // Importe o tipo das rotas

type NavigationProps = StackNavigationProp<RootStackParamList, 'AdmAgendas'>;

const AdmAgenda = () => {
  const navigation = useNavigation<NavigationProps>();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [barbeiros, setBarbeiros] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [currentAgendamento, setCurrentAgendamento] = useState<any>(null);

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const [agendamentosResponse, barbeirosResponse, horariosResponse] = await Promise.all([
        axios.get('http://192.168.192.145:3000/agendamentos'),
        axios.get('http://192.168.192.145:3000/barbeiros'),
        axios.get('http://192.168.192.145:3000/horarios'),
      ]);
      setAgendamentos(agendamentosResponse.data);
      setBarbeiros(barbeirosResponse.data);
      setHorarios(horariosResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const handleEdit = (agendamento: any) => {
    setCurrentAgendamento({
      ...agendamento,
      data: format(new Date(agendamento.data), 'yyyy-MM-dd'),
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://192.168.192.145:3000/agendamentos/${id}`);
      Alert.alert('Sucesso', 'Agendamento excluído com sucesso');
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      Alert.alert('Erro', 'Erro ao excluir agendamento');
    }
  };

  const handleSave = async () => {
    const { agendamento_id, corte_nome, barbeiro_id, horario_id, cliente_nome, data } = currentAgendamento;

    const formattedData = format(new Date(data), 'yyyy-MM-dd');

    if (!corte_nome || !barbeiro_id || !horario_id || !cliente_nome || !data) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    const agendamentoData = {
      corte: corte_nome,
      barbeiro_id,
      horario_id,
      cliente: cliente_nome,
      data: formattedData,
    };

    try {
      await axios.put(`http://192.168.192.145:3000/agendamentos/${agendamento_id}`, agendamentoData);
      Alert.alert('Sucesso', 'Agendamento atualizado com sucesso');
      setEditModalVisible(false);
      carregarAgendamentos();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      Alert.alert('Erro', 'Erro ao atualizar agendamento');
    }
  };

  const formatData = (data: string) => {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
  };

  return (
    <ImageBackground
      source={{ uri: 'https://img.lovepik.com/bg/20231219/Classic-Barbershop-Captivating-Black-and-White-Photography-Background_2651923_wh860.jpg!/fw/860' }}
      style={styles.container}
    >
      <Text style={styles.title}>Agendamentos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.agendamentosList}>
          {agendamentos.map((agendamento) => (
            <View key={agendamento.agendamento_id} style={styles.agendamentoContainer}>
              <Text style={styles.agendamentoText}>Corte: {agendamento.corte_nome || 'Não especificado'}</Text>
              <Text style={styles.agendamentoText}>Cliente: {agendamento.cliente_nome || 'Não especificado'}</Text>
              <Text style={styles.agendamentoText}>Barbeiro: {agendamento.barbeiro_nome}</Text>
              <Text style={styles.agendamentoText}>Horário: {agendamento.horario}</Text>
              <Text style={styles.agendamentoText}>Data: {formatData(agendamento.data)}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(agendamento)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(agendamento.agendamento_id)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Botões de navegação */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('admagendamento')}>
        <Text style={styles.buttonText}>Ir para Administração</Text>
      </TouchableOpacity>

      {/* Botão para acessar Feedback */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('feedback')}>
        <Text style={styles.buttonText}>Ir para Feedback</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}> <Text style={styles.buttonText}>Voltar</Text> </TouchableOpacity>
      
      {currentAgendamento && (
        <Modal visible={editModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Modal Content */}
              <TextInput
                style={styles.input}
                placeholder="Nome do Corte"
                value={currentAgendamento.corte_nome}
                onChangeText={(text) => setCurrentAgendamento({ ...currentAgendamento, corte_nome: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Nome do Cliente"
                value={currentAgendamento.cliente_nome}
                onChangeText={(text) => setCurrentAgendamento({ ...currentAgendamento, cliente_nome: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Data (yyyy-MM-dd)"
                value={currentAgendamento.data}
                onChangeText={(text) => setCurrentAgendamento({ ...currentAgendamento, data: text })}
              />
              <Picker
                selectedValue={currentAgendamento.barbeiro_id}
                onValueChange={(itemValue) => setCurrentAgendamento({ ...currentAgendamento, barbeiro_id: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o Barbeiro" value="" />
                {barbeiros.map((barbeiro) => (
                  <Picker.Item key={barbeiro.id} label={barbeiro.nome} value={barbeiro.id} />
                ))}
              </Picker>
              <Picker
                selectedValue={currentAgendamento.horario_id}
                onValueChange={(itemValue) => setCurrentAgendamento({ ...currentAgendamento, horario_id: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o Horário" value="" />
                {horarios.map((horario) => (
                  <Picker.Item key={horario.id} label={horario.hora} value={horario.id} />
                ))}
              </Picker>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </Modal>
      )}
    </ImageBackground>
  );
};

export default AdmAgenda;
