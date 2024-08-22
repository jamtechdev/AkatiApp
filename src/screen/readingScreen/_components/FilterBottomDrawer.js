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
import {useTranslation} from 'react-i18next';

const {height: screenHeight} = Dimensions.get('window');

const FilterBottomDrawer = ({
  visible,
  onClose,
  title,
  setFilterState,
  filterState,
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const {t} = useTranslation();
  const filterOptions = [
    {
      category: t('screens.reading.fontSize'),
      type: 'range',
      categoryValue: 'fontSize',
      currentValue: 18,
      minValue: 10,
      maxValue: 40,
      tab: 'Layout',
    },
    {
      category: t('screens.reading.textAlignment'),
      categoryValue: 'textAlign',
      type: 'list',
      currentValue: 'left',
      options: [
        {value: 'left', label: t('screens.reading.left')},
        {value: 'right', label: t('screens.reading.right')},
        {value: 'center', label: t('screens.reading.center')},
        {value: 'justify', label: t('screens.reading.justify')},
      ],
      tab: 'Layout',
    },
    {
      category: t('screens.reading.textWeight'),
      categoryValue: 'fontWeight',
      type: 'list',
      currentValue: 'normal',
      options: [
        {value: 'normal', label: t('screens.reading.normal')},
        {value: '500', label: t('screens.reading.500')},
        {value: '600', label: t('screens.reading.600')},
        {value: 'bold', label: t('screens.reading.700')},
      ],
      tab: 'Layout',
    },
    {
      category: t('screens.reading.lineHeight'),
      categoryValue: 'lineHeight',
      type: 'list',
      currentValue: 40,
      options: [
        // {value: 20, label: '20'},
        {value: 30, label: t('screens.reading.30')},
        {value: 40, label: t('screens.reading.40')},
        {value: 50, label: t('screens.reading.50')},
      ],
      tab: 'Layout',
    },
    {
      category: t('screens.reading.fontStyle'),
      categoryValue: 'fontFamily',
      type: 'list',
      currentValue: 'default',
      options: [
        // {value: 'baskerville', label: t('screens.reading.Verdana')},
        {value: 'Helvetica', label: t('screens.reading.Helvetica')},
        {value: 'Verdana', label: t('screens.reading.Verdana')},
      ],
      tab: 'Themes',
    },
    {
      category: t('screens.reading.fontColor'),
      categoryValue: 'color',
      type: 'list',
      currentValue: 'white',
      options: [
        {value: '#fff', label: t('screens.reading.white')},
        {value: 'black', label: t('screens.reading.black')},
        {value: '#ff0000', label: t('screens.reading.red')},
        {value: 'blue', label: t('screens.reading.blue')},
        {value: '#e4a101', label: t('screens.reading.yellow')},
      ],
      tab: 'Themes',
    },
    {
      category: t('screens.reading.backgroundColor'),
      categoryValue: 'backgroundColor',
      type: 'list',
      currentValue: '#18181b',
      options: [
        {value: '#18181b', label: t('screens.reading.black')},
        {value: '#fff', label: t('screens.reading.white')},
        {value: 'gray', label: t('screens.reading.gray')},
        {value: '#d4e6dd', label: t('screens.reading.lightBlue')},
        {value: '#d0ba95', label: t('screens.reading.lightYellow')},
      ],
      tab: 'Themes',
    },
  ];
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
          updatedState.backgroundColorSecondary = '#efefef';
        } else if (value === '#fff' && prevState.backgroundColor === '#fff') {
          updatedState.backgroundColor = '#18181b';
          updatedState.backgroundColorSecondary = '#242424';
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
      title: t('screens.reading.layout'),
      content: renderTabContent('Layout'),
    },
    {
      key: 'Themes',
      title: t('screens.reading.theme'),
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
