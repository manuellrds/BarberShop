import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Fundo claro para melhor contraste
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#333', // Texto escuro para melhor legibilidade
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Georgia', // Fonte com estilo clássico
  },
  section: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#333', // Texto escuro para melhor legibilidade
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#333', // Texto escuro para melhor legibilidade
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#fff', // Fundo branco para melhor contraste
    color: '#333', // Texto escuro para melhor legibilidade
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#333', // Bordas escuras para destacar os campos
    fontFamily: 'Courier New', // Fonte mais clássica
  },
  button: {
    backgroundColor: '#007BFF', // Azul claro para um contraste agradável
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff', // Texto branco para melhor contraste
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Arial', // Fonte simples e impactante
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallButton: {
    backgroundColor: '#007BFF', // Azul claro para pequenos botões
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#8b0000', // Vermelho para ações de exclusão
  },
  item: {
    backgroundColor: '#fff', // Fundo branco para melhor contraste
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc', // Bordas cinzas para destacar os itens
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
  },
});
