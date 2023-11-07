import {
    Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'; 
import { Picker } from "@react-native-picker/picker";

import * as Location from 'expo-location';

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

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [ufs, setUfs] = useState<SelectItem[]>([]);
  const [cities, setCities] = useState<SelectItem[]>([]);
  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  
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

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  useEffect(() => {
    if (errorMsg !== '')
      Alert.alert('Info', errorMsg);
    else if (location) {
      console.log(JSON.stringify(location));
      (async () => {
        let response = await Location.reverseGeocodeAsync({latitude: location.coords.latitude, longitude: location.coords.longitude});
        for (let item of response) {
            let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
            console.log(address);
        }
      })();
    }
  }, [errorMsg, location]);

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
    fontFamily: 'Satisfy-Regular',
    maxWidth: 260,
    marginTop: -30
  },
  description: {
    color: '#6C6C80',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
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
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  select: {
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#6C6C80',
  },
});

export default Home;