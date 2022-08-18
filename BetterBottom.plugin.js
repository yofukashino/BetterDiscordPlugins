/**
 * @name BetterBottom
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.2
 * @invite SgKSKyh9gY
 * @description Adds a slash command to send random cursed gif.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterBottom.plugin.js
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
      name: "BetterBottom",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.2",
      description: "Adds a slash command to send random cursed gif.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterBottom.plugin.js",
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
          "Getting cursed is part of life ￣へ￣",
        ],
      },
    ],
    main: "BetterBottom.plugin.js",
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
          WebpackModules,
          Logger,
          PluginUpdater,
          Utilities,
          Patcher,
          DiscordModules: { MessageActions, DiscordConstants },
          Settings: { SettingPanel, Switch, Textbox },
        } = Library;
        const { get } = require("request");
        const SlashCommandsStore =
          WebpackModules.getByProps("BUILT_IN_COMMANDS");
        return class BetterBottom extends Plugin {
          constructor() {
            super();
            this.encoder = Utilities.loadData(
              config.info.name,
              "encoder",
              true
            );
            this.decoder = Utilities.loadData(
              config.info.name,
              "decoder",
              true
            );
            this.split = Utilities.loadData(config.info.name, "split", true);
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
            if (this.encoder) this.addEncoder();
            if (this.decoder) this.addDecoder();
          }
          addEncoder() {
            SlashCommandsStore.BUILT_IN_COMMANDS.push({
              __registerId: config.info.name,
              applicationId: "-1",
              name: "bottom encode",
              displayName: "bottom encode",
              description: "Convert text to bottom.",
              id: (-1 - SlashCommandsStore.BUILT_IN_COMMANDS.length).toString(),
              type: 1,
              target: 1,
              predicate: () => true,
              execute: ([toEncode], { channel }) => {
                try {
                  get(
                    `https://bottom.daggy.workers.dev/encode?text=${toEncode.value}`,
                    async (error, response, body) => {
                      if (error) {
                        Logger.err(error);
                        return MessageActions.sendBotMessage(
                          channel.id,
                          "Could Not convert the text to bottom."
                        );
                      }
                      const encodedObject = JSON.parse(body);

                      if (encodedObject.message)
                        return MessageActions.sendBotMessage(
                          channel.id,
                          encodedObject.message
                        );
                      if (
                        this.split &&
                        encodedObject.encoded?.length >
                          DiscordConstants.MAX_MESSAGE_LENGTH
                      ) {
                        let characterLimit = new RegExp(
                          `.{1,${DiscordConstants.MAX_MESSAGE_LENGTH}}`,
                          "g"
                        );
                        const splitMessages =
                          encodedObject.encoded.match(characterLimit);
                        for (const message of splitMessages) {
                          MessageActions.sendMessage(
                            channel.id,
                            {
                              content: message,
                              tts: false,
                              bottom: true,
                              invalidEmojis: [],
                              validNonShortcutEmojis: [],
                            },
                            undefined,
                            {}
                          );
                        }
                        return;
                      }
                      MessageActions.sendMessage(
                        channel.id,
                        {
                          content: encodedObject.encoded,
                          tts: false,
                          bottom: true,
                          invalidEmojis: [],
                          validNonShortcutEmojis: [],
                        },
                        undefined,
                        {}
                      );
                    }
                  );
                } catch (error) {
                  logger.err(error);
                }
              },
              options: [
                {
                  description: "The text you want to encode.",
                  displayDescription: "The text you want to encode.",
                  displayName: "Text",
                  name: "Text",
                  required: true,
                  type: 3,
                },
              ],
            });
          }
          addDecoder() {
            SlashCommandsStore.BUILT_IN_COMMANDS.push({
              __registerId: config.info.name,
              applicationId: "-1",
              name: "bottom decode",
              displayName: "bottom decode",
              description: "Convert bottom to text for understanding.",
              id: (-1 - SlashCommandsStore.BUILT_IN_COMMANDS.length).toString(),
              type: 1,
              target: 1,
              predicate: () => true,
              execute: ([toDecode], { channel }) => {
                try {
                  get(
                    `https://bottom.daggy.workers.dev/decode?bottom=${toDecode.value}`,
                    async (error, response, body) => {
                      if (error) {
                        Logger.err(error);
                        return MessageActions.sendBotMessage(
                          channel.id,
                          "Could Not convert the bottom to text."
                        );
                      }
                      const decodedObject = JSON.parse(body);
                      if (decodedObject.message)
                        return MessageActions.sendBotMessage(
                          channel.id,
                          decodedObject.message
                        );
                      if (
                        this.split &&
                        decodedObject.decoded?.length >
                          DiscordConstants.MAX_MESSAGE_LENGTH
                      ) {
                        let characterLimit = new RegExp(
                          `.{1,${DiscordConstants.MAX_MESSAGE_LENGTH}}`,
                          "g"
                        );
                        const splitMessages =
                          decodedObject.decoded.match(characterLimit);
                        for (const message of splitMessages) {
                          MessageActions.sendMessage(
                            channel.id,
                            {
                              content: message,
                              tts: false,
                              bottom: true,
                              invalidEmojis: [],
                              validNonShortcutEmojis: [],
                            },
                            undefined,
                            {}
                          );
                        }
                        return;
                      }
                      MessageActions.sendMessage(
                        channel.id,
                        {
                          content: decodedObject.decoded,
                          tts: false,
                          bottom: true,
                          invalidEmojis: [],
                          validNonShortcutEmojis: [],
                        },
                        undefined,
                        {}
                      );
                    }
                  );
                } catch (error) {
                  logger.err(error);
                }
              },
              options: [
                {
                  description: "The Bottom you want to decode.",
                  displayDescription: "The Bottom you want to decode.",
                  displayName: "Bottom",
                  name: "Bottom",
                  required: true,
                  type: 3,
                },
              ],
            });
          }
          onStop() {
            this.unregisterAllCommands(config.info.name);
          }
          unregisterAllCommands(caller) {
            let index = SlashCommandsStore.BUILT_IN_COMMANDS.findIndex(
              (cmd) => cmd.__registerId === caller
            );
            while (index > -1) {
              SlashCommandsStore.BUILT_IN_COMMANDS.splice(index, 1);
              index = SlashCommandsStore.BUILT_IN_COMMANDS.findIndex(
                (cmd) => cmd.__registerId === caller
              );
            }
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Encode",
                "Enable Command to encode bottom.",
                this.encoder,
                (e) => {
                  this.encoder = e;
                }
              ),
              new Switch(
                "Decode",
                "Enable Command to decode bottom.",
                this.decoder,
                (e) => {
                  this.decoder = e;
                }
              ),
              new Switch(
                "Split Message",
                "Split into multiple message if larger than character limit.",
                this.split,
                (e) => {
                  this.split = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "encoder", this.encoder);
            Utilities.saveData(config.info.name, "decoder", this.decoder);
            Utilities.saveData(config.info.name, "split", this.split);
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
