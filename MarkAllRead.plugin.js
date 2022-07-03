/**
	* @name MarkAllRead
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.7
	* @invite SgKSKyh9gY
	* @description Get A option to Mark all read by right clicking on home button.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MarkAllRead.plugin.js
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
module.exports = (_ => {
    const config = {
        info: {
            name: "MarkAllRead",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			}
            ],
            version: "1.0.7",
            description:
            "Get A option to Mark all read by right clicking on home button.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/MarkAllRead.plugin.js",
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
				"Who sliding into your DMs ~~~///(^v^)\\\~~~"
			]
            }, {
			title: "v1.0.5",
			items: [
				"Remove option from context menu if no ping"
			]
		}, {
			title: "v1.0.7",
			items: [
				"Blacklist server/dm from being read in settings"
			]
		}
        ],
        main: "MarkAllRead.plugin.js",
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
            ContextMenu,
            Settings,
            DiscordModules,
            Toasts
		} = Library;
        const {
            React,
            ChannelStore,
            UserStore,
            GuildStore,
            GuildChannelsStore
		} = DiscordModules;
        const markread = w => React.createElement('svg', {
            viewBox: '0 0 24 24',
            width: w,
            height: w
			}, React.createElement('path', {
				style: {
					fill: 'currentColor'
				},
				d: 'M13.3483 2.68577C13.1302 2.57142 12.8698 2.57142 12.6517 2.68577L4.19881 7.11784C3.81186 7.32073 3.50078 7.62754 3.29257 7.99365L13 13.1507L22.7074 7.99366C22.4992 7.62754 22.1881 7.32073 21.8012 7.11784L13.3483 2.68577ZM3 17.75V9.53676L12.6482 14.6623C12.8682 14.7792 13.1319 14.7792 13.3519 14.6623L23 9.53677V17.75C23 19.5449 21.5449 21 19.75 21H6.25C4.45507 21 3 19.5449 3 17.75ZM6.01172 22C6.58925 22.9021 7.6002 23.5 8.75081 23.5H20.2508C23.1503 23.5 25.5008 21.1495 25.5008 18.25V10.75C25.5008 9.59941 24.9029 8.58846 24.0008 8.01093V18.25C24.0008 20.3211 22.3219 22 20.2508 22H6.01172Z'
			}));
			const servers = w => React.createElement('svg', {
				viewBox: '0 0 24 24',
				width: w,
				height: w
				}, React.createElement('path', {
                    style: {
                        fill: 'currentColor'
					},
                    d: 'M7.5 2C6.11929 2 5 3.11929 5 4.5V15.5C5 16.8807 6.11929 18 7.5 18H12.5C13.8807 18 15 16.8807 15 15.5V4.5C15 3.11929 13.8807 2 12.5 2H7.5ZM7.5 5H12.5C12.7761 5 13 5.22386 13 5.5C13 5.77614 12.7761 6 12.5 6H7.5C7.22386 6 7 5.77614 7 5.5C7 5.22386 7.22386 5 7.5 5ZM7 12.5C7 12.2239 7.22386 12 7.5 12H12.5C12.7761 12 13 12.2239 13 12.5C13 12.7761 12.7761 13 12.5 13H7.5C7.22386 13 7 12.7761 7 12.5ZM7 14.5C7 14.2239 7.22386 14 7.5 14H12.5C12.7761 14 13 14.2239 13 14.5C13 14.7761 12.7761 15 12.5 15H7.5C7.22386 15 7 14.7761 7 14.5ZM2 7C2 5.89543 2.89543 5 4 5V15.5C4 15.6698 4.01209 15.8367 4.03544 16H4C2.89543 16 2 15.1046 2 14V7ZM16 15.5C16 15.6698 15.9879 15.8367 15.9646 16H16C17.1046 16 18 15.1046 18 14V7C18 5.89543 17.1046 5 16 5V15.5Z'
				}));
				const dms = w => React.createElement('svg', {
					viewBox: '0 0 24 24',
					width: w,
					height: w
					}, React.createElement('path', {
						style: {
							fill: 'currentColor'
						},
						d: 'M17.75 18C18.7165 18 19.5 18.7835 19.5 19.75V21.752L19.4921 21.8604C19.1814 23.9866 17.2715 25.009 14.0668 25.009C10.8736 25.009 8.9333 23.9983 8.51446 21.8966L8.5 21.75V19.75C8.5 18.7835 9.2835 18 10.25 18H17.75ZM18.2439 11.9999L24.25 12C25.2165 12 26 12.7835 26 13.75V15.752L25.9921 15.8604C25.6814 17.9866 23.7715 19.009 20.5668 19.009L20.3986 19.0074C20.09 17.9045 19.111 17.0816 17.9288 17.0057L17.75 17L16.8278 17.0007C17.8478 16.1758 18.5 14.914 18.5 13.5C18.5 12.974 18.4098 12.4691 18.2439 11.9999ZM3.75 12L9.75609 11.9999C9.59024 12.4691 9.5 12.974 9.5 13.5C9.5 14.8309 10.0777 16.0268 10.9961 16.8507L11.1722 17.0007L10.25 17C8.9878 17 7.9242 17.8504 7.60087 19.0094L7.56679 19.009C4.37361 19.009 2.4333 17.9983 2.01446 15.8966L2 15.75V13.75C2 12.7835 2.7835 12 3.75 12ZM14 10C15.933 10 17.5 11.567 17.5 13.5C17.5 15.433 15.933 17 14 17C12.067 17 10.5 15.433 10.5 13.5C10.5 11.567 12.067 10 14 10ZM20.5 4C22.433 4 24 5.567 24 7.5C24 9.433 22.433 11 20.5 11C18.567 11 17 9.433 17 7.5C17 5.567 18.567 4 20.5 4ZM7.5 4C9.433 4 11 5.567 11 7.5C11 9.433 9.433 11 7.5 11C5.567 11 4 9.433 4 7.5C4 5.567 5.567 4 7.5 4Z'
					}));
					const UnreadStore = WebpackModules.getByProps("getUnreadCount");
					const MentionStore = WebpackModules.getByProps("getMentionCount");
					const unreadAcks = WebpackModules.getByProps('ack', 'ackCategory');
					const messageStore = WebpackModules.getByProps('hasUnread', 'lastMessageId');
					const isMentioned = WebpackModules.getByProps("isRawMessageMentioned");
					const dispatcher = WebpackModules.getByProps("dirtyDispatch");
					const SideBar = WebpackModules.getByProps("ListNavigatorItem");
					const ContextMenuAPI = window.HomeButtonContextMenu ||= (() => {
						const items = new Map();
						function insert(id, item) {
							items.set(id, item);
						}
						function remove(id) {
							items.delete(id);
						}
						Patcher.after(SideBar, "ListNavigatorItem", (_, args, res) => {
							if (!args[0] || args[0].id !== "home")
							return res;
							let menu = Array.from(items.values())
							res.props.onContextMenu = (event) => {
								ContextMenu.openContextMenu(event, ContextMenu.buildMenu(menu))
							};
						})
						return {
							items,
							remove,
							insert
						};
					})();
					return class MarkAllRead extends Plugin {
						onStart() {
							this.loadSettings();
							this.initiate();
							dispatcher.subscribe("MESSAGE_ACK", () => this.initiate());
							Patcher.after(isMentioned, "isMentioned", (_, args, res) => {
								if (res)
								this.initiate();
							});
						}
						loadSettings() {
							this.blacklistedServers = BdApi.loadData(config.info.name, "blacklistedServers") ?? {};
							this.blacklistedDMs = BdApi.loadData(config.info.name, "blacklistedDMs") ?? {};
							this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;
						}
						async initiate() {
							let menu = await this.makeMenu();
							if (!menu)
							return ContextMenuAPI.remove("MarkAllRead");
							ContextMenuAPI.insert("MarkAllRead", menu);
						}
						getPingedDMs() {
							return ChannelStore.getSortedPrivateChannels().map(c => c.id).filter(id => id && !this.blacklistedDMs[id] && MentionStore.getMentionCount(id) > 0);
						}
						getPingedGuilds() {
							const PingedChannels = [];
							const guildIds = Object.keys(GuildStore.getGuilds());
							for (const id of guildIds) {
								if (this.blacklistedServers[id])
								continue;
								PingedChannels.push(GuildChannelsStore.getChannels(id).SELECTABLE.map(c => c.channel.id).filter(id => MentionStore.getMentionCount(id) > 0))
							}
							return PingedChannels.filter(n => n.length > 0);
						}
						async makeMenu() {
							const PingedDMs = this.getPingedDMs();
							const PingedGuilds = this.getPingedGuilds();
							const all = PingedGuilds.concat(PingedDMs).filter(n => n.length > 0);
							if (!all.length)
							return;
							const children = [];
							if (PingedGuilds.length > 0 && PingedDMs.length > 0) {
								children.push({
									label: "Mark All Guilds Read",
									id: "mark-all-guild-read",
									icon: () => servers('19'),
									action: async() => {
										const unreads = PingedGuilds.map(ur => ({
											channelId: ur,
											messageId: messageStore.lastMessageId(ur)
										}))
										await unreadAcks.bulkAck(unreads);
										await this.initiate();
										if (this.showToast)
										Toasts.show(`Marked All Guilds Read`, {
											icon: 'https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Server%20Multiple/SVG/ic_fluent_server_multiple_20_filled.svg',
											timeout: 5000,
											type: 'info'
										})
									},
									}, {
									label: "Mark All DMs Read",
									id: "mark-all-dm-read",
									icon: () => dms('19'),
									action: async() => {
										const unreads = PingedDMs.map(ur => ({
											channelId: ur,
											messageId: messageStore.lastMessageId(ur)
										}))
										await unreadAcks.bulkAck(unreads);
										await this.initiate();
										if (this.showToast)
										Toasts.show(`Marked All DMs Read`, {
											icon: 'https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/People%20Community/SVG/ic_fluent_people_community_28_filled.svg',
											timeout: 5000,
											type: 'info'
										})
									},
								})
							}
							const MarkAllRead = {
								label: "Mark All Read",
								id: "mark-all-read",
								icon: () => children.length > 0 ? null : markread('19'),
								action: async() => {
									const unreads = all.map(ur => ({
										channelId: ur,
										messageId: messageStore.lastMessageId(ur)
									}))
									await unreadAcks.bulkAck(unreads);
									await this.initiate();
									if (this.showToast)
									Toasts.show(`Marked All Read`, {
										icon: 'https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Mail%20All%20Read/SVG/ic_fluent_mail_all_read_28_filled.svg',
										timeout: 5000,
										type: 'info'
									})
								},
								children: children.length > 0 ? ContextMenu.buildMenuChildren(children) : null,
							}
							return MarkAllRead;
						}
						onStop() {
							ContextMenuAPI.remove("MarkAllRead");
							dispatcher.unsubscribe("MESSAGE_ACK", () => this.initiate());
							Patcher.unpatchAll();
						}
						getSettingsPanel() {
							const servers = [];
							const DMs = [];
							const guilds = Object.values(GuildStore.getGuilds());
							const dms = ChannelStore.getSortedPrivateChannels();
							for (const guild of guilds) {
								servers.push(
									new Settings.Switch(guild.name, guild.description, this.blacklistedServers[guild.id] ?? false, (e) => {
										this.blacklistedServers[guild.id] = e;
									}))
							}
							for (const DM of dms) {
								const user = UserStore.getUser(DM.recipients[0]);
								DMs.push(
									new Settings.Switch(user.tag, user.pronouns, this.blacklistedDMs[DM.id] ?? false, (e) => {
										this.blacklistedDMs[DM.id] = e;
									}))
									
							}
							return Settings.SettingPanel.build(this.saveSettings.bind(this),
								new Settings.Switch("Popup/Toast", "Toast Confirmation of message being read", this.showToast, (e) => {
									this.showToast = e;
								}),
								new Settings.SettingGroup("Server Blacklist", {
									collapsible: true,
									shown: false
								}).append(...servers),
								new Settings.SettingGroup("DM Blacklist", {
									collapsible: true,
									shown: false
								}).append(...DMs))
						}
						saveSettings() {
							BdApi.saveData(config.info.name, "blacklistedServers", this.blacklistedServers);
							BdApi.saveData(config.info.name, "blacklistedDMs", this.blacklistedDMs);
							BdApi.saveData(config.info.name, "showToast", this.showToast);
						}
					};
					return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
