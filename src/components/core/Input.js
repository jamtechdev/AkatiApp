/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Controller} from 'react-hook-form';
import {
  TextInput,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import GlobalStyles, {Colors} from '../../_utils/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const Input = ({
  name,
  control,
  placeholder,
  onChangeText,
  secureTextEntry = false,
  ...rest
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureTextEntry = () => {
    setIsSecure(prevState => !prevState);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
        <View>
          <View style={styles.container}>
            <TextInput
              style={GlobalStyles.inputView}
              placeholderTextColor={Colors.darkGray}
              placeholder={placeholder}
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              secureTextEntry={isSecure}
              {...rest}
            />
            {secureTextEntry && (
              <TouchableOpacity
                style={styles.icon}
                onPress={toggleSecureTextEntry}>
                <Icon
                  name={isSecure ? 'eye' : 'eye-slash'}
                  size={20}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )}
          </View>
          {error && <Text style={GlobalStyles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{translateY: -10}],
  },
});
