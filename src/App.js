import React from 'react';
import beepSound from './BeepSound.wav'
import './App.css';

class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      status: false,
      displayname: "Session",
      display: "25:00",
      timerclass: "timerstandard"
    }
    this.handleBreaks = this.handleBreaks.bind(this)
    this.handleSessions = this.handleSessions.bind(this)
    this.handleStartStop = this.handleStartStop.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleCountDown = this.handleCountDown.bind(this)
  }
  handleBreaks(e) {
    if (!this.state.status) {
      if (e.target.value === "decrement" && this.state.break >= 2) {      
        this.setState({
          break: this.state.break - 1
        })
      }
      else if (e.target.value === "increment" && this.state.break <=59) {
        this.setState({
          break: this.state.break + 1
        })
      }
    }  
  }
  
  handleSessions(e) {
    if (!this.state.status) {
      if (e.target.value === "decrement" && this.state.session >=2) {
        if (this.state.session <= 10) {
          this.setState({
            session: this.state.session - 1,
            display: "0" + (this.state.session - 1) + ":00" 
          })
        } else {
          this.setState({
            session: this.state.session - 1,
            display: (this.state.session - 1) + ":00"           
          })
        }
      }                      
      else if (e.target.value === "increment" && this.state.session <=59) {
        if (this.state.session <= 8) {
          this.setState({
            session: this.state.session + 1,
            display: "0" + (this.state.session + 1) + ":00" 
          })      
        } else {
          this.setState({
            session: this.state.session + 1,
            display: (this.state.session + 1) + ":00" 
          })           
        }
      }
    }
  }
  
  handleStartStop() {
    if (this.state.status === false) {
      this.interval_id = setInterval(this.handleCountDown, 1000)
      this.secondsRemaining = Number((this.state.display.slice(0,2) * 60)) + Number(this.state.display.slice(3,5)) - 1
      this.setState({
        status: true
    })
    }
    else if (this.state.status === true) {
      clearInterval(this.interval_id)
      this.setState({
        status: false
      })
    }
  }

  handleCountDown() {    
    var min = Math.floor(this.secondsRemaining / 60) 
    var sec = Math.floor(this.secondsRemaining % 60)
    
    if (min === 0 && sec === 0) {
      this.secondsRemaining = this.state.break * 60 + 1
      this.beep.play()
      this.setState({
        display: "0" + min + ":" + "0" + sec,
      })   
    } else {
      this.setState({
        display: min + ":" + sec
      })
      if (min >=1 && sec >=0 && this.state.timerclass === "timerred" && this.state.displayname ==="Session") {
        this.setState ({
          timerclass: "timerstandard",
          displayname: "Break"
        })
      }
      if (min >=1 && sec >=0 && this.state.timerclass === "timerred" && this.state.displayname ==="Break") {
        this.setState ({
          timerclass: "timerstandard",
          displayname: "Session"
        })
      }      
      if (min < 10) {
        this.setState({
          display: "0"+ min + ":" + sec 
        })      
      }
      if (sec < 10) {
        this.setState({
          display: min + ":" + "0" + sec 
        })
      }   
      if (min < 10 && sec < 10) {
        this.setState({
          display: "0" + min + ":" + "0" + sec 
        })
      }      
      if (min === 0 && sec === 59) {
        this.setState({
          timerclass: "timerred"
        })
      }
    }
     this.secondsRemaining = this.secondsRemaining - 1   
  }  
  
  handleReset() {
    clearInterval(this.interval_id)
    this.beep.pause()
    this.beep.currentTime=0;
    this.setState({
      break: 5,
      session: 25,
      status: false,
      displayname: "Session",
      display: "25:00",
      timerclass: "timerstandard"
    })
  }
  
  render() {
    return(
      <div id="main">
        <h1>Pomodoro Clock</h1>
        <Length 
          breaks={this.handleBreaks}
          currentBreak={this.state.break}
          sessions={this.handleSessions}
          currentSession={this.state.session} />
        <Timer 
          startStop={this.handleStartStop}
          reset={this.handleReset}
          currentDisplay={this.state.display} 
          displayName={this.state.displayname}
          timerClass={this.state.timerclass}
          />
        <audio 
          ref={ref => this.beep = ref}
          id="beep"
          preload="auto"
          crossOrigin="*"
          // src="https://goo.gl/65cBl1"
          src={beepSound}
          />
      </div>
      )
    }
}

class Length extends React.Component {
  render() {
    return (
      <div id="length-wrapper">
      <div className="length">
        <div id="break-label" className="label">Break Length</div>  
          <button id="break-decrement" onClick={this.props.breaks} value="decrement" className="btn">↓</button>
          <div id="break-length" className="lengthdisplay">{this.props.currentBreak}</div>
          <button id="break-increment" onClick={this.props.breaks} value="increment" className="btn">↑</button>
      </div>
      <div className="length">      
        <div id="session-label" className="label">Session Length</div>
          <button id="session-decrement" onClick={this.props.sessions} value="decrement" className="btn">↓</button>
          <div id="session-length" className="lengthdisplay">{this.props.currentSession}</div>     
          <button id="session-increment" onClick={this.props.sessions} value="increment" className="btn">↑</button>
      </div>
      </div>  
    )
  }
}

class Timer extends React.Component {
  render() {
    return(
    <div id="timer-wrapper" className={this.props.timerClass}>
        <div id="timer-label">{this.props.displayName}</div>
        <div id="time-left">{this.props.currentDisplay}</div>
        <button id="start_stop" onClick={this.props.startStop}>
          <i className="fa fa-play fa-2x"></i>
          <i className="fa fa-pause fa-2x"></i>
        </button>
        <button id="reset" onClick={this.props.reset}>
          <i className="fa fa-refresh fa-2x"></i>
        </button>
      </div>    
    )
  }
}

export default Pomodoro;
