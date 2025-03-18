import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name) {
  console.log(navigationRef.isReady())
  if (navigationRef.isReady()) {
    navigationRef.navigate(name);
  }
}
