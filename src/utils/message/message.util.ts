import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { MessageType } from '../../modules/message/enum/message-type';
import { MessageUserRoleType } from '../../modules/message/enum/message-user-role-type';
import * as moment from 'moment';
import { ApiException } from '../../common/exception/api.exception';
import { ResponseCode } from '../../common/response/response.code';
import { FirebaseGroupDto } from '../../modules/message/dto/entity/firebase-group-dto';

@Injectable()
export class MessageUtil {
  private readonly logger = new Logger(MessageUtil.name);

  private readonly app;
  private readonly auth;
  private readonly db;

  constructor(private readonly configService: ConfigService) {
    //firebase admin sdk initialization
    //https://firebase.google.com/docs/admin/setup
    const firebaseConfig = {
      credential: admin.credential.cert(
        './src/config/service-account-file.json',
      ),
      databaseURL: this.configService.get<string>(
        'message.FIREBASE_DATABASE_URL',
      ),
    };

    // Initialize Firebase
    this.app = admin.initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    //custom auth
    //https://firebase.google.com/docs/auth/web/custom-auth?authuser=0

    // As an admin, the app has access to read and write all data, regardless of Security Rules
    this.db = admin.database();
  }

  async createCustomToken(userUuid: string) {
    try {
      const customToken = await this.auth.createCustomToken(userUuid);
      return customToken;
    } catch (e) {
      this.logger.error('Error creating custom token:', e);
      throw new ApiException(ResponseCode.STATUS_8000_FIREBASE_ERROR);
    }
  }

  async createMessage(
    messageGroupId: string,
    userUuid: string,
    messageType: MessageType,
    content: string,
    userRole: MessageUserRoleType,
    userName: string,
  ) {
    try {
      const timeStamp = moment().valueOf();

      const messageData: any = {
        user: userUuid,
        type: messageType,
        content: content,
        role: userRole,
        name: userName,
        timestamp: timeStamp,
      };

      // Get a key for a new Post.
      const newMessageKey = this.db.ref().child('messages').push().key;

      // Write the new post's data simultaneously in the posts list and the user's post list.
      const updates = {};
      updates[`/messages/${messageGroupId}/${newMessageKey}`] = messageData;
      updates[`/groups/${messageGroupId}/lastMessage`] = messageData;

      await this.db.ref().update(updates);
      messageData.id = newMessageKey;
      return messageData;
    } catch (e) {
      this.logger.error('Error creating message:', e);
      throw new ApiException(ResponseCode.STATUS_8000_FIREBASE_ERROR);
    }
  }

  async getRandomNumberWithFourDigits(): Promise<string> {
    //get random number from 0 - 9999
    const randomNumber: number = Math.floor(Math.random() * 10000);
    //add padding zeros
    const orderSuffix: string = randomNumber.toString().padStart(4, '0');
    return orderSuffix;
  }

  async findMessageGroupIdByTaskUuidAndHeroUuid(
    taskUuid: string,
    heroUuid: string,
  ): Promise<string> {
    const messageGroupId = await this.db
      .ref(`/tasks/${taskUuid}/heros/${heroUuid}/group`)
      .once('value');
    this.logger.log('messageGroupId: ' + messageGroupId.val());
    return messageGroupId.val();
  }

  async findMessageGroupById(
    messageGroupId: string,
  ): Promise<FirebaseGroupDto> {
    const groupObject = await this.db
      .ref(`/groups/${messageGroupId}`)
      .once('value');
    this.logger.log('groupObject: ' + groupObject.val());
    return groupObject.val();
  }

  async createMessageGroup(
    taskUuid: string,
    bossUuid: string,
    heroUuid: string,
  ): Promise<string> {
    try {
      const existingGroupId: string =
        await this.findMessageGroupIdByTaskUuidAndHeroUuid(taskUuid, heroUuid);
      if (existingGroupId != null && existingGroupId !== 'null') {
        return existingGroupId;
      }
      const randomBossName: string =
        'boss-' + (await this.getRandomNumberWithFourDigits());
      const randomHeroName: string =
        'hero-' + (await this.getRandomNumberWithFourDigits());

      const groupData = {
        //taskUuid
        task: taskUuid,
        active: true,
        boss: {
          id: bossUuid,
          name: randomBossName,
          role: 'boss',
        },
        hero: {
          id: heroUuid,
          name: randomHeroName,
          role: 'hero',
        },
        lastMessage: null,
      };

      // Get a key for a new Post.
      const newMessageGroupKey = this.db.ref().child('groups').push().key;

      this.logger.log(
        '[createMessageGroup] taskUuid: ' +
          bossUuid +
          ',newMessageGroupKey: ' +
          newMessageGroupKey,
      );
      this.logger.log(
        'bossUuid: ' + bossUuid + ',randomBossName: ' + randomBossName,
      );
      this.logger.log(
        'heroUuid: ' + bossUuid + ',randomHeroName: ' + randomHeroName,
      );

      // Write the new post's data simultaneously in the posts list and the user's post list.
      const updates = {};
      updates['/groups/' + newMessageGroupKey] = groupData;
      updates['/users/' + bossUuid + '/groups/' + newMessageGroupKey] = true;
      updates['/users/' + heroUuid + '/groups/' + newMessageGroupKey] = true;
      updates['/tasks/' + taskUuid + '/boss'] = bossUuid;
      updates['/tasks/' + taskUuid + '/heros/' + heroUuid + '/group'] =
        newMessageGroupKey;

      await this.db.ref().update(updates);
      return newMessageGroupKey;
    } catch (e) {
      this.logger.error('Error creating message group:', e);
      throw new ApiException(ResponseCode.STATUS_8000_FIREBASE_ERROR);
    }
  }
}
