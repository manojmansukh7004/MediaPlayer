import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
  
} from 'react-native';
import * as ImagePicker from "react-native-image-picker"
import * as Progress from 'react-native-progress';
import { TextInput } from 'react-native-paper';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import RNVideoPlayer from "react-native-advanced-video-player";
import Video from 'react-native-video';

export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [name, setName] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [media, setMedia] = useState(null)

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      mediaType: 'image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        setImage(source);
        setMedia("image")
      }
    });
  };
  const selectVideo = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        setImage(source);
        setMedia("video")

      }
    });
  };

  const submitPost = async () => {
    if (name !== null && title !== null && desc !== null && image !== null) {
      const imageUrl = await uploadImage();
      firestore()
        .collection('MediaContent')
        .add({
          name: name,
          title: title,
          desc: desc,
          imageUrl: imageUrl,
          media: media,
          postTime: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          Alert.alert(
            'Post published!',
            'Your post has been published Successfully!',
          );
          setName(null);
          setDesc(null);
          setTitle(null);
          setMedia(null)
        })
        .catch((error) => {
          console.log('Something went wrong with added post to firestore.', error);
        });
    }
    else {
      Alert.alert(
        'Please enter all details!',
      );
    }
  }

  const uploadImage = async () => {
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      // console.log(
      //   `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      // );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
        100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <TextInput
        label="Name"
        mode='outlined'
        style={{ margin: 3 }}
        value={name}
        onChangeText={value => setName(value)}
      />
      <TextInput
        label="Title"
        mode='outlined'
        style={{ margin: 3 }}
        value={title}
        onChangeText={value => setTitle(value)}
      />
      <TextInput
        label="Description"
        multiline={true}
        mode='outlined'
        style={{ margin: 3 }}
        value={desc}
        onChangeText={value => setDesc(value)}
      />


      <View style={styles.imageContainer}>
        {media == 'image' ? (
          <Image source={{ uri: image!== null? image.uri : ''}} style={styles.imageBox} />
        ) :
          <Video
            source={{ uri: image!== null? image.uri : ''}}
            style={image!== null?styles.imageBox : null}
            resizeMode="cover"
          />
        }
        {
          image == null ?
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
                <Text style={styles.buttonText}>Pick an image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.selectButton} onPress={selectVideo}>
                <Text style={styles.buttonText}>Pick an Video</Text>
              </TouchableOpacity>
            </View>
            : null
        }

        {uploading ? (
          <View style={styles.progressBarContainer}>
            <Progress.Bar progress={transferred} width={300} />
          </View>
        ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={submitPost}>
              <Text style={styles.buttonText}>Upload Details</Text>
            </TouchableOpacity>
          )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20
    // alignItems: 'center',
    // backgroundColor: '#bbded6'
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 300,
    height: 300
  }
});