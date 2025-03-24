import {
    CameraMode,
    CameraType,
    CameraView,
    useCameraPermissions,
  } from "expo-camera"; // Importe les composants et hooks de la caméra Expo
  import { useRef, useState, useEffect } from "react"; // Importe les hooks de React
  import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
  } from "react-native"; // Importe les composants de base de React Native
  import { Image } from "expo-image"; // Importe le composant Image d'Expo
  import { AntDesign, Feather, FontAwesome6, Ionicons } from "@expo/vector-icons"; // Importe des icônes vectorielles
  import * as MediaLibrary from "expo-media-library"; // Importe le module pour accéder à la bibliothèque média


  export default function MediaFunction() {
    // États et références
    const [permission, requestPermission] = useCameraPermissions(); // Gère les permissions de la caméra
    const ref = useRef(null); // Référence à l'instance de la caméra
    const [uri, setUri] = useState(null); // Stocke l'URI de la photo ou de la vidéo
    const [mode, setMode] = useState("picture"); // Mode de la caméra (photo ou vidéo)
    const [facing, setFacing] = useState("back"); // Caméra avant ou arrière
    const [recording, setRecording] = useState(false); // État d'enregistrement vidéo
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null); // Permission pour la bibliothèque média
    const [photo, setPhoto] = useState(); // Stocke la photo capturée
  
    // Demander les permissions pour la bibliothèque média
    useEffect(() => {
      (async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync(); // Demande la permission
        setMediaLibraryPermission(status === "granted"); // Met à jour l'état de la permission
      })();
    }, []);
  
    // Vérifier les permissions
    if (permission === undefined || mediaLibraryPermission === undefined) {
      return <Text>Request Permissions....</Text>; // Affiche un message pendant la demande de permissions
    } else if (!permission) {
      return (
        <Text>
          Permission for camera not granted. Please change this in settings
        </Text> // Affiche un message si la permission est refusée
      );
    }
  
    // Prendre une photo
    const takePicture = async () => {
      const newPhoto = await ref.current?.takePictureAsync(); // Capture une photo
      setPhoto(newPhoto); // Met à jour l'état avec la nouvelle photo
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
  
    // Sauvegarder la photo dans la bibliothèque
    if (photo) {
      const savePhoto = () => {
        MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
          setPhoto(undefined); // Réinitialise l'état de la photo après sauvegarde
        });
      };
  
      // Affiche la photo capturée et les boutons pour sauvegarder ou supprimer
      return (
        <SafeAreaView style={styles.imageContainer}>
          <Image style={styles.preview} source={{ uri: photo.uri }} />
          <View style={styles.btnContainer}>
            {mediaLibraryPermission ? (
              <TouchableOpacity style={styles.btn} onPress={savePhoto}>
                <Ionicons name="save-outline" size={30} color="black" />
              </TouchableOpacity>
            ) : undefined}
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setPhoto(undefined)}
            >
              <Ionicons name="trash-outline" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
  
    // Basculer entre photo et vidéo
    const toggleMode = () => {
      setMode((prev) => (prev === "picture" ? "video" : "picture"));
    };
  
    // Basculer entre caméra avant et arrière
    const toggleFacing = () => {
      setFacing((prev) => (prev === "back" ? "front" : "back"));
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
          <View style={styles.bottomContainer}>
            <Pressable onPress={toggleMode}>
              {mode === "picture" ? (
                <AntDesign name="picture" size={32} color="white" />
              ) : (
                <Feather name="video" size={32} color="white" />
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
              <FontAwesome6 name="rotate-left" size={32} color="white" />
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
      justifyContent: "center", // Centre le contenu verticalement
    },
    camera: {
      flex: 1, // La caméra occupe tout l'espace disponible
    },
    bottomContainer: {
      position: "absolute", // Position absolue pour placer en bas de l'écran
      bottom: 20, // Espacement du bas
      left: 0,
      right: 0,
      flexDirection: "row", // Alignement horizontal des boutons
      justifyContent: "space-around", // Espacement uniforme entre les boutons
      alignItems: "center", // Centre les boutons verticalement
    },
    shutterBtn: {
      width: 60,
      height: 60,
      borderRadius: 30, // Bouton rond
      borderWidth: 2,
      borderColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    shutterBtnInner: {
      width: 50,
      height: 50,
      borderRadius: 25, // Cercle intérieur du bouton
    },
    btnContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly", // Espacement uniforme entre les boutons
      backgroundColor: "white", // Fond blanc pour les boutons
    },
    btn: {
      justifyContent: "center",
      margin: 10,
      elevation: 5, // Ombre pour un effet 3D
    },
    imageContainer: {
      height: "95%",
      width: "100%", // Conteneur pour l'image capturée
    },
    preview: {
      alignSelf: "stretch",
      flex: 1,
      width: "auto", // Ajuste la taille de l'image
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white", // Texte blanc
    },
  });