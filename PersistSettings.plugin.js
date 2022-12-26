/**
 * @name PersistSettings
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.0
 * @invite SgKSKyh9gY
 * @description Backs up your settings and restores them in case Discord clears them after logging out or for other reasons.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/PersistSettings.plugin.js
 */
/* PersistSettings, a powercord/replugged plugin to make sure you never lose your favourites again!
 * Copyright (C) 2021 Vendicated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Ported to BetterDiscord
 * Copyright 2022 Ahlawat
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
      name: "PersistSettings",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.0",
      description:
        "Backs up your settings and restores them in case Discord clears them after logging out or for other reasons",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/PersistSettings.plugin.js",
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
          "Fuck You Discord (>'-'<)",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Bug Fixes", "Library Handler fixed"],
      },
      {
        title: "v1.2.1",
        items: [
          "Fixed some bugs",
          "its recommended to delete config file and restart discord.",
        ],
      },
    ],
    main: "PersistSettings.plugin.js",
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
        const { PluginUpdater, Logger, Utilities } = ZLibrary;
        const { 
          LibraryModules: { 
              Dispatcher,
              ExperimentsStore,
              NotificationStore,
              AccessibilityStore,
              KeybindStore,
              MediaEngineStore
           } 
      } = BunnyLib.build(config);          
        const AccessiblityEvents = Object.freeze([
          "ACCESSIBILITY_SET_MESSAGE_GROUP_SPACING",
          "ACCESSIBILITY_SET_PREFERS_REDUCED_MOTION",
          "ACCESSIBILITY_DESATURATE_ROLES_TOGGLE",
          "ACCESSIBILITY_DARK_SIDEBAR_TOGGLE",
          "ACCESSIBILITY_SET_SATURATION",
          "ACCESSIBILITY_SET_FONT_SIZE",
          "ACCESSIBILITY_SET_ZOOM",
        ]);
        const VoiceEvents = Object.freeze([
          "AUDIO_SET_DISPLAY_SILENCE_WARNING",
          "AUDIO_SET_AUTOMATIC_GAIN_CONTROL",
          "MEDIA_ENGINE_SET_HARDWARE_H264",
          "MEDIA_ENGINE_SET_VIDEO_DEVICE",
          "AUDIO_SET_NOISE_SUPPRESSION",
          "AUDIO_SET_ECHO_CANCELLATION",
          "MEDIA_ENGINE_SET_OPEN_H264",
          "MEDIA_ENGINE_SET_AEC_DUMP",
          "AUDIO_SET_OUTPUT_VOLUME",
          "AUDIO_SET_OUTPUT_DEVICE",
          "AUDIO_SET_INPUT_DEVICE",
          "AUDIO_SET_ATTENUATION",
          "AUDIO_SET_MODE",
          "AUDIO_SET_QOS",
        ]);
        const NotificationEvents = Object.freeze([
          "NOTIFICATIONS_SET_DISABLE_UNREAD_BADGE",
          "NOTIFICATIONS_SET_PERMISSION_STATE",
          "NOTIFICATIONS_SET_DISABLED_SOUNDS",
          "NOTIFICATIONS_SET_TASKBAR_FLASH",
          "NOTIFICATIONS_SET_DESKTOP_TYPE",
          "NOTIFICATIONS_SET_TTS_TYPE",
        ]);
        const KeybindEvents = Object.freeze([
          "KEYBINDS_ADD_KEYBIND",
          "KEYBINDS_SET_KEYBIND",
          "KEYBINDS_DELETE_KEYBIND",
          "KEYBINDS_ENABLE_ALL_KEYBINDS",
        ]);   
        return class PersistSettings extends Plugin {
          constructor(...args) {
            super(...args);
            this.restore = this.restore.bind(this);
            this.backupVoice = this.backupVoice.bind(this);
            this.backupKeybinds = this.backupKeybinds.bind(this);
            this.backupSettings = this.backupSettings.bind(this);
            this.backupExperiments = this.backupExperiments.bind(this);
            this.backupAccessibility = this.backupAccessibility.bind(this);
            this.backupNotifications = this.backupNotifications.bind(this);
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
            this.addListeners();
          }
          addListeners() {
            Dispatcher.subscribe("CONNECTION_OPEN", this.restore);
            Dispatcher.subscribe("USER_SETTINGS_UPDATE", this.backupSettings);
            Dispatcher.subscribe(
              "EXPERIMENT_OVERRIDE_BUCKET",
              this.backupExperiments
            );
            for (const event of KeybindEvents) {
              Dispatcher.subscribe(event, this.backupKeybinds);
            }
            for (const event of AccessiblityEvents) {
              Dispatcher.subscribe(event, this.backupAccessibility);
            }
            for (const event of VoiceEvents) {
              Dispatcher.subscribe(event, this.backupVoice);
            }
            for (const event of NotificationEvents) {
              Dispatcher.subscribe(event, this.backupNotifications);
            }
            setTimeout(() => this.didRestore || this.restore(), 1000 * 10);
          }

          backupKeybinds() {
            const keybinds = KeybindStore.__getLocalVars().keybinds;
            Utilities.saveData(config.info.name, "keybinds", keybinds);
          }
          backupAccessibility() {
            const accessibility = AccessibilityStore.__getLocalVars().state;
            Utilities.saveData(
              config.info.name,
              "accessibility",
              accessibility
            );
          }
          backupNotifications() {
            const notifications = NotificationStore.__getLocalVars().state;
            Utilities.saveData(
              config.info.name,
              "notifications",
              notifications
            );
          }
          backupExperiments() {
            const experiments =
              ExperimentsStore.__getLocalVars()?.experimentOverrides;
            Utilities.saveData(config.info.name, "experiments", experiments);
          }
          backupVoice() {
            const voice = MediaEngineStore.__getLocalVars()?.settingsByContext.default;
            Utilities.saveData(config.info.name, "voice", voice);
          }
          backupSettings() {
            this.backupVoice();
            this.backupKeybinds();
            this.backupExperiments();
            this.backupAccessibility();
            this.backupNotifications();
          }
          restore() {
            this.didRestore = true;
            this.restoreVoice();
            this.restoreKeybinds();
            this.restoreExperiments();
            this.restoreAccessibility();
            this.restoreNotifications();
          }

          restoreKeybinds() {
            const backup = Utilities.loadData(
              config.info.name,
              "keybinds",
              false
            );

            if (!backup) return void this.backupKeybinds();
            const keybinds = KeybindStore.__getLocalVars().keybinds;
            for (const state in keybinds) {
              if (!backup[state])
              delete keybinds[state]
            }
            for (const state in backup) {
              Object.defineProperty(keybinds, state, {
                value: backup[state],
                writable: true,
              });
            }
          }
          restoreExperiments() {
            const backup = Utilities.loadData(
              config.info.name,
              "experiments",
              false
            );
            if (!backup) return void this.backupExperiments();
            const experiments = ExperimentsStore.__getLocalVars();
            for (const state in experiments) {
              if (!backup[state])
              delete experiments[state]
            }
            for (const state in backup) {
              Object.defineProperty(experiments, state, {
                value: backup[state],
                writable: true,
              });
            }
          }
          restoreVoice() {
            const backup = Utilities.loadData(config.info.name, "voice", false);
            if (!backup) return void this.backupVoice();
            const voice = MediaEngineStore.__getLocalVars().settingsByContext.default;
            for (const state in voice) {
              Object.defineProperty(voice, state, {
                value: backup[state],
                writable: true,
              });
            }          
          }
          restoreAccessibility() {
            const backup = Utilities.loadData(
              config.info.name,
              "accessibility",
              false
            );
            if (!backup) return void this.backupAccessibility();
            const accessibility = AccessibilityStore.__getLocalVars().state;
            for (const state in accessibility) {
              Object.defineProperty(accessibility, state, {
                value: backup[state],
                writable: true,
              });
            }
          }
          restoreNotifications() {
            const backup = Utilities.loadData(
              config.info.name,
              "notifications",
              false
            );
            if (!backup) return void this.backupNotifications();
            const notifications = NotificationStore.__getLocalVars().state;
            for (const state in notifications) {
              Object.defineProperty(notifications, state, {
                value: backup[state],
                writable: true,
              });
            }
          }
          onStop() {
            this.removeListeners();
          }
          removeListeners() {
            Dispatcher.unsubscribe("CONNECTION_OPEN", this.restore);
            Dispatcher.unsubscribe("USER_SETTINGS_UPDATE", this.backupSettings);
            Dispatcher.unsubscribe(
              "EXPERIMENT_OVERRIDE_BUCKET",
              this.backupExperiments
            );
            for (const event of KeybindEvents) {
              Dispatcher.unsubscribe(event, this.backupKeybinds);
            }
            for (const event of AccessiblityEvents) {
              Dispatcher.unsubscribe(event, this.backupAccessibility);
            }
            for (const event of VoiceEvents) {
              Dispatcher.unsubscribe(event, this.backupVoice);
            }
            for (const event of NotificationEvents) {
              Dispatcher.unsubscribe(event, this.backupNotifications);
            }
          }
        };
      })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
