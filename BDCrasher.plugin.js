/**
 * @name BDCrasher
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.0
 * @invite SgKSKyh9gY
 * @description Get a option to open crash better discord loading vanilla discord by right clicking on home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDCrasher.plugin.js
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
        name: "BDCrasher",
        authors: [
          {
            name: "Ahlawat",
            discord_id: "887483349369765930",
            github_username: "Tharki-God",
          },
        ],
        version: "1.0.0",
        description:
          "Get a option to open crash better discord loading vanilla discord by right clicking on home button.",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BDCrasher.plugin.js",
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
            "i want a gf.! (。_。)",
          ],
        },
      ],
      main: "BDCrasher.plugin.js",
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
            PluginUpdater,
            Logger,
            DiscordModules: { React },
          } = Library;
          const reload = (width, height) =>
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
                d: "M7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 5a1 1 0 0 0 1 1h6a1 1 0 1 0 0-2H9a1 1 0 0 0-1 1ZM5 8a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1ZM19 8a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1ZM9 20a1 1 0 1 1 0-2h6a1 1 0 1 1 0 2H9ZM5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM21 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM19 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
              })
            );
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
          return class BDCrasher extends Plugin {
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
              ContextMenuAPI.insert("bdCrasher", this.makeMenu());
            }
            makeMenu() {
              return {
                label: "Crash Better Discord",
                id: "crash-better-discord",
                icon: () => reload("20", "20"),
                action: async () => {
                  process.abort(0);
                },
              };
            }        
            onStop() {
              ContextMenuAPI.remove("bdCrasher");
            }
          };
          return plugin(Plugin, Library);
        })(window.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  