import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import Emoji from 'react-native-emoji';
import { HereApiRequests, Item } from '../../services/HereMapsApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { DetailParams } from '../detail';

import LeftArrowIcon from '../../assets/icons/left-arrow.svg';

export type MapParams = {
  Map: MapProps
}

type MapProps = {
  selectedUF?: string;
  selectedCity?: string;
  latitude?: number;
  longitude?: number;
}

const Map = () => {
  const route = useRoute();
  const routeParams = route.params as MapProps;

  const [initialPosition, setInitialposition] = useState<[number, number]>([0, 0]);
  const [points, setPoints] = useState<Item[]>([]);

  const navigation = useNavigation<StackNavigationProp<DetailParams>>();

  useEffect(() => {
    (async () => {
      if (routeParams.latitude && routeParams.longitude) {
        setInitialposition([
          routeParams.latitude,
          routeParams.longitude
        ]);
      } else {
        var location = await HereApiRequests.SearchByText(`${routeParams.selectedCity}+${routeParams.selectedUF}`);
        if (location !== null)
          setInitialposition([
            location.position.lat,
            location.position.lng
          ]);
      }
    })();
  }, []);

  useEffect(() => {
    if (initialPosition[0] !== 0)
      (async () => {
        var restaurants = await HereApiRequests.SearchByRestaurants(initialPosition[0], initialPosition[1]);
        if (restaurants.length > 0)
          setPoints(restaurants);
      })();
  }, [initialPosition])

  function handleNavigateToDetail(id: string) {
    let selected = points.find(p => p.id === id);
    if (selected)
      navigation.navigate('Detail', { ...selected });
    else
      Alert.alert('Erro', 'Não foi possível coletar os dados do item selecionado, por favor, contacte o suporte.');
  }

  function handleNavigateBack() {
    navigation.goBack();
  }

  return(
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack}>
        <LeftArrowIcon style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}><Emoji name=":blush:" style={{fontSize: 25}} /> Bem vindo!</Text>
      <Text style={styles.description}>Encontre o local perfeito abaixo.</Text>
      <View style={styles.mapContainer}>
      {
        initialPosition[0] !== 0 &&
        (<MapView 
          style={styles.map}
          initialRegion={{ 
            latitude: initialPosition[0],
            longitude: initialPosition[1],
            latitudeDelta: 0.014,
            longitudeDelta: 0.014,
          }}
          >
          {points.map(point => (
            <Marker
              key={point.id}
              style={styles.mapMarker}
              onPress={() => handleNavigateToDetail(point.id)}
              coordinate={{ 
                latitude: point.position.lat,
                longitude: point.position.lng,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image style={styles.mapMarkerImage} source={require('../../assets/images/logo.png')} />
                <Text style={styles.mapMarkerTitle}>{point.title}</Text>
              </View>
            </Marker>
          ))}
        </MapView>)
      }
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  backIcon: {
    color:'#C21807',
    marginTop: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 45,
  },
  title: {
    fontSize: 20,
    fontFamily: 'RobotoMedium',
    marginTop: 24,
  },
  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'RobotoMedium',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    width: 90,
    height: 80, 
  },
  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#C21807',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },
  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'RobotoMedium',
    color: '#FFF',
    fontSize: 16,
    lineHeight: 23,
  },
});

export default Map;