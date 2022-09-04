/**
 * @name SlowModeConfirmation
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.7
 * @invite SgKSKyh9gY
 * @description Warns you before sending a Message about slowmode.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/SlowModeConfirmation.plugin.js
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
module.exports = ((_) => {
  const config = {
    info: {
      name: "SlowModeConfirmation",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.7",
      description: "Warns you before sending a Message about slowmode.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/SlowModeConfirmation.plugin.js",
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
          "Mommy loves me ψ(｀∇´)ψ",
        ],
      },
    ],
    main: "SlowModeConfirmation.plugin.js",
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
          Patcher,
          Utilities,
          PluginUpdater,
          Logger,
          Settings: { SettingPanel, Slider },
          DiscordModules: { DiscordConstants },
        } = Library;
        const ChannelPermissionStore = WebpackModules.getByProps(
          "getChannelPermissions"
        );
        const warningStore = WebpackModules.getByProps("RESTRICTIONS");
        return class SlowModeConfirmation extends Plugin {
          constructor() {
            super();
            this.slowmodeTrigger = Utilities.loadData(
              config.info.name,
              "slowmodeTrigger",
              600
            );
            this.warning = {
              analyticsType: config.info.name,
              check: (_, channel) => {
                if (
                  !this.hasPermissions(channel) &&
                  this.checkCooldown(channel) > this.slowmodeTrigger
                )
                  return {
                    body: `This will put you in Slowmode, continue?`,
                    footer: `${this.toDaysMinutesSeconds(
                      this.checkCooldown(channel)
                    )} seconds slowdown!`,
                  };
                else return false;
              },
            };
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
            this.addWarning();
          }
          addWarning() {
            warningStore.RESTRICTIONS.push(this.warning);
          }
          hasPermissions(channel) {
            if (
              ChannelPermissionStore.can(
                DiscordConstants.Permissions.MANAGE_MESSAGES,
                channel
              ) ||
              ChannelPermissionStore.can(
                DiscordConstants.Permissions.MANAGE_CHANNELS,
                channel
              )
            ) {
              return true;
            } else return false;
          }
          checkCooldown(channel) {
            return channel.rateLimitPerUser;
          }
          toDaysMinutesSeconds(totalSeconds) {
            const seconds = Math.floor(totalSeconds % 60);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const days = Math.floor(totalSeconds / (3600 * 24));
            const secondsStr = this.makeHumanReadable(seconds, "second");
            const minutesStr = this.makeHumanReadable(minutes, "minute");
            const hoursStr = this.makeHumanReadable(hours, "hour");
            const daysStr = this.makeHumanReadable(days, "day");
            return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(
              /,\s*$/,
              ""
            );
          }
          makeHumanReadable(num, singular) {
            return num > 0
              ? num + (num === 1 ? ` ${singular}, ` : ` ${singular}s, `)
              : "";
          }
          onStop() {
            const index = warningStore.RESTRICTIONS.indexOf(this.warning);
            if (index > -1) {
              warningStore.RESTRICTIONS.splice(index, 1);
            }
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Slider(
                "Slowmode Trigger",
                "The Time in mins to get confirmation if Slow mode is more than it.",
                0.5,
                30,
                this.slowmodeTrigger / 60,
                (e) => {
                  this.slowmodeTrigger = e * 60;
                },
                {
                  markers: [0.5, 1, 2.5, 5, 10, 15, 20, 25, 30],
                  stickToMarkers: true,
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(
              config.info.name,
              "slowmodeTrigger",
              this.slowmodeTrigger
            );
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
