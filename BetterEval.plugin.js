/**
	* @name BetterEval
	* @author Ahlawat
	* @authorId 887483349369765930
	* @version 1.0.1
	* @invite SgKSKyh9gY
	* @description Adds a slash command to evaluate javascript code locally.
	* @website https://tharki-god.github.io/
	* @source https://github.com/Tharki-God/BetterDiscordPlugins
	* @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterEval.plugin.js
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
            name: "BetterEval",
            authors: [{
				name: "Ahlawat",
				discord_id: "887483349369765930",
				github_username: "Tharki-God",
			},
            ],
            version: "1.0.1",
            description:
            "Adds a slash command to evaluate javascript code locally.",
            github: "https://github.com/Tharki-God/BetterDiscordPlugins",
            github_raw:
            "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/BetterEval.plugin.js",
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
				"[DANGEROUS] DO NOT USE THIS COMMAND WITH CODE YOU DO NOT UNDERSTAND.",
				"...( ＿ ＿)ノ｜"
			]
		}
        ],
        main: "BetterEval.plugin.js",
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
			Modals
		} = Library;
        const DiscordCommands = WebpackModules.getByProps("BUILT_IN_COMMANDS");
        const sendBotMessage = WebpackModules.getByProps('sendBotMessage');
        const sendUserMessage = WebpackModules.getByProps('sendMessage');
        const util = require('util');
        const process = require('process');
        return class BetterEval extends Plugin {
			showDisclaimer() {
			Modals.showAlertModal("DISCLAIMER: THIS PLUGIN IS DANGEROUS", ["```DO NOT, UNDER ANY CIRCUMSTANCES, RUN CODE YOU DO NOT UNDERSTAND. IF SOMEBODY TELLS YOU TO RUN CODE, THEY ARE MOST LIKELY TRYING TO STEAL YOUR ACCOUNT OR INSTALL MALWARE ON YOUR DEVICE. UNLESS YOU FULLY UNDERSTAND WHAT A PIECE OF CODE DOES, DO NOT RUN SAID PIECE OF CODE.```\n\n\n\n\n I, the author of Better Eval, am not responsible for any harm/damage caused by using this plugin. Use the plugin at your own risk."] )
			}
            onStart() {
			 this.firstRun = BdApi.loadData(config.info.name, "firstRun") ?? true;
                if (this.firstRun)
				this.showDisclaimer();
                BdApi.saveData(config.info.name, "firstRun", false);
                DiscordCommands.BUILT_IN_COMMANDS.push({
                    __registerId: this.getName(),
                    applicationId: "-1",
                    name: "eval",
                    description: "[DANGEROUS] Evaluates javascript code locally. DO NOT USE THIS COMMAND WITH CODE YOU DO NOT UNDERSTAND.",
                    id: (-1 - DiscordCommands.BUILT_IN_COMMANDS.length).toString(),
                    type: 1,
                    target: 1,
                    predicate: () => true,
                    execute: async(args, {
                        channel
					}) => {					
					let code = args[0].value;
					let isAsync = args[1].value;
					const Embed = await this.evaluate(code, isAsync);
					sendBotMessage.sendBotMessage(channel.id, "", [Embed]);					
					},				
					options: [{
						description: "Javascript code you want to evaluate.",
						displayDescription: "Javascript code you want to evaluate.",
						displayName: "Code",
						name: "Code",
						required: true,
						type: 3
						}, {
						description: "Evaluate Asynchronously.",
						displayDescription: "Evaluate Asynchronously.",
						displayName: "Async",
						name: "Async",
						required: true,
						type: 5
					}
					]
				});
			}
			async evaluate(statement, isAsync) {
				var result = undefined;
				var errored = false;
				if (isAsync) {
					if (statement.includes(";") && (!statement.endsWith(";") || statement.includes("\n") || (statement.split(';').length) > 2)) {
						statement = "(async () => {" + statement + "})()";
						} else {
						statement = "(async () => { return " + statement + "})()";
					}
				}
				
				var start = process.hrtime();
				try {
					result = eval(statement);
					if (result instanceof Promise) {
						result = await result;
					}
					} catch (e) {
                    result = e;
                    errored = true;
				}
                var elapsed = process.hrtime(start);
                var elapsed_ms = elapsed[0] * 1e3 + elapsed[1] / 1e6;
                var elapsed_str = elapsed_ms + ' ms';				
                if (errored) {
                    console.error(result);
				}				
                result = util.inspect(result);				
                return {
                    type: 'rich',
                    title: (errored ? 'Error' : 'Success') + ' ' + elapsed_str,
                    description: '```js\n' + result + '\n```',
                    timestamp: Date.now(),
                    color: "#8a0000"
				}
			}
            onStop() {
                this.unregisterAllCommands(this.getName());
			}
            unregisterAllCommands(caller) {
                let index = DiscordCommands.BUILT_IN_COMMANDS.findIndex((cmd => cmd.__registerId === caller));
                while (index > -1) {
                    DiscordCommands.BUILT_IN_COMMANDS.splice(index, 1);
                    index = DiscordCommands.BUILT_IN_COMMANDS.findIndex((cmd => cmd.__registerId === caller));
				}
			}
		};
        return plugin(Plugin, Library);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
