/**
 * @name FriendInvites
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.0
 * @invite SgKSKyh9gY
 * @description Get an option to manage friend invites of your account by right clicking on the home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/FriendInvites.plugin.js
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
      name: "FriendInvites",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.0",
      description:
        "Get an option to manage friend invites of your account by right clicking on the home button.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/FriendInvites.plugin.js",
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
          "You Have friends? DAMN φ(゜▽゜*)♪",
        ],
      },
      {
        title: "v1.2.1",
        items: ["Corrected text."],
      },
    ],
    main: "FriendInvites.plugin.js",
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
      for (const Lib of RequiredLibs.filter(lib =>  !window.hasOwnProperty(lib.window)))
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
        ContextMenu,
        Modals,
        Utilities,
        Logger,
        PluginUpdater,
        Toasts,
        Settings: { SettingPanel, Switch },
        DiscordModules: { InviteResolver },
      } = ZLibrary;
      const { 
        HBCM, 
        LibraryIcons, 
        LibraryModules: { DiscordNative: { clipboard } }
      } = BunnyLib.build(config);
      const defaultSettings = {
        showToast: true,
      };     
      return class FriendInvites extends Plugin {
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
          this.initiate();
        }
        async initiate() {
          HBCM.insert(config.info.name, await this.friendInvites());
        }
        async friendInvites() {
          return {
            label: "Friend Invites",
            id: "friend-invites",
            action: async () => {
              try {
                const { code } = await InviteResolver.createFriendInvite();
                Logger.info(`${code} is your friend invite.`);
                clipboard.copy(`https://discord.gg/${code}`);
                await this.initiate();
                if (this.settings["showToast"])
                  Toasts.show(
                    `Friend Invite Generated and Copied to Clipboard.`,
                    {
                      icon: "https://tharki-god.github.io/files-random-host/ic_fluent_send_copy_24_regular.png",
                      timeout: 5000,
                      type: "success",
                    }
                  );
              } catch (err) {
                Logger.err(err);
                if (this.settings["showToast"])
                  Toasts.show(` Error: ${err}.`, {
                    icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                    timeout: 5000,
                    type: "error",
                  });
              }
            },
            children: ContextMenu.buildMenuChildren([
              {
                label: "Generate and Copy New Friend Invite",
                id: "generate-and-cody-friend-invite",
                children: await this.mapInvites(),
                action: async () => {
                  try {
                    const { code } =
                      await InviteResolver.createFriendInvite();
                    Logger.info(
                      `https://discord.gg/${code} is your friend invite.`
                    );
                    clipboard.copy(`https://discord.gg/${code}`);
                    await this.initiate();
                    if (this.settings["showToast"])
                      Toasts.show(
                        `Friend Invite Generated and Copied to Clipboard.`,
                        {
                          icon: "https://tharki-god.github.io/files-random-host/ic_fluent_send_copy_24_regular.png",
                          timeout: 5000,
                          type: "success",
                        }
                      );
                  } catch (err) {
                    Logger.err(err);
                    if (this.settings["showToast"])
                      Toasts.show(` Error: ${err}.`, {
                        icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                        timeout: 5000,
                        type: "error",
                      });
                  }
                },
              },
              {
                label: "View All Friend Invites",
                id: "view-all-friend-invite",
                icon: () => LibraryIcons.ViewAll("20", "20"),
                action: async () => {
                  this.showAllInvites();
                },
              },
              {
                label: "Delete All Friend Invites",
                id: "delete-friend-invite",
                icon: () => LibraryIcons.Trash("20", "20"),
                action: () => {
                  this.showDeleteConfirmation();
                },
              },
            ]),
          };
        }
        async showAllInvites() {
          try {
            const invites = await InviteResolver.getAllFriendInvites();
            if (invites.length === 0) {
              if (this.settings["showToast"])
                Toasts.show(`You have no friend invites.`, {
                  icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                  timeout: 5000,
                  type: "error",
                });
              return;
            }
            Modals.showAlertModal(
              "All your Friend Invites",
              invites
                .map(
                  (invite, index) =>
                    `***${++index}.*** **Code:**  https://discord.gg/${invite.code
                    } \n\n **Created At:**  ${new Date(
                      invite.created_at
                    ).toLocaleDateString()} ${new Date(invite.created_at)
                      .toLocaleTimeString([], {
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .toUpperCase()} \n\n **Expire At:**  ${new Date(
                        invite.expires_at
                      ).toLocaleDateString()} ${new Date(invite.expires_at)
                        .toLocaleTimeString([], {
                          hour12: true,
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .toUpperCase()}`
                )
                .join("\n\n\n\n\n\n")
            );
          } catch (err) {
            Logger.err(err);
            if (this.settings["showToast"])
              Toasts.show(` Error: ${err}.`, {
                icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                timeout: 5000,
                type: "error",
              });
          }
        }
        showDeleteConfirmation() {
          Modals.showConfirmationModal(
            "Are you sure?",
            "By confirming, you will make all of your friend invites invalid.\nDo you still wish to proceed?",
            {
              danger: true,
              confirmText: "DELETE ALL",
              cancelText: "Go back",
              onConfirm: async () => {
                try {
                  await InviteResolver.revokeFriendInvites();
                  await this.initiate();
                  if (this.settings["showToast"])
                    Toasts.show(`Successfully deleted all of your links`, {
                      icon: "https://tharki-god.github.io/files-random-host/ic_fluent_delete_24_filled.png",
                      timeout: 5000,
                      type: "error",
                    });
                } catch (err) {
                  Logger.err(err);
                  if (this.settings["showToast"])
                    Toasts.show(` Error: ${e}.`, {
                      icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                      timeout: 5000,
                      type: "error",
                    });
                }
              },
            }
          );
        }
        async mapInvites() {
          try {
            const invites = await InviteResolver.getAllFriendInvites();
            if (invites.length === 0)
              return ContextMenu.buildMenuChildren([
                {
                  id: "no-invites",
                  action: async () => await this.initiate(),
                  icon: () => LibraryIcons.ClipboardError("20", "20"),
                  label: "You have no friend invites.",
                },
              ]);
            let mapped = invites.map((i) => {
              return {
                id: i.code,
                label: i.code,
                icon: () => LibraryIcons.Clipboard("20", "20"),
                action: async () => {
                  try {
                    clipboard.copy(`https://discord.gg/${i.code}`);
                    if (this.settings["showToast"])
                      Toasts.show(`Friend Invite Copied to Clipboard.`, {
                        icon: "https://tharki-god.github.io/files-random-host/ic_fluent_send_copy_24_regular.png",
                        timeout: 5000,
                        type: "success",
                      });
                    await this.initiate();
                  } catch (err) {
                    Logger.err(err);
                    if (this.settings["showToast"])
                      Toasts.show(`Error: ${e}.`, {
                        icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                        timeout: 5000,
                        type: "error",
                      });
                  }
                },
              };
            });
            return ContextMenu.buildMenuChildren(mapped);
          } catch (err) {
            Logger.err(err);
            if (this.settings["showToast"])
              Toasts.show(`Error: ${err}.`, {
                icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                timeout: 5000,
                type: "error",
              });
            return ContextMenu.buildMenuChildren([
              {
                id: "failed-to-get-invites",
                icon: () => LibraryIcons.ClipboardError("20", "20"),
                label: "Failed to get your links.",
              },
            ]);
          }
        }
        onStop() {
          HBCM.remove(config.info.name);
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "Pop-up/Toast",
              "Display error/success toast.",
              this.settings["showToast"],
              (e) => {
                this.settings["showToast"] = e;
              }
            )
          );
        }
        saveSettings() {
          Utilities.saveData(config.info.name, "settings", this.settings);
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
