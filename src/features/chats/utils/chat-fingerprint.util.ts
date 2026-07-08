import crypto
    from "node:crypto";

import {
    ChatType,
} from "../entities/chat-type.enum.js";

interface BuildFingerprintParams {

    type: ChatType;

    ownerId: string | null;

    title: string | null;

    avatarUrl: string | null;

    memberIds: string[];

}

export function buildChatFingerprint(

    params: BuildFingerprintParams,

): string {

    const members =
        [...params.memberIds]
            .sort();

    if (

        params.type === ChatType.PRIVATE

    ) {

        return crypto

            .createHash(
                "sha256",
            )

            .update(

                `private:${members.join(":")}`,

            )

            .digest(

                "hex",

            );

    }

    return crypto

        .createHash(
            "sha256",
        )

        .update(

            [

                "group",

                params.ownerId ?? "",

                params.title ?? "",

                params.avatarUrl ?? "",

                members.join(","),

            ].join("|"),

        )

        .digest(

            "hex",

        );

}