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

import './Home.css';

const Home: React.FC = () => {
  const [ input, setInput ] = useState<string>('');
  const [ qrCode, setQrCode ] = useState<string>('A1B2C3D4')
  const [ present, dismiss ] = useIonToast();

  useEffect(() => {
    const handleBrightness = async () => {
      const { brightness: currentBrightness } = await ScreenBrightness.getBrightness();
      if ( currentBrightness < 0.6 ) {
        await ScreenBrightness.setBrightness({ brightness: 1.0 });
      }
    }
    handleBrightness();
  }, []);

  console.log('QR code', qrCode);

  const handleGenerate = (qrCode: string) => {
    if (qrCode.length !== 8){
      present({
        message: "Driver ID needs to be 8 characters long",
        duration: 2000,
        color: 'danger'
      });
    }else {
      setQrCode(qrCode);
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
            <IonLabel>Enter Driver ID</IonLabel>
            <IonInput
              autocapitalize="characters"
              clearInput
              value={input}
              onIonChange={(e: any) => setInput(e.detail.value)}
              >
              </IonInput>
          </IonItem>
          <IonButton expand="block" onClick={() => handleGenerate(input)}>Generate</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
