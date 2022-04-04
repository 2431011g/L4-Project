import React from 'react';
import {StatusBar} from 'react-native';
import WebView from 'react-native-webview'

const INJECTEDJAVASCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('content', 'initial-scale=0.95, maximum-scale=0.95, user-scalable=0');
  meta.setAttribute('name', 'viewport');
  document.getElementsByTagName('head')[0].appendChild(meta);`

class Web extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <WebView source={{ uri: "https://forms.gle/KCWPPzvV9mpycQGJ7" }} />
      </>
    )
  }
}

module.exports = Web;
