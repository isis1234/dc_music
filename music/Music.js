const { 
  joinVoiceChannel, VoiceConnectionStatus, entersState, 
  createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType
} = require('@discordjs/voice')
const ytdl = require('ytdl-core')
const prism = require('prism-media')

module.exports = class Music {
  constructor() {
    // this.isPlaying = { 724145832802385970: false }
    this.isPlaying = {}

    /*this.queue = {
      724145832802385970: [{
        name: 'G.E.M.鄧紫棋【好想好想你 Missing You】Official Music Video',
        url: 'https://www.youtube.com/watch?v=P6QXo88IG2c&ab_channel=GEM%E9%84%A7%E7%B4%AB%E6%A3%8B'
      }]
    }*/
    this.queue = {}

    // https://discord.js.org/#/docs/main/stable/class/VoiceConnection
    this.connection = {}

    // https://discord.js.org/#/docs/main/stable/class/StreamDispatcher
    this.dispatcher = {}

    this.player = {}

    this.currentSong = {}
  }

  async join(msg) {
    if (msg.member.voice.channel !== null) {
      try {
        this.connection[msg.guild.id] = joinVoiceChannel({
          channelId: msg.member.voice.channel.id,
          guildId: msg.member.voice.channel.guild.id,
          adapterCreator: msg.member.voice.channel.guild.voiceAdapterCreator,
          selfMute: false,
          selfDeaf: false
        })
        .on('stateChange', (oldState, newState) => {
          if(oldState.status != newState.status)
            console.log(`[ ${msg.guild.name} ] 🎙 Voice from ${oldState.status} to ${newState.status}`)
        })
        this.player[msg.guild.id] = createAudioPlayer()
        .on('stateChange', (oldState, newState) => {
          console.log(`[ ${msg.guild.name} ] 🎙 Audio player from ${oldState.status} to ${newState.status}`)
          if(oldState.status=="playing" && newState.status=="idle"){
            // playing -> idle
            if (this.queue[msg.guild.id].length > 0) {
              this.playMusic(msg, msg.guild.id, this.queue[msg.guild.id][0])
            } else {
              this.isPlaying[msg.guild.id] = false
              this.currentSong[msg.guild.id] = false
              msg.channel.send('目前沒有音樂了，請加入音樂 :D')
            }
          }
        })
        await entersState(this.connection[msg.guild.id], VoiceConnectionStatus.Ready, 30_000)
      } catch (error) {
        // this.connection[msg.guild.id].destroy()
        throw error
      }
    } else {
      msg.channel.send('請先進入語音頻道')
    }
  }

  async play(msg) {
    const guildID = msg.guild.id
    const musicURL = msg.options._hoistedOptions[0].value

    // join channel handler
    // console.log(this.connection[guildID]._state.status)
    if (!this.connection[guildID]) { this.join(msg) }
    else if (this.connection[guildID]._state.status == VoiceConnectionStatus.Signalling) { 
      console.log(`[ ${msg.guild.name} ] 🎙 Voice channel signalling.`)
      this.join(msg) 
    }
    else if (this.connection[guildID]._state.status == VoiceConnectionStatus.Connecting) { 
      console.log(`[ ${msg.guild.name} ] 🎙 Voice channel connecting.`)
      this.join(msg) 
    }

    try {
      const res = await ytdl.getInfo(musicURL)
      const info = res.videoDetails

      if (!this.queue[guildID]) { this.queue[guildID] = [] }

      this.queue[guildID].push({
        name: info.title,
        url: musicURL
      })

      if (this.isPlaying[guildID]) {
        await msg.reply(`歌曲加入隊列：${info.title}`)
      } else {
        await msg.reply(`播放音樂：${info.title}`)
        this.isPlaying[guildID] = true
        // console.log(`播放音樂：${info.title}`)
        this.playMusic(msg, guildID, this.queue[guildID][0])
      }
    } catch(e) {
      console.log(e)
    }
  }

  async top(msg) {
    const guildID = msg.guild.id
    const musicURL = msg.options._hoistedOptions[0].value
    const res = await ytdl.getInfo(musicURL)
    const info = res.videoDetails

    // join channel handler
    // console.log(this.connection[guildID]._state.status)
    if (!this.connection[guildID]) { this.join(msg) }
    else if (this.connection[guildID]._state.status == VoiceConnectionStatus.Signalling) { 
      console.log(`[ ${msg.guild.name} ] 🎙 Voice channel signalling.`)
      this.join(msg) 
    }
    else if (this.connection[guildID]._state.status == VoiceConnectionStatus.Connecting) { 
      console.log(`[ ${msg.guild.name} ] 🎙 Voice channel connecting.`)
      this.join(msg) 
    }

    if((this.queue[guildID]).length > 1){
      this.queue[guildID] = [this.queue[guildID][0]].concat({name: info.title, url: musicURL}, (this.queue[guildID]).slice(1))
    }else{
      this.queue[guildID].push({name: info.title, url: musicURL})
    }
    this.player[guildID].stop() // 跳過歌曲
    return `插播音樂：${info.title}`
  }

  playMusic(msg, guildID, musicInfo) {
    const resource = createAudioResource(
      ytdl(musicInfo.url, { filter: 'audioonly' }),
      { inlineVolume: true }
    )
    this.player[guildID].play(resource)
    this.dispatcher[guildID] = this.connection[guildID].subscribe(this.player[guildID])
    this.currentSong[guildID] = musicInfo
    this.queue[msg.guild.id].shift() // 移除 queue 中目前播放的歌曲
    // // 歌曲播放結束時的事件
    // this.player[guildID].on('stateChange', (oldState, newState) => {
    //   //playing -> idle
    //   console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
    //   if(oldState.status=="playing" && newState.status=="idle"){
    //     if (this.queue[guildID].length > 0) {
    //       this.playMusic(msg, guildID, this.queue[guildID][0])
    //     } else {
    //       this.isPlaying[guildID] = false
    //       msg.channel.send('目前沒有音樂了，請加入音樂 :D')
    //     }
    //   }
    // })
  }

  resume(msg) {
    if (this.dispatcher[msg.guild.id]) {
      this.player[msg.guild.id].unpause()  // 恢復播放
      return '恢復播放'
    }
  }

  pause(msg) {
    if (this.dispatcher[msg.guild.id]) {
      this.player[msg.guild.id].pause() // 暫停播放
      return '暫停播放'
    }
  }

  skip(msg) {
    if (this.dispatcher[msg.guild.id]) {
      this.player[msg.guild.id].stop() // 跳過歌曲
      return '跳過目前歌曲'
    }
  }

  nowQueue(msg) {
    if(!this.currentSong[msg.guild.id]){
      return "目前隊列中沒有歌曲"
    }else{
      let output = `播放中：${this.currentSong[msg.guild.id].name}\n`

      if (this.queue[msg.guild.id] && this.queue[msg.guild.id].length > 0) {
        // const queueString = this.queue[msg.guild.id].map((item, index) => `[${index+1}] ${item.name}`).join("\n")
        for(let i=0; i<this.queue[msg.guild.id].length; i++){
          output += (`[${i+1}] ${this.queue[msg.guild.id][i].name}\n`)
        }
      } else {
        output += '目前隊列中沒有歌曲'
      }
    
      return (output)
    }


  }

  leave(msg) {
    if (this.connection[msg.guild.id]) {
    // if (this.connection[msg.guild.id] && this.connection[msg.guild.id].status === 0) {
      // 如果機器人有播放過歌曲
      if (this.queue.hasOwnProperty(msg.guild.id)) {
        delete this.queue[msg.guild.id] // 清空播放列表
        this.isPlaying[msg.guild.id] = false  // 改變 isPlaying 狀態為 false
      }
      this.connection[msg.guild.id].destroy()  // 離開頻道
      if(this.dispatcher[msg.guild.id]) this.dispatcher[msg.guild.id].unsubscribe()
      return "Bye"
    } else {
      return '機器人未加入任何頻道'
    }
  }
}