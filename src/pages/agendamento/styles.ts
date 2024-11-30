import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  // Para manter os elementos no topo
    alignItems: 'center',
    paddingHorizontal: 15, // Ajustando o padding horizontal
    paddingVertical: 20,   // Ajustando o padding vertical
  },
  title: {
    fontSize: 26,  // Tamanho do título ajustado
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20, // Espaço maior entre título e campos
    textAlign: 'center',
  },
  label: {
    fontSize: 16,  // Tamanho da fonte ajustado
    color: '#fff',
    marginVertical: 8,  // Um pouco mais de espaço entre rótulos e campos
  },
  cortesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,  // Espaço adicional entre as seções
  },
  corteContainer: {
    margin: 10, // Ajuste de margem
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.38,  // Tamanho mais compacto para o corte
    height: width * 0.38,
  },
  corteImage: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  corteText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
  },
  picker: {
    width: '100%',
    height: 45,  // Menor altura para o Picker
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    borderRadius: 5,
    marginBottom: 20,
    color: '#fff',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,  // Ajuste do padding para o botão
    borderRadius: 10,
    marginTop: 20,
    width: '80%',  // Largura do botão ajustada
    alignItems: 'center',  // Centralizando o texto do botão
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#a9a9a9',  // Cor do botão desabilitado
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 15,
    marginVertical: 10,
    fontSize: 18,
    backgroundColor: '#f2f2f2',
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  dateButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
  },
  scrollView: {
    width: '100%',  // Garante que o ScrollView ocupe toda a largura
    flexGrow: 1,    // Permite que o conteúdo ocupe a altura restante disponível
  },
});

export default styles;
