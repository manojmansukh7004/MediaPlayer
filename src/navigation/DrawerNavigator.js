import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import AddDetails from '../pages/AddDetails';
import DrawerContent from '../navigation/DrawerContent'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const PMS = (props) => {

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: "#082b68",
        borderBottomColor: '#f27024',
        borderBottomWidth: 3
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>

      <Stack.Screen name="Home"
        component={Home}
        options={{
          title: "Home",
          headerLeft: () => (
            <Icon.Button name="menu" size={25} backgroundColor={'transparent'} onPress={() => props.navigation.openDrawer()}></Icon.Button>
          )
        }}
      />
      <Stack.Screen name="AddDetails"
        component={AddDetails}
        options={{
          title: "Add Details",
        }}
      />
    </Stack.Navigator>
  );
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="PMS" component={PMS} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;