import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Button,
  StyleSheet,
} from 'react-native';
import user_icon from '../../images/avtar.png';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../_utils/GlobalStyle';
import moment from 'moment';
// import moment from 'moment';

const Comment = ({comment, onReply, onLike}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false); // Local state for showing replies

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <>
      <View style={styles.commentContainer}>
        {/* <Avatar
          rounded
          source={user_icon}
          size="small"
          containerStyle={styles.avatar}
        /> */}
        <View style={styles.commentContent}>
          <Text style={styles.username}>
            {comment?.user?.first_name} {comment?.user?.last_name}
          </Text>
          <Text style={styles.text}>{comment.text}</Text>
          <Text style={styles.time}>
                      {moment(comment.created_at).fromNow()}
                    </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => setShowReplyInput(!showReplyInput)}>
                <Text style={styles.replyButton}>Reply</Text>
              </TouchableOpacity>
            </View>
            {comment.all_replies && comment.all_replies.length > 0 && (
              <TouchableOpacity onPress={toggleReplies}>
                <Text style={styles.replyListButton}>
                {showReplies ? 'Hide' : 'View'} {comment?.all_replies.length}{' '}
                  {comment?.all_replies.length == 1 ? 'reply' : 'replies'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {showReplyInput && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholderTextColor={Colors.white}
                placeholder="Write a reply..."
                value={replyText}
                onChangeText={setReplyText}
              />
              <TouchableOpacity onPress={handleReply}>
                <Icon
                  name="send"
                  size={30}
                  color={Colors.secondary}
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => onLike(comment.id)}
          style={styles.likeButtonView}>
          {comment.favorites_count == 0 ? (
            <Icon
              name="heart-outline"
              size={22}
              color="#ff0000"
              style={styles.sendIcon}
            />
          ) : (
            <Text style={styles.likeButton}>❤️ {comment.favorites_count}</Text>
          )}
        </TouchableOpacity>
      </View>
      {showReplies && (
        <View style={styles.replyView}>
          {comment.all_replies.map((item, index) => {
            return (
              <View style={styles.replyCommentContainer} key={index}>
                {/* <Avatar
                  rounded
                  source={user_icon}
                  size="small"
                  containerStyle={styles.avatar}
                /> */}
                <View style={styles.commentContent}>
                  <Text style={styles.username}>
                    {comment?.user?.first_name} {comment?.user?.last_name}
                  </Text>
                  <Text style={styles.text}>{item.text}</Text>
                  <View style={styles.footer}>
                    <Text style={styles.time}>
                      {moment(comment.created_at).fromNow()}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => onLike(item.id)}
                  style={styles.likeButtonView}>
                  {item.favorites_count == 0 ? (
                    <Icon
                      name="heart-outline"
                      size={22}
                      color="#ff0000"
                      style={styles.sendIcon}
                    />
                  ) : (
                    <Text style={styles.likeButton}>
                      ❤️ {item.favorites_count}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'start',
    backgroundColor: Colors.tertiary,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.darkGray,
    // marginLeft: 10,
    // marginTop: 5,
    justifyContent: 'center',
  },
  replyCommentContainer: {
    flexDirection: 'row',
    alignItems: 'start',
    backgroundColor: Colors.tertiary,
    // borderBottomWidth: 1,
    paddingVertical: 5,
    paddingLeft: 40,
    // marginLeft:10,
    borderBottomColor: Colors.darkGray,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  replyView: {
    // marginLeft: 5,
    padding: 0,
    // marginTop: 5,
  },
  avatar: {
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: Colors.white
  },
  text: {
    marginVertical: 5,
    fontSize: 12,
    color: Colors.white
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
    alignItems: 'center',
  },
  time: {
    color: '#aaa',
  },
  likeButton: {
    color: '#ff0000',
  },
  likeButtonView: {
    paddingHorizontal: 10,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  replyButton: {
    color: Colors.secondary,
    fontSize: 14,
  },
  replyListButton: {
    color: Colors.secondary,
    fontSize: 14,
    // marginTop: 5,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#ddd',
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomWidth: 1,
    borderColor: Colors.darkGray,
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.darkGray,
    padding: 10,
    borderRadius: 20,
    color: Colors.white
    // marginRight: 10,
  },
  sendIcon: {
    marginLeft: 10,
  },
  repliesList: {
    marginLeft: 10,
  },
});

export default Comment;
