/**
 * Generated by orval v7.5.0 🍺
 * Do not edit manually.
 * Code Dual API
 * The Code Dual API description
 * OpenAPI spec version: 1.0
 */
import type { UserDto } from './userDto';
import type { GameParticipantDtoLanguage } from './gameParticipantDtoLanguage';

export interface GameParticipantDto {
  id: string;
  user: UserDto;
  currentCode: string;
  isCompleted: boolean;
  completedAt: string;
  language: GameParticipantDtoLanguage;
  isHost: boolean;
  percentage: number;
  sharedCode: boolean;
}
