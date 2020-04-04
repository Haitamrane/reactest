import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props)

    this.localVideoref = React.createRef()
    this.remoteVideoref = React.createRef()
  }

  componentDidMount() {

    const pc_config = null



    this.pc = new RTCPeerConnection(pc_config)

    this.pc.onicecandidate = (e) => {
      if (e.candidate) console.log(JSON.stringify(e.candidate))
    }

    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e)
    }

    this.pc.onaddsteam = (e) => {
      this.remoteVideoref.current.srcObject = e.stream
    }

    const constraints = { video: true, audio: true }

    const succes = (stream) => {
      this.localVideoref.current.srcObject = stream
      this.pc.addStream(stream)
    }

    const failure = (e) => {
      console.log('getUserMedia Error:', e)
    }

    navigator.getUserMedia(constraints, succes, failure)
  }

    createOffer = () => {
      console.log('Offer')
      this.pc.createOffer({offerToReceiveVideo: 1, offerToReceiveAudio: 1})
      .then(sdp => {
        console.log(JSON.stringify(sdp))
        this.pc.setLocalDescription(sdp)
      })
    }

    setRemoteDescription = () => {
      const desc = JSON.parse(this.textref.value)

      this.pc.setRemoteDescription(new RTCSessionDescription(desc))
    }

    createAnswer = () => {
      console.log('Answer')
      this.pc.createAnswer({offerToReceiveVideo: 1, offerToReceiveAudio: 1})
      .then(sdp => {
        console.log(JSON.stringify(sdp))
        this.pc.setLocalDescription(sdp)
      }, e => {})
    }

    addCandidate = () => {
      const candidate = JSON.parse(this.textref.value)
      console.log('Adding candidate:', candidate)

      this.pc.addIceCandidate(new RTCIceCandidate(candidate))
    }

  render() {

    return(
    <div> 
      <video style={{
        width: 640, height: 640, margin: 5, background: 'black'
      }} ref={this.localVideoref} autoPlay></video>

      <video style={{
        width: 640, height: 640, margin: 5, background: 'black'
      }} ref={this.remoteVideoref} autoPlay></video>

      <button onClick={this.createOffer}>Offer</button>
      <button onClick={this.createAnswer}>Answer</button>
      <br/>
      <textarea ref={ref => {this.textref = ref}}/>
      <br/>
      <button onClick={this.setRemoteDescription}>Set remote Description</button>
      <button onClick={this.addCandidate}>Add Candidate</button>
    </div>
    );
  }
}

export default App;
