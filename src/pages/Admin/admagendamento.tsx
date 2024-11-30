import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import styles from './styles'; // Certifique-se de que o caminho está correto
import { format } from 'date-fns'; // Para formatar a data
import { Calendar } from 'react-native-calendars'; // Importa o Calendar

const Admagendamento = () => {
  const navigation = useNavigation();
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<string>(''); // Armazena o barbeiro selecionado
  const [selectedHorario, setSelectedHorario] = useState<string>(''); // Armazena o horário selecionado
  const [barbeiros, setBarbeiros] = useState<any[]>([]); // Lista de barbeiros
  const [horarios, setHorarios] = useState<any[]>([]); // Lista de horários
  const [usuarioId, setUsuarioId] = useState<number>(1); // Substitua com a lógica de obtenção do usuário real
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

    if (!selectedBarbeiro || !selectedHorario || !dataAgendamento || !nomeCliente) {
      return Alert.alert('Erro', 'Todos os campos são obrigatórios!');
    }

    const dataFormatada = formatData(dataAgendamento); // Formata a data

    try {
      const response = await axios.post('http://192.168.192.145:3000/agendamentos', {
        corte: corteFinal,
        barbeiro_id: selectedBarbeiro,
        horario_id: selectedHorario,
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
    loadData();
  }, []);

  // Verifique se o botão de agendar deve ser habilitado
  const isButtonDisabled = !selectedBarbeiro || !selectedHorario || !customCorte || !dataAgendamento || !nomeCliente;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Serviço</Text>

      <Text style={styles.label}>Nome do Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do cliente"
        value={nomeCliente}
        onChangeText={setNomeCliente}
      />

      <Text style={styles.label}>Escolha o Corte</Text>
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
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}> <Text style={styles.buttonText}>Voltar</Text> </TouchableOpacity>
    </View>
  );
};

export default Admagendamento;
