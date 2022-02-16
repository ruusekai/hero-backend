import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageWebTestDto } from './dto/create-message-web-test.dto';
import { UpdateMessageWebTestDto } from './dto/update-message-web-test.dto';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase, ref, child, get } from 'firebase/database';

@Injectable()
export class MessageWebTestService {
  private readonly logger = new Logger(MessageWebTestService.name);

  private readonly firebase;

  constructor() {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: 'AIzaSyCRVWBAYTTYALwEbygZqN7Bt5teNh8DXXY',
      authDomain: 'hero-chatroom-local.firebaseapp.com',
      databaseURL:
        'https://hero-chatroom-local-default-rtdb.asia-southeast1.firebasedatabase.app',
      projectId: 'hero-chatroom-local',
      storageBucket: 'hero-chatroom-local.appspot.com',
      messagingSenderId: '812650862977',
      appId: '1:812650862977:web:ff52a553826c0e06d13080',
      measurementId: 'G-TCEM610F1E',
    };

    // Initialize Firebase
    this.firebase = initializeApp(firebaseConfig);
  }

  async clientSignInWithCustomToken(token: string, messageGroupId: string) {
    try {
      const auth = getAuth(this.firebase);
      const dbRef = ref(getDatabase(this.firebase));
      this.logger.log(token);
      const userCredential = await signInWithCustomToken(auth, token);
      const user = userCredential.user;

      return get(child(dbRef, `/messages/-Mw01pLN9mmupUt0O6uR`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            return snapshot.val();
          } else {
            console.log('No data available');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      this.logger.error(JSON.stringify(e.stack));
    }
  }

  create(createMessageWebTestDto: CreateMessageWebTestDto) {
    return 'This action adds a new messageWebTest';
  }

  findAll() {
    return `This action returns all messageWebTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageWebTest`;
  }

  update(id: number, updateMessageWebTestDto: UpdateMessageWebTestDto) {
    return `This action updates a #${id} messageWebTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageWebTest`;
  }
}
