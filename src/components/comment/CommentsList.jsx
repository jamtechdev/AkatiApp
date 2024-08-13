import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmojiPicker from 'rn-emoji-keyboard';
import Comment from './Comment';
import {commonServices} from '../../_services/common.service';
import {useAppContext} from '../../_customContext/AppProvider';
import {Colors} from '../../_utils/GlobalStyle';
import NoDataFound from '../NoDataFound';

const defaultEmojis = ['😀', '😂', '😍', '👍', '😎', '🥳', '🙌', '🔥'];

const getRandomEmojis = num => {
  const shuffled = defaultEmojis.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const CommentsList = ({token, chapterDetails, textSettings}) => {
  const {showToast} = useAppContext();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState(getRandomEmojis(4));
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    fetchComments();
    setSelectedEmojis(getRandomEmojis(4));
  }, [chapterDetails]);

  const fetchComments = () => {
    const bookId = chapterDetails?.book_id;
    const chapterId = chapterDetails?.chapter_details?.chapter_id;
    commonServices
      .getComments(bookId, chapterId)
      .then(data => {
        setComments(data.data.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      })
      .finally(() => {
        setLoadingComments(false);
      });
  };

  const addComment = () => {
    if (newComment.trim()) {
      const bookId = chapterDetails?.book_id;
      const chapterId = chapterDetails?.chapter_details?.chapter_id;
      const formData = {
        text: newComment,
        book_id: bookId,
        chapter_id: chapterId,
        paragraph_number: 1,
      };
      commonServices
        .addComments(formData)
        .then(res => {
          fetchComments();
          setNewComment('');
          showToast('comment add successfully');
        })
        .catch(error => {
          console.error('Error adding comment:', error);
          showToast(error, 'error');
        });
    } else {
      showToast('Please fill the comment first', 'info');
    }
  };

  const addReply = (commentId, replyText) => {
    if (replyText.trim()) {
      const formData = {
        text: replyText,
        comment_id: commentId,
      };
      commonServices
        .replayComments(formData)
        .then(res => {
          fetchComments();
        })
        .catch(error => {
          console.error('Error replying to comment:', error);
        });
    }
  };

  const likeComment = id => {
    commonServices
      .favoriteComments(id)
      .then(res => {
        fetchComments(); // Fetch updated comments list
      })
      .catch(error => {
        console.error('Error replying to comment:', error);
      });

    setComments(
      comments.map(comment => {
        if (comment.id === id) {
          return {...comment, likes: comment.likes + 1};
        }
        return comment;
      }),
    );
  };

  const addEmoji = emoji => {
    setNewComment(newComment + emoji.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: textSettings?.backgroundColor},
      ]}>
      <View style={styles.emojiContainer}>
        <TouchableOpacity onPress={() => setShowEmojiPicker(!showEmojiPicker)}>
          <Icon
            name="add-reaction"
            size={30}
            color="#007AFF"
            style={styles.addEmojiIcon}
          />
        </TouchableOpacity>
        {selectedEmojis.map((emoji, index) => (
          <View key={index} style={styles.emojiBox}>
            <Text style={styles.emoji} onPress={() => addEmoji({emoji})}>
              {emoji}
            </Text>
          </View>
        ))}
      </View>
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelected={addEmoji}
          open={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          placeholderTextColor={textSettings?.color}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={addComment}>
          <Icon
            name="send"
            size={30}
            color={Colors.secondary}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={comments}
        style={{height: '100%'}}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Comment
            comment={item}
            onReply={addReply}
            onLike={likeComment}
            textSettings={textSettings}
          />
        )}
        ListEmptyComponent={
          loadingComments ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{marginVertical: 20}}
            />
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 15, fontWeight: 'bold', marginTop: 50}}>
                {/* No comments available. */}
                <NoDataFound description={'No comments available.'} />
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 0,
  },
  emojiContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 30,
    lineHeight: 41,
  },
  emojiBox: {
    borderColor: Colors.darkGray,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingBottom: 12,
    marginLeft: 10,
    borderRadius: 10,
  },
  addEmojiIcon: {
    marginLeft: 10,
    borderColor: Colors.darkGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.darkGray,
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.darkGray,
    padding: 10,
    borderRadius: 20,
    color: Colors.white,
  },
  sendIcon: {
    marginLeft: 10,
  },
});

export default CommentsList;
