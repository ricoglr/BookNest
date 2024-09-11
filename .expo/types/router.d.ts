/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/BookContext` | `/SummaryScreen` | `/Tabs/HomeScreen` | `/Tabs/ProfileScreen` | `/Tabs/StackTab` | `/Tabs/ToReadScreen` | `/_sitemap` | `/kitapSlice` | `/kitapTypes` | `/store`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
