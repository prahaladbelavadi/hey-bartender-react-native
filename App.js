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
      const ingredientsProps = propertiesOfDrink.filter( ( property ) => property.startsWith( "strIngredient" ) && cuppa.data.drinks[0][property] != null && cuppa.data.drinks[0][property] != "" );
      const ingredientsMeasureProps = propertiesOfDrink.filter( ( property ) => property.startsWith( "strMeasure" ) && cuppa.data.drinks[0][property] != null && cuppa.data.drinks[0][property] != "" );

      const ingredients = ingredientsProps.map( ( prop ) => cuppa.data.drinks[0][prop] );
      const measures = ingredientsMeasureProps.map( ( prop ) => cuppa.data.drinks[0][prop] );

      setDrink(
        {
          url: cuppa.data.drinks[0].strDrinkThumb,
          name: cuppa.data.drinks[0].strDrink,
          type: cuppa.data.drinks[0].strAlcoholic,
          category: cuppa.data.drinks[0].strCategory,
          glass: cuppa.data.drinks[0].strGlass,
          instructions: cuppa.data.drinks[0].strInstructions,
          ingredients, measures
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
            backgroundColor: '#16697A',
            // padding: 2
            textAlign: 'center',
            marginTop: 6,
            marginBottom: 6
            // 
          }}
        > {drink.type} || {drink.category} || {drink.glass}
        </Text>


        {
          drink.ingredients &&
          drink.ingredients.map( ( l, i ) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{l}</ListItem.Title>
                <ListItem.Subtitle>{drink['measures'][i]}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ) )
        }
        <Text
          style={{
            color: "#009DAE",
            fontStyle: "italic",
            textAlign: "center",
            backgroundColor: '#FFE652',
            // padding: 2
            marginTop: 4,
            marginBottom: 2
          }}
        >
          {drink.instructions}
        </Text>


        <Divider style={{ height: 1, backgroundColor: "pink", paddingBottom: 4 }} />
        <Button
          title="Hit me!" onPress={() => fetchDrink()} style={{ marginBottom: 6 }}
        />

      </ScrollView>
    </SafeAreaView>
  );

};
