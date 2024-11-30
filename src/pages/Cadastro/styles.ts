import { Dimensions, StyleSheet } from 'react-native';

export const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c1c1c',
    },
    logo: {
        width: Dimensions.get('window').width * 0.5,  // Diminuindo a imagem
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    boxmid: {
        backgroundColor: '#333',
        borderRadius: 10,  // Borda arredondada
        padding: 20,
        width: '90%',
        justifyContent: 'center',
    },
    boxbottom: {
        marginTop: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
        color: '#ddd',
    },
    input: {
        height: 40,
        borderColor: '#666',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#555',
        color: '#fff',
    },
    button: {
        width: '80%',
        backgroundColor: '#1e90ff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'thin',
    },
    linkText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 15,
        textDecorationLine: 'underline',
    },
    picker:{},
});
