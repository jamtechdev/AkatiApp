import React, {useEffect, useState} from 'react';
import {
  CustomHeader,
  CustomText,
  HeadingText,
  RowContainer,
} from '../../components';
import {commonServices} from '../../_services/common.service';
import {ScrollView} from 'react-native';
import {useAppContext} from '../../_customContext/AppProvider';
import {Colors} from '../../_utils/GlobalStyle';

function TermsScreen() {
  const {showToast, showLoader, hideLoader} = useAppContext();
  const [terms, setTerms] = useState({});

  useEffect(() => {
    showLoader();
    commonServices
      .getTermsConditions()
      .then(res => {
        setTerms(res.data.result);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => hideLoader());
  }, []);

  return (
    <RowContainer>
      <HeadingText>Terms & Conditions</HeadingText>
      <ScrollView>
        <CustomText style={{paddingVertical: 20, color: Colors.gray}}>
          {terms?.content}
        </CustomText>
      </ScrollView>
    </RowContainer>
  );
}

export default TermsScreen;
