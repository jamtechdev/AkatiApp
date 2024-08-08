import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {HeadingText, TextBadge} from '../../../components';
import {Colors} from '../../../_utils/GlobalStyle';
import Slider from '@react-native-community/slider';

const {height: screenHeight} = Dimensions.get('window');

const filterOptions = [
  {
    category: 'Font Size',
    type: 'range',
    categoryValue: 'fontSize',
    currentValue: 18,
    minValue: 10,
    maxValue: 40,
  },
  {
    category: 'Text Alignment',
    categoryValue: 'textAlign',
    type: 'list',
    currentValue: 'left',
    options: [
      {value: 'left', label: 'Left'},
      {value: 'right', label: 'Right'},
      {value: 'center', label: 'Center'},
      {value: 'justify', label: 'Justify'},
    ],
  },
  {
    category: 'Text Weight',
    categoryValue: 'fontWeight',
    type: 'list',
    currentValue: 'normal',
    options: [
      {value: 'normal', label: 'Normal'},
      {value: '500', label: '500'},
      {value: '600', label: '600'},
      {value: 'bold', label: 'Bold'},
    ],
  },
  {
    category: 'Line Height',
    categoryValue: 'lineHeight',
    type: 'list',
    currentValue: 40,
    options: [
      {value: 20, label: '20'},
      {value: 30, label: '30'},
      {value: 40, label: '40'},
      {value: 50, label: '50'},
    ],
  },
  {
    category: 'Font Style',
    categoryValue: 'fontFamily',
    type: 'list',
    currentValue: 'default',
    options: [
      {value: 'default', label: 'Default'},
      {value: 'Helvetica', label: 'Helvetica'},
      {value: 'Verdana', label: 'Verdana'},
    ],
  },
  {
    category: 'Font Color',
    categoryValue: 'color',
    type: 'list',
    currentValue: 'white',
    options: [
      {value: 'white', label: 'White'},
      {value: 'black', label: 'Black'},
      {value: '#ff0000', label: 'Red'},
    ],
  },
  {
    category: 'Background Color',
    categoryValue: 'backgroundColor',
    type: 'list',
    currentValue: '#18181b',
    options: [
      {value: '#18181b', label: 'Black'},
      {value: 'white', label: 'White'},
      {value: 'gray', label: 'Gray'},
      {value: '#d4e6dd', label: 'Light Blue'},
      {value: '#d0ba95', label: 'Light Yellow'},
    ],
  },
];

const FilterBottomDrawer = ({
  visible,
  onClose,
  title,
  setFilterState,
  filterState,
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? screenHeight * 0.3 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleChange = (category, value) => {
    setFilterState(prevState => {
      // Default updated state with the new value
      let updatedState = {...prevState, [category]: value};

      // Conditional updates based on category
      if (category === 'backgroundColor') {
        // Update color based on new backgroundColor
        updatedState.color = getValidTextColor(value);
      } else if (category === 'color') {
        // Update backgroundColor based on new color
        updatedState.backgroundColor = getValidTextColor(value);
      }

      return updatedState;
    });
  };

  const getValidTextColor = backgroundColor => {
    if (backgroundColor === '#18181b' || backgroundColor === 'black') {
      return 'white';
    }
    if (backgroundColor === 'white') {
      return 'black';
    }
    return 'black'; // Default color
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none" // Disable the default animation
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, {transform: [{translateY}]}]}>
          <View style={styles.header}>
            <HeadingText>{title}</HeadingText>
            <Icons
              name={'close'}
              size={20}
              color={Colors.white}
              onPress={onClose}
            />
          </View>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            style={{marginBottom: 300}}
            showsVerticalScrollIndicator={false}>
            {filterOptions.map(option => {
              if (option.type === 'range') {
                return (
                  <View key={option.category} style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>
                      {option.category} : {filterState[option.categoryValue]}
                    </Text>
                    <Slider
                      style={styles.slider}
                      minimumValue={option.minValue}
                      value={filterState[option.categoryValue]}
                      step={1}
                      maximumValue={option.maxValue}
                      minimumTrackTintColor="#FFFFFF"
                      maximumTrackTintColor="#000000"
                      onValueChange={value =>
                        handleChange(option.categoryValue, value)
                      }
                    />
                  </View>
                );
              } else if (option.type === 'list') {
                return (
                  <View key={option.category} style={styles.filterContainer}>
                    <Text style={styles.filterLabel}>{option.category}</Text>
                    <View style={styles.categoryContainer}>
                      {option.options.map((opt, index) => (
                        <TextBadge
                          key={index}
                          title={opt.label}
                          onPress={() =>
                            handleChange(option.categoryValue, opt.value)
                          }
                        />
                      ))}
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modal: {
    height: '100%', // Adjust height to ensure visibility of content
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalContent: {
    paddingBottom: 20, // Ensure content is not hidden
    alignItems: 'center',
  },
  filterContainer: {
    width: '100%',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 18,
    color: Colors.white,
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  categoryContainer: {
    flexWrap: 'wrap',
    gap: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },
});

export default FilterBottomDrawer;
