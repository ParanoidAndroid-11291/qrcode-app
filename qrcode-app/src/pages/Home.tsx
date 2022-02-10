import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonItem,
  IonInput,
  IonImg,
  IonButton,
  useIonToast
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { ScreenBrightness } from '@capacitor-community/screen-brightness';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Storage } from '@capacitor/storage';

import './Home.css';

const Home: React.FC = () => {
  const [ input, setInput ] = useState<string>('');
  const [ qrCode, setQrCode ] = useState<string>()
  const [ present, dismiss ] = useIonToast();

  //sets phone brightness to full, sets QR code from local storage.
  useEffect(() => {
    const handleBrightness = async () => await ScreenBrightness.setBrightness({ brightness: 1.0 });
    handleBrightness();

    getQrCode().then( (qrCode) => {
      console.log('useEffect qrCode', qrCode);
      if(qrCode !== null){
        setQrCode(qrCode);
        setInput(qrCode);
      }else {
        setQrCode('A1B2C3D4');
      }
    });
  },[]);

  const storeQrCode = async (qrCode: string) => {
    await Storage.set({
      key: "driver_id",
      value: qrCode
    });
    setQrCode(qrCode);
  };

  const getQrCode = async () => {
    const { value } = await Storage.get({ key: "driver_id" });
    console.log('getQrCode value', value);
    return value;
  }

  console.log('QR code', qrCode);

  const handleGenerate = (qrCode: string) => {
    if (qrCode.length !== 8){
      present({
        message: "Driver ID needs to be 8 characters long",
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
    }else {
      storeQrCode(qrCode);
      present({
        message: "QR Code Generated",
        duration: 2000,
        position: 'top',
        color: "secondary"
      });
    }
  };

  const stopScan = () => {
    console.log('stopScan');
    document.body.style.visibility = "visible";
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };

  const startScan = async () => {
    console.log('startScan');
    document.body.style.visibility = "hidden";
    BarcodeScanner.hideBackground();

    const result = await BarcodeScanner.startScan();
    console.log("~~result",result);
    if (result !== undefined && result.hasContent) {
      console.log('QRcode Scanned',result);
      stopScan();
    }
  };

  const checkPermission = async () => {
    BarcodeScanner.prepare();

    const status = await BarcodeScanner.checkPermission({ force: true });

    if(status.granted) {
      console.log('Permission Granted');
      startScan();
    } else {
      stopScan();
    }
  };

  return (
    <IonPage>
      <IonHeader hidden>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonImg src={`https://barcodeapi.org/api/qr/${qrCode}`} alt=""></IonImg>
        <div className="input-wrapper">
          <IonItem>
            <IonLabel position="floating">Enter Driver ID</IonLabel>
            <IonInput
              autocapitalize="characters"
              clearInput
              value={input}
              onIonChange={(e: any) => setInput(e.detail.value)}
              >
              </IonInput>
          </IonItem>
          <IonButton id="scan-btn" color="secondary" expand="block" onClick={() => checkPermission()}>Scan</IonButton>
          <IonButton id="generate-btn" expand="block" onClick={() => handleGenerate(input)}>Generate</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
