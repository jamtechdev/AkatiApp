// BottomModal.js
import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../../_utils/GlobalStyle';
import {HeadingText} from '../../../components';

const {height: screenHeight} = Dimensions.get('window');

const BottomDrawer = ({
  visible,
  onClose,
  data,
  currentChapter,
  onPress,
  title,
}) => {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? screenHeight * 0.3 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none" // Disable the default animation
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, {transform: [{translateY}]}]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <HeadingText>{title}</HeadingText>
            <Icons
              name={'close'}
              size={20}
              color={Colors.white}
              onPress={onClose}
            />
          </View>
          <View style={styles.modalContent}>
            <ScrollView
              style={{width: '100%'}}
              showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {data && data.length > 0 ? (
                  data.map((chapter, index) => (
                    <Pressable
                      style={[
                        {
                          padding: 15,
                          borderWidth: 1,
                          borderColor: Colors.primary,
                          borderRadius: 5,
                          marginBottom: 10,
                          backgroundColor: Colors.primary,
                        },
                        index == currentChapter && {
                          backgroundColor: Colors.secondary,
                        },
                      ]}
                      key={index}
                      onPress={() => onPress(index)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: Colors.white,
                            fontWeight: 600,
                            marginBottom: 5,
                          }}>
                          Chapter {index + 1}
                        </Text>
                        {chapter.unlock != 1 && (
                          <Icons
                            name={'lock'}
                            size={15}
                            color={Colors.secondary}
                          />
                        )}
                      </View>
                      <Text style={styles.chapterText}>
                        {chapter.chapter_details.title}
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <Text style={styles.description}>No chapters available.</Text>
                )}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    // flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modal: {
    height: '100%',
    backgroundColor: Colors.tertiary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    padding: 20,
  },
  modalContent: {
    // justifyContent: 'center',
    paddingTop: 15,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    fontSize: 18,
    color: 'blue',
  },
  chapterText: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
  tabContent: {
    padding: 10,
    width: '100%',
  },
});

export default BottomDrawer;
