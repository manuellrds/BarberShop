import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.02,
    width: '100%',
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: 10,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: height * 0.2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    width: '90%',
    position: 'absolute',
    bottom: height * 0.03,
  },
  button: {
    backgroundColor: '#000',
    padding: width * 0.03,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
  },
  service: {
    alignItems: 'center',
  },
  serviceImage: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 10,
    borderWidth: 3,
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
  pricesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.2,
    width: '90%',
  },
  pricesTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default style;
