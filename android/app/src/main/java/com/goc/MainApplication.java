package com.goc;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.guichaguri.trackplayer.TrackPlayer;
import com.microsoft.codepush.react.CodePush;
import com.BV.LinearGradient.LinearGradientPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new CodePush(getResources().getString(R.string.CodePushDeploymentKey), getApplicationContext(), BuildConfig.DEBUG));
          packages.add(new RNFirebasePackage());
          packages.add(new RNFirebaseFirestorePackage());
          packages.add(new RNFirebaseAnalyticsPackage());
          packages.add(new RNFirebaseAuthPackage());
          packages.add(new RNFirebaseMessagingPackage());
          packages.add(new RNFirebaseFunctionsPackage());
          packages.add(new RNFirebaseNotificationsPackage());
          packages.add(new TrackPlayer());
          packages.add(new SplashScreenReactPackage());
          packages.add(new LinearGradientPackage());
          packages.add(new RNCViewPagerPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  // /**
  //  * Loads Flipper in React Native templates. Call this in the onCreate method with something like
  //  * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  //  *
  //  * @param context
  //  * @param reactInstanceManager
  //  */
  // private static void initializeFlipper(
  //     Context context, ReactInstanceManager reactInstanceManager) {
  //   if (BuildConfig.DEBUG) {
  //     try {
  //       /*
  //        We use reflection here to pick up the class that initializes Flipper,
  //       since Flipper library is not available in release mode
  //       */
  //       Class<?> aClass = Class.forName("com.goc.ReactNativeFlipper");
  //       aClass
  //           .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
  //           .invoke(null, context, reactInstanceManager);
  //     } catch (ClassNotFoundException e) {
  //       e.printStackTrace();
  //     } catch (NoSuchMethodException e) {
  //       e.printStackTrace();
  //     } catch (IllegalAccessException e) {
  //       e.printStackTrace();
  //     } catch (InvocationTargetException e) {
  //       e.printStackTrace();
  //     }
  //   }
  // }
}
