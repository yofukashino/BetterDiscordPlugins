/**
 * @name MentionCacheFix
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.1
 * @invite SgKSKyh9gY
 * @description Fix uncached user mentions including in embeds.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MentionCacheFix.plugin.js
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
      name: "MentionCacheFix",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "887483349369765930",
          github_username: "Tharki-God",
        },
      ],
      version: "1.0.1",
      description: "Fix uncached user mentions including in embeds.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MentionCacheFix.plugin.js",
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
          "Why, WHY... WHY（⊙ｏ⊙）",
        ],
      },
    ],
    main: "MentionCacheFix.plugin.js",
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
          PluginUpdater,
          Logger,
          Patcher,
          ReactTools,
          DiscordModules: { GuildMemberStore, SelectedGuildStore },
        } = Library;
        const ProfileStore = WebpackModules.getByProps("getUser");
        const prase = WebpackModules.getByProps("parse", "parseTopic");
        const SlateMention = WebpackModules.getByProps("UserMention");
        return class MentionCacheFix extends Plugin {
          constructor() {
            super();
            this.checkingMessages = new Set();
            this.cachedMembers = new Set();
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
            this.patchUserMentions();
            this.patchMessage();
            this.patchTopic();
          }
          isCached(id) {
            const guildId = SelectedGuildStore.getGuildId();
            return (
              this.cachedMembers.has(`${id}-${guildId}`) ||
              !!GuildMemberStore.getMember(guildId, id)
            );
          }
          fetchUser(id, retry = false) {
            if (this.isCached(id)) return;
            const guildId = SelectedGuildStore.getGuildId();
            const fn = retry
              ? ProfileStore.getUser(id)
              : ProfileStore.fetchProfile(id, {
                  guildId,
                  withMutualGuilds: false,
                });
            return fn
              .then((x) => {
                if (retry || (!retry && !x.guild_member))
                  this.cachedMembers.add(`${id}-${guildId}`);
                return false;
              })
              .catch((e) => {
                if (e && e.status === 429) return true; // Abort if ratelimited
                else if (e?.status === 403 && !retry)
                  return this.fetchUser(id, true);
                else this.cachedMembers.add(`${id}-${guildId}`);

                return;
              });
          }
          async processMatches(matches, updateInfo) {
            for (const id of matches) {
              const abort = await this.fetchUser(id);
              if (abort) break;
              this.update(updateInfo);
            }
          }
          update(updateInfo) {
            switch (updateInfo) {
              case "topic":
                ReactTools.getStateNodes(document.querySelector(".topic-11NuQZ"))[0]?.forceUpdate();
                break;
              default: // Message
              ReactTools.getOwnerInstance(document.querySelector(`#chat-messages-${updateInfo} .contents-2MsGLg`))?.forceUpdate();
              ReactTools.getStateNodes(document.querySelector(`#message-accessories-${updateInfo} > article`))[0]?.forceUpdate();       
            }
          }
          getIDsFromText(text) {
            return [...text.matchAll(/<@!?(\d+)>/g)]
              .map((m) => m[1])
              .filter((id, i, arr) => arr.indexOf(id) === i)
              .filter((id) => !this.isCached(id));
          }
          getMatches(message) {
            const content = [message.content];
            message.embeds.forEach((embed) => {
              content.push(embed.rawDescription || "");
              if (embed.fields)
                embed.fields.forEach((field) => content.push(field.rawValue));
            });
            return this.getIDsFromText(content.join(" "));
          }
          patchUserMentions() {            
            Patcher.after(SlateMention, "UserMention", (_, [{ id }], res) => {
              this.fetchUser(id);
              return res;
            });
          }
          patchMessage() {
            const Message = WebpackModules.getModule(m => m.type && m.type.toString().indexOf('useContextMenuMessage') > -1, false)[0];
            Patcher.after(Message, "type", (_, [props], res) => {
              const message = props.message;
              if (!message) return res;
              const el = document.getElementById(`chat-messages-${message.id}`);
              if (!el) return res;
              el.addEventListener("mouseleave", () => {
                if (!this.checkingMessages.has(message.id)) return;
                this.checkingMessages.delete(message.id);
                this.update(message.id);
              });
              el.addEventListener(
                "mouseenter",
                () => {
                  if (this.checkingMessages.has(message.id)) return;
                  this.checkingMessages.add(message.id);
                  this.update(message.id);
                  const matches = this.getMatches(message);
                  this.processMatches(matches, message.id);
                },
                true
              );
              return res;
            });
          }
          patchTopic() {
            Patcher.instead(prase, "parseTopic", (_, [content], res) => {
              const matches = this.getIDsFromText(content);
              this.processMatches(matches, "topic");
              return res;
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
