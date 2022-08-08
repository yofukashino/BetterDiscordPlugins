/**
 * @name BackgroundMusic
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.3
 * @invite SgKSKyh9gY
 * @description Play BackgroundMusic in discord lol.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BackgroundMusic.plugin.js
 */
/*@cc_on
	@if (@_jscript)	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
	shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
	shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
	fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
	// Show the user where to put plugins in the future
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
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.3",
      description: "Play Background Music in discord lol",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BackgroundMusic.plugin.js",
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
    ],
    main: "BackgroundMusic.plugin.js",
  };
  return !global.ZeresPluginLibrary
    ? class {
        constructor() {
          this._config = config;
        }
        getName() {
          return config.info.name;
        }
        getAuthor() {
          return config.info.authors.map((a) => a.name).join(", ");
        }
        getDescription() {
          return config.info.description;
        }
        getVersion() {
          return config.info.version;
        }
        load() {
          BdApi.showConfirmationModal(
            "Library Missing",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => {
                require("request").get(
                  "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                  async (error, response, body) => {
                    if (error) {
                      return BdApi.showConfirmationModal("Error Downloading", [
                        "Library plugin download failed. Manually install plugin library from the link below.",
                        BdApi.React.createElement(
                          "a",
                          {
                            href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                            target: "_blank",
                          },
                          "ZeresPluginLibrary"
                        ),
                      ]);
                    }
                    await new Promise((r) =>
                      require("fs").writeFile(
                        require("path").join(
                          BdApi.Plugins.folder,
                          "0PluginLibrary.plugin.js"
                        ),
                        body,
                        r
                      )
                    );
                  }
                );
              },
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Library]) => {
        const {
          Utilities,
          PluginUpdater,
          Logger,
          Settings: { SettingPanel, Slider, Textbox },
        } = Library;
        const defaultMp3 =
          "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/_Lost%20of%20Words_.mp3";
        return class BackgroundMusic extends Plugin {
          constructor() {
            super();
            this.volume = Utilities.loadData(config.info.name, "volume", 0.25);
            this.musicLink = Utilities.loadData(
              config.info.name,
              "musicLink",
              defaultMp3
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
              Logger.err(              
                "Plugin Updater could not be reached.",
                err
              );
            }
          }
          start() {
            this.checkForUpdates();
            this.updateMusic();
          }
          playDefault() {
            Logger.warn(
              "Invaild or no link provided, hence playing default track (Lost of words: Nisekoi)."
            );
            this.music = new Audio(defaultMp3);
            this.music.pause();
            this.music.loop = true;
            this.music.volume = this.volume;
            this.music.play();
          }
          updateMusic() {
            if (this.music) this.music.pause();
            this.music = new Audio(this.musicLink);
            this.music.onerror = () => this.playDefault();
            this.music.pause();
            this.music.loop = true;
            this.music.volume = this.volume;
            this.music.play();
          }

          stop() {
            this.music.pause();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Slider(
                "Volume",
                "Volume for the music",
                0,
                100,
                this.volume * 100,
                (e) => {
                  this.volume = e / 100;
                },
                {
                  markers: [0, 100],
                  stickToMarkers: false,
                }
              ),
              new Textbox(
                "Music",
                "Link To Audio File of the music you want. Default Track: Lost of Words Nisekoi",
                this.musicLink,
                (e, d) => {
                  this.musicLink = e;
                },
                {
                  placeholder:
                    "Paste you File Link. Mp3 is prefered audio format",
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "volume", this.volume);
            Utilities.saveData(config.info.name, "musicLink", this.musicLink);
            this.updateMusic();
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
