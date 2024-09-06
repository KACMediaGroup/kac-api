import { BaseService } from '@/base.service';
import { SendAligoRequestDto } from '@/shared/dtos/request/send-aligo-request.dto';
import ApplicationException from '@/shared/exceptions/application.exception';
import { ErrorCode } from '@/shared/exceptions/error-code';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AligoService extends BaseService {
  constructor() {
    super();
  }

  async sendKaKaoTalk(dto: SendAligoRequestDto) {
    try {
      const res = await axios.post('https://kakaoapi.aligo.in/akv10/alimtalk/send/', dto, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      });
      console.log(res.data);

      if (res.data.code !== 0) {
        throw new ApplicationException(
          new InternalServerErrorException('알림톡 발송 에러'),
          ErrorCode.SEND_KAKAOTALK_EXTERNAL_ERROR,
        );
      }
      return res.data;
    } catch (e) {
      console.log(e.message ?? e.toString() ?? JSON.stringify(e));
      throw new ApplicationException(
        new InternalServerErrorException('알림톡 발송 api 콜 에러'),
        ErrorCode.SEND_KAKAOTALK_EXTERNAL_ERROR,
      );
    }
  }
}
