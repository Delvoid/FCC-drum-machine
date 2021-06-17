import React, { useState, useEffect } from 'react'
import './App.css'

const audioClips = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
  },
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
  },
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
  },
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
  },
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
  },
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
  },
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
  },
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
  },
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
  },
]

function App() {
  const [volume, setVolume] = useState(0.5)
  const [recording, setRecording] = useState('')
  const [speed, setSpeed] = useState(1)
  const [power, setPower] = useState(true)
  const [display, setDisplay] = useState('')

  useEffect(() => {
    const resetDisplay = setTimeout(() => {
      setDisplay('')
    }, 1500)
    return () => {
      clearTimeout(resetDisplay)
    }
  }, [display])

  const playRecording = () => {
    let i = 0
    let recordArray = recording.split(' ')
    const interval = setInterval(() => {
      const audioTag = document.getElementById(recordArray[i])
      audioTag.volume = volume
      audioTag.currentTime = 0

      setDisplay('Playing')
      audioTag.play()

      i++
    }, 300 / speed)
    setTimeout(
      () => clearInterval(interval),
      (300 / speed) * recordArray.length - 1
    )
  }

  const togglePower = () => {
    const message = !power && 'Welcome'
    setDisplay(message)
    setPower(!power)
    // every 1.5 sec reset display message
    setTimeout(() => {
      setDisplay('')
    }, 1500)

    setRecording('')
  }

  const changeSpeed = (e) => {
    if (power) {
      setDisplay(`Speed: ${e.target.value}`)
    }
    setSpeed(e.target.value)
  }
  const clearRecording = () => {
    setRecording('')
    if (power) {
      setDisplay('Cleared')
    }
  }
  return (
    <div className="container1">
      <div id="drum-machine" className="drum-machine">
        <div className="pads">
          {audioClips.map((clip) => (
            <Pad
              key={clip.id}
              clip={clip}
              power={power}
              volume={volume}
              recording={recording}
              setRecording={setRecording}
              setDisplay={setDisplay}
            />
          ))}
        </div>
        <div className="controls">
          <div className="header">
            <header>Drum Machine</header>
            <button
              style={
                power
                  ? { background: '#0ad82c' }
                  : { background: 'darkred', boxShadow: 'none' }
              }
              className="power"
              onClick={togglePower}
            >
              <i className="fas fa-power-off power-icon"></i>
            </button>
          </div>
          <div
            style={
              power ? { background: '#1ec8ce' } : { background: '#476b68' }
            }
            className="display"
            id="display"
          >
            {display}
          </div>
          <div
            style={power ? { opacity: '1' } : { opacity: '0.2' }}
            className="volume"
          >
            <h4>Volume</h4>
            <input
              type="range"
              step="0.01"
              onChange={(e) => setVolume(e.target.value)}
              value={volume}
              max="1"
              min="0"
              className="w-50"
            />
          </div>
          <div
            style={power ? { opacity: '1' } : { opacity: '0.2' }}
            className="recording"
          >
            <h3>{recording}</h3>
            {
              <>
                <button onClick={playRecording} className="btn btn-success">
                  <i className="fas fa-play-circle"></i>
                </button>
                <button
                  onClick={() => clearRecording()}
                  className="btn btn-warning text-white"
                >
                  <i className="fas fa-trash-restore"></i>
                </button>

                <br />
                <h4>Speed</h4>
                <input
                  type="range"
                  step="0.1"
                  onChange={(e) => changeSpeed(e)}
                  value={speed}
                  max="2.0"
                  min="0.5"
                  className="w-50"
                />
              </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function Pad({ clip, volume, setRecording, recording, setDisplay, power }) {
  const [active, setActive] = useState(false)
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [power, recording])

  const handleKeyPress = (e) => {
    if (power) {
      if (e.keyCode === clip.keyCode) {
        const drumPad = document.getElementById(clip.keyTrigger)
        const drumOuter = drumPad.closest('.outer-drum')
        drumPad.closest('.drum-pad').classList.add('drum-pad-press')
        drumOuter.classList.add('drum-press')
        setTimeout(() => {
          drumOuter.classList.remove('drum-press')
          drumPad.closest('.drum-pad').classList.remove('drum-pad-press')
        }, 100)
        playSound()
      }
    }
  }

  const playSound = () => {
    if (power) {
      const audioTag = document.getElementById(clip.keyTrigger)
      setActive(true)
      setTimeout(() => {
        setActive(false)
      }, 200)
      audioTag.volume = volume
      audioTag.currentTime = 0
      audioTag.play()
      setDisplay(clip.id)

      if (recording.split(' ').length <= 27) {
        setRecording((prev) => prev + clip.keyTrigger + ' ')
      } else {
        setDisplay('Rec Full')
      }
    }
  }
  const onStyle = {
    transform: 'scale(0.90)',
    boxShadow: '1px 1px 4px 4px cyan, -1px -1px 4px 4px cyan',
  }
  const offStyle = { transform: 'scale(1)', boxShadow: 'none' }
  const style = !power ? { background: '#476b68' } : active ? onStyle : offStyle

  return (
    <div style={style} className="outer-drum">
      <div id={clip.id} onClick={playSound} className={`drum-pad`}>
        <audio className="clip" id={clip.keyTrigger} src={clip.url} />
        {clip.keyTrigger}
      </div>
    </div>
  )
}

export default App

//       className={`btn btn-secondary p-4 m-3 ${
//           active && 'btn-warning'
//         } drum-pad`}
