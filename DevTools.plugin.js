/**
 * @name DevTools
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.1
 * @invite SgKSKyh9gY
 * @description Get an option to open DevTools by right clicking on the home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DevTools.plugin.js
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
module.exports = ((_) => {
    const config = {
      info: {
        name: "DevTools",
        authors: [
          {
            name: "Ahlawat",
            discord_id: "887483349369765930",
            github_username: "Tharki-God",
          },
        ],
        version: "1.0.1",
        description:
          "Get an option to open DevTools by right clicking on the home button.",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DevTools.plugin.js",
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
            "Who uses web discord anyways (ノω<。)ノ))☆.。",
          ],
        },
        {
          title: "v1.0.1",
          items: ["Corrected text."],
        }
      ],
      main: "DevTools.plugin.js",
    };
    return !window.hasOwnProperty("ZeresPluginLibrary")
      ? class {
          load() {
            BdApi.showConfirmationModal(
              "ZLib Missing",
              `The library plugin (ZeresPluginLibrary) needed for ${config.info.name} is missing. Please click Download Now to install it.`,
              {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => this.downloadZLib(),
              }
            );
          }
          async downloadZLib() {
            const fs = require("fs");
            const path = require("path");
            const ZLib = await fetch(
              "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
            );
            if (!ZLib.ok) return this.errorDownloadZLib();
            const ZLibContent = await ZLib.text();
            try {
              await fs.writeFile(
                path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"),
                ZLibContent,
                (err) => {
                  if (err) return this.errorDownloadZLib();
                }
              );
            } catch (err) {
              return this.errorDownloadZLib();
            }
          }
          errorDownloadZLib() {
            const { shell } = require("electron");
            BdApi.showConfirmationModal(
              "Error Downloading",
              [
                `ZeresPluginLibrary download failed. Manually install plugin library from the link below.`,
              ],
              {
                confirmText: "Download",
                cancelText: "Cancel",
                onConfirm: () => {
                  shell.openExternal(
                    "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
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
            Logger,
            PluginUpdater,
            ReactTools,
            DiscordModules: { React },
          } = Library;
          const Dispatcher = WebpackModules.getByProps(
            "dispatch",
            "_actionHandlers");
          const tools = (width, height) =>
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
                d: "M3 3.05c-.619.632-1 1.496-1 2.45v11A3.5 3.5 0 0 0 5.5 20h7.014c.051-.252.144-.5.28-.736l.73-1.264H5.5A1.5 1.5 0 0 1 4 16.5V7h14v1.254a4.515 4.515 0 0 1 2-.245V5.5c0-.954-.381-1.818-1-2.45V3h-.05a3.489 3.489 0 0 0-2.45-1h-11c-.954 0-1.818.381-2.45 1H3v.05ZM19.212 9a3.496 3.496 0 0 1 .96.044l-1.651 2.858a1.167 1.167 0 1 0 2.02 1.167l1.651-2.859a3.501 3.501 0 0 1-2.975 5.762l-3.031 5.25a1.458 1.458 0 0 1-2.527-1.458l3.026-5.24A3.5 3.5 0 0 1 19.212 9Zm-8.91.243a.75.75 0 0 1-.045 1.06L7.86 12.5l2.397 2.197a.75.75 0 0 1-1.014 1.106l-3-2.75a.75.75 0 0 1 0-1.106l3-2.75a.75.75 0 0 1 1.06.046Zm2.955 6.56 2.02-1.852a4.495 4.495 0 0 1-.008-2.91l-2.012-1.844a.75.75 0 0 0-1.014 1.106L14.64 12.5l-2.397 2.197a.75.75 0 0 0 1.014 1.106Z",
              })
            );          
          const defaultSettings = {
            showToast: true,
            normalizeAddress: true,
          };
          const GuildNav = WebpackModules.getModule((m) =>
          m?.type?.toString?.()?.includes("guildsnav")
        );
          const { tutorialContainer } = WebpackModules.getByProps(
            "homeIcon",
            "tutorialContainer"
          );
          const NavBar = WebpackModules.getByProps("guilds", "base");       
          const ContextMenuAPI = (window.HomeButtonContextMenu ||= (() => {
            const items = new Map();
            function insert(id, item) {
              items.set(id, item);
              forceUpdate();
            }
            function remove(id) {
              items.delete(id);
              forceUpdate();
            }
            function forceUpdate() {
              const toForceUpdate = ReactTools.getOwnerInstance(
                document.querySelector(`.${NavBar.guilds}`)
              );
              const original = toForceUpdate.render;
              toForceUpdate.render = function forceRerender() {
                original.call(this);
                toForceUpdate.render = original;
                return null;
              };
              toForceUpdate.forceUpdate(() =>
                toForceUpdate.forceUpdate(() => {})
              );
            }
            Patcher.after(GuildNav, "type",  (_, args, res) => {
              const HomeButton = document.querySelector(`.${tutorialContainer}`);
              const HomeButtonContextMenu = Array.from(items.values()).sort(
                (a, b) => a.label.localeCompare(b.label)
              );
              if (!HomeButton || !HomeButtonContextMenu) return;            
              HomeButton.firstChild.oncontextmenu = (event) => {
                ContextMenu.openContextMenu(
                  event,
                  ContextMenu.buildMenu(HomeButtonContextMenu)
                );
              };
             });          
            return {
              items,
              remove,
              insert,
              forceUpdate,
            };
          })());
          return class Address extends Plugin {
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
            onStart() {
              this.checkForUpdates();
              this.addMenu();
            }
            addMenu() {
              ContextMenuAPI.insert("devTools", this.makeMenuItem());
            }
            makeMenuItem() {
              return {
                label: "Open DevTools",
                id: "dev-tools",
                icon: () => tools("20", "20"),
                action: async () => {
                    Dispatcher.dispatch({
                        type: "DEV_TOOLS_SETTINGS_UPDATE",
                        settings: {
                            devToolsEnabled: !0,
                            displayTools: !0,
                            showDevWidget: !0
                        }
                    })
                },
              };
            }
            onStop() {
                ContextMenuAPI.remove("devTools");
              }    
          };
          return plugin(Plugin, Library);
        })(window.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  
