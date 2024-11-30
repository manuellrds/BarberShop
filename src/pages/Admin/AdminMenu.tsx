import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types';

type AdminMenuNavigationProp = StackNavigationProp<RootStackParamList, 'AdminMenu'>;

const AdminMenu: React.FC = () => {
  const navigation = useNavigation<AdminMenuNavigationProp>();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://img.lovepik.com/bg/20231219/Classic-Barbershop-Captivating-Black-and-White-Photography-Background_2651923_wh860.jpg!/fw/860' }}
        style={styles.backgroundImage}
      >
        <Text style={styles.title}>Administração BarberShop</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AdmAgendas')} // Sem parâmetros
        >
          <Text style={styles.buttonText}>Gerenciar Agendamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('admagendamento')} // Sem parâmetros
        >
          <Text style={styles.buttonText}>Adicionar Novo Agendamento</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Adm', { userId: 1 })} // Com parâmetros
        >
          <Text style={styles.buttonText}>Gerenciar Barbeiros e Horários</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('feedback')} // Sem parâmetros
        >
          <Text style={styles.buttonText}>Ver Feedbacks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PrecoCrudScreen')} // Sem parâmetros
        >
          <Text style={styles.buttonText}>Cadastrar Preços</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4D4D', // Vermelho rosado
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF4D4D', // Vermelho rosado
    fontSize: 18,
  },
});

export default AdminMenu;
