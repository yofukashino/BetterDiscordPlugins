/**
	* @name DiscordBypass
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.3
	* @invite SgKSKyh9gY
	* @description A Collection of patches into one, Check plugin settings for features.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypass.plugin.js
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
module.exports = (() => {
    const config = {
        info: {
            name: "DiscordBypass",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.3",
            description:
            "A Collection of patches into one, Check plugin settings for features.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/DiscordBypass.plugin.js",
		},
        changelog: [{
			title: "v0.0.1",
			items: [
				"Idea in mind"
			]
            }, {
			title: "v0.0.5",
			items: [
				"Base Model"
			]
            }, {
			title: "Initial Release v1.0.0",
			items: [
				"This is the initial release of the plugin :)",
				"I :3 wannya *looks at you* cuddwe w-w-with my fiancee :3 (p≧w≦q)"
			]
            }, {
			title: "v1.0.1",
			items: [
				"Infinity account in account switcher"
			]
		}, {
			title: "v1.0.2",
			items: [
				"MFA requirement in guilds"
				]
			}
		
        ],
        main: "DiscordBypass.plugin.js",
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
			
			try {
				global.ZeresPluginLibrary.PluginUpdater.checkForUpdate(config.info.name, config.info.version, config.info.github_raw);
				} catch (err) {
				console.error(this.getName(), "Plugin Updater could not be reached.", err);
			}
			BdApi.showConfirmationModal(
				"Library Missing",
				`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get(
							"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							async(error, response, body) => {
								if (error) {
									return BdApi.showConfirmationModal("Error Downloading",
										[
											"Library plugin download failed. Manually install plugin library from the link below.",
											BdApi.React.createElement("a", {
												href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
												target: "_blank"
											}, "Plugin Link")
										], );
								}
								await new Promise((r) =>
									require("fs").writeFile(
										require("path").join(
											BdApi.Plugins.folder,
										"0PluginLibrary.plugin.js"),
										body,
									r));
							});
					},
				});
		}
        start() {}
        stop() {}
	}
	: (([Plugin, Library]) => {
        const {
			WebpackModules,
			DiscordModules,
			Patcher,
			Settings
		} = Library;
        const afkChannelIds = [];
        const DelayedCall = WebpackModules.getByProps('DelayedCall');
        const AppliedGuildBoostsRequiredForBoostedGuildTier = WebpackModules.getByProps("AppliedGuildBoostsRequiredForBoostedGuildTier");
        const getChannelPermissions = WebpackModules.getByProps("getChannelPermissions");
        const idle = WebpackModules.getByProps("getIdleSince");
        const MAX_ACCOUNTS = WebpackModules.getByProps("MAX_ACCOUNTS");
        const UserStore = DiscordModules.UserStore;
        return class DiscordBypass extends Plugin {
			onStart() {
				this.loadSettings();
				this.initialize();
			}
			loadSettings() {
				this.NSFW = BdApi.saveData(config.info.name, "NSFW") ?? !UserStore.getCurrentUser().nsfwAllowed;
				this.MFA = BdApi.saveData(config.info.name, "MFA") ?? !UserStore.getCurrentUser().mfaEnabled;
				this.verification = BdApi.saveData(config.info.name, "verification") ?? true;
				this.noTimeout = BdApi.saveData(config.info.name, "noTimeout") ?? true;
				this.ptt = BdApi.saveData(config.info.name, "ptt") ?? true;
				this.idle = BdApi.saveData(config.info.name, "idle") ?? true;
				this.accounts = BdApi.saveData(config.info.name, "accounts") ?? true;
			}
			initialize() {
				if (this.NSFW)
				this.nsfw();
				if (this.MFA)
				this.MFA();
				if (this.verification)
				this.verify(true);
				if (this.noTimeout)
				this.bandwidth();
				if (this.ptt)
				this.noPTT();
				if (this.idle)
				this.noIdle();
				if (this.accounts)
				this.maxAccount(true);
				if (this.accounts)
				this.maxAccount(true);
			}
			maxAccount(toggle) {
				MAX_ACCOUNTS.MAX_ACCOUNTS = toggle ? Infinity : 5;
				
			}
			noPTT() {
				Patcher.after(getChannelPermissions, 'can', (_, args, res) => {
					if (args[0] == DiscordModules.DiscordConstants.Permissions.USE_VAD) {
						return true;
					}
					return res;
				})
			}
			bandwidth() {
				Patcher.after(DelayedCall.Timeout.prototype, 'start', (timeout, [_, args]) => {
					if (args?.toString().includes('BOT_CALL_IDLE_DISCONNECT')) {
						timeout.stop();
					};
				});
			}
			noIdle() {
				Patcher.instead(idle, 'getIdleSince', (_, args, res) => {
					return null;
				});
				Patcher.instead(idle, 'isIdle', (_, args, res) => {
					return false;
				});
				Patcher.instead(idle, 'isAFK', (_, args, res) => {
					return false;
				});
			}
			verify(toggle) {
				AppliedGuildBoostsRequiredForBoostedGuildTier.VerificationCriteria = toggle ? {
					ACCOUNT_AGE: 0,
					MEMBER_AGE: 0
				}
				: {
					ACCOUNT_AGE: 5,
					MEMBER_AGE: 10
				};
			}
			nsfw() {
				Patcher.after(UserStore, 'getCurrentUser', (_, args, res) => {
					if (!res?.nsfwAllowed && res?.nsfwAllowed !== undefined) {
						res.nsfwAllowed = true;
					}
				})
			}
			mfa() {
				Patcher.after(UserStore, 'getCurrentUser', (_, args, res) => {
					if (!res?.mfaEnabled && res?.mfaEnabled !== undefined) {
						res.mfaEnabled = true;
					}
				})
			}
			onStop() {
				Patcher.unpatchAll();
				this.verify(false);
				
			}
			getSettingsPanel() {
				return Settings.SettingPanel.build(this.saveSettings.bind(this),
					new Settings.Switch("NSFW Bypass", "Bypass NSFW Age restriction", this.NSFW, (e) => {
						this.NSFW = e;
						}, {
						disabled: UserStore.getCurrentUser().nsfwAllowed
					}),
					new Settings.Switch("2FA Bypass", "Bypass 2FA requirement on servers for moderation", this.MFA, (e) => {
						this.MFA = e;
						}, {
						disabled: UserStore.getCurrentUser().mfaEnabled
					}),
					new Settings.Switch("Verification Bypass", "Disable wait for 10 mins to join vc in new servers", this.verification, (e) => {
						this.verification = e;
					}),
					new Settings.Switch("Call Timeout", "Let you stay alone in call for more than 5 mins.", this.noTimeout, (e) => {
						this.noTimeout = e;
					}),
					new Settings.Switch("No Push to talk", "Let you use voice Activity in push to talk only channels.", this.ptt, (e) => {
						this.ptt = e;
					}),
					new Settings.Switch("No AFK", "Stops Discord from setting your presense to idle and Probably no afk in vc too.", this.idle, (e) => {
						this.idle = e;
					}),
					new Settings.Switch("Maximum Account", "Add Unlimited Account in discord account switcher.", this.accounts, (e) => {
						this.accounts = e;
					}))
			}
			saveSettings() {
				BdApi.saveData(config.info.name, "NSFW", this.NSFW);
				BdApi.saveData(config.info.name, "MFA", this.MFA);
				BdApi.saveData(config.info.name, "verification", this.verification);
				BdApi.saveData(config.info.name, "noTimeout", this.noTimeout);
				BdApi.saveData(config.info.name, "ptt", this.ptt);
				BdApi.saveData(config.info.name, "idle", this.idle);
				dApi.saveData(config.info.name, "accounts", this.accounts);
				this.stop();
				this.initialize();
			}
			
		};
        return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
