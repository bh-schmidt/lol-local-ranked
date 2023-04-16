import React from 'react';
import './App.css';

enum Performance {
    Feeder = 1,
    Even = 2,
    Mvp = 3
}

class Player {
    name?: string
    currentPdls?: number
    winner?: boolean
    resultPdls?: number
    performance?: Performance = Performance.Even
}

interface State {
    players: Player[]
    setPlayers: (players: Player[]) => void
    text: string
    setText: (text: string) => void
}

function App() {
    const [players, setPlayers] = React.useState<Player[]>([]);
    const [text, setText] = React.useState<any>();

    const state: State =
    {
        players,
        setPlayers,
        text,
        setText
    }

    return (
        <div className="App">
            <h1>Current</h1>
            <textarea style={{ height: '200px', width: '600px' }} onChange={e => { setText(e.target.value) }}>
            </textarea>
            <div>
                <button onClick={() => convert(text, setPlayers)}>Convert</button>
            </div>

            <div style={{ width: '1200px', margin: 'auto' }}>
                <hr />
                {[...players]
                    .sort((a, b) => {
                        if (a.winner === undefined)
                            return 1

                        if (b.winner === undefined)
                            return -1

                        return +b.winner! - +a.winner!
                    })
                    .map(player => (
                        <div key={player.name}>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div>
                                    <span>Player: </span>
                                    <input style={{ margin: '5px', width: '100px' }} type="text" readOnly disabled value={player.name} />

                                    <span>Current Pdls: </span>
                                    <input style={{ margin: '5px', width: '50px' }} type="text" readOnly disabled value={player.currentPdls} />

                                    <button style={{ margin: '5px' }} onClick={() => setWinner(player, true, state)}>Winner</button>
                                    <button style={{ margin: '5px' }} onClick={() => setWinner(player, false, state)}>Loser</button>
                                </div>

                                <div>
                                    {
                                        player.winner !== undefined &&

                                        <span>
                                            <span>Winner: </span>
                                            <input style={{ margin: '5px', width: '25px' }} type="text" readOnly disabled value={player.winner ? 'yes' : 'no'} />

                                            <button style={{ margin: '5px' }} onClick={() => setResult(player, Performance.Feeder, state)}>Feeder</button>
                                            <button style={{ margin: '5px' }} onClick={() => setResult(player, Performance.Even, state)}>Even</button>
                                            <button style={{ margin: '5px' }} onClick={() => setResult(player, Performance.Mvp, state)}>Mvp</button>

                                            <span>Performance: </span>
                                            <input style={{ margin: '5px', width: '50px' }} type="text" readOnly disabled value={Performance[player.performance!]} />

                                            <span>Result Pdls: </span>
                                            <input style={{ margin: '5px', width: '50px' }} type="text" readOnly disabled value={player.resultPdls} />
                                        </span>
                                    }

                                </div>
                            </div>

                            <hr />
                        </div>
                    ))}
            </div>

            <h1>Result</h1>
            <textarea readOnly style={{ height: '200px', width: '600px' }} value={buildResult(state)}>
            </textarea>
        </div>
    );
}

const buildResult = (state: State) => {
    return [...state.players]
        .sort((a, b) => b.resultPdls! - a.resultPdls!)
        .map(player => `${player.name}: ${player.resultPdls}`)
        .join('\n')
}

const setWinner = (player: Player, winner: boolean, state: State) => {
    const statePlayer = state.players.find(e => e.name === player.name)!
    statePlayer.winner = winner

    setResult(player, player.performance!, state)
}

const setResult = (player: Player, performance: Performance, state: State) => {
    let result = 0
    switch (performance) {
        case Performance.Feeder:
            result = -1
            break;

        case Performance.Even:
            result = 0
            break;

        case Performance.Mvp:
            result = 1
            break;
    }

    result += player.winner ? 5 : -5

    const statePlayer = state.players.find(e => e.name === player.name)!
    statePlayer.resultPdls = player.currentPdls! + result
    statePlayer.performance = performance

    console.log(player.currentPdls! + result)
    console.log(statePlayer)
    console.log(state.players[0])
    state.setPlayers([...state.players])
}

const convert = (text: string, setState: (player: Player[]) => void) => {
    const lines = text.split(/\n|\r|\r\n/)
    console.log(lines)

    const players = lines.map(line => {
        const split = line.split(':')
        const player = new Player()
        player.name = split[0]
        player.currentPdls = +split[1]
        player.resultPdls = +split[1]
        return player
    })

    setState(players)
}


export default App;
