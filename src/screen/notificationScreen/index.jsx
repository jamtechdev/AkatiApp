import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {Colors} from '../../_utils/GlobalStyle';
import {commonServices} from '../../_services/common.service';
import {useAppContext} from '../../_customContext/AppProvider';
import {
  CustomText,
  HeadingText,
  RowContainer,
  Skeleton,
} from '../../components';
import NoDataFound from '../../components/NoDataFound';
import {useTranslation} from 'react-i18next';

export default function NotificationScreen() {
  const {hideLoader} = useAppContext();
  const [notifications, setNotifications] = useState();
  const {t} = useTranslation();

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

  const renderItem = ({item}) => (
    <View style={styles.listView}>
      <CustomText style={{fontSize: 18}}>{item.description}</CustomText>
      <CustomText style={{color: Colors.darkGray}}>
        {new Date(item.created_at).toLocaleString()}
      </CustomText>
    </View>
  );

  return (
    <RowContainer>
      <HeadingText>{t('screens.topBar.notificationTitle')}</HeadingText>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          !notifications ? (
            <Skeleton isLoading={true} isList />
          ) : (
            <NoDataFound description={t('screens.topBar.noNotificationText')} />
          )
        }
        contentContainerStyle={{marginVertical: 15}}
        showsVerticalScrollIndicator={false}
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
