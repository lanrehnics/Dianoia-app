import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {NotificationProvider} from "../providers/notification/notification";
import {AppStorageProvider} from "../providers/app-storage/app-storage";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component?: any, pageFile?: string, pageCode?: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private localNotifications: NotificationProvider, private appStorage: AppStorageProvider) {
    this.initializeApp(platform, statusBar);
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Αρχική', component: "HomePage"},
      { title: 'Ας μάθουμε τα βασικά', component: "BasicInfoPage"},
      { title: 'Τι να προσέξουμε', component: "InfoListPage", pageCode: "page_tips_list", pageFile: "pages/tips_list.json" },
      { title: 'Ασκήσεις - Δραστηριότητες', component: "ActivityCategoriesPage"},
      { title: 'Ιστορικό', component: "StatisticsPage" },
      { title: 'Ρυθμίσεις ειδοποιήσεων', component: "NotificationsPage" },
      { title: 'Βοήθεια', component: "HelpPage"},
      { title: 'About', component: "AboutPage"}
    ];



  }

  initializeApp(platform, statusBar) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (platform.is('android')) {
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString("#3f51b5");
        statusBar.styleBlackOpaque();
      } else {
        statusBar.overlaysWebView(true);
        statusBar.styleDefault();
      }

      this.localNotifications.listenForNotificationClicks();

      this.appStorage.get('notifications_scheduled').then(data => {
        let notificationsScheduled = JSON.parse(data);
        if(!notificationsScheduled && platform.is('cordova')) {
          console.log("Notifications not scheduled. Scheduling...");
          this.localNotifications.scheduleNextNotification();
        }
      })
    });
  }

  openPage(page) {
    this.nav.push(page.component, {pageData: page});
  }
}
