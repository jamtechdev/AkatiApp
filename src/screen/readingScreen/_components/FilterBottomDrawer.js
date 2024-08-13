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
import {
  GradientView,
  HeadingText,
  TabSwitcher,
  TextBadge,
} from '../../../components';
import {Colors} from '../../../_utils/GlobalStyle';
import Slider from '@react-native-community/slider';
import NoDataFound from '../../../components/NoDataFound';

const {height: screenHeight} = Dimensions.get('window');

const filterOptions = [
  {
    category: 'Font Size',
    type: 'range',
    categoryValue: 'fontSize',
    currentValue: 18,
    minValue: 10,
    maxValue: 40,
    tab: 'Layout',
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
    tab: 'Layout',
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
    tab: 'Layout',
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
    tab: 'Layout',
  },
  {
    category: 'Font Style',
    categoryValue: 'fontFamily',
    type: 'list',
    currentValue: 'default',
    options: [
      {value: 'baskerville', label: 'Baskerville'},
      {value: 'Helvetica', label: 'Helvetica'},
      {value: 'Verdana', label: 'Verdana'},
    ],
    tab: 'Themes',
  },
  {
    category: 'Font Color',
    categoryValue: 'color',
    type: 'list',
    currentValue: 'white',
    options: [
      {value: '#fff', label: 'White'},
      {value: 'black', label: 'Black'},
      {value: '#ff0000', label: 'Red'},
    ],
    tab: 'Themes',
  },
  {
    category: 'Background Color',
    categoryValue: 'backgroundColor',
    type: 'list',
    currentValue: '#18181b',
    options: [
      {value: '#18181b', label: 'Black'},
      {value: '#fff', label: 'White'},
      {value: 'gray', label: 'Gray'},
      {value: '#d4e6dd', label: 'Light Blue'},
      {value: '#d0ba95', label: 'Light Yellow'},
    ],
    tab: 'Themes',
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
      let updatedState = {...prevState, [category]: value};

      if (category === 'backgroundColor') {
        switch (value) {
          case '#18181b': // Black
            updatedState.backgroundColorSecondary = '#242424';
            updatedState.color = 'white';
            break;
          case '#fff': // White
            updatedState.backgroundColorSecondary = '#efefef';
            updatedState.color = 'black';
            break;
          case 'gray': // Gray
            updatedState.backgroundColorSecondary = '#c7c7c7';
            updatedState.color = prevState.color; // Keep the current text color
            break;
          case '#d4e6dd': // Light Blue
            updatedState.backgroundColorSecondary = '#f8fffc';
            updatedState.color = 'black'; // Keep the current text color
            break;
          case '#d0ba95': // Light Yellow
            updatedState.backgroundColorSecondary = '#ffeccc';
            updatedState.color = prevState.color; // Keep the current text color
            break;
          default:
            updatedState.backgroundColorSecondary =
              prevState.backgroundColorSecondary;
            updatedState.color = prevState.color; // Keep the current text color
        }
      } else if (category === 'color') {
        if (value === 'black' && prevState.backgroundColor === '#18181b') {
          updatedState.backgroundColor = '#fff';
        } else if (value === '#fff' && prevState.backgroundColor === '#fff') {
          updatedState.backgroundColor = '#18181b';
        }
      }

      return updatedState;
    });
  };

  const renderTabContent = key => {
    const tabOptions = filterOptions.filter(option => option.tab === key);
    return (
      <ScrollView
        contentContainerStyle={styles.modalContent}
        style={{marginBottom: 200, paddingVertical: 20}}
        showsVerticalScrollIndicator={false}>
        {tabOptions.map(option => {
          if (option.type === 'range') {
            return (
              <View key={option.category} style={styles.filterContainer}>
                <Text style={[styles.filterLabel, {color: filterState.color}]}>
                  {option.category} : {filterState[option.categoryValue]}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={option.minValue}
                  value={filterState[option.categoryValue]}
                  step={1}
                  maximumValue={option.maxValue}
                  minimumTrackTintColor={Colors.secondary}
                  maximumTrackTintColor="#000000"
                  onValueChange={value =>
                    handleChange(option.categoryValue, value)
                  }
                  thumbTintColor="#fff"
                />
              </View>
            );
          } else if (option.type === 'list') {
            return (
              <View key={option.category} style={styles.filterContainer}>
                <Text style={[styles.filterLabel, {color: filterState.color}]}>
                  {option.category}
                </Text>
                <View style={styles.categoryContainer}>
                  {option.options.map((opt, index) => (
                    <TextBadge
                      key={index}
                      style={{backgroundColor: Colors.black}}
                      title={opt.label}
                      onPress={() =>
                        handleChange(option.categoryValue, opt.value)
                      }
                      isActive={filterState[option.categoryValue] === opt.value}
                    />
                  ))}
                </View>
              </View>
            );
          }
          return null;
        })}
      </ScrollView>
    );
  };

  const tabs = [
    {
      key: 'Layout',
      title: 'Layout',
      content: renderTabContent('Layout'),
    },
    {
      key: 'Themes',
      title: 'Themes',
      content: renderTabContent('Themes'),
    },
  ];

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, {transform: [{translateY}]}]}>
          <GradientView style={styles.header} onPress={onClose}>
            <Icons name={'close'} size={20} color={Colors.white} />
          </GradientView>
          <TabSwitcher
            tabs={tabs}
            primary={filterState.backgroundColor}
            tertiary={filterState.backgroundColorSecondary}
            textColor={filterState.color}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    height: '100%',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    // padding: 20,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  filterContainer: {
    width: '100%',
  },
  filterLabel: {
    fontSize: 17,
    fontWeight: '500',
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
  tabContent: {
    padding: 10,
  },
});

export default FilterBottomDrawer;
