import React, {useEffect, useState} from 'react';
import {Colors} from '../../_utils/GlobalStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import {commonServices} from '../../_services/common.service';
import {useAppContext} from '../../_customContext/AppProvider';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {CustomText, HeadingText, RowContainer} from '../../components';

export default function NotificationScreen() {
  const {showLoader, hideLoader} = useAppContext();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    showLoader();
    commonServices
      .getNotifications()
      .then(res => {
        setNotifications(res.data.list);
      })
      .catch(err => console.log(err))
      .finally(() => hideLoader());
  }, []);

  return (
    <RowContainer>
      <HeadingText>Notificatons</HeadingText>
      <ScrollView style={{marginVertical: 15}}>
        {notifications &&
          notifications.map((item, index) => {
            return (
              <View style={styles.listView} key={index}>
                <CustomText style={{fontSize: 18}}>
                  {item.description}
                </CustomText>
                <Text style={{color: Colors.darkGray}}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            );
          })}

        {notifications?.length == 0 && (
          <View
            style={{
              gap: 5,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              paddingVertical: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              backgroundColor: Colors.tertiary,
            }}>
            <Icon name={'notifications-off-outline'} size={18} />
            <CustomText>No Notifications</CustomText>
          </View>
        )}
      </ScrollView>
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  listView: {
    padding: 10,
    marginVertical: 5,
    borderLeft: 1,
    borderLeftColor: Colors.secondary,
    borderLeftWidth: 2,
    backgroundColor: Colors.tertiary,
    borderRadius: 10,
  },
});
