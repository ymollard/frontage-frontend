import { FlagsJoytickPage } from './../pages/flags-joytick/flags-joytick';
import { SettingsPage } from './../pages/settings/settings';
import { HttpInterceptorProvider } from './../providers/http-interceptor/http-interceptor';
import { WaitingPage } from './../pages/waiting/waiting';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FAppListPage } from '../pages/f-app-list/f-app-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataFAppsProvider } from '../providers/data-f-apps/data-f-apps';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { TimeProvider } from '../providers/time/time';
import { WebSocketProvider } from '../providers/web-socket/web-socket';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { NicknameGeneratorProvider } from '../providers/nickname-generator/nickname-generator';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http, HttpModule } from '@angular/http';
import { TranslateLanguageProvider } from '../providers/translate-language/translate-language';
import { LanguageComponent } from '../components/language/language';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

let components:any[] = [
    MyApp,
    HomePage,
    FAppListPage,
    WaitingPage,
    SettingsPage,
    FlagsJoytickPage,
    LanguageComponent
];

@NgModule({
  declarations: components,
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: components,
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorProvider, multi: true},
    DataFAppsProvider,
    AuthenticationProvider,
    TimeProvider,
    WebSocketProvider,
    HttpInterceptorProvider,
    LocalStorageProvider,
    NicknameGeneratorProvider,
    TranslateLanguageProvider
  ]
})
export class AppModule {}
