import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { styles } from './AdminScreenStyles';
import { useNavigation } from '@react-navigation/native'; // Importação da navegação
import { StackNavigationProp } from '@react-navigation/stack'; // Importar a tipagem do React Navigation
import { RootStackParamList } from '../../../types'; // Importe a tipagem de suas rotas

interface Barbeiro {
  id?: number;
  nome: string;
  especialidade: string;
}

interface Horario {
  id?: number;
  hora: string;
  disponivel: boolean;
}

// Tipando a navegação para a tela 'AdmAgenda'
type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdmAgenda'>;

const AdminScreen = () => {
  // Navegação tipada
  const navigation = useNavigation<AdminScreenNavigationProp>(); // Hook de navegação com tipagem

  // Estados para os dados
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [barbeiroEditando, setBarbeiroEditando] = useState<Barbeiro | null>(null);
  const [horarioEditando, setHorarioEditando] = useState<Horario | null>(null);

  // Estados para novos itens
  const [novoBarbeiro, setNovoBarbeiro] = useState<Barbeiro>({ nome: '', especialidade: '' });
  const [novoHorario, setNovoHorario] = useState<Horario>({ hora: '', disponivel: true });

  // URLs da API
  const API_BASE_URL = 'http://192.168.192.145:3000'; // Alterar para o IP do servidor se estiver em produção

  const carregarDados = async () => {
    try {
      const [barbeirosRes, horariosRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/barbeiros`),
        axios.get(`${API_BASE_URL}/horarios`),
      ]);
      setBarbeiros(barbeirosRes.data);
      setHorarios(horariosRes.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados');
      console.error('Erro ao carregar dados:', error);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Funções CRUD para Barbeiros
  const adicionarBarbeiro = async () => {
    if (!novoBarbeiro.nome || !novoBarbeiro.especialidade) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/barbeiros`, novoBarbeiro);
      setNovoBarbeiro({ nome: '', especialidade: '' });
      carregarDados();
      Alert.alert('Sucesso', 'Barbeiro adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar barbeiro');
      console.error('Erro ao adicionar barbeiro:', error);
    }
  };

  const editarBarbeiro = async (id: number, barbeiroAtualizado: Barbeiro) => {
    try {
      await axios.put(`${API_BASE_URL}/barbeiros/${id}`, {
        nome: barbeiroAtualizado.nome,
        especialidade: barbeiroAtualizado.especialidade,
      });
      setBarbeiroEditando(null); // Limpa o estado de edição após salvar
      carregarDados();
      Alert.alert('Sucesso', 'Barbeiro atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar barbeiro');
      console.error('Erro ao atualizar barbeiro:', error);
    }
  };

  const excluirBarbeiro = async (id: number) => {
    console.log(`Excluindo barbeiro com id: ${id}`);
    try {
      await axios.delete(`${API_BASE_URL}/barbeiros/${id}`);
      carregarDados();
      Alert.alert('Sucesso', 'Barbeiro excluído com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir barbeiro');
      console.error('Erro ao excluir barbeiro:', error);
    }
  };
  
  const excluirHorario = async (id: number) => {
    console.log(`Excluindo horário com id: ${id}`);
    try {
      await axios.delete(`${API_BASE_URL}/horarios/${id}`);
      carregarDados();
      Alert.alert('Sucesso', 'Horário excluído com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir horário');
      console.error('Erro ao excluir horário:', error);
    }
  };
  
  // Funções CRUD para Horários
  const adicionarHorario = async () => {
    if (!novoHorario.hora) {
      Alert.alert('Erro', 'Por favor, preencha o horário');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/horarios`, {
        hora: novoHorario.hora,
        disponivel: novoHorario.disponivel,
      });
      setNovoHorario({ hora: '', disponivel: true });
      carregarDados();
      Alert.alert('Sucesso', 'Horário adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar horário');
      console.error('Erro ao adicionar horário:', error);
    }
  };

  const editarHorario = async (id: number, horarioAtualizado: Horario) => {
    try {
      await axios.put(`${API_BASE_URL}/horarios/${id}`, {
        hora: horarioAtualizado.hora,
        disponivel: horarioAtualizado.disponivel,
      });
      setHorarioEditando(null); // Limpa o estado de edição após salvar
      carregarDados();
      Alert.alert('Sucesso', 'Horário atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar horário');
      console.error('Erro ao atualizar horário:', error);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Administração da Barbearia</Text>

      {/* Seção de Barbeiros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gerenciar Barbeiros</Text>

        {barbeiroEditando ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nome do barbeiro"
              value={barbeiroEditando.nome}
              onChangeText={(text) => setBarbeiroEditando({ ...barbeiroEditando, nome: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Especialidade"
              value={barbeiroEditando.especialidade}
              onChangeText={(text) => setBarbeiroEditando({ ...barbeiroEditando, especialidade: text })}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (barbeiroEditando.id) editarBarbeiro(barbeiroEditando.id, barbeiroEditando);
              }}
            >
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nome do barbeiro"
              value={novoBarbeiro.nome}
              onChangeText={(text) => setNovoBarbeiro({ ...novoBarbeiro, nome: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Especialidade"
              value={novoBarbeiro.especialidade}
              onChangeText={(text) => setNovoBarbeiro({ ...novoBarbeiro, especialidade: text })}
            />
            <TouchableOpacity style={styles.button} onPress={adicionarBarbeiro}>
              <Text style={styles.buttonText}>Adicionar Barbeiro</Text>
            </TouchableOpacity>
          </View>
        )}

        {barbeiros.map((barbeiro) => (
          <View key={barbeiro.id} style={styles.item}>
            <Text>Nome: {barbeiro.nome}</Text>
            <Text>Especialidade: {barbeiro.especialidade}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setBarbeiroEditando(barbeiro)} // Ativa o modo de edição
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.deleteButton]}
                onPress={() => excluirBarbeiro(barbeiro.id!)}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Seção de Horários */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gerenciar Horários</Text>

        {horarioEditando ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Hora"
              value={horarioEditando.hora}
              onChangeText={(text) => setHorarioEditando({ ...horarioEditando, hora: text })}
            />
            <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (horarioEditando.id) editarHorario(horarioEditando.id, horarioEditando);
                }}
              >
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Hora"
              value={novoHorario.hora}
              onChangeText={(text) => setNovoHorario({ ...novoHorario, hora: text })}
            />
            <TouchableOpacity style={styles.button} onPress={adicionarHorario}>
              <Text style={styles.buttonText}>Adicionar Horário</Text>
            </TouchableOpacity>
          </View>
        )}

        {horarios.map((horario) => (
          <View key={horario.id} style={styles.item}>
            <Text>Hora: {horario.hora}</Text>
            <Text>Disponível: {horario.disponivel ? 'Sim' : 'Não'}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setHorarioEditando(horario)} // Ativa o modo de edição
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.deleteButton]}
                onPress={() => excluirHorario(horario.id!)}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Navegar para a tela de agendamento de cliente
            navigation.navigate('AdmAgendas');
          }}
        >
          <Text style={styles.buttonText}>Ir para Agendamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}> <Text style={styles.buttonText}>Voltar</Text> </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AdminScreen;
