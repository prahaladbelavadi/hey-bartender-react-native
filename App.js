import AppLoading from "expo-app-loading";
import React from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text, SafeAreaView, ScrollView, StatusBar
} from "react-native";

import { Image, Button } from 'react-native-elements';
import { ListItem, Avatar } from 'react-native-elements';
import { Divider } from 'react-native-elements';

import axios from "axios";

export default function App() {
  return (
    <MainScreen />
  );
}



const MainScreen = () => {
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


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "pink"
        // backgroundColor: "plum",
        // alignItems: "center",
        // justifyContent: "space-around",
        // justifyContent: "space-between",
        // justifyContent: "flex-start",
      }}
    >

      <ScrollView>
        <StatusBar hidden={true} />
        <View style={{
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 10
        }}>
          <Image
            // source={{ uri: image }}
            source={{ uri: drink.url }}
            style={{
              width: 250, height: 250,
            }}
          />

        </View>

        <Divider style={{ height: 1, backgroundColor: "#e1e8ee", paddingBottom: 4 }} />
        <Text style={{
          backgroundColor: "#489FB5", fontSize: 30,
          color: "black",
          fontWeight: "800",
          textAlign: "center"
        }}>
          {drink.name}
        </Text>
        <Text
          style={{
            color: "yellow",
            fontStyle: "italic",
            textAlign: "center",
            backgroundColor: '#16697A',
            padding: 2
          }}
        >
          {drink.type}

        </Text>

        {
          drink.ingredients &&
          drink.ingredients.map( ( l, i ) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{l}</ListItem.Title>
                <ListItem.Subtitle>{l}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ) )
        }
        <Divider style={{ height: 1, backgroundColor: "pink", paddingBottom: 4 }} />
        <Button
          title="Hit me!" onPress={() => fetchDrink()} style={{ bottom: 0 }}
        />

      </ScrollView>
    </SafeAreaView>
  );

};
