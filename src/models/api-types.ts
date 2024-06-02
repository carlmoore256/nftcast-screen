import type { DeviceType } from "../prisma";
import { z } from "zod";

export type DisplayLoadData =
    | {
          pairingCode: null;
          deviceType: DeviceType;
          display: {
              style: {
                  id: string;
                  size: number;
                  posX: number;
                  posY: number;
                  rotation: number;
                  css: any;
              } | null;
              currentDisplayContentPair:
                  | ({
                        style: {
                            id: string;
                            size: number;
                            posX: number;
                            posY: number;
                            rotation: number;
                            css: any;
                        } | null;
                        content: {
                            style: {
                                id: string;
                                size: number;
                                posX: number;
                                posY: number;
                                rotation: number;
                                css: any;
                            } | null;
                        } & {
                            id: string;
                            uri: string;
                            name: string | null;
                            description: string | null;
                            thumbnailUri: string | null;
                            mimetype: string;
                            bytes: string;
                            createdAt: Date;
                            userId: string;
                            organizationId: string;
                            styleId: string | null;
                            directoryId: string | null;
                            hostedFileId: string | null;
                        };
                    } & {
                        id: string;
                        displayId: string;
                        contentId: string;
                        collectionId: string | null;
                        styleId: string | null;
                        createdAt: Date;
                        updatedAt: Date;
                    })
                  | null;
          } & {
              id: string;
              name: string;
              organizationId: string;
              createdAt: Date;
              styleId: string | null;
              settings: any;
              deviceType: DeviceType;
              currentDisplayContentPairId: string | null;
              lastSeenAt: Date;
              width: number;
              height: number;
          };
      }
    | {
          pairingCode: {
              code: string;
              createdAt: Date;
              claimedAt: Date | null;
              deviceType: DeviceType;
              displayId: string | null;
          };
          deviceType: DeviceType;
          display: null;
      };

export type DisplayClientView = DisplayLoadData["display"];
export type DisplayContentPairClientView = DisplayLoadData["display"]["currentDisplayContentPair"];

enum ClientDeviceType {
    Computer = "Computer",
    Tablet = "Tablet",
    Phone = "Phone",
    SmartTV = "SmartTV",
    Unknown = "Unknown",
}

export const DisplaySettingsSchema = z
    .object({
        showConsole: z.boolean().optional().default(false),
    })
    .strip();

export const DisplayPatchSchema = z
    .object({
        name: z.string().optional(),
        settings: DisplaySettingsSchema.optional(),
        deviceType: z.nativeEnum(ClientDeviceType).optional(),
        width: z.number().optional(),
        height: z.number().optional(),
    })
    .strip();

export type DisplayPatch = z.infer<typeof DisplayPatchSchema>;
