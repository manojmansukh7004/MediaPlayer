import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  Pressable,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Card, Button, FAB } from 'react-native-paper';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import RNVideoPlayer from "react-native-advanced-video-player";
import Video from 'react-native-video';


const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [item, setItem] = useState('');



  const handleItem = (item) => {
    console.log(item);
    if (item !== '') {
      setModalVisible(true)
    }
    setItem(item)
  }

  useEffect(() => {
    if (item !== '') {
      setModalVisible(true)
    }
  }, [item]);

  const handleModalClose = () => {
    // setItem('')
    setModalVisible(false)
  }

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('MediaContent')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {

          querySnapshot.forEach((doc) => {
            const { name, title, desc, imageUrl, postTime, media } = doc.data();
            list.push({
              // key: doc.id,
              name,
              title,
              desc,
              imageUrl,
              postTime,
              media
            });
          });
        });
      setPosts(list);
      if (loading) {
        setLoading(false);
      }

    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(
    () => navigation.addListener('focus', () => fetchPosts()),
    []
  );
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      <ScrollView>

        {loading ? (
          <View style={{ marginTop: 10 }}>
            <ActivityIndicator size="large" color="#082b68" />
          </View>
        ) : (
            <>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModalVisible(false);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    {item.media !== 'video' ?
                      <Image source={{ uri: item != null ? item.imageUrl : '' }} style={styles.imageBox} />
                      :
                      <RNVideoPlayer
                        source={item.imageUrl}
                        showLikeButton={false}
                        showShareButton={false}
                        showDownloadButton={false}
                        playerStyle={{
                          width: 300,
                          height: 450
                        }}
                      />
                    }

                    <View style={{ width: 300, marginTop: 10 }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{`Name :`} <Text style={{ fontWeight: '100' }}>{`${item != '' ? item.name : ''}`}</Text></Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{`Title :`} <Text style={{ fontWeight: '100' }}>{`${item != '' ? item.title : ''}`}</Text></Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{`Description :`} <Text style={{ fontWeight: '300' }}>{`${item != '' ? item.desc : ''}`}</Text></Text>
                    </View>
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => handleModalClose()}
                    >
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              <Card style={{ padding: 10, marginTop: 10, }}>
                <View style={{ backgroundColor: 'transparent', flexDirection: 'row' }}>
                  <View style={{ width: '35%', borderWidth: .3 }}>
                    <Text style={styles.heading}>Name</Text>
                  </View>
                  <View style={{ width: '35%', borderWidth: .3 }}>
                    <Text style={styles.heading}>Title</Text>
                  </View>
                  <View style={{ width: '29%', borderWidth: .3 }}>
                    <Text style={styles.heading}>View</Text>
                  </View>
                </View>

                <FlatList
                  data={posts}
                  renderItem={({ item, index }) => (
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '35%', borderWidth: .3 }}>
                        <Text style={{ padding: 8, alignSelf: 'flex-start', fontSize: 16 }}>{index + 1 + '. ' + item.name}</Text>
                      </View>
                      <View style={{ width: '35%', borderWidth: .3 }}>
                        <Text style={{ padding: 8, alignSelf: 'flex-start', fontSize: 16 }}>{item.title}</Text>
                      </View>
                      <View style={{ width: '29%', borderWidth: .3, justifyContent: 'center', alignItems: 'center' }}>
                        <Button style={{ margin: 5, }} mode="contained" onPress={() => handleItem(item)}>
                          press
                        </Button>
                      </View>
                      <View style={{ marginBottom: 10 }} />
                    </View>

                  )}
                />
              </Card>

            </>
          )}
      </ScrollView>
      <FAB
        style={styles.fab}
        color={'white'}
        icon="plus"
        onPress={() => navigation.navigate('AddDetails')}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    marginTop: 30,
    borderRadius: 5,
    paddingHorizontal: 40,
    paddingVertical: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  imageBox: {
    width: 300,
    height: 300
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  heading: {
    padding: 10,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
