/**
 * @name VanillaLoader
 * @author Ahlawat
 * @authorId 887483349369765930
 * @version 1.0.4
 * @invite SgKSKyh9gY
 * @description Get a option to open vanilla discord by right clicking on home button.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins
 * @updateUrl https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/VanillaLoader.plugin.js
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
module.exports = ((_) => {
	const config = {
	  info: {
		name: "VanillaLoader",
		authors: [
		  {
			name: "Ahlawat",
			discord_id: "887483349369765930",
			github_username: "Tharki-God",
		  },
		],
		version: "1.0.4",
		description:
		  "Get a option to open vanilla discord by right clicking on home button.",
		github: "https://github.com/Tharki-God/BetterDiscordPlugins",
		github_raw:
		  "https://raw.githubusercontent.com/Tharki-God/BetterDiscordPlugins/master/VanillaLoader.plugin.js",
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
			"Who uses Better discord? me? (。_。)",
		  ],
		},
		{
		  title: "v1.0.1",
		  items: ["Mac Support"],
		},
		{
		  title: "v1.0.3",
		  items: ["Mac Support Fixed"],
		},
		{
		  title: "v1.0.4",
		  items: [
			"Linux Support Somewhat.",
			"Only Gnome Enviorments",
			'Install "gnome-terminal" To Use it in Non Gnome Distro.',
		  ],
		},
	  ],
	  main: "VanillaLoader.plugin.js",
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
			BdApi.showConfirmationModal(
			  "Library Missing",
			  `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
			  {
				confirmText: "Download Now",
				cancelText: "Cancel",
				onConfirm: () => {
				  require("request").get(
					"https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
					async (error, response, body) => {
					  if (error) {
						return BdApi.showConfirmationModal("Error Downloading", [
						  "Library plugin download failed. Manually install plugin library from the link below.",
						  BdApi.React.createElement(
							"a",
							{
							  href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
							  target: "_blank",
							},
							"ZeresPluginLibrary"
						  ),
						]);
					  }
					  await new Promise((r) =>
						require("fs").writeFile(
						  require("path").join(
							BdApi.Plugins.folder,
							"0PluginLibrary.plugin.js"
						  ),
						  body,
						  r
						)
					  );
					}
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
			Patcher,
			Utilities,
			Modals,
			ContextMenu,
			PluginUpdater,
			Logger,
			Toasts,
			DiscordModules: { React },
		  } = Library;
		  const { execPath, platform, pid, resourcesPath } = process;
		  const childProcess = require("child_process");
		  const detached = { detached: true };
		  const reload = (width, height) =>
			React.createElement(
			  "svg",
			  {
				viewBox: "0 0 24 24",
				width,
				height,
			  },
			  React.createElement("path", {
				style: {
				  fill: "currentColor",
				},
				d: "M12 3a9 9 0 0 0-9 9 9.005 9.005 0 0 0 4.873 8.001L6 20a1 1 0 0 0-.117 1.993L6 22h4a1 1 0 0 0 .993-.883L11 21v-4a1 1 0 0 0-1.993-.117L9 17l-.001 1.327A7.006 7.006 0 0 1 5 12a7 7 0 0 1 14 0 1 1 0 1 0 2 0 9 9 0 0 0-9-9Zm0 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
			  })
			);
		  const SideBar = WebpackModules.getByProps("ListNavigatorItem");
		  const ContextMenuAPI = (window.HomeButtonContextMenu ||= (() => {
			const items = new Map();
			function insert(id, item) {
			  items.set(id, item);
			}
			function remove(id) {
			  items.delete(id);
			}
			Patcher.after(SideBar, "ListNavigatorItem", (_, args, res) => {
			  if (!args[0] || args[0].id !== "home") return res;
			  let menu = Array.from(items.values());
			  res.props.onContextMenu = (event) => {
				ContextMenu.openContextMenu(event, ContextMenu.buildMenu(menu));
			  };
			});
			return {
			  items,
			  remove,
			  insert,
			};
		  })());
		  return class VanillaLoader extends Plugin {
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
			}         
			addMenu() {
			  ContextMenuAPI.insert("loadVanilla", this.makeMenu());
			}
			makeMenu() {
			  return {
				label: "Load Vanilla",
				id: "load-vanilla",
				icon: () => reload("20", "20"),
				action: async () => {
				  this.loadVanilla();
				},
			  };
			}
			loadVanilla() {
			  switch (platform) {
				case "win32":
				  childProcess.exec(
					`powershell.exe taskkill /pid ${pid} /f; start "${execPath}"  --vanilla`,
					detached
				  );
				  break;
				case "darwin":
				  childProcess.exec(
					`kill ${pid} && sleep 1 && open ${
					  resourcesPath.split(".app")[0]
					}.app --args --vanilla`,
					detached
				  );
				  break;
				case "linux":
				  childProcess.exec(
					`kill ${pid} &&  gnome-terminal -- bash -ci "${execPath} --vanilla & disown && exit"`,
					detached
				  );
				  break;
				default:
				  Toasts.show(`Platform not supported, Contact Dev for help!`, {
					icon: "https://cdn.discordapp.com/attachments/887530885010825237/990770627851980811/ic_fluent_error_circle_24_filled.png",
					timeout: 5000,
					type: "error",
				  });
			  }
			}
			onStop() {
			  ContextMenuAPI.remove("loadVanilla");
			}
		  };
		  return plugin(Plugin, Library);
		})(global.ZeresPluginLibrary.buildPlugin(config));
  })();
  /*@end@*/
  
