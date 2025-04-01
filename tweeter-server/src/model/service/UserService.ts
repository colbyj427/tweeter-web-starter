import { User, UserDto } from "tweeter-shared";
import { UserDaoInterface } from "../Daos/UserDaoInterface";
import { UserEntity } from "../Entity/User"
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export class UserService {
  private dao: UserDaoInterface;
  
  constructor(dao: UserDaoInterface) {
    this.dao = dao;
  }

    public async login (
        alias: string,
        password: string
      ): Promise<[UserDto, string]> {
        //encrypt the password        
        const user = await this.dao.get(alias);

        if (user === null) {
          throw new Error("Invalid alias or password");
        }
        //check if the given password matches the one in the database.
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }
        
        //create token 
        const token = crypto.randomBytes(32).toString('hex');
        //make the session
        await this.dao.putSession(token, user.alias, Date.now());

        const userDto = this.entityToDto(user);
        return [userDto, token];
      };

    public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
      ): Promise<[UserDto, string]> {
        const hashedPassword = await bcrypt.hash(password, 10);

        //Put the image in the bucket and get the url
        const imageUrl = await this.dao.putImage(alias, userImageBytes);

        //create token 
        const token = crypto.randomBytes(32).toString('hex');
        //make the session
        await this.dao.putSession(token, alias, Date.now());

        const userEntity = new UserEntity(
          firstName,
          lastName,
          alias,
          hashedPassword,
          imageUrl
        )
        await this.dao.put(userEntity)
        const user = await this.dao.get(alias);
        if (user === null) {
          throw new Error("Invalid registration");
        }
        const userDto = this.entityToDto(userEntity);
        return [userDto, token];
      };

      public async logout (token: string): Promise<void> {
        this.dao.deleteSession(token);
      };

      public async getUser (
        token: string,
        alias: string
      ): Promise<UserDto | null> {
        const isExpired = await this.dao.getSession(token);
        if (isExpired) {
          throw new Error("Must log in again");
        }
        const userEntity = await this.dao.get(alias);
        
        if (userEntity === null) {
          throw new Error("User does not exist");
        }
        const dto = this.entityToDto(userEntity);
        return dto
      };

      private entityToDto(entity: UserEntity): UserDto {
        let toDto = new User(
          entity.firstName,
          entity.lastName,
          entity.alias,
          entity.imageUrl
        )
        const userDto = toDto.dto;
        return userDto;
      }
}