import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

let camera

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [zoomLevel, setZoomLevel] = useState(0)

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text style={{ justifyContent: 'center', alignItems: 'center' }}>Permission for camera not granted. Please change this in settings.</Text>
  } else if (!hasMediaLibraryPermission) {
    return <Text style={{ justifyContent: 'center', alignItems: 'center' }}>Permission for media not granted. Please change this in settings.</Text>
  }


  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const handleCapture = async () => {
    if (camera) {
      const options = { quality: 0.7 }
      const data = await camera.takePictureAsync(options)

      await MediaLibrary.saveToLibraryAsync(data.uri)
      console.log(data.uri)
    }
  }

  const handleZoom = (type) => {
    setZoomLevel((prev) =>
      type === "+"
        ? prev === 100
          ? 100
          : prev + 10
        : prev === 0
          ? 0
          : prev - 10

    )
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera}
        type={type}
        zoom={zoomLevel / 100}
        ref={(ref) => { camera = ref }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={toggleCameraType}>
            <Text style={styles.text}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCapture}>
            <Text style={styles.text}>Take a photo</Text>
          </TouchableOpacity>
          <Text style={styles.text}>{zoomLevel / 100}</Text>
          <View style={styles.zoomContainer}>
            <TouchableOpacity
              style={styles.zoom}
              onPress={() => handleZoom("-")}
              disabled={zoomLevel / 100 === 0}
            >
              <Text style={styles.text}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.zoom}
              onPress={() => handleZoom("+")}
              disabled={zoomLevel / 100 === 1}
            >
              <Text style={styles.text}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: '#999',
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',

  },

  text: {
    fontSize: 22,
    color: 'white',
  },
  zoomContainer: {
    flexDirection: 'row'
  },
  zoom: {
    width: 40,
    height: 40,
    backgroundColor: '#DDD',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4
  },
  zoomText: {
    fontSize: 26
  }
});
