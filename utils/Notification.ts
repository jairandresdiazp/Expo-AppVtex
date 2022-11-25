import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import {
  X_VTEX_AccountName,
  X_VTEX_API_AppKey,
  X_VTEX_API_AppToken,
  X_VTEX_DataEntityName,
  X_VTEX_Schema,
} from '../Const';

export const getPushToken = async () => {
  let token = null;
  if (Device.isDevice) {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;
    if (status !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
};

export const retrieveWeatherSubscription = async (token: string, email: string) => {
  var headers = {
    'X-VTEX-API-AppKey': X_VTEX_API_AppKey,
    'X-VTEX-API-AppToken': X_VTEX_API_AppToken,
    'Content-Type': 'application/json',
  };

  var bodySchema = {
    properties: {
      token: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
    },
    'v-default-fields': ['token'],
    required: ['token'],
    'v-indexed': ['token'],
    'v-security': {
      allowGetAll: true,
      publicRead: ['token', 'email', 'id'],
      publicWrite: ['token', 'email'],
      publicFilter: ['token', 'email', 'id'],
    },
  };

  var requestOptionsSchema = {
    method: 'PUT',
    headers,
    body: JSON.stringify(bodySchema),
  };

  const BaseUrl = `https://${X_VTEX_AccountName}.vtexcommercestable.com.br/api/dataentities/${X_VTEX_DataEntityName}`;

  await fetch(`${BaseUrl}/schemas/${X_VTEX_Schema}`, requestOptionsSchema);

  var requestOptionsGetDocument = {
    method: 'GET',
    headers,
  };

  const responseExistToken = await fetch(
    `${BaseUrl}/search?_schema=${X_VTEX_Schema}&_fields=token,id&token=${token}`,
    requestOptionsGetDocument
  );
  const existToken: any = await responseExistToken.json();

  if (existToken?.length == 0) {
    var bodyDocument = {
      token,
      email
    };

    var requestOptionsDocument = {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyDocument),
    };

    await fetch(
      `${BaseUrl}/documents?_schema=${X_VTEX_Schema}`,
      requestOptionsDocument
    );
  }

  if (existToken?.length > 0) {
    var bodyDocument = {
      token,
      email
    };

    var requestOptionsDocument = {
      method: 'PUT',
      headers,
      body: JSON.stringify(bodyDocument),
    };

    await fetch(`${BaseUrl}/documents/${existToken[0]?.id}`, requestOptionsDocument);
  }
};
