import React, {useEffect, useState} from 'react';
import {CustomText, HeadingText, RowContainer} from '../../components';
import {ScrollView} from 'react-native';
import {commonServices} from '../../_services/common.service';
import {useAppContext} from '../../_customContext/AppProvider';
import {Colors} from '../../_utils/GlobalStyle';

function PrivacyScreen() {
  const {showLoader, hideLoader} = useAppContext();
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
        <CustomText style={{paddingVertical: 20, color: Colors.gray}}>
          {policy?.content}
        </CustomText>
      </ScrollView>
    </RowContainer>
  );
}

export default PrivacyScreen;
