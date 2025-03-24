import {
    CameraMode,
    CameraType,
    CameraView,
    useCameraPermissions,
  } from "expo-camera"; // Importe les composants et hooks de la caméra Expo
  import { useRef, useState } from "react"; // Importe les hooks de React
  import { Button, Pressable, StyleSheet, Text, View } from "react-native"; // Importe les composants de base de React Native
  import { Image } from "expo-image"; // Importe le composant Image d'Expo
  import { AntDesign } from "@expo/vector-icons"; // Importe des icônes vectorielles
  import { Feather } from "@expo/vector-icons"; // Importe des icônes vectorielles
  import { FontAwesome6 } from "@expo/vector-icons"; // Importe des icônes vectorielles

  export default function CameraFunction() {
    // États et références
    const [permission, requestPermission] = useCameraPermissions(); // Gère les permissions de la caméra
    const ref = useRef(null); // Référence à l'instance de la caméra
    const [uri, setUri] = useState(null); // Stocke l'URI de la photo capturée
    const [mode, setMode] = useState("picture"); // Mode de la caméra (photo ou vidéo)
    const [facing, setFacing] = useState("back"); // Caméra avant ou arrière
    const [recording, setRecording] = useState(false); // État d'enregistrement vidéo
  
    // Si les permissions ne sont pas encore définies
    if (!permission) {
      return null; // Ne rien afficher tant que les permissions ne sont pas chargées
    }
  
    // Si la permission n'est pas accordée
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to use the camera
          </Text> // Affiche un message demandant la permission
          <Button onPress={requestPermission} title="Grant permission" /> // Bouton pour demander la permission
        </View>
      );
    }
  
    // Prendre une photo
    const takePicture = async () => {
      const photo = await ref.current?.takePictureAsync(); // Capture une photo
      setUri(photo?.uri); // Met à jour l'URI de la photo
    };
  
    // Enregistrer une vidéo
    const recordVideo = async () => {
      if (recording) {
        setRecording(false); // Arrête l'enregistrement
        ref.current?.stopRecording(); // Arrête la caméra
        return;
      }
      setRecording(true); // Démarre l'enregistrement
      const video = await ref.current?.recordAsync(); // Enregistre la vidéo
      console.log({ video }); // Affiche les détails de la vidéo dans la console
    };
  
    // Basculer entre photo et vidéo
    const toggleMode = () => {
      setMode((prev) => (prev === "picture" ? "video" : "picture"));
    };
  
    // Basculer entre caméra avant et arrière
    const toggleFacing = () => {
      setFacing((prev) => (prev === "back" ? "front" : "back"));
    };
  
    // Afficher la photo capturée
    const renderPicture = () => {
      return (
        <View>
          <Image
            source={{ uri }}
            contentFit="contain"
            style={{ width: 300, aspectRatio: 1 }} // Affiche la photo capturée
          />
          <Button onPress={() => setUri(null)} title="Take another picture" /> // Bouton pour reprendre une photo
        </View>
      );
    };
  
    // Afficher l'interface de la caméra
    const renderCamera = () => {
      return (
        <CameraView
          style={styles.camera}
          ref={ref}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
        >
          {/* Conteneur pour les boutons en bas de l'écran */}
          <View style={styles.shutterContainer}>
            <Pressable onPress={toggleMode}>
              {mode === "picture" ? (
                <AntDesign name="picture" size={32} color="white" /> // Icône pour le mode photo
              ) : (
                <Feather name="video" size={32} color="white" /> // Icône pour le mode vidéo
              )}
            </Pressable>
            <Pressable onPress={mode === "picture" ? takePicture : recordVideo}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    {
                      opacity: pressed ? 0.5 : 1, // Change l'opacité lors du clic
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.shutterBtnInner,
                      {
                        backgroundColor: mode === "picture" ? "white" : "red", // Change la couleur en fonction du mode
                      },
                    ]}
                  />
                </View>
              )}
            </Pressable>
            <Pressable onPress={toggleFacing}>
              <FontAwesome6 name="rotate-left" size={32} color="white" /> // Icône pour basculer entre les caméras
            </Pressable>
          </View>
        </CameraView>
      );
    };
  
    // Rendu principal du composant
    return (
      <View style={styles.container}>
        {uri ? renderPicture() : renderCamera()} // Affiche la caméra ou la photo capturée
      </View>
    );
  }  
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff", // Fond blanc
      alignItems: "center", // Centre les éléments horizontalement
      justifyContent: "center", // Centre les éléments verticalement
    },
    camera: {
      flex: 1, // La caméra occupe tout l'espace disponible
      width: "100%", // Largeur de 100%
    },
    shutterContainer: {
      position: "absolute", // Position absolue pour placer en bas de l'écran
      bottom: 44, // Espacement du bas
      left: 0,
      width: "100%", // Largeur de 100%
      alignItems: "center", // Centre les éléments verticalement
      flexDirection: "row", // Alignement horizontal des boutons
      justifyContent: "space-between", // Espacement uniforme entre les boutons
      paddingHorizontal: 30, // Espacement horizontal
    },
    shutterBtn: {
      backgroundColor: "transparent", // Fond transparent
      borderWidth: 5, // Largeur de la bordure
      borderColor: "white", // Couleur de la bordure
      width: 85, // Largeur du bouton
      height: 85, // Hauteur du bouton
      borderRadius: 45, // Bouton rond
      alignItems: "center", // Centre les éléments horizontalement
      justifyContent: "center", // Centre les éléments verticalement
    },
    shutterBtnInner: {
      width: 70, // Largeur du cercle intérieur
      height: 70, // Hauteur du cercle intérieur
      borderRadius: 50, // Cercle intérieur rond
    },
  });