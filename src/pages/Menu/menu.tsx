import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, ImageBackground, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';

interface Preco {
  id: number;
  nome: string;
  valor: number;
}

const Menu = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Menu'>>();
  const [precos, setPrecos] = useState<Preco[]>([]);

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

  return (
    <ScrollView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground 
          source={{ uri: 'https://images2.alphacoders.com/132/1325726.png' }} 
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/LogoBarber.png')} style={styles.logo} />
            <Text style={styles.title}>Bem-vindo à Maps BarberShop</Text>
          </View>
          <View style={styles.servicesContainer}>
            <View style={styles.service}>
              <Image source={require('../../../assets/Barba.png')} style={styles.serviceImage} />
              <Text style={styles.serviceText}>Serviço de Barba</Text>
              <Text style={styles.serviceDescription}>Deixe sua barba impecável com nossos profissionais especializados.</Text>
            </View>
            <View style={styles.service}>
              <Image source={require('../../../assets/Cabelo.png')} style={styles.serviceImage} />
              <Text style={styles.serviceText}>Serviço de Cabelo</Text>
              <Text style={styles.serviceDescription}>Transforme seu visual com nossos cortes modernos e estilosos.</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.transparentBackground]} 
              onPress={() => navigation.navigate('Agendamento')}
            >
              <Text style={styles.buttonText}>Agendar Serviço</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.transparentBackground]} 
              onPress={() => navigation.navigate('usuario')}
            >
              <Text style={styles.buttonText}>Editar Usuário</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.transparentBackground]} 
              onPress={() => navigation.navigate('feedback')}
            >
              <Text style={styles.buttonText}>Deixar Feedback</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pricesContainer}>
            <Text style={styles.pricesTitle}>Lista de Preços</Text>
            <FlatList
              data={precos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.itemText}>{item.nome} - R$ {typeof item.valor === 'number' ? item.valor.toFixed(2) : item.valor}</Text>
                </View>
              )}
            />
          </View>
        </ImageBackground>
      </ScrollView>
    </ScrollView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: height * 0.05,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 10,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  service: {
    alignItems: 'center',
    width: width * 0.4,
  },
  serviceImage: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 10,
  },
  serviceText: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#fff',
  },
  serviceDescription: {
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
    color: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#000',
    padding: width * 0.03,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  transparentBackground: {
    backgroundColor: 'rgba(211, 211, 211, 0.5)', // Fundo cinza claro transparente
    borderRadius: 10,
    padding: width * 0.04,
  },
  pricesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  pricesTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  itemText: {
    fontSize: width * 0.045,
  },
});

export default Menu;
