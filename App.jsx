// import { Provider } from "react-redux";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// import { store } from "./src/store/store";
// import AppNavigator from "./src/navigation/AppNavigator";

// const App = () => {
//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <AppNavigator />
//       </SafeAreaProvider>
//     </Provider>
//   );
// };

// export default App;
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;