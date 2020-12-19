import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  // const [x, setX] = useState(0);
  // const [y, setY] = useState(0);
  // const [width, setWidth] = useState(0);
  // const [height, setHeight] = useState(0);
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const colorMaps = ["red", "orange", "blue", "green", "pink"]

  function handleFacesDetected(resultObject) {
    const fs = [];
    resultObject.faces.forEach((faceData, idx) => {
      console.log('[faceData]', faceData);
      fs.push(faceData);
    });
    setFaces(fs);
  }

  const faceMaps = faces.map((face, idx) => {
    return (
      <View key={`face${face.faceID}`} style={{
        left: face.bounds.origin.x,
        top: face.bounds.origin.y,
        width: face.bounds.size.width,
        height: face.bounds.size.height,
        backgroundColor: colorMaps[idx % 5],
        ...styles.rect
      }}>

        <Text style={styles.mapText}>
          微笑機率: {Math.round(face.smilingProbability * 10000) / 100} %
        </Text>
        <Text style={styles.mapText}>
          左眼睜開: {Math.round(face.leftEyeOpenProbability * 10000) / 100} %
        </Text>
        <Text style={styles.mapText}>
          右眼睜開: {Math.round(face.rightEyeOpenProbability * 10000) / 100} %
        </Text>
      </View>
    )
  })

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} onFacesDetected={handleFacesDetected} type={type} faceDetectorSettings={{
        mode: FaceDetector.Constants.Mode.fast,
        detectLandmarks: FaceDetector.Constants.Landmarks.all,
        runClassifications: FaceDetector.Constants.Classifications.all,
        minDetectionInterval: 100,
        tracking: true,
      }}>
        {faceMaps}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  rect: {
    position: "absolute",
    // top: 0,
    // left: 0,
    // width: 100,
    // height: 100,
    // backgroundColor: "red",
    opacity: 0.5
  },
  mapText: {
    color: '#fff'
  },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
