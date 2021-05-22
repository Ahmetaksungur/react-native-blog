import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import HTML from "react-native-render-html";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { LinearGradient } from 'expo-linear-gradient';
const { width } = Dimensions.get('window');

function homeScreen({ navigation: { navigate } }) {
  const [isLoading, setLoading1] = useState(true);
  const [data, setData1] = useState([]);

  const [isLoading2, setLoading] = useState(true);
  const [data2, setData] = useState([]);

  const contentWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetch('https://blog.bogerdsoft.com/api/blog')
      .then((response) => response.json())
      .then((json) => setData1(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading1(false));

      fetch('https://blog.bogerdsoft.com/api/blog?slider=1&limit=5')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

  }, []);

  return (
    <View style={styles.container}>

{isLoading2 ? (
        <ActivityIndicator />
      ) : (
        <SwiperFlatList
        autoplay
        autoplayDelay={2}
        autoplayLoop
        index={1}
        data={data2}
        style={styles.sliderCardList}
        renderItem={({ item }) => (
        <ImageBackground style={styles.sliderCard} source={{uri : item.image.path}}>
          <TouchableOpacity style={styles.sliderCardContent} onPress={() => navigate('Blog', { id: item.id })}>
            <LinearGradient style={styles.sliderCardContent} colors={['#ffffff2e', '#ffffff2e', '#07090ef2']}>
            <Text style={styles.sliderCardTitle}>{item.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ImageBackground>
        )}
      />
      )}

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigate('Blog', { id: item.id })}>
              <View style={styles.blogCard}>
                <Image
                  style={styles.blogCardImage}
                  source={{ uri: item.image.path }}
                />
                <Text style={styles.blogCardTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.blogCardDetail}>
                {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

function blogDetail() {
  const route = useRoute();
  const id = route.params.id;
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const contentWidth = Dimensions.get('window').width;

  useEffect(() => {
    fetch(`https://blog.bogerdsoft.com/api/blog?id=${id}`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  });

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <View style={styles.singleBlog}>
                <Text style={styles.singleBlogCategory}>{item.categories.map((e) => e.title).join(', ')} - {item.create_date.date}</Text>
                <Text style={styles.singleBlogTitle}>{item.title}</Text>
                <Image
                  style={styles.singleBlogImage}
                  source={{ uri: item.image.path }}
                />
                <HTML style={styles.singleBlogDetail} source={{ html: item.content }} contentWidth={contentWidth} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const Stack = createStackNavigator();

function HeaderLogo() {
  return (
    <Image
      style={styles.logo}
      source="https://blog.bogerdsoft.com/core/public/uploads/mimarice_logo.png"
    />
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Mimarice">
        <Stack.Screen name="Mimarice" component={homeScreen} options={{ headerTitle: props => <HeaderLogo {...props} /> }} />
        <Stack.Screen name="Blog" component={blogDetail}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  logo: {
    width: 200,
    height: 40,
    justifyContent: 'center',
  },
  blogCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#00000003',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 15,
  },
  blogCardImage: {
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  blogCardTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  blogCardDetail: {
    fontSize: 15,
    color: '#b1b1b1'
  },
  singleBlog: {
    flex: 1,
    padding: 15
  },

  singleBlogCategory: {
    color: '#595DAF',
    marginBottom: 10,
  },

  singleBlogTitle: {
    fontSize: 25,
    marginBottom: 15,
  },

  singleBlogImage: {
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
  },

  singleBlogDetail: {
    color: '#b1b1b1',
    fontSize: 18,
  },

  sliderCard: {
    width: width - 30,
    height: 250,
  },
  sliderCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  sliderCardTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    padding: 15,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0
  },
  sliderCardContainer: {
    marginBottom: 5,
    padding: 15,
  },
  sliderCardList: {
    borderRadius: 15,
    width: width - 30,
    height: 250,
    marginBottom: 15,
  }

});

export default App;
