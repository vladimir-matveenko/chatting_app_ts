import type { UserResponseDto }
    from "../../../users/dto/response/user-response.dto.js";

import type { TokenResponseDto }
    from "./token-response.dto.js";

export interface AuthResponseDto {

    user: UserResponseDto;

    tokens: TokenResponseDto;

}