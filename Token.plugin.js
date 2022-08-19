/**
 * @name Token
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.4
 * @invite SgKSKyh9gY
 * @description Get a option to copy your token by right clicking on home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Token.plugin.js
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
      name: "Token",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.4",
      description:
        "Get a option to copy your token by right clicking on home button.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/Token.plugin.js",
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
          "Get 2FA bitch (/≧▽≦)/",
        ],
      },
    ],
    main: "Token.plugin.js",
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
          ContextMenu,          
          Utilities,
          PluginUpdater,
          Logger,
          Toasts,
		  Settings: {SettingPanel, Switch},
          DiscordModules: { React },
        } = Library;
        const { clipboard } = require("electron");
        const TokenStore = WebpackModules.getByProps("getToken");
        const TokenIcon = (width, height) =>
          React.createElement(
            "svg",
            {
              viewBox: "0 0 24 24",
              width,
              height,
            },
            React.createElement("path", {
              style: {
                fill: "currentColor",
              },
              d: "M6.25 4.5C7.2165 4.5 8 5.2835 8 6.25V8H6.25C5.2835 8 4.5 7.2165 4.5 6.25C4.5 5.2835 5.2835 4.5 6.25 4.5ZM9.5 8V6.25C9.5 4.45507 8.04493 3 6.25 3C4.45507 3 3 4.45507 3 6.25C3 8.04493 4.45507 9.5 6.25 9.5H8V14.5H6.25C4.45507 14.5 3 15.9551 3 17.75C3 19.5449 4.45507 21 6.25 21C8.04493 21 9.5 19.5449 9.5 17.75V16H14.5V17.75C14.5 19.5449 15.9551 21 17.75 21C19.5449 21 21 19.5449 21 17.75C21 15.9551 19.5449 14.5 17.75 14.5H16V9.5H17.75C19.5449 9.5 21 8.04493 21 6.25C21 4.45507 19.5449 3 17.75 3C15.9551 3 14.5 4.45507 14.5 6.25V8H9.5ZM9.5 9.5H14.5V14.5H9.5V9.5ZM16 8V6.25C16 5.2835 16.7835 4.5 17.75 4.5C18.7165 4.5 19.5 5.2835 19.5 6.25C19.5 7.2165 18.7165 8 17.75 8H16ZM16 16H17.75C18.7165 16 19.5 16.7835 19.5 17.75C19.5 18.7165 18.7165 19.5 17.75 19.5C16.7835 19.5 16 18.7165 16 17.75V16ZM8 16V17.75C8 18.7165 7.2165 19.5 6.25 19.5C5.2835 19.5 4.5 18.7165 4.5 17.75C4.5 16.7835 5.2835 16 6.25 16H8Z",
            })
          );
        const SideBar = WebpackModules.getByProps("ListNavigatorItem");
        const ContextMenuAPI = (window.HomeButtonContextMenu ||= (() => {
          const items = new Map();
          function insert(id, item) {
            items.set(id, item);
          }
          function remove(id) {
            items.delete(id);
          }
          Patcher.after(SideBar, "ListNavigatorItem", (_, args, res) => {
            if (!args[0] || args[0].id !== "home") return res;
            let menu = Array.from(items.values());
            res.props.onContextMenu = (event) => {
              ContextMenu.openContextMenu(event, ContextMenu.buildMenu(menu));
            };
          });
          return {
            items,
            remove,
            insert,
          };
        })());
        return class Token extends Plugin {
          constructor() {
            super();
            this.showToast = Utilities.loadData(
              config.info.name,
              "showToast",
              true
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
            this.addMenu();
          }
          addMenu() {
            ContextMenuAPI.insert("copyToken", this.makeMenu());
          }
          makeMenu() {
            return {
              label: "Copy Token",
              id: "copy-token",
              icon: () => TokenIcon("20", "20"),
              action: async () => {
                try {
                  let token = await TokenStore.getToken();
                  if (!token) {
                    Logger.err(`Whoops! I couldn't find your token.`);
                    if (this.showToast)
                      Toasts.show(`Whoops! I couldn't find your token.`, {
                        icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_error_circle_24_regular.png",
                        timeout: 5000,
                        type: "error",
                      });
                    return;
                  }
                  clipboard.writeText(token);
                  if (this.showToast)
                    Toasts.show(`Token Copied to Clipboard.`, {
                      icon: "https://raw.githubusercontent.com/Tharki-God/files-random-host/main/ic_fluent_send_copy_24_regular.png",
                      timeout: 5000,
                      type: "success",
                    });
                } catch (err) {
                  Logger.err(err);
                  if (this.showToast)
                    Toasts.show(` Error: ${err}.`, {
                      icon: "https://cdn.discordapp.com/attachments/887750789781676092/990999807415955486/ic_fluent_error_circle_24_filled.png?size=4096",
                      timeout: 5000,
                      type: "error",
                    });
                }
              },
            };
          }
          onStop() {
            ContextMenuAPI.remove("copyToken");
          }
          getSettingsPanel() {
            return SettingPanel.build(
              this.saveSettings.bind(this),
              new Switch(
                "Popup/Toast",
                "Confirmation/Error message when copying token",
                this.showToast,
                (e) => {
                  this.showToast = e;
                }
              )
            );
          }
          saveSettings() {
            Utilities.saveData(config.info.name, "showToast", this.showToast);
          }
        };
        return plugin(Plugin, Library);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
