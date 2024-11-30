import { StackNavigationProp } from '@react-navigation/stack';

// Definindo as rotas
export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    Adm: { userId: number }; 
    Menu: { userId: number }
    Agendamento: undefined;
    AdmAgendas: undefined;
    AdminScreen: undefined; // Sem parâmetros para AdminScreen
    AdmAgenda: undefined; // Sem parâmetros para AdmAgenda
    admagendamento: undefined;
    usuario: undefined; // Adicionada a tela de Editar Usuário
    feedback: undefined;
    AdminMenu: {userId: number};
    PrecoCrudScreen: undefined;
};


export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
export type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;
export type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;
export type AgendamentoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Agendamento'>;
export type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Adm'>; // Nome correto da rota
export type AdmAgendamentosScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdmAgendas'>;
export type AdmagendamentoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'admagendamento'>;
export type EditUsuarioScreenNavigationProp = StackNavigationProp<RootStackParamList, 'usuario'>; // Tipo para EditUsuario
export type FeedbackScreenNavigationProp = StackNavigationProp<RootStackParamList, 'feedback'>; // Tipo para FeedbackScreen
export type PrecoCrudScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrecoCrudScreen'>;
