
import { signal, effect } from "@preact/signals";

const tree = signal([]);
const upath = signal([]);

const search_query = signal('');
const results_tress = signal({});

const list = signal([]);

effect(() => {
	if(!tree.value.length) return;
	if(search_query.value.length) {
		const query = search_query.value;
		let entries = [...tree.value];
		let found   = [];
		const search = (query, entries, path) => {
	console.log('search', path);
			entries.map(entry => {
				if(entry.name.indexOf(query)>0) {
					entry.path = path;
					found.push(entry);
				}
				if(entry.kind=='d') {
					search(query, entry.entries, [...path, entry.name]);
				}
			});
		};
		search(query, entries, []);
		list.value = found;
	} else {	
		list.value = [];
	}
}, [search_query.value, tree.value]);

const listRed = {

};

const treeRed = {
	remEntry (id) {
		let entries = [...tree.value];
		const rem = function (entries) {
			let ok = false;
			entries.map(entry => {
				if(entry.kind=='d') {
					if(entry.id!=id) {
						entry.entries = rem(entry.entries);
					} else if(entry.id==id && entry.entries.length==0) {
						entry.handler.remove().then(ok => {
							console.log('ok?', ok);
							ok = true;
						})
					} else if(entry.id==id && entry.entries.length!=0) {
						alert('No vacío');
					}
				}
				if(entry.kind=='f') {
					if(entry.id==id) {
						entry.handler.remove().then(ok => {
							console.log('ok?', ok);
							ok = true;
						})
						ok = true;
					}
				}
			});
			if(ok) {
				console.log('ok entries', entries);
				entries = entries.filter(entry => entry.id!==id);
				console.log('ok entries', entries);
			}
			return entries;
		}
		entries = rem(entries);
		tree.value = entries;
	},
	get_directory_handler(path) {
		let entries = [...tree.value];
		const get_dh = (path, entries) => {
			const dirname = path.shift();
			let found = null;
			entries.map(entry => {
				if(entry.kind=='d' && entry.name==dirname) {
					if (path.length) {
						found = get_dh(path, entry.entries);
					} else {
						found = entry.handler;
					}

				}
			});
			return found;
		}
		return get_dh(path, entries);
	},
};

const upathRed = {
	get_entries(path) {
		let entries = tree.value;
		let apath = [];
	//	path = path.split('/');
		for(let dirname of path) {
			let found = false;
			for(let entry of entries) {
				if(entry.kind=='d' && entry.name==dirname) {
					apath.push(dirname);
					entries = entry.entries;
					found = true;
				}
			}
			if(!found) {
				break; // TODO Exception? re-set upath?
			}
		}
		return [ apath, entries ];
	}
};

export {
	tree, treeRed,
	list, listRed,
	upath, upathRed,
	search_query
};
