import { Injectable } from '@nestjs/common';
import { UserDbService } from '@/providers/database/services/user-db.service';

@Injectable()
export class UserService {
  constructor(private readonly userDbService: UserDbService) {}

  async profile(userId: number) {
    return await this.userDbService.readUser(userId);
  }
}
