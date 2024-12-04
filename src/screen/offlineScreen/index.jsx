import React, { useEffect } from 'react'
import { RowContainer } from '../../components'
import { Text } from 'react-native'
import { useNetInfo } from "@react-native-community/netinfo";


function OffllineScreen({navigation}) {
  const { type, isConnected } = useNetInfo();
  useEffect(()=>{isConnected && navigation.navigate("Discover")},[isConnected])

  return (
    <RowContainer>
        <Text>Offline Screen</Text>
    </RowContainer>
  )
}

export default OffllineScreen
