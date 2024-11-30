import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/login';
import SignUp from '../pages/Cadastro/signUp';
import Menu from '../pages/Menu/menu';
import AdmAgenda from '../pages/Admin/AdmAgenda';
import AgendamentoScreen from '../pages/agendamento/AgendamentoScreen';
import Admagendamento from '../pages/Admin/admagendamento';
import AdminScreen from '../pages/Admin/AdminScreen';
import EditUsuario from '../pages/usuario/EditUsuario';
import FeedbackScreen from '../pages/feedback/FeedbackScreen';
import { RootStackParamList } from '../../types'; // Certifique-se de que está no caminho correto
import AdminMenu from '../pages/Admin/AdminMenu';
import PrecoCrudScreen from '../pages/precos/PrecoCrudScreen';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Agendamento" component={AgendamentoScreen} />
        <Stack.Screen name="AdmAgendas" component={AdmAgenda} />
        <Stack.Screen name="Adm" component={AdminScreen} />
        <Stack.Screen name="admagendamento" component={Admagendamento} />
        <Stack.Screen name="usuario" component={EditUsuario} />
        <Stack.Screen name="feedback" component={FeedbackScreen} />
        <Stack.Screen name="AdminMenu" component={AdminMenu}/>
        <Stack.Screen name="PrecoCrudScreen" component={PrecoCrudScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
