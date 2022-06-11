/**
	* @name VoiceChatUtilities
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.3
	* @invite SgKSKyh9gY
	* @description General use voicechat utilities.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/VoiceChatUtilities.plugin.js
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
            name: "VoiceChatUtilities",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
                }, , {
				name: "Kirai",
				discord_id: "872383230328832031",
				github_username: "HiddenKirai",
			},
            ],
            version: "1.0.3",
            description:
            "General use voicechat utilities",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/VoiceChatUtilities.plugin.js",
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
				"Fuck me, This took time but was worth it.",
				"Well Now Do it in mass (●ˇ∀ˇ●)"
			]
		}, 
		{
			title: "v1.0.1",
			items: [
				"Bug Fixes"
			]
		}, 
		{
			title: "v1.0.2",
			items: [
				"Added Icons",
				"Refractor",
				"Beautify"
			]
		}
        ],
        main: "VoiceChatUtilities.plugin.js",
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
            Patcher,
            DiscordModules,
            ContextMenu,
            Settings
		} = Library;
        const {
            clipboard
		} = require("electron");
        const DiscordPermissions = WebpackModules.getByProps('API_HOST').Permissions;
        const {
            patch
		} = WebpackModules.find(m => typeof m == 'object' && m.patch);
        const Permissions = WebpackModules.getByProps('getChannelPermissions');
        const {
            getVoiceStatesForChannel
		} = WebpackModules.getByProps('getVoiceStatesForChannel');
        const {
            getVoiceChannelId
		} = WebpackModules.getByProps('getVoiceChannelId');
        const {
            Endpoints
		} = WebpackModules.getByProps('Endpoints');
        const sleep = (time) => new Promise((f) => setTimeout(f, time));
        const mass = DiscordModules.React.createElement(WebpackModules.getByDisplayName("OverflowMenu"), {
            width: 18,
            height: 18
		});
        const undeaf = DiscordModules.React.createElement(WebpackModules.getByDisplayName("Headset"), {
            width: 18,
            height: 18
		});
        const unmute = DiscordModules.React.createElement(WebpackModules.getByDisplayName("Microphone"), {
            width: 18,
            height: 18
		});
        const mute = DiscordModules.React.createElement(WebpackModules.getByDisplayName("MicrophoneMute"), {
            width: 18,
            height: 18
		});
        const deaf = DiscordModules.React.createElement(WebpackModules.getByDisplayName("HeadsetDeafen"), {
            width: 18,
            height: 18
		});
        const disconnect = DiscordModules.React.createElement(WebpackModules.getByDisplayName("CallLeave"), {
            width: 18,
            height: 18
		});
        const vc = DiscordModules.React.createElement(WebpackModules.getByDisplayName("Speaker"), {
            width: 18,
            height: 18
		});
        return class VoiceChatUtilities extends Plugin {
            start() {
				
                this.BulkActionsdelay = BdApi.loadData(config.info.name, "BulkActionsdelay") ?? 0.25;
                this.voicechatcopyids = BdApi.loadData(config.info.name, "voicechatcopyids") ?? false;
                this.exceptSelf = BdApi.loadData(config.info.name, "exceptSelf") ?? false;
                this.patchContextMenu();
			}
            stop() {
                Patcher.unpatchAll();
				
			}
            async patchContextMenu() {
                const useChannelDeleteItem = await ContextMenu.getDiscordMenu("useChannelDeleteItem");
                Patcher.after(useChannelDeleteItem, "default", (_, [channel], ret) => {
                    let menu = this.makeMenu(channel);
                    return [
                        menu,
                        ret
					];
				});
			}
            makeMenu(channel) {
                if (channel.type !== 2)
				return;
                let user = DiscordModules.UserStore.getCurrentUser();
                let channelmembers = this.getVoiceChannelMembers(channel.id);
                const guildChannels = DiscordModules.GuildChannelsStore.getChannels(channel.guild_id);
                const voiceChannels = guildChannels.VOCAL.map(({
					channel
				}) => channel);
                if (channelmembers < 1 || channelmembers.length == 1)
				return;
                let currentChannel = this.getVoiceChannel();
                let delaybetweenactions = this.BulkActionsdelay * 1000;
                let exceptSelf = (this.exceptSelf && getVoiceChannelId() == channel.id && currentChannel.members.length > 1 && currentChannel);
                const children = [];
                if (this.voicechatcopyids) {
                    children.push({
                        id: 'copy-all-vc-members',
                        label: 'Copy All User Ids',
                        icon: () => mass,
                        action: async() => {
                            clipboard.writeText(channelmembers.join(",\n"));
						},
					})
				}
                if (Permissions.can(DiscordPermissions.MOVE_MEMBERS, channel)) {
                    children.push({
                        id: 'disconnect-all-vc',
                        label: 'Disconnect All',
                        icon: () => disconnect,
                        action: async() => {
                            for (const member of channelmembers) {
                                patch({
                                    url: Endpoints.GUILD_MEMBER(
                                        channel.guild_id,
									member),
                                    body: {
                                        channel_id: null,
									},
								});
								
                                if (delaybetweenactions != 0)
								await sleep(delaybetweenactions);
							}
						},
					})
                    if (exceptSelf) {
                        children.push({
                            id: 'disconnect-all-vc-except-self',
                            label: 'Disconnect all except self',
                            icon: () => disconnect,
                            action: async() => {
                                for (const member of channelmembers) {
                                    if (member == user.id)
									continue;
                                    patch({
                                        url: Endpoints.GUILD_MEMBER(
                                            channel.guild_id,
										member),
                                        body: {
                                            channel_id: null,
										},
									});
                                    if (delaybetweenactions != 0)
									await sleep(delaybetweenactions);
								}
							},
						})
					}
                    children.push({
                        id: 'move-all-vc',
                        label: 'Move All',
                        children: this.getMoveableChannels(voiceChannels, channelmembers, delaybetweenactions, false)
						
					})
                    if (exceptSelf) {
                        children.push({
							id: 'move-all-vc-except-self',
							label: 'Move All Except Self',
							children: this.getMoveableChannels(voiceChannels, channelmembers, delaybetweenactions, user)
							
						})
					}
					
				}				
				if (Permissions.can(DiscordPermissions.MUTE_MEMBERS, channel)) {
					children.push({
						id: 'mute-all-vc',
						label: 'Mute All',
						icon: () => mute,
						action: async() => {
							for (const member of channelmembers) {
								patch({
									url: Endpoints.GUILD_MEMBER(
										channel.guild_id,
									member),
									body: {
										mute: true,
									},
								});
								if (delaybetweenactions != 0)
								await sleep(delaybetweenactions);
							}
						},
					})
					
					if (exceptSelf) {
						children.push({
							id: 'mute-all-vc-except-self',
							label: 'Mute all except self',
							icon: () => mute,
							action: async() => {
								for (const member of channelmembers) {
									if (member == user.id)
									continue;
									patch({
										url: Endpoints.GUILD_MEMBER(
											channel.guild_id,
										member),
										body: {
											mute: true,
										},
									});
									if (delaybetweenactions != 0)
									await sleep(delaybetweenactions);
								}
							},
						})
						children.push({
							id: 'unmute-all-vc-except-self',
							label: 'Unmute all except self',
							icon: () => unmute,
							action: async() => {
								for (const member of channelmembers) {
									if (member == user.id)
									continue;
									patch({
										url: Endpoints.GUILD_MEMBER(
											channel.guild_id,
										member),
										body: {
											mute: false,
										},
									});
									if (delaybetweenactions != 0)
									await sleep(delaybetweenactions);
								}
							},
						})
					}
					children.push({
						id: 'unmute-all-vc',
						label: 'Unmute All',
						icon: () => unmute,
						action: async() => {
							for (const member of channelmembers) {
								patch({
									url: Endpoints.GUILD_MEMBER(
										channel.guild_id,
									member),
									body: {
										mute: false,
									},
								});
								if (delaybetweenactions != 0)
								await sleep(delaybetweenactions);
							}
						},
					})
				}
				if (Permissions.can(DiscordPermissions.DEAFEN_MEMBERS, channel)) {
					children.push({
						id: 'defen-all-vc',
						label: 'Deafen All',
						icon: () => deaf,
						action: async() => {
							for (const member of channelmembers) {
								patch({
									url: Endpoints.GUILD_MEMBER(
										channel.guild_id,
									member),
									body: {
										deaf: true,
									},
								});
								if (delaybetweenactions != 0)
								await sleep(delaybetweenactions);
							}
						},
					})
					
					if (exceptSelf) {
						children.push({
							id: 'deafen-all-vc-except-self',
							label: 'Defen all except self',
							icon: () => deaf,
							action: async() => {
								for (const member of channelmembers) {
									if (member == user.id)
									continue;
									patch({
										url: Endpoints.GUILD_MEMBER(
											channel.guild_id,
										member),
										body: {
											deaf: true,
										},
									});
									if (delaybetweenactions != 0)
									await sleep(delaybetweenactions);
								}
							},
						})
						children.push({
							id: 'undeafen-all-vc-except-self',
							label: 'Undeafen all except self',
							icon: () => undeaf,
							action: async() => {
								for (const member of channelmembers) {
									if (member == user.id)
									continue;
									patch({
										url: Endpoints.GUILD_MEMBER(
											channel.guild_id,
										member),
										body: {
											deaf: false,
										},
									});
									if (delaybetweenactions != 0)
									await sleep(delaybetweenactions);
								}
							},
						})
					}
					children.push({
						id: 'undeafen-all-vc',
						label: 'Undeafen All',
						icon: () => undeaf,
						action: async() => {
							for (const member of channelmembers) {
								patch({
									url: Endpoints.GUILD_MEMBER(
										channel.guild_id,
									member),
									body: {
										deaf: false,
									},
								});
								if (delaybetweenactions != 0)
								await sleep(delaybetweenactions);
							}
						},
					})
				}
				if (!children?.length)
				return;
				return ContextMenu.buildMenuChildren([{
					label: "Mass VC Utilities",
					id: 'mass-vc-utilities',
					action: () => {
						console.log(`Teri Mummy Meri Hoja ${user.username}`)
					},
					children: ContextMenu.buildMenuChildren(children)
				}
				]);
			}
			getMoveableChannels(voiceChannels, channelmembers, delaybetweenactions, user) {
				let Moveable = []
				voiceChannels.forEach((channel) => {
					if (!Permissions.can(DiscordPermissions.CONNECT, channel))
					return;
					Moveable.push({
						action: async() => {
							for (const member of channelmembers) {
								if (member == user?.id)
								continue;
								patch({
									url: Endpoints.GUILD_MEMBER(
										channel.guild_id,
									member),
									body: {
										channel_id: channel.id,
									},
								});
								if (delaybetweenactions != 0)
								await sleep(delaybetweenactions);
							}
						},
						
						id: channel.id,
						icon: () => vc,
						label: channel.name,
					})
				})
				return ContextMenu.buildMenuChildren(Moveable)
			}
			getVoiceUserIds(channel) {
				return Object.values(getVoiceStatesForChannel(channel))
				.map((a) => a.userId);
			}
			getVoiceChannelMembers(id) {
				let channel = DiscordModules.ChannelStore.getChannel(id);
				return this.getVoiceUserIds(channel?.id);
			}
			getVoiceChannel() {
				let channel = DiscordModules.ChannelStore.getChannel(getVoiceChannelId());
				if (!channel)
				return;
				return {
					channel: channel,
					members: this.getVoiceUserIds(channel.id),
				};
			}
			getSettingsPanel() {
				return Settings.SettingPanel.build(this.saveSettings.bind(this),
					new Settings.Slider("Bulk Actions delay (seconds)", "making it 0 makes all of the actions happen simultaneously (its cool af maybe)", 0, 1, this.BulkActionsdelay, (e) => {
						this.BulkActionsdelay = e;
						}, {
						markers: [0, 0.1, 0.25, 0.5, 1],
						stickToMarkers: true
					}),
					new Settings.Switch("Show all user ids", "Whether or not to show the button to copy the ids of all of the members of a voicechannel", this.voicechatcopyids, (e) => {
						this.voicechatcopyids = e;
					}),
					new Settings.Switch("Except Self", "Whether or not to show An Array of options to apply to everyone except self", this.exceptSelf, (e) => {
						this.exceptSelf = e;
					}))
			}
			saveSettings() {
				BdApi.saveData(config.info.name, "BulkActionsdelay", this.BulkActionsdelayBulkActionsdelay);
				BdApi.saveData(config.info.name, "voicechatcopyids", this.voicechatcopyids);
				BdApi.saveData(config.info.name, "exceptSelf", this.exceptSelf);
			}
		};
		return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
