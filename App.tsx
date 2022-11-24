import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import WebView from 'react-native-webview';

export default function App() {
  const Url = 'http://vtex-store.blacksip.com/';
  const [loading, setLoading] = useState(true);
  const hideSpinner = () => {
    setLoading(false);
  };
  const showSpinner = () => {
    setLoading(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#f41c64" />
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
            <Text style={styles.webViewText}>Render Error: {error}</Text>
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
