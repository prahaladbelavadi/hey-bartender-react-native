import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import React from "react";
import {
  Animated,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import axios from "axios";

// import image from "./assets/orange.jpg";


// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch( () => {
  /* reloading the app might trigger some race conditions, ignore them */
} );

export default function App() {
  return (
    <AnimatedAppLoader image={{ uri: Constants.manifest.splash.image }}>
      <MainScreen />
    </AnimatedAppLoader>
  );
}

function AnimatedAppLoader( { children, image } ) {
  const [isSplashReady, setSplashReady] = React.useState( false );

  const startAsync = React.useMemo(
    // If you use a local image with require(...), use `Asset.fromModule`
    () => () => Asset.fromURI( image ).downloadAsync(),
    [image]
  );

  const onFinish = React.useMemo( () => setSplashReady( true ), [] );

  if ( !isSplashReady ) {
    return (
      <AppLoading
        // Instruct SplashScreen not to hide yet, we want to do this manually
        autoHideSplash={false}
        startAsync={startAsync}
        onError={console.error}
        onFinish={onFinish}
      />
    );
  }

  return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
}

function AnimatedSplashScreen( { children, image } ) {
  const animation = React.useMemo( () => new Animated.Value( 1 ), [] );
  const [isAppReady, setAppReady] = React.useState( false );
  const [isSplashAnimationComplete, setAnimationComplete] = React.useState(
    false
  );

  React.useEffect( () => {
    if ( isAppReady ) {
      Animated.timing( animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      } ).start( () => setAnimationComplete( true ) );
    }
  }, [isAppReady] );


  const onImageLoaded = React.useMemo( () => async () => {
    try {
      await SplashScreen.hideAsync();
      // Load stuff
      await Promise.all( [] );
    } catch ( e ) {
      // handle errors
    } finally {
      setAppReady( true );
    }
  } );

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest.splash.backgroundColor,
              opacity: animation,
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest.splash.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={image}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
      )}
    </View>
  );
}





function MainScreen() {
  const [drink, setDrink] = React.useState( {} );
  // const [ingredients, setIngredients] = React.useState( [] );


  React.useEffect( () => {
    fetchDrink();
  }, [] );


  const fetchDrink = () => {
    axios.get( "https://www.thecocktaildb.com/api/json/v1/1/random.php" ).then( cuppa => {
      const LogData = cuppa.data.drinks[0].strAlcoholic;

      // console.log( JSON.stringify( LogData ) );

      const propertiesOfDrink = Object.keys( cuppa.data.drinks[0] );
      // console.log(propertiesOfDrink)
      const ingredientsProps = propertiesOfDrink.filter( ( property ) => property.startsWith( "strIngredient" ) && cuppa.data.drinks[0][property] != null );
      const ingredients = ingredientsProps.map( ( prop ) => cuppa.data.drinks[0][prop] );


      setDrink(
        {
          url: cuppa.data.drinks[0].strDrinkThumb,
          name: cuppa.data.drinks[0].strDrink,
          type: cuppa.data.drinks[0].strAlcoholic,
          ingredients
        }
      );
    } ).catch( err => {
      console.error( err );
    } );

  };


  function onReloadPress() {
    if ( Platform.OS === "web" ) {
      location.reload();
    } else {
      Updates.reloadAsync();
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "plum",
        // alignItems: "center",
        // justifyContent: "space-around",
        // justifyContent: "space-between",
        // justifyContent: "flex-start",
      }}
    >

      <Image
        // source={{ uri: image }}
        source={{ uri: drink.url }}
        style={{ width: 200, height: 200 }}
      />
      <Button title="Hit me!" onPress={onReloadPress} style={{ bottom: 0 }} />
      <Text style={{
        backgroundColor: "purple", fontSize: 20,
        color: "black",
      }}>
        Name: {drink.name}
        Type: {drink.type}
      </Text>
      <Text
        style={{
          color: "black",
          // marginBottom: "100%",
          fontWeight: "bold",
          backgroundColor: 'white'
        }}
      >

        {JSON.stringify( drink )}

      </Text>


    </View>
  );
}
