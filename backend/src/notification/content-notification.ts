type NotificationContentGenerator = (...args: string[]) => string;

export enum NotificationType {
  FRIENDREQUEST_RECEIVED,
  FRIENDREQUEST_ACCEPTED,
  INVITED_TO_GAME,
  ACHIEVEMENT_UNLOCKED,
  INVITED_TO_CHANNEL,
  INTEGRATED_TO_CHANNEL,
  CHANNEL_PRIVILEGE_GRANTED,
}

// Tableau associatif pour mapper les types à leurs fonctions correspondantes
export const NotificationContentFunctions: Record<
  NotificationType,
  NotificationContentGenerator
> = {
  [NotificationType.FRIENDREQUEST_RECEIVED]: (...args) =>
    `${args[0]} has sent you a friend request.`,
  [NotificationType.FRIENDREQUEST_ACCEPTED]: (...args) =>
    `${args[0]} has accepted your friend request.`,
  [NotificationType.INVITED_TO_GAME]: (...args) =>
    `${args[0]} has invited you to play`,
  [NotificationType.ACHIEVEMENT_UNLOCKED]: (...args) =>
    `You've unlocked success '${args[0]}'.`,
  [NotificationType.INVITED_TO_CHANNEL]: (...args) =>
    `${args[0]} has invited you to join ${args[1]}.`,
  [NotificationType.INTEGRATED_TO_CHANNEL]: (...args) =>
    `${args[0]} has integrated you into the salon ${args[1]}.`,
  [NotificationType.CHANNEL_PRIVILEGE_GRANTED]: (...args) =>
    `You are now ${args[0]} on the channel ${args[1]}.`,

};
