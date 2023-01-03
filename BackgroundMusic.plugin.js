/**
 * @name BackgroundMusic
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.2.1
 * @invite SgKSKyh9gY
 * @description Play background music in Discord. (Why would you need this tho?)
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/BackgroundMusic.plugin.js
 */
/*@cc_on
@if (@_jscript)
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
var pathSelf = WScript.ScriptFullName;
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I move myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.MoveFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)));
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
  const config = {
    info: {
      name: "BackgroundMusic",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.2.1",
      description: "Play background music in Discord. (Why would you need this tho?)",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/BackgroundMusic.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Idea in mind"],
      },
      {
        title: "v0.0.5",
        items: ["Base Model"],
      },
      {
        title: "Initial Release v1.0.0",
        items: [
          "This is the initial release of the plugin :)",
          "IDK Who would want this but here it is （￣︶￣）↗　",
        ],
      },
      {
        title: "v1.1.1",
        items: ["Corrected text."],
      },
    ],
    main: "BackgroundMusic.plugin.js",
  };
   const RequiredLibs = [{
    window: "ZeresPluginLibrary",
    filename: "0PluginLibrary.plugin.js",
    external: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
    downloadUrl: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
  },
  {
    window: "BunnyLib",
    filename: "1BunnyLib.plugin.js",
    external: "https://github.com/Tharki-God/BetterDiscordPlugins",
    downloadUrl: "https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js"
  }];
  class handleMissingLibrarys {
    load() {
      for (const Lib of RequiredLibs.filter(lib =>  !window.hasOwnProperty(lib.window)))
        BdApi.showConfirmationModal(
          "Library Missing",
          `The library plugin (${Lib.window}) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
          {
            confirmText: "Download Now",
            cancelText: "Cancel",
            onConfirm: () => this.downloadLib(Lib),
          }
        );
    }
    async downloadLib(Lib) {
      const fs = require("fs");
      const path = require("path");
      const { Plugins } = BdApi;
      const LibFetch = await fetch(
        Lib.downloadUrl
      );
      if (!LibFetch.ok) return this.errorDownloadLib(Lib);
      const LibContent = await LibFetch.text();
      try {
        await fs.writeFile(
          path.join(Plugins.folder, Lib.filename),
          LibContent,
          (err) => {
            if (err) return this.errorDownloadLib(Lib);
          }
        );
      } catch (err) {
        return this.errorDownloadLib(Lib);
      }
    }
    errorDownloadZLib(Lib) {
      const { shell } = require("electron");
      BdApi.showConfirmationModal(
        "Error Downloading",
        [
          `${Lib.window} download failed. Manually install plugin library from the link below.`,
        ],
        {
          confirmText: "Download",
          cancelText: "Cancel",
          onConfirm: () => {
            shell.openExternal(
              Lib.external
            );
          },
        }
      );
    }
    start() { }
    stop() { }
  }
  return RequiredLibs.some(m => !window.hasOwnProperty(m.window))
    ? handleMissingLibrarys
    : (([Plugin, ZLibrary]) => {
        const {
          Utilities,
          PluginUpdater,
          Logger,
          Settings: { SettingPanel, Slider, Textbox },
        } = ZLibrary;
        const defaultMp3 =
          "https://tharki-god.github.io/files-random-host/LostofWords.mp3";
        const defaultSettings = {
          volume: 0.25,
          musicLink: "",
        };
        return class BackgroundMusic extends Plugin {
          constructor() {
            super();
            this.settings = Utilities.loadData(
              config.info.name,
              "settings",
              defaultSettings
            );
          }
          checkForUpdates() {
            try {
              PluginUpdater.checkForUpdate(
                config.info.name,
                config.info.version,
                config.info.github_raw
              );
            } catch (err) {
              Logger.err("Plugin Updater could not be reached.", err);
            }
          }
          start() {
            this.checkForUpdates();
            this.updateMusic();
          }
          playDefault() {
            Logger.warn(
              "Invalid or no link provided, therefore playing the default track (Nisekoi - Lost of Words)."
            );
            this.music = new Audio(defaultMp3);
            this.UpdateMusicV2();
          }
          updateMusic() {
            if (this.music) this.music.pause();
            this.music = new Audio(this.settings["musicLink"]);
            this.music.onerror = () => this.playDefault();
            this.UpdateMusicV2();
          }
          UpdateMusicV2() {
            this.music.pause();
            this.music.loop = true;
            this.music.volume = this.settings["volume"];
            this.music.play();
          }

          stop() {
            this.stopMusic();
          }
          stopMusic() {
            this.music.pause();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Slider(
                "Volume",
                "Volume of the music",
                0,
                100,
                this.settings["volume"] * 100,
                (e) => {
                  this.settings["volume"] = e / 100;
                },
                {
                  markers: [0, 100],
                  stickToMarkers: false,
                }
              ),
              new Textbox(
                "Music",
                "Link to the audio file of the music you want to be played. Default track: Nisekoi - Lost of Words",
                this.musicLink,
                (e) => {
                  this.settings["musicLink"] = e;
                },
                {
                  placeholder:
                    "Paste the file link here. (MP3 is preferred as the audio format.)",
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "settings", this.settings);
            this.updateMusic();
          }
        };
      })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
