import {
  Alert,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'; 
import { Picker } from "@react-native-picker/picker";
import Geolocation from 'react-native-geolocation-service';

const Home = () => {
  interface IBGEUF {
    nome: string;
    sigla: string;
  }

  interface IBGECity {
    nome: string;
  }

  interface SelectItem {
    label: string;
    value: string;
  }

  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [hasLocationPermission, setLocationPermission] = useState(false);
  
  useEffect(() => {
    if (selectedUF === '0') {
      setCities([]);
      return;
    }

    axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
      const cities = response.data.map(function(city){
        return {
          label: city.nome,
          value: city.nome
        }
      });
      setCities(cities);
    });
  }, [selectedUF]);

  useEffect(() => {
    axios.get<IBGEUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(function(uf){
        return {
          label: uf.nome,
          value: uf.sigla
        }
      });

      setUfs(ufInitials);
    });

    async function getLocationPermission() {
      let permissionResult = '';
      if (Platform.OS === 'ios') {
        permissionResult = await Geolocation.requestAuthorization('whenInUse');
      } else {
        permissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Permissão de Geolocalização',
            'message': 'Podemos acessar a sua localização?',
            'buttonNegative': 'Negar',
            'buttonPositive': 'Aceitar',
          },
        );
      }
      console.log(permissionResult);
      //if (permissionResult === PermissionsAndroid.RESULTS.GRANTED)
      //  setLocationPermission(true);
    }

    getLocationPermission();
  }, []);

  useEffect(() => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          Alert.alert('Posicao', `altitude: ${position.coords.altitude}\nlatitude: ${position.coords.latitude}`);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }, [hasLocationPermission]);

  function handleNavigationPoints() {
    /*navigation.navigate('Points', {
      selectedUF,
      selectedCity
    });*/
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/home-background.png')} 
      style={styles.container}
    >
      <View style={styles.main}>
        <Image style={styles.mediumLogo} source={require('../../assets/images/logo.png')} />
        <Text style={styles.title}>RestAurant</Text>
        <Text style={styles.description}>Ajudando pessoas a comerem bem.</Text>
      </View>
      <View>
        <Picker
          placeholder={'Selecione uma UF'}
          selectedValue={selectedUF}
          onValueChange={setSelectedUF}
          style={styles.select}
        >
          {
            ufs.map((uf) =>
              <Picker.Item label={uf.label} value={uf.value} key={uf.value} />
            )
          }
        </Picker>
        <Picker
          placeholder={'Selecione uma cidade'}
          selectedValue={selectedCity}
          onValueChange={setSelectedCity}
          style={styles.select}
        >
          {
            cities.map((city) =>
              <Picker.Item label={city.label} value={city.value} key={city.value} />
            )
          }
        </Picker>
        <RectButton style={styles.button} onPress={handleNavigationPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Feather name="chevron-right" size={24} color={'#FFF'} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  mediumLogo: {
    width: 120,
    height: 120,
  },
  title: {
    color: '#322153',
    fontSize: 29,
    fontFamily: 'Satisfy_400Regular',
    maxWidth: 260,
    marginTop: -30
  },
  description: {
    color: '#6C6C80',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
    marginTop: 16,
    maxWidth: 260,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#C21807',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
  select: {
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#6C6C80',
  },
});

export default Home;