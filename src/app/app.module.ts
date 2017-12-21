import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Keyboard } from "@ionic-native/keyboard";
import { IonicStorageModule } from '@ionic/storage';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from "@ionic-native/file-transfer";
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { MediaCapture } from '@ionic-native/media-capture';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SignaturePage } from '../pages/signature/signature';
import { CapturePicturePage } from '../pages/capture-picture/capture-picture'
import { BarcodeScanner } from '@ionic-native/barcode-scanner'



import { DatabaseService, Localstorage, UtilService, StartService, ToastService, ValidationService } from "../providers";
import { Mji247App } from "./app.component";
import { HomePage } from "../pages/home/home";
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPage } from '../pages/forgot/forgot';
import { ProfilePage } from '../pages/profile/profile';
import { ServiceDescription } from '../pages/service-description/service-description';
import { FullscreenImage } from "../pages/fullscreen-image/fullscreen-image";
import { PaymentPage } from "../pages/payment/payment";
import { PayNowPage } from "../pages/paynow/paynow";
import { TermsAndConditions } from "../pages/termsandconditions/termsandconditions";
import { TrackServicePage } from "../pages/track-service/track-service";
import { CaptureSubServicePicturePage} from "../pages/capture-sub-service-picture/capture-sub-service-picture";
import { ChangePasswordPage } from "../pages/change-password/change-password";
import { ChangeAddressPage } from "../pages/change-address/change-address";
import { ChangeNamePhonePage } from "../pages/change-name-phone/change-name-phone";
import { ProfileModelPage } from "../pages/profile-modal/profile-modal";
import { AboutUsPage } from "../pages/about-us/about-us";
import { ContactUsPage } from "../pages/contact-us/contact-us";
import { DisplayBarCodePage } from "../pages/bar-code/bar-code";
import { CreateNotePage } from "../pages/note-modal/note-modal";
import { ControlMessages } from "../components/control-messages";
import { ElasticTextarea } from "../components/elasticTextarea";
import { PopoverContentPage } from "../components/popover";
import { PopoverProfilePage } from "../components/profile-page-popover/profile-popover";
import { ChatBubble } from "../components/chatBubble";
import { ChatBubbleMsg } from "../components/chatBubbleMsg";
import { CardDesign } from "../components/cardDesign";
import { CardDesignTrack } from "../components/cardDesign-track/cardDesign-track";
import { CardTile } from "../components/cardTile";
import { Timeline } from "../components/timeline";
import { KeyboardAttachDirective } from "../directives";
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicImageLoader } from 'ionic-image-loader';
import { VideoCapturePlus,VideoCapturePlusOptions} from '@ionic-native/video-capture-plus'
import { Transfer } from '@ionic-native/transfer';


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '1748b2a4',
  },
  'push': {
    'sender_id': '218459793279',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    Mji247App,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    ProfilePage,
    TrackServicePage,
    CaptureSubServicePicturePage,
    ChangePasswordPage,
    PaymentPage,
    PayNowPage,
    TermsAndConditions,
    ChangeAddressPage,
    ProfileModelPage,
    AboutUsPage,
    ContactUsPage,
    DisplayBarCodePage,
    CreateNotePage,
    PopoverContentPage,
    PopoverProfilePage,
    ChangeNamePhonePage,
    ServiceDescription,
    FullscreenImage,
    ElasticTextarea,
    ChatBubble,
    ChatBubbleMsg,
    CardDesign,
    CardDesignTrack,
    CardTile,
    Timeline,
    ControlMessages,
    KeyboardAttachDirective,
    SignaturePage,
    CapturePicturePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicImageViewerModule,
    IonicImageLoader.forRoot(),
    IonicModule.forRoot(Mji247App),
    SignaturePadModule,
    IonicStorageModule.forRoot({
      name: '__mji247',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Mji247App,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPage,
    ProfilePage,
    TrackServicePage,
    ProfileModelPage,
    ServiceDescription,
    FullscreenImage,
    AboutUsPage,
    ContactUsPage,
    ChangePasswordPage,
    DisplayBarCodePage,
    CreateNotePage,
    ChangeAddressPage,
    ChangeNamePhonePage,
    PaymentPage,
    PayNowPage,
    TermsAndConditions,
    PopoverContentPage,
    PopoverProfilePage,
    ControlMessages,
    SignaturePage,
    CaptureSubServicePicturePage,
    CapturePicturePage
  ],
  providers: [
    Localstorage,
    DatabaseService,
    UtilService,
    ToastService,
    ValidationService,
    StartService,
    StatusBar,
    SplashScreen,
    Keyboard,
    IonicStorageModule,
    File,
    Camera,
    FilePath,
    FileTransfer,
    Geolocation,
    Network,
    MediaCapture,
    VideoCapturePlus,
    Transfer,
 	BarcodeScanner,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
}
