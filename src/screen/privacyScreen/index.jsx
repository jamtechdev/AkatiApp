import React, {useEffect, useState} from 'react';
import {CustomText, HeadingText, RowContainer} from '../../components';
import {ScrollView} from 'react-native';
import {commonServices} from '../../_services/common.service';
import {useLoader} from '../../_customHook';

function PrivacyScreen() {
  const [showLoader, hideLoader, LoaderComponent] = useLoader();
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
        {LoaderComponent}
      </ScrollView>
    </RowContainer>
  );
}

export default PrivacyScreen;
