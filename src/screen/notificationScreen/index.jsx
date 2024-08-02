import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Colors } from '../../_utils/GlobalStyle';
import { commonServices } from '../../_services/common.service';
import { useAppContext } from '../../_customContext/AppProvider';
import { CustomText, HeadingText, RowContainer, Skeleton } from '../../components';

export default function NotificationScreen() {
  const { hideLoader } = useAppContext();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    // showLoader();
    commonServices
      .getNotifications()
      .then(res => {
        setNotifications(res.data.list);
      })
      .catch(err => console.log(err))
      .finally(() => hideLoader());
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.listView}>
      <CustomText style={{ fontSize: 18 }}>
        {item.description}
      </CustomText>
      <CustomText style={{ color: Colors.darkGray }}>
        {new Date(item.created_at).toLocaleString()}
      </CustomText>
    </View>
  );

  return (
    <RowContainer>
      <HeadingText>Notifications</HeadingText>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          !notifications ? <Skeleton isLoading={true} isList /> : <CustomText>No Notifications found</CustomText>
        }
        contentContainerStyle={{ marginVertical: 15 }}
      />
    </RowContainer>
  );
}

const styles = StyleSheet.create({
  listView: {
    padding: 10,
    marginVertical: 5,
    borderLeftColor: Colors.secondary,
    borderLeftWidth: 2,
    backgroundColor: Colors.tertiary,
    borderRadius: 10,
  },
});
