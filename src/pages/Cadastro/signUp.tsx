// src/pages/Cadastro/SignUp.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native'; // Adicione o Picker aqui
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SignUpScreenNavigationProp } from '../../../types'; // Ajuste o caminho conforme necessário
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { style } from './styles'; // Ajuste o caminho conforme necessário

const SignUp = () => {
    const navigation = useNavigation<SignUpScreenNavigationProp>(); // Usando o tipo

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [role, setRole] = useState('user'); // Novo estado para a role

    const handleSignUp = async () => {
        try {
            const response = await axios.post('http://192.168.192.145:3000/usuarios', { nome, email, senha, role });
            console.log(response.data); // Verifique a resposta
            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
            navigation.navigate('Login');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // Aqui você pode acessar a estrutura do erro Axios
                console.error('Erro ao cadastrar usuário:', error.response?.data.message || error.message);
                Alert.alert('Erro', error.response?.data.message || 'Erro inesperado ao cadastrar usuário.');
            } else {
                console.error('Erro desconhecido:', error);
                Alert.alert('Erro', 'Erro desconhecido ao cadastrar usuário.');
            }
        }
    };

    return (
        <View style={style.container}>
            <Image
                source={require('../../../assets/cadastro.png')} // Ajuste o caminho conforme necessário
                style={style.logo}
            />
            <View style={style.boxmid}>
                <Text style={style.label}>Cadastro</Text>
                <TextInput
                    style={style.input}
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                />
                <TextInput
                    style={style.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={style.input}
                    placeholder="Senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                />
                <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={style.picker}
                >
                    <Picker.Item label="Usuário" value="user" />
                    <Picker.Item label="Administrador" value="admin" />
                </Picker>
                <View style={style.boxbottom}>
                    <TouchableOpacity style={style.button} onPress={handleSignUp}>
                        <Text style={style.buttonText}>Cadastrar</Text> {/* Aqui está o texto do botão */}
                    </TouchableOpacity>
                    <TouchableOpacity style={style.button} onPress={() => navigation.goBack()}> <Text style={style.buttonText}>Voltar</Text> </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SignUp;
