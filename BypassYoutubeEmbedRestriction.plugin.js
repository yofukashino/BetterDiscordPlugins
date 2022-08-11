/**
 * @name BypassYoutubeEmbedRestriction
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.3
 * @invite SgKSKyh9gY
 * @description Make youtube embed play regardless of restrictions.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BypassYoutubeEmbedRestriction.plugin.js
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
      name: "BypassYoutubeEmbedRestriction",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.3",
      description: "Make youtube embed play regardless of restrictions.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BypassYoutubeEmbedRestriction.plugin.js",
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
          "I love you Rajonna ☆*: .｡. o(≧▽≦)o .｡.:*☆",
        ],
      },
    ],
    main: "BypassYoutubeEmbedRestriction.plugin.js",
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
          Settings: { SettingPanel, Switch, Textbox },
        } = Library;
        const { MessageAccessories } =
          WebpackModules.getByProps("MessageAccessories");
        const { get } = require("request");
        const defaultInstance = "invidious.weblibre.org";
        return class BypassYoutubeEmbedRestriction extends Plugin {
          constructor() {
            super();
            this.replaceAllEmbeds = Utilities.loadData(
              config.info.name,
              "replaceAllEmbeds",
              false
            );
            this.invidiousInstance = Utilities.loadData(
              config.info.name,
              "invidiousInstance",
              defaultInstance
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
            this.patchEmbeds();
          }
          patchEmbeds() {
            Patcher.after(
              MessageAccessories.prototype,
              "render",
              (_, args, res) => {
                if (this.invidiousInstance == "") {
                  Logger.warn(
                    `Invalid or No instance link provided. Running on Default Indious Instance. (${defaultInstance})`
                  );
                  this.invidiousInstance = defaultInstance;
                }
                const children = res?.props?.children;
                if (!children || children.length < 9) {
                  return res;
                }
                const context = children[8];
                if (!context) {
                  return res;
                }
                const embeds = context?.props?.message?.embeds;
                if (!embeds || !embeds.length) {
                  return res;
                }
                for (const embed of embeds) {
                  const { video } = embed;
                  if (video) {
                    const { url } = video;
                    if (url && url.includes("youtube.com/embed/")) {
                      const replaceEmbed = () => {
                        const urlObject = new URL(url);
                        urlObject.hostname = this.invidiousInstance;
                        video.url = urlObject.toString();
                      };

                      if (this.replaceAllEmbeds) {
                        replaceEmbed();
                      } else {
                        get(url, async (error, response, body) => {
                          if (error) {
                            return Logger.err(error);
                          }
                          const contents = body.toString();
                          if (
                            contents.includes('name="robots" content="noindex"')
                          ) {
                            replaceEmbed();
                          }
                        });
                      }
                    }
                  }
                }

                return res;
              }
            );
          }
          onStop() {
            Patcher.unpatchAll();
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Replace all embeds",
                "Forward all embeds to Invidious without checking if it is blocked on YouTube",
                this.replaceAllEmbeds,
                (e) => {
                  this.replaceAllEmbeds = e;
                }
              ),
              new Textbox(
                "Invidious instance",
                `Invidious instance used in embeds. You can find other instances at https://api.invidious.io/`,
                this.invidiousInstance,
                (e) => {
                  this.invidiousInstance = e;
                },
                {
                  placeholder: `The default is ${defaultInstance}`,
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(
              config.info.name,
              "replaceAllEmbeds",
              this.replaceAllEmbeds
            );
            Utilities.saveData(
              config.info.name,
              "invidiousInstance",
              this.invidiousInstance
            );
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
