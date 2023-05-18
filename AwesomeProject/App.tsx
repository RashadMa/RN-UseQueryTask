import { View, Text, TextInput, Button, FlatList, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { QueryClient, QueryClientProvider, useMutation, useQuery } from 'react-query';
import React, { useState } from 'react';
import axios from 'axios';

const queryClient = new QueryClient();

const App = () => {
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [url] = useState('https://northwind.vercel.app/api/products/');

  const { data: response, refetch } = useQuery("supplierData", () => {
    return axios.get(url)
      .then(response => response.data);
  }, {
    staleTime: 30000,
    refetchInterval: 5000
  });

  const { mutate: mutatedelete } = useMutation((id) => {
    return axios.delete(url + id);
  }, {
    onSuccess: () => {
      console.log('item deleted');
      queryClient.invalidateQueries("supplierData");
    },
    onError: (err) => {
      console.log('Error!', err);
    }
  });

  const { mutate: post } = useMutation((data: any) => {
    return axios.post(url, data);
  }, {
    onSuccess: () => {
      console.log('item added');
      queryClient.invalidateQueries("supplierData");
    },
    onError: (err) => {
      console.log('Error!', err);
    }
  });


  const handleAdd = () => {
    post({ name: name, price: price });
  };

  const handleDelete = (id: any) => {
    mutatedelete(id);
  };

  return (

    <SafeAreaView style={styles.container}>
      <View>
        <TextInput style={{ borderWidth: 1, padding: 5, borderColor: "lightgrey", borderRadius: 8 }} placeholder='name' onChangeText={setName} />
        <TextInput style={{ borderWidth: 1, padding: 5, borderColor: "lightgrey", borderRadius: 8 }} placeholder='unitPrice' onChangeText={setPrice} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => refetch}>
          <Text style={{ color: "blue", fontSize: 15, }}>Refetch</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAdd}>
          <Text style={{ color: "blue", fontSize: 15, }}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 10 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={response}
          renderItem={({ item }) => (
            <View>
              <Text style={{ fontSize: 15, borderWidth: 1, borderColor: "lightgrey", padding: 5, borderRadius: 5 }}>{item.name}, {item.price}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: "blue", fontSize: 15, }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const RootComponent = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default RootComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  }
})

