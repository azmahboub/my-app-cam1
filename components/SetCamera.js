import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // Importe les composants et hooks de la caméra Expo
import { useState } from 'react'; // Importe le hook useState de React
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Importe les composants de base de React Native

export default function SetCamera() {
  // États et références
  const [facing, setFacing] = useState('back'); // État pour gérer la caméra avant ou arrière
  const [permission, requestPermission] = useCameraPermissions(); // Gère les permissions de la caméra

  // Si les permissions ne sont pas encore définies
  if (!permission) {
    return <View />; // Ne rien afficher tant que les permissions ne sont pas chargées
  }

  // Si la permission n'est pas accordée
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text> 
        <Button onPress={requestPermission} title="grant permission" /> 
      </View>
    );
  }

  // Basculer entre caméra avant et arrière
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Rendu principal du composant
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Basculer Camera</Text> 
            
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
