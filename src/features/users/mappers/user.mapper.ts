import type { Mapper } from "../../../core/mappers/mapper.js";

import type { UserEntity } from "../entities/user.entity.js";
import type { User } from "../models/user.model.js";

export class UserMapper implements Mapper<UserEntity, User> {

    map(entity: UserEntity): User {

        return {
            id: entity.id,
            username: entity.username,
            email: entity.email,
            passwordHash: entity.password_hash,
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
        };

    }

}