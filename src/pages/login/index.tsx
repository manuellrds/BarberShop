import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '../../../types'; // Tipagem personalizada
import { style } from './styles'; // Importando o estilo
import axios from 'axios';

const Login = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.192.145:3000/login', {
                email,
                senha,
            });

            if (response.status === 200) {
                const { id, isAdmin } = response.data.usuario;
                if (isAdmin) {
                    navigation.navigate('AdminMenu', { userId: id });
                } else {
                    navigation.navigate('Menu', { userId: id });
                }
            }
        } catch (error) {
            setErrorMessage('Email ou senha incorretos!');
            console.error('Erro ao realizar login: ', error);
        }
    };

    return (
        <View style={style.container}>
            <Image source={require('../../../assets/LogoBarber.png')} style={style.logo} />
            <View style={style.boxmid}>
                <Text style={style.label}>Email</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite seu email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#aaa"
                />
                <Text style={style.label}>Senha</Text>
                <TextInput
                    style={style.input}
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                    placeholderTextColor="#aaa"
                />
                {errorMessage ? <Text style={style.errorText}>{errorMessage}</Text> : null}
                <TouchableOpacity style={style.button} onPress={handleLogin}>
                    <Text style={style.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={style.linkText}>Não tem uma conta? Crie uma</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;
