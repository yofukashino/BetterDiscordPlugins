/**
 * @name AtSomeone
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.0.0
 * @invite SgKSKyh9gY
 * @description Be able to ping a random person on the server by sending "@someone".
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/AtSomeone.plugin.js
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
        name: "AtSomeone",
        authors: [
          {
            name: "Ahlawat",
            discord_id: "1025214794766221384",
            github_username: "Tharki-God",
          },
        ],
        version: "1.0.0",
        description: "Be able to ping a random person on the server by sending \"@someone\".",
        github: "https://github.com/Tharki-God/BetterDiscordPlugins",
        github_raw:
          "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/AtSomeone.plugin.js",
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
            "Another Useless Plugin like the Author (⊙o⊙)",
          ],
        },
      ],
      main: "AtSomeone.plugin.js",
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
            Logger,
            PluginUpdater,
            DiscordModules: { GuildMemberStore },
          } = Library;
          const { type: Slate } = WebpackModules.getModule((m) =>
            m?.type?.render?.toString?.()?.includes?.("richValue")
          );
          const regEscape = (v) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          const interleave = (arr, thing) =>
            [].concat(...arr.map((n) => [n, thing])).slice(0, -1);
          const randomNo = (min, max) =>
            Math.floor(Math.random() * (max - min + 1) + min);
          return class AtSomeone extends Plugin {
            constructor() {
              super();
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
              this.applyPatch();
            }
            applyPatch() {
              Patcher.before(Slate, "render", (_, [args]) => {
                if (!args?.richValue?.some(({ children }) => children.some(({text}) => text?.toLowerCase().includes("@someone")))) return;
                args.richValue = args.richValue.map(({ children, type }) => ({
                  children: children
                    .map((m) => {
                      if (!m?.text?.toLowerCase().includes("@someone")) return m;
                      const splittedText = m?.text?.split(
                        new RegExp(regEscape("@someone"))
                      );
                      const textElementArray = splittedText.map((m) => ({
                        text: m,
                      }));
                      const guildMemberIds = args.channel.guild_id ? GuildMemberStore.getMemberIds(
                        args.channel.guild_id
                      ) : args.channel.recipients;
                      const randomIndexValue = randomNo(0, guildMemberIds.length - 1);
                      const randomMemberId = guildMemberIds[randomIndexValue];
                      return interleave(textElementArray, {
                        type: "userMention",
                        userId: randomMemberId ,
                        children: [{ text: "" }],
                      });
                    })
                    .flat(Infinity),
                  type,
                }));
              });
            }
            onStop() {
              Patcher.unpatchAll();
            }
          };
          return plugin(Plugin, Library);
        })(window.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  
