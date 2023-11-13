import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Item } from "../../services/HereMapsApi";
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Emoji from 'react-native-emoji';

import LeftArrowIcon from '../../assets/icons/left-arrow.svg';
import { Picker } from "@react-native-picker/picker";

export type DetailParams = {
  Detail: Item
}

type Comment = {
  key: string,
  text: string,
  date: string,
  points: number
}

const Detail = () => {
  const route = useRoute();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const comments: Array<Comment> = [
    {key: '1', text: 'Muito bom', date: '13/11/2023', points: 9},
    {key: '2', text: 'Horrível', date: '12/11/2023', points: 2},
    {key: '3', text: 'Amei', date: '13/11/2023', points: 10},
    {key: '4', text: 'O lugar fede', date: '13/11/2023', points: 2},
    {key: '5', text: 'Médio', date: '13/11/2023', points: 5},
    {key: '6', text: 'Okay, não estava muito saboroso', date: '13/11/2023', points: 4},
    {key: '7', text: 'O garçom deu em cima da minha filha', date: '13/11/2023', points: 1},
  ]

  useEffect(() => {
    let receivedData = route.params;
    if (receivedData)
      setSelectedItem(receivedData as Item);
  }, [])

  const navigation = useNavigation();

  function handleNavigateBack() {
    navigation.goBack();
  }

  if (selectedItem)
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
          <Text style={styles.field}>{selectedItem.address && selectedItem.address.label}</Text>
        </View>
        {
          selectedItem && selectedItem.contacts && selectedItem.contacts.length > 0 &&
          <>
            <Text style={styles.title}>Contato</Text>
            {
              selectedItem.contacts.map(c => 
                <View key={c.phone ? c.phone[0].value : ''}>
                  <Text style={styles.field}>{c.phone ? c.phone[0].value : ''}</Text>
                  <Text style={styles.field}>{c.www ? c.www[0].value : ''}</Text>
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
        <Text style={styles.title}>Nota geral</Text>
        <Text style={styles.title}>4.7/10</Text>
        <Text style={styles.title}>Comentários</Text>
        <FlatList
          style={styles.comments}
          data={comments}
          renderItem={({item}) => 
            <View style={styles.comment} key={item.key}>
              <Text>{item.text}</Text>
              <Text>{item.points}/10</Text>
              <Text>{item.date}</Text>
            </View>}
        />
        <TextInput style={styles.select} placeholder='Digite seu comentário aqui' />
        <Picker
            placeholder={'Nota'}
            style={styles.select}
          >
          <Picker.Item label={'1'} value={1} key={1} />
          <Picker.Item label={'2'} value={2} key={2} />
          <Picker.Item label={'3'} value={3} key={3} />
          <Picker.Item label={'4'} value={4} key={4} />
          <Picker.Item label={'5'} value={5} key={5} />
          <Picker.Item label={'6'} value={6} key={6} />
          <Picker.Item label={'7'} value={7} key={7} />
          <Picker.Item label={'8'} value={8} key={8} />
          <Picker.Item label={'9'} value={9} key={9} />
          <Picker.Item label={'10'} value={10} key={10} />
        </Picker>
        <Button color={'#bd544a'} title='Enviar' />
      </View>
    )
  else
    return (
      <>
        <Text>Erro, não foi possível obter os dados do local selecionado</Text>
      </>
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
    marginTop: 10,
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
  },
  comment: {
    fontSize: 18,
    height: 44,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginBottom: 5
  },
  comments: {
    height: 150,
    flexGrow: 0
  },
  select: {
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#6C6C80',
    fontFamily: 'RobotoMedium',
    marginBottom: 5
  }
})

export default Detail;