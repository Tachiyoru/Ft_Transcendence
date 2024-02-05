import { createMachine } from 'xstate'
//import { createModel } from 'xstate/lib/model';

enum GameStates {
	LOBBY = 'LOBBY',
	PLAY = 'PLAY',
	VICTORY = 'VICTORY',
}

// export const GameModel = createModel({
// 	players:[]
// })

export const GameMachine = createMachine({
	id: 'game',
	initial: GameStates.LOBBY,
	states: {
		[GameStates.LOBBY]: {
			on: {
				join: {
					target: GameStates.LOBBY
				},
				leave: {
					target: GameStates.LOBBY
				},
				start: {
					target: GameStates.LOBBY
				}
			},
		},
		[GameStates.PLAY]: {
			on: {
				restart: {
					target: GameStates.LOBBY
				},
			},
		},
		[GameStates.VICTORY]: {
			on: {
				restart: {
					target: GameStates.LOBBY
				},
			},
		},
	}
}) 