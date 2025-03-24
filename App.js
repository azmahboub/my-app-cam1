import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import CameraFunction from './components/Camera/CameraFunction';
import MediaFunction from './components/Camera/MediaFunction';
import SetCamera from './components/SetCamera';

function HomeScreen({ navigation }) {  
  return (
   <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    
     <TouchableOpacity
       style={{
         width: "80%",
         padding: 5,
         borderColor: "red",
         borderWidth: 1,
         borderRadius: 15,
         marginVertical: 10
       }}
     >
       <Text
         style={{ textAlign: "center", color: "red" }}
         onPress={() =>
           navigation.navigate("Camera")
         }
       >
         Camera
       </Text>
       </TouchableOpacity>
       <TouchableOpacity
       style={{
         width: "80%",
         padding: 5,
         borderColor: "red",
         borderWidth: 1,
         borderRadius: 15,
         marginVertical: 10
       }}
     >
       <Text
         style={{ textAlign: "center", color: "red" }}
         onPress={() =>
           navigation.navigate("TakePicture")
         }
       >
         Take picture
       </Text>
       </TouchableOpacity>
       <TouchableOpacity
       style={{
         width: "80%",
         padding: 5,
         borderColor: "red",
         borderWidth: 1,
         borderRadius: 15,
         marginVertical: 10
       }}
     >
       <Text
         style={{ textAlign: "center", color: "red" }}
         onPress={() =>
           navigation.navigate("SavePicture")
         }
       >
         Save picture
       </Text>
     </TouchableOpacity>
    
   </View>
 );
}

const Stack = createNativeStackNavigator();

function App() {
 return (
   <NavigationContainer>
     <Stack.Navigator>
       <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={SetCamera}/>
        <Stack.Screen name="TakePicture" component={CameraFunction}/>
        <Stack.Screen name="SavePicture" component={MediaFunction}/>
      
     </Stack.Navigator>
   </NavigationContainer>
 );
}

export default App;