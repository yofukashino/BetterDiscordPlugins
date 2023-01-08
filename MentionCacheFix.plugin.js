/**
 * @name MentionCacheFix
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.1
 * @invite SgKSKyh9gY
 * @description Fix uncached user mentions, including in embeds.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/MentionCacheFix.plugin.js
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
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.1",
      description: "Fix uncached user mentions, including in embeds.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/MentionCacheFix.plugin.js",
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
      {
        title: "v1.1.1",
        items: [
          "Plugin Working again",
        ],
      },
    ],
    main: "MentionCacheFix.plugin.js",
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
  },
  ];
  class handleMissingLibrarys {
    load() {
      for (const Lib of RequiredLibs.filter(lib => !window.hasOwnProperty(lib.window)))
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
        PluginUpdater,
        Logger,
        Patcher,
        ReactTools,
        DiscordModules: { GuildMemberStore, SelectedGuildStore },
      } = ZLibrary;
      const {
        LibraryModules: {
          Slate,
          Praser,
          Message,
          ProfileStore
        }
      } = BunnyLib.build(config);
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
        async processMatches(matches, updateInfo, channelId) {
          for (const id of matches) {
            const abort = await this.fetchUser(id);
            if (abort) break;
            this.update(updateInfo, channelId);
          }
        }
        update(updateInfo, channelId) {
          switch (updateInfo) {
            case "topic":
              const channelTopic = document.querySelector(".topic-11NuQZ");
              if (channelTopic)
                ReactTools.getOwnerInstance(
                  channelTopic
                )?.forceUpdate();
              break;
            default: // Message  
              const messageContent = document.querySelector(
                `#chat-messages-${channelId}-${updateInfo}  > div > div.contents-2MsGLg`
              )
              if (messageContent)
                ReactTools.getOwnerInstance(
                  messageContent
                )?.forceUpdate();
              const messageAccessories = document.querySelector(
                `#message-accessories-${updateInfo} > article`
              );
              if (messageAccessories)
                ReactTools.getOwnerInstance(
                  messageAccessories
                )?.forceUpdate();
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
          Patcher.before(Slate, "render", (_, [{ textValue }]) => {
            const mentions = this.getIDsFromText(textValue);
            for (const id of mentions) {
              this.fetchUser(id);
            }
          });
        }
        patchMessage() {
          Patcher.after(
            Message,
            "ZP",
            (_, [{ message, isInteracting }], res) => {
              if (!isInteracting) {
                if (!this.checkingMessages.has(message.id)) return;
                this.checkingMessages.delete(message.id);
                this.update(message.id, message.channel_id);
              }
              if (isInteracting) {
                if (this.checkingMessages.has(message.id)) return;
                this.checkingMessages.add(message.id);
                this.update(message.id, message.channel_id);
                const matches = this.getMatches(message);
                this.processMatches(matches, message.id, message.channel_id);
              }
            }
          );
        }
        patchTopic() {
          Patcher.before(Praser, "parseTopic", (_, [content]) => {
            const matches = this.getIDsFromText(content);
            this.processMatches(matches, "topic");
          });
        }
        onStop() {
          Patcher.unpatchAll();
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
