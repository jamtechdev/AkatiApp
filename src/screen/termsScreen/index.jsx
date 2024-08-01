import React, {useEffect, useState} from 'react';
import {
  CustomHeader,
  CustomText,
  HeadingText,
  RowContainer,
} from '../../components';
import {commonServices} from '../../_services/common.service';
import {ScrollView} from 'react-native';
import {useLoader} from '../../_customHook';

function TermsScreen() {
  const [showLoader, hideLoader, LoaderComponent] = useLoader();
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
        <CustomText style={{padding: 5}}>{terms?.content}</CustomText>
        {LoaderComponent}
      </ScrollView>
    </RowContainer>
  );
}

export default TermsScreen;
