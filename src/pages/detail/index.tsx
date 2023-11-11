import React, { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Item } from "../../services/HereMapsApi";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Emoji from 'react-native-emoji';

import LeftArrowIcon from '../../assets/icons/left-arrow.svg';

export type DetailParams = {
  Detail: Item
}

const Detail = () => {
  const route = useRoute();
  const selectedItem = route.params as Item;

  const navigation = useNavigation();

  function handleNavigateBack() {
    navigation.goBack();
  }

  return(
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNavigateBack}>
        <LeftArrowIcon style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}><Emoji name=":pencil:" style={{fontSize: 25}} /> Detalhes</Text>
      <Text style={styles.description}>Veja mais detalhes sobre este local.</Text>
      <Text style={styles.nameField}>{selectedItem.title}</Text>
      <Text style={styles.title}>Endereço</Text>
      <View>
        <Text style={styles.field}>{selectedItem.address.label}</Text>
      </View>
      {
        selectedItem && selectedItem.contacts && selectedItem.contacts.length > 0 &&
        <>
          <Text style={styles.title}>Contato</Text>
          {
            selectedItem.contacts.map(c => 
              <View key={c.phone[0].value}>
                <Text style={styles.field}>{c.phone[0].value}</Text>
                <Text style={styles.field}>{c.www[0].value}</Text>
              </View>
            )
          }
        </>
      }
      {
        selectedItem && selectedItem.categories && selectedItem.categories.length > 0 &&
        <>
          <Text style={styles.title}>Categorias</Text>
          {
            selectedItem.categories.map(c => 
              <Text style={styles.category} key={c.name}>{c.name}</Text>
            )
          }
        </>
      }
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
    color: '#6C6C80',
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
  nameField: {
    fontSize: 22,
    fontFamily: 'RobotoMedium',
    marginTop: 14,
  },
  field: {
    fontSize: 18,
    fontFamily: 'RobotoMedium',
    marginTop: 4,
  },
  category: {
    fontSize: 16,
    fontFamily: 'RobotoMedium',
    marginTop: 4,
    padding: 4,
    borderRadius: 10,
    backgroundColor: '#bd544a',
    width: 90,
    color: '#FFF'
  }
})

export default Detail;