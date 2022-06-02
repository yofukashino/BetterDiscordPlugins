/**
	* @name MarkAllRead
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.0
	* @invite SgKSKyh9gY
	* @description Attempts to disconnect/rejoin a voice chat if ping goes above a certain threshold.
	* @website https://wife-ruby.ml
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
            version: "1.0.0",
            description:
            "Attempts to disconnect/rejoin a voice chat if ping goes above a certain threshold.",
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
				"Teri Mummy Meri Hoja (^///^)"
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
            Modals
		} = Library;
		const UnreadStore = WebpackModules.getByProps("getUnreadCount");
		const MentionStore = WebpackModules.getByProps("getMentionCount");
		const GuildStore = DiscordModules.GuildStore;
		const UserStore = DiscordModules.UserStore;
		const ChannelStore = DiscordModules.ChannelStore;
		const unreadAcks = WebpackModules.getByProps('ack', 'ackCategory');
		const messageStore = WebpackModules.getByProps('hasUnread', 'lastMessageId');
		const GuildChannelsStore = DiscordModules.GuildChannelsStore;
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
                this.showToast = BdApi.loadData(config.info.name, "showToast") ?? true;                			
                this.initiate();
				this.checkPings = this.checkPings.bind(this)
				dispatcher.subscribe("MESSAGE_CREATE", this.checkPings);
				
			}
			async initiate(){
				let menu = await this.makeMenu();
				
				if (!menu) return ContextMenuAPI.remove("MarkAllRead");
				ContextMenuAPI.insert("MarkAllRead", menu);
			}
			checkPings(message){
			let currentUser = UserStore.getCurrentUser();
			if (message.message.content.includes(currentUser.id)) this.initiate();
				}
			getPingedDMs() {
				return ChannelStore.getSortedPrivateChannels().map(c => c.id).filter(id => id && MentionStore.getMentionCount(id) > 0);
			}
			getPingedGuilds() {
				const PingedChannels =  [];
				const guildIds = Object.keys(GuildStore.getGuilds());
				guildIds.forEach(id => {				
				PingedChannels.push(GuildChannelsStore.getChannels(id).SELECTABLE.map(c=> c.channel.id).filter(id => MentionStore.getMentionCount(id) > 0))})
				return PingedChannels.filter(n => n.length > 0) ;
			}
			async makeMenu() {
				const PingedDMs = this.getPingedDMs();
				const PingedGuilds = this.getPingedGuilds();
				const all = PingedGuilds.concat(PingedDMs).filter(n => n.length > 0);
				if (!all.length) return;
				const children = [];
				if (PingedGuilds.length > 0 && PingedDMs.length > 0) {
					children.push({
						label: "Mark All Guilds Read",
						id: "mark-all-guild-read",
						action: async() => {	
							const unreads = PingedGuilds.map(ur => ({
								channelId: ur,
								messageId: messageStore.lastMessageId(ur)
							}))
							await unreadAcks.bulkAck(unreads);
							await this.initiate();
							if (this.showToast)
								BdApi.showToast(`Marked All Guilds Read`, {
									icon: true,
									timeout: 5000,
									type: 'info'
								})
						},
						}, {
						label: "Mark All DMs Read",
						id: "mark-all-dm-read",
						action: async() => {	
							const unreads = PingedDMs.map(ur => ({
								channelId: ur,
								messageId: messageStore.lastMessageId(ur)
							}))
							await unreadAcks.bulkAck(unreads);
							await this.initiate();
							if (this.showToast)
								BdApi.showToast(`Marked All DMs Read`, {
									icon: true,
									timeout: 5000,
									type: 'info'
								})
						},
					})
				}
				
				const MarkAllRead = {
                    label: "Mark All Read",
                    id: "mark-all-read",
                    action: async() => {	
						const unreads = all.map(ur => ({
							channelId: ur,
							messageId: messageStore.lastMessageId(ur)
						}))
						await unreadAcks.bulkAck(unreads);	
						await this.initiate();
						if (this.showToast)
								BdApi.showToast(`Marked All Read`, {
									icon: true,
									timeout: 5000,
									type: 'info'
								})
					},
					children: children.length > 0 ? ContextMenu.buildMenuChildren(children) : null,
				}	
			return MarkAllRead;}
            onStop() {
                ContextMenuAPI.remove("MarkAllRead");
				dispatcher.unsubscribe("MESSAGE_CREATE", this.checkPings)
			}
            getSettingsPanel() {
                return Settings.SettingPanel.build(this.saveSettings.bind(this),
                    new Settings.Switch("Popup/Toast", "Toast Confirmation of message being read", this.showToast, (e) => {
                        this.showToast = e;
					}))
			}
            saveSettings() {
                BdApi.saveData(config.info.name, "showToast", this.showToast);
			}
			
		};
        return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
