/**
 * @name Token
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @version 1.3.0
 * @invite SgKSKyh9gY
 * @description Get an option to copy your token by right clicking on the home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/Token.plugin.js
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
      name: "Token",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "1.3.0",
      description:
        "Get an option to copy your token by right clicking on the home button.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/Token.plugin.js",
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
      {
        title: "v1.2.1",
        items: ["Corrected text."],
      },
      {
        title: "v1.2.2",
        items: [
          "Added option to login with token when logging in or adding account.",
        ],
      },
    ],
    main: "Token.plugin.js",
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
        Patcher,
        Utilities,
        PluginUpdater,
        Logger,
        Toasts,
        Settings: { SettingPanel, Switch },
        DiscordModules: {
          React,
          ConfirmationModal,
          ModalActions,
          ButtonData,
          Textbox,
        },
      } = ZLibrary;      
      const { 
        HBCM, 
        LibraryIcons, 
        LibraryModules: { 
         DiscordNative: { clipboard },
         AuthenticationStore,
         LinkButtonModule,
         LoginForm,
         LoginUtils
      }
    } = BunnyLib.build(config);
      const defaultSettings = {
        showToast: true,
      };  
      return class Token extends Plugin {
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
        start() {
          this.checkForUpdates();
          this.addMenu();
          this.addTokenLogin();
        }
        addMenu() {
          HBCM.insert(config.info.name, this.makeMenu());
        }
        makeMenu() {
          return {
            label: "Copy Token",
            id: "copy-token",
            icon: () => LibraryIcons.Auth("20", "20"),
            action: async () => {
              try {
                let token = AuthenticationStore.getToken();
                if (!token) {
                  Logger.err(`Whoops! I couldn't find your token.`);
                  if (this.settings["showToast"])
                    Toasts.show(`Whoops! I couldn't find your token.`, {
                      icon: "https://tharki-god.github.io/files-random-host/ic_fluent_error_circle_24_regular.png",
                      timeout: 5000,
                      type: "error",
                    });
                  return;
                }
                clipboard.copy(token);
                if (this.settings["showToast"])
                  Toasts.show(`Token Copied to Clipboard.`, {
                    icon: "https://tharki-god.github.io/files-random-host/ic_fluent_send_copy_24_regular.png",
                    timeout: 5000,
                    type: "success",
                  });
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
          };
        }
        addTokenLogin() {
          Patcher.before(LoginForm, "gO", (_, [args]) => {
            const ForgotPasswordLink = args?.children?.find(
              (m) => m?.props?.children == "Forgot your password?"
            );
            if (!ForgotPasswordLink) return;
            const FPLIndex = args.children.indexOf(ForgotPasswordLink);
            const TokenLogin = React.createElement(
              LinkButtonModule.zx,
              {
                color: LinkButtonModule.zx.Colors.LINK,
                look: LinkButtonModule.zx.Looks.LINK,
                className: "token-login",
                onClick: () => {
                  this.openTokenLoginForm();
                },
              },
              "Login With Token"
            );
            args.children.splice(FPLIndex + 1, 0, TokenLogin);
          });
        }
        openTokenLoginForm() {
          return ModalActions.openModal((props) => {
            return React.createElement(
              ConfirmationModal,
              Object.assign(
                {
                  header: "Login With Token",
                  confirmButtonColor: ButtonData.Colors.BRAND,
                  confirmText: "Login",
                  cancelText: null,
                  onConfirm: () => LoginUtils.loginToken(props.token),
                  onCancel: null,
                },
                props
              ),
              React.createElement(Textbox, {
                onChange: (val) => (props.token = val),
                value: null,
                disabled: false,
                placeholder: "Token to Login With.",
              })
            );
          });
        }
        onStop() {
          HBCM.remove(config.info.name);
          Patcher.unpatchAll();
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new Switch(
              "Pop-up/Toast",
              "Get a confirmation/error toast when copying your token.",
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
