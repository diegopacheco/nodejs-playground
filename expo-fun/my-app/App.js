import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 50, color: 'blue'}}>Diego Pacheco</Text>
      <Text style={{fontSize: 20}}>Test Expo on react-native !!!</Text>
      <Text style={{fontSize: 20}}>🎉🎉🎉 {"\n"}</Text>
      <Image
          style={styles.image}
          source={{uri:'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png'}}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: "contain",
    opacity:0.7,
    width: '80%', 
    height:'25%'    
  }
});
