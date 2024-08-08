import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../../_utils/GlobalStyle';
import {HeadingText} from '../../../components';

const {height: screenHeight} = Dimensions.get('window');

const ChapterBottomDrawer = ({
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
      toValue: visible ? 0 : screenHeight,
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
            showsVerticalScrollIndicator={false}>
            <View style={styles.tabContent}>
              {data && data.length > 0 ? (
                data.map((chapter, index) => (
                  <Pressable
                    style={[
                      styles.chapterContainer,
                      index === currentChapter && styles.currentChapter,
                    ]}
                    key={index}
                    onPress={() => onPress(index)}>
                    <View style={styles.chapterHeader}>
                      <Text style={styles.chapterTitle}>
                        Chapter {index + 1}
                      </Text>
                      {chapter.unlock !== 1 && (
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
    height: '60%',
    backgroundColor: Colors.tertiary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  tabContent: {
    width: '100%',
  },
  chapterContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.primary,
  },
  currentChapter: {
    backgroundColor: Colors.secondary,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterTitle: {
    color: Colors.white,
    fontWeight: '600',
    marginBottom: 5,
  },
  chapterText: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
  },
  description: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChapterBottomDrawer;
