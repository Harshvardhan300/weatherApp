import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import theme from './theme/theme';
import { fetchLocation, fetchWeatherForecast } from './api/weather.js';
import { weatherImages } from './api/api.js';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  
  const handleLocation = (loc) => {
    //console.log('location: ', loc);
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForecast({ cityName: loc.name, days:'7' })
      .then((data) =>{
        setWeather(data);
        //console.log('got forecast: ', data);
      })
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocation({ cityName: value })
        .then((data) => setLocations(data))
        .catch((error) => console.error('Error fetching locations:', error));
    }
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);
  const fetchMyWeatherData = async ()=>{
    fetchWeatherForecast({
      cityName: 'New Delhi',
      days: '7',
    }).then(data=>{
      setWeather(data);
    })
  }

  const {current, location, forecast} = weather;

  return (
    <View style={{ flex: '1', position: 'relative' }}>
      <StatusBar style="light" />
      <Image
        source={require('./bg.png')}
        style={{ position: 'absolute', height: '100%', width: '100%' }}
      />
          <SafeAreaView style={{ flex: 1 }}>
            {/* Search Section */}
            <View style={{ height: '7%', marginHorizontal: 16, position: 'relative', zIndex: 50 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderRadius: 50,
                  backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
                }}
              >
                {showSearch ? (
                  <TextInput
                    onChangeText={handleSearch}
                    placeholder="Search city"
                    placeholderTextColor="white"
                    style={{
                      paddingLeft: 16,
                      height: 40,
                      flex: 1,
                      fontSize: 16,
                      color: 'white',
                    }}
                  />
                ) : null}
    
                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={{
                    backgroundColor: theme.bgWhite(0.3),
                    borderRadius: 50,
                    padding: 10,
                    margin: 2,
                  }}
                >
                </TouchableOpacity>
              </View>
              { 
                locations.length > 0 && showSearch ? (
                  <View
                    style={{
                      position: 'absolute',
                      width: '100%',
                      backgroundColor: '#d1d5db',
                      top: 44,
                      borderRadius: 8,
                    }}>
                    {
                
                      locations.map((loc, index) =>{
                        return(
                          <TouchableOpacity
                            onPress={()=> handleLocation(loc)}
                            key={index}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 12,
                              paddingHorizontal: 16,
                              marginBottom: 4,
                              borderBottomWidth: 1,
                              borderBottomColor: 'gray',
                            }}
                          >
                            <Text style={{ color: 'black' }}>{loc?.name}, {loc?.country}</Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                </View>
              ) : null}
            </View>
    
            {/* Forecast Section */}
            <View style={{ marginHorizontal: 16, flex: 1, justifyContent: 'space-around', marginBottom: 8 }}>
              {/* Location */}
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
                {location?.name},
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#d1d5db' }}>
                  {" "+location?.country}
                </Text>
              </Text>
    
              {/* Weather Image */}
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image
                  source={weatherImages[current?.condition?.text]}
                  style={{ width: 208, height: 208 }}
                />
              </View>
    
              {/* Degree Celsius */}
              <View style={{ alignItems: 'center', marginVertical: 8 }}>
                <Text style={{ fontSize: 64, fontWeight: 'bold', color: 'white' }}>{current?.temp_c}&#176;</Text>
                <Text style={{ fontSize: 20, color: 'white', letterSpacing: 2 }}>
                  {current?.condition?.text}
                </Text>
              </View>
    
              {/* Other Stats */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('./api/icons/wind.png')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                    {current?.wind_kph}km/h
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('./api/icons/drop.png')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                    {current?.humidity}%
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('./api/icons/sun.png')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 8 }}>
                    {forecast?.forecastday[0]?.astro?.sunsrise}
                  </Text>
                </View>
              </View>
            </View>
    
            {/* Forecast for Next 7 Days */}
            <View style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16 }}>
                <Text style={{ color: 'white', fontSize: 16, marginLeft: 8 }}>Daily Forecast</Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 16 }}
                showsHorizontalScrollIndicator={false}
              >
                {
                  weather?.forecast?.forecastday?.map((item, index)=>{
                    let date = new Date(item.date);
                    let options= {weekday: 'long'};
                    let dayName = date.toLocaleDateString('en-US', options);
                    dayName = dayName.split(',')[0]
    
                    return(
                      <View
                        key={index}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 96,
                          borderRadius: 24,
                          paddingVertical: 12,
                          marginRight: 16,
                          backgroundColor: theme.bgWhite(0.15),
                        }}
                      >
                        <Image
                          source={weatherImages[item?.day?.condition?.text]}
                          style={{ height: 44, width: 44 }}
                        />
                        <Text style={{ color: 'white', marginTop: 4 }}>{dayName}</Text>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>{item?.day?.avgtemp_c}&#176;</Text>
                      </View>
                    )
    
                  })
                }
              </ScrollView>
            </View>
          </SafeAreaView>
    </View>
  );
}
