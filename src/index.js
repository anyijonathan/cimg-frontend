import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css'
/* import 'flowbite'; */
import App from './App';
import { SidebarProvider } from './context/SidebarContext'
import ThemedSuspense from './components/ThemedSuspense'
import { Windmill } from '@windmill/react-ui'
import myTheme from './myTheme'
import "react-datepicker/dist/react-datepicker.css";
import { persistor, store } from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react';


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
     <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill usePreferences theme={myTheme}>
        
        <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        </PersistGate>
        <App />
      
        </Provider>
      </Windmill>
    </Suspense>
  </SidebarProvider>
);
