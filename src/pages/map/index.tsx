import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';

import { HereApiRequests } from '../../services/HereMapsApi';

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
  interface Point {
    id_point: string;
    name: string;
    latitude: number;
    longitude: number;
  }
  
  const [initialPosition, setInitialposition] = useState<[number, number]>([0, 0]);
  const [points, setPoints] = useState<Point[]>([]);

  const route = useRoute();
  const routeParams = route.params as MapProps;
  
  const navigation = useNavigation();

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
    (async () => {
      var restaurants = await HereApiRequests.SearchByRestaurants(initialPosition[0], initialPosition[1]);
      if (restaurants.length > 0) {
        var foundPoints: Point[] = [];
        restaurants.map(r => {
          foundPoints.push({
            id_point: r.id,
            name: r.title,
            latitude: r.position.lat,
            longitude: r.position.lng
          });
        });
        setPoints(foundPoints);
      }
    })();
  }, [initialPosition])

  function handleNavigateToDetail(id: string) {
    console.log('/Detail (TODO)')
    //navigate('Detail', { state: { point_id: id } });
  }

  return(
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
              key={point.id_point}
              style={styles.mapMarker}
              onPress={() => handleNavigateToDetail(point.id_point)}
              coordinate={{ 
                latitude: point.latitude,
                longitude: point.longitude,
              }}
            >
              <View style={styles.mapMarkerContainer}>
                <Image style={styles.mapMarkerImage} source={require('../../assets/images/logo.png')} />
                <Text style={styles.mapMarkerTitle}>{point.name}</Text>
              </View>
            </Marker>
          ))}
        </MapView>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
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
    alignItems: 'center'
  },
  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },
  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto-Medium',
    color: '#FFF',
    fontSize: 14,
    lineHeight: 23,
  },
});

export default Map;