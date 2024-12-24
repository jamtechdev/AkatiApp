import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import countryList from 'react-select-country-list';
import { Colors } from '../_utils/GlobalStyle';

const CountrySelector = ({ onSelectCountry }) => {
  const countriesList = useMemo(() => countryList().getData(), []);

  return (
    <SelectDropdown
      data={countriesList}
      onSelect={(selectedItem, index) => {
        onSelectCountry(selectedItem);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem.label) || 'Select your country'}
            </Text>
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: Colors.gradientReverse }) }}>
            <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

const styles = StyleSheet.create({
    dropdownButtonStyle: {
      width: 200,
      height: 50,
      backgroundColor: Colors.primary,
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: Colors.white,
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: Colors.primary,
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: Colors.white,
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
  });


export default CountrySelector;