import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ImageBackground, Alert, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { format } from 'date-fns'; // Para formatar a data
import { Calendar } from 'react-native-calendars'; // Importa o Calendar
import styles from './styles';

// Função fictícia para obter o ID do usuário a partir de uma API ou armazenamento local
const getUsuarioId = async () => {
  // Substitua esta função com a lógica real para obter o ID do usuário
  try {
    const response = await axios.get('http://192.168.192.145:3000/usuario'); // Ajuste a URL conforme necessário
    console.log('Resposta da API de usuário:', response.data);
    return response.data.id; // Retorna o ID do usuário
  } catch (error) {
    console.error('Erro ao obter ID do usuário:', error);
    return null;
  }
};

const AgendamentoScreen = () => {
  const navigation = useNavigation();
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<string>(''); // Armazena o barbeiro selecionado
  const [selectedHorario, setSelectedHorario] = useState<string>(''); // Armazena o horário selecionado
  const [barbeiros, setBarbeiros] = useState<any[]>([]); // Lista de barbeiros
  const [horarios, setHorarios] = useState<any[]>([]); // Lista de horários
  const [usuarioId, setUsuarioId] = useState<number | null>(null); // Estado para o ID do usuário
  const [customCorte, setCustomCorte] = useState<string>(''); // Estado para o corte personalizado
  const [loading, setLoading] = useState<boolean>(false); // Para indicar o carregamento dos dados
  const [dataAgendamento, setDataAgendamento] = useState<string>(''); // Estado para armazenar a data selecionada
  const [nomeCliente, setNomeCliente] = useState<string>(''); // Estado para armazenar o nome do cliente

  // Função para carregar barbeiros e horários
  const loadData = async () => {
    setLoading(true);
    try {
      const [barbeirosResponse, horariosResponse] = await Promise.all([
        axios.get('http://192.168.192.145:3000/barbeiros'),
        axios.get('http://192.168.192.145:3000/horarios'),
      ]);
      setBarbeiros(barbeirosResponse.data);
      setHorarios(horariosResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados do banco:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do banco');
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar a data
  const formatData = (data: string) => {
    const formattedDate = format(new Date(data), 'yyyy-MM-dd');
    console.log('Data formatada:', formattedDate); // Log da data para conferir o valor
    return formattedDate;
  };

  // Função de agendamento
  const agendar = async () => {
    const corteFinal = customCorte || 'Corte padrão'; // Define um nome padrão se customCorte estiver vazio

    if (!dataAgendamento || !nomeCliente || usuarioId === null) {
      return Alert.alert('Erro', 'Os campos Nome do Cliente, Data e Usuário são obrigatórios!');
    }

    const dataFormatada = formatData(dataAgendamento); // Formata a data

    try {
      const response = await axios.post('http://192.168.192.145:3000/agendamentos', {
        corte: corteFinal,
        barbeiro_id: selectedBarbeiro || null, // Define null se não selecionado
        horario_id: selectedHorario || null, // Define null se não selecionado
        usuario_id: usuarioId,
        cliente: nomeCliente, // Envia o nome do cliente
        data: dataFormatada, // Envia a data formatada
      });

      Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
      navigation.goBack(); // Redireciona para a tela anterior
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Erro ao agendar o serviço');
    }
  };

  // Carregar dados ao iniciar a tela
  useEffect(() => {
    const fetchUsuarioId = async () => {
      const id = await getUsuarioId();
      if (id !== null) {
        setUsuarioId(id);
      } else {
        Alert.alert('Erro', 'Não foi possível obter o ID do usuário');
      }
    };
    fetchUsuarioId();
    loadData();
  }, []);

  // Verifique se o botão de agendar deve ser habilitado
  const isButtonDisabled = !dataAgendamento || !nomeCliente;

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <ImageBackground
        source={{ uri: 'https://img.lovepik.com/bg/20231219/Classic-Barbershop-Captivating-Black-and-White-Photography-Background_2651923_wh860.jpg!/fw/860' }}
        style={styles.container}
      >
        <Text style={styles.title}>Agendar Serviço</Text>

        <Text style={styles.label}>Nome do Cliente</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do cliente"
          value={nomeCliente}
          onChangeText={setNomeCliente}
        />

        <Text style={styles.label}>Escolha o Corte</Text>
        <View style={styles.cortesGrid}>
          <TouchableOpacity style={styles.corteContainer} onPress={() => setCustomCorte('Longo')}>
            <Image source={{ uri: 'https://blog.prohair.com.vc/wp-content/uploads/2024/03/d52b698d906c45e029f756405602fe70.jpg' }} style={styles.corteImage} />
            <Text style={styles.corteText}>Longo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.corteContainer} onPress={() => setCustomCorte('Low Fade')}>
            <Image source={{ uri: 'https://ellasmagazine.com.br/wp-content/uploads/2024/08/corte-masculino-atual-3-1024x1024.webp' }} style={styles.corteImage} />
            <Text style={styles.corteText}>Low Fade</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.corteContainer} onPress={() => setCustomCorte('Afro')}>
            <Image source={{ uri: 'https://unhasdecoradas2025.com.br/wp-content/uploads/2024/07/corte-de-cabelo-masculino-2025-imagem-agno-black-red.jpg' }} style={styles.corteImage} />
            <Text style={styles.corteText}>Afro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.corteContainer} onPress={() => setCustomCorte('Social')}>
            <Image source={{ uri: 'https://blog.newoldman.com.br/wp-content/uploads/2024/09/Cortes-de-Cabelo-Masculino-Social-Classico-4.jpg' }} style={styles.corteImage} />
            <Text style={styles.corteText}>Social</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Ou digite o nome do corte desejado"
          value={customCorte}
          onChangeText={setCustomCorte}
        />

        <Text style={styles.label}>Escolha o Barbeiro</Text>
        <Picker
          selectedValue={selectedBarbeiro}
          onValueChange={(itemValue) => setSelectedBarbeiro(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Barbeiro" value="" />
          {barbeiros.map((barbeiro) => (
            <Picker.Item key={barbeiro.id} label={barbeiro.nome} value={barbeiro.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Escolha o Horário</Text>
        <Picker
          selectedValue={selectedHorario}
          onValueChange={(itemValue) => setSelectedHorario(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Horário" value="" />
          {horarios.map((horario) => (
            <Picker.Item key={horario.id} label={horario.hora || horario.time} value={horario.id} />
          ))}
        </Picker>

        <Text style={styles.label}>Escolha a Data</Text>
        <Calendar
          onDayPress={(day: { dateString: string }) => setDataAgendamento(day.dateString)}
          markedDates={{
            [dataAgendamento]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
          }}
          theme={{
            todayTextColor: 'red',
            selectedDayBackgroundColor: 'blue',
            selectedDayTextColor: 'white',
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Data selecionada"
          value={dataAgendamento}
          editable={false} // O campo de data não é editável diretamente
        />

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={agendar}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ImageBackground>
    </ScrollView>
  );
};

export default AgendamentoScreen;
