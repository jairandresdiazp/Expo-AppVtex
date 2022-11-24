import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Platform, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import WebView from 'react-native-webview';

export default function App() {
  const Url =
    'https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d63141782.451334655!2d-2.970703!3d15!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1669236929109!5m2!1ses!2sco';
  const [loading, setLoading] = useState(true);
  const hideSpinner = () => {
    setLoading(false);
  };
  const showSpinner = () => {
    setLoading(true);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Spinner
        color="#000"
        visible={loading}
        textContent="Loading..."
        textStyle={styles.spinnerTextStyle}
      />
      {Platform.OS === 'web' ? (
        <iframe
          src={Url}
          height="100%"
          width="100%"
          onLoadStart={() => showSpinner()}
          onLoad={() => hideSpinner()}
          allowFullScreen
          style={styles.iframe}
        />
      ) : (
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
          startInLoadingState={true}
          source={{ html: '<h1>Some Heading</h1>' }}
          style={styles.webView}
        />
      )}
    </View>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
