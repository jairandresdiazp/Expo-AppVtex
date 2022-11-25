import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import WebView from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { getPushToken, retrieveWeatherSubscription } from './utils/Notification';
import { BaseColor, Url, X_VTEX_API_AppKey, X_VTEX_API_AppToken } from './Const';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [_notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  
  useEffect(() => {
    getPushToken().then((pushToken) => {
      if (pushToken) {
        retrieveWeatherSubscription(pushToken,email);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [email]);

  useEffect(()=>{
    var headers = {
      'X-VTEX-API-AppKey': X_VTEX_API_AppKey,
      'X-VTEX-API-AppToken': X_VTEX_API_AppToken,
      'Content-Type': 'application/json',
    };

    var requestOptionsSession = {
      method: 'GET',
      headers,
    };

    fetch(
      `${Url}/api/sessions?items=*`,
      requestOptionsSession
    )
      .then((response) => response.json())
      .then((session) => setEmail(session?.namespaces?.profile?.email?.value));
  },[]);


  const hideSpinner = () => {
    setLoading(false);
  };
  const showSpinner = () => {
    setLoading(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={BaseColor} />
      <Spinner
        color="#000"
        visible={loading}
        textContent="Loading..."
        textStyle={styles.spinnerTextStyle}
      />
      <WebView
        originWhitelist={['*']}
        onLoadStart={() => showSpinner()}
        onLoad={() => hideSpinner()}
        bounces={false}
        dataDetectorTypes="link"
        scalesPageToFit={true}
        scrollEnabled={false}
        automaticallyAdjustContentInsets={false}
        mediaPlaybackRequiresUserAction={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: Url }}
        style={styles.webView}
        containerStyle={styles.webView}
        renderError={(error) => (
          <View style={styles.container}>
            <Text style={styles.webViewText}>{error}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: '#000',
  },
  iframe: {
    overflow: 'hidden',
    border: 'none',
  },
  webView: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  webViewText: {
    color: '#000',
  },
});
