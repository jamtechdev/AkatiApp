import React, {useEffect, useState} from 'react';
import {CustomText, HeadingText, RowContainer} from '../../components';
import {ScrollView} from 'react-native';
import {commonServices} from '../../_services/common.service';
import { useAppContext } from '../../_customContext/AppProvider';

function PrivacyScreen() {
  const { showToast, showLoader, hideLoader } = useAppContext();
  const [policy, setPolicy] = useState({});

  useEffect(() => {
    showLoader();
    commonServices
      .getPrivacyPolicy()
      .then(res => {
        setPolicy(res.data.result);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => hideLoader());
  }, []);
  return (
    <RowContainer>
      <HeadingText>Privacy & Policy</HeadingText>
      <ScrollView>
        <CustomText style={{padding: 5}}>{policy?.content}</CustomText>
      </ScrollView>
    </RowContainer>
  );
}

export default PrivacyScreen;
