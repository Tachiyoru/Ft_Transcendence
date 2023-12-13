type NotificationContentGenerator = (...args: string[]) => string;

export enum NotificationContentType
{
	FRIENDREQUEST_RECEIVED,
	FRIENDREQUEST_ACCEPTED,
	INVITED_TO_GAME,
	ACHIEVEMENT_UNLOCKED,
	INVITED_TO_CHANNEL,
	INTEGRATED_TO_CHANNEL,
	CHANNEL_PRIVILEGE_GRANTED,
}

// Tableau associatif pour mapper les types à leurs fonctions correspondantes
export const NotificationContentFunctions: Record<NotificationContentType, NotificationContentGenerator> = {
	[NotificationContentType.FRIENDREQUEST_RECEIVED]: (...args) => `${args[0]} vous a envoyé une demande d'ami.`,
	[NotificationContentType.FRIENDREQUEST_ACCEPTED]: (...args) => `${args[0]} a accepté votre demande d'ami.`,
	[NotificationContentType.INVITED_TO_GAME]: (...args) => `${args[0]} vous a invité à jouer`,
	[NotificationContentType.ACHIEVEMENT_UNLOCKED]: (...args) => `Vous avez debloque le succès ${args[0]}.`,
	[NotificationContentType.INVITED_TO_CHANNEL]: (...args) => `${args[0]} vous a invité à rejoindre le salon ${args[1]}.`,
	[NotificationContentType.INTEGRATED_TO_CHANNEL]: (...args) => `${args[0]} vous a integré dans le salon ${args[1]}.`,
	[NotificationContentType.CHANNEL_PRIVILEGE_GRANTED]: (...args) => `Vous etes maintenant ${args[0]} sur le salon ${args[1]}.`,
};
